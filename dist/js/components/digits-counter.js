/**
 * Анимация цифр
 */

class DigitsCounter {
  static init() {
    var els = document.querySelectorAll('.odometer');
    if (!els.length) return;

    /* Тайминги */
    var BASE_DURATION = 1.4;          // сек: остановка первой (левой) цифры
    var TOTAL_DURATION = 2.4;         // сек: остановка последней цифры в каждом числе
    
    var UPDATE_DURATION = 1.2;        // сек: докрутка при обновлении числа с сервера
    var COUNTER_DELAY = 0.5;          // сек: задержка старта между числами

    /* Качание как у маятника (0..1)
       Только у последней цифры каждого числа.
       INERTIA   — размах качания: 0 — без качания, 1 — сильно раскачивается.
       MAGNETISM — как быстро качание затихает: 0 — долго, 1 — почти сразу встаёт.
       FREQUENCY — как часто качается: 0 — медленно, 1 — часто */
    var INERTIA = 0.00;
    var MAGNETISM = 0.00;
    var FREQUENCY = 0.00;
    var SWING_MAX = 0.18;             // em: размах при INERTIA = 1
    var DAMPING_RANGE = [2.2, 14];    // 1/сек: затухание при MAGNETISM = 0 и 1
    var FREQ_RANGE = [1.5, 5];        // Гц: частота при FREQUENCY = 0 и 1
    var SETTLE_MAX = 2.0;             // сек: самое долгое качание

    /* Обороты */
    var MIN_TURNS = 1;                // оборотов у левой цифры
    var MAX_TURNS = 3;                // оборотов у правой цифры

    /* Прозрачность: растёт синхронно с движением колонки */
    var MIN_OPACITY = 0.15;           // старт при полной анимации
    var UPDATE_MIN_OPACITY = 0.6;     // старт при обновлении числа

    /* Знак «+» */
    var GLYPH_FADE = 0.6;             // сек: появление после остановки цифр
    var GLYPH_LIFT = 0.08;            // em: подъём при появлении

    /* Motion blur: 'vertical' | 'css' | 'none' */
    var BLUR_MODE = 'vertical';
    var MAX_BLUR = 22;                // px
    var BLUR_PER_SPEED = 0.005;       // px размытия на каждый px/сек скорости

    /* Автозащита производительности: vertical → css → none */
    var AUTO_DEGRADE = true;
    var SLOW_FRAME_MS = 24;
    var PERF_SAMPLES = 30;

    /* Числа */
    var MIN_GROUP_DIGITS = 5;         // пробел между разрядами только от 5 цифр: 12 772, но 3109

    var blurMode = BLUR_MODE;
    var inertia = INERTIA;
    var magnetism = MAGNETISM;
    var frequency = FREQUENCY;

    function bezier(x1, y1, x2, y2) {
      var cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
      var cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
      function sx(t) { return ((ax * t + bx) * t + cx) * t; }
      function sy(t) { return ((ay * t + by) * t + cy) * t; }
      return function (x) {
        var lo = 0, hi = 1, t = x;
        for (var i = 0; i < 24; i++) {
          var v = sx(t);
          if (Math.abs(v - x) < 1e-6) break;
          if (v < x) lo = t; else hi = t;
          t = (lo + hi) / 2;
        }
        return sy(t);
      };
    }
    var ease = bezier(0.2, 0.8, 0.2, 1);
    var glyphEase = ease;

    function clamp01(v) { return Math.min(Math.max(v, 0), 1); }

    function offsetT(pos) {
      return 'translateY(calc(-1 * ' + pos.toFixed(4) + ' * var(--step)))';
    }

    function smoother(x) { x = clamp01(x); return x * x * x * (x * (6 * x - 15) + 10); }

    function travelAt(t, a) {
      var pos = t >= a.D ? a.rows : a.rows * ease(t / a.D);
      if (a.amp > 0) {
        var tau = t - a.t0;
        if (tau > 0 && tau < a.T) {
          var env = smoother(tau / a.lead) * smoother((a.T - tau) / (0.25 * a.T));
          pos += a.amp * env * Math.exp(-a.gamma * tau) * Math.sin(2 * Math.PI * a.freq * tau);
        }
      }
      return pos;
    }

    function formatNumber(n, minGroup) {
      var s = String(Math.round(n));
      if (s.length >= minGroup) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
      return s;
    }

    var perf = { frameAt: 0, blurring: false, samples: [] };
    function perfFrame(now, blurring) {
      if (now === perf.frameAt) { perf.blurring = perf.blurring || blurring; return; }
      if (perf.frameAt && perf.blurring) {
        var dt = now - perf.frameAt;
        if (dt < 120) perf.samples.push(dt);
      }
      perf.frameAt = now;
      perf.blurring = blurring;
      if (AUTO_DEGRADE && perf.samples.length >= PERF_SAMPLES) {
        var s = perf.samples.sort(function (a, b) { return a - b; });
        var med = s[s.length >> 1];
        perf.samples = [];
        if (med > SLOW_FRAME_MS && blurMode !== 'none') {
          blurMode = blurMode === 'vertical' ? 'css' : 'none';
          if (window.console) console.info('[odometer] медленные кадры (' + med.toFixed(0) + ' мс), размытие: ' + blurMode);
        }
      }
    }

    var uid = 0;

    function Odometer(el) {
      this.el = el;
      this.cols = [];
      this.glyphs = [];
      this.raf = 0;
      this.id = ++uid;
      this.key = '';
      this.minGroup = parseInt(el.dataset.minGroup, 10) || MIN_GROUP_DIGITS;
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.odometer = this;
      this.build(el.dataset.placeholder || '0');
      if (this.reduced) this.settle();
    }

    Odometer.prototype.toText = function (value) {
      if (typeof value !== 'number') return String(value);
      var text = formatNumber(value, this.minGroup);
      var suffix = this.el.dataset.suffix;
      return suffix ? text + ' ' + suffix : text;
    };

    Odometer.prototype.makeCell = function (index, seps, rows) {
      var col = document.createElement('span');
      col.className = 'odometer__col';
      col.setAttribute('aria-hidden', 'true');
      col.style.setProperty('--d', index);
      col.style.setProperty('--s', seps);

      var strip = document.createElement('span');
      strip.className = 'odometer__strip';
      strip.innerHTML = rows.map(function (r) {
        return '<span class="odometer__digit">' + r + '</span>';
      }).join('');

      col.appendChild(strip);
      this.el.appendChild(col);
      return { col: col, strip: strip };
    };

    Odometer.prototype.build = function (text) {
      var self = this, el = this.el;
      var cells = 0, seps = 0;

      cancelAnimationFrame(this.raf);
      this.text = text;
      this.key = text.replace(/\d/g, '#');
      this.cols = [];
      this.glyphs = [];

      el.innerHTML = '';
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', text);

      text.split('').forEach(function (ch) {
        if (/\d/.test(ch)) {
          var rows = [];
          for (var k = 0; k <= 10; k++) rows.push(k % 10);
          var c = self.makeCell(cells, seps, rows);
          c.digit = +ch;
          c.cur = 0;
          c.fe = null;
          c.ref = '';
          c.col.style.opacity = MIN_OPACITY;
          self.cols.push(c);
          cells++;
        } else if (/\s/.test(ch)) {
          var sep = document.createElement('span');
          sep.className = 'odometer__sep';
          sep.setAttribute('aria-hidden', 'true');
          el.appendChild(sep);
          seps++;
        } else {
          var g = self.makeCell(cells, seps, [ch]);
          g.col.classList.add('odometer__col--glyph');
          g.col.style.opacity = 0;
          g.strip.style.transform = 'translateY(' + GLYPH_LIFT + 'em)';
          self.glyphs.push(g);
          cells++;
        }
      });

      el.style.setProperty('--nd', cells);
      el.style.setProperty('--ns', seps);

      this.buildFilters();
    };

    Odometer.prototype.render = function (text) {
      if (text.replace(/\d/g, '#') !== this.key) return this.build(text);
      var i = 0;
      this.text = text;
      this.el.setAttribute('aria-label', text);
      text.split('').forEach(function (ch) {
        if (/\d/.test(ch)) this.cols[i++].digit = +ch;
      }, this);
    };

    Odometer.prototype.buildFilters = function () {
      var ns = 'http://www.w3.org/2000/svg', self = this;
      var svg = document.createElementNS(ns, 'svg');
      svg.setAttribute('width', '0');
      svg.setAttribute('height', '0');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.position = 'absolute';

      this.cols.forEach(function (c, i) {
        var id = 'odo-blur-' + self.id + '-' + i;
        var f = document.createElementNS(ns, 'filter');
        f.setAttribute('id', id);
        f.setAttribute('x', '-20%');
        f.setAttribute('y', '-150%');
        f.setAttribute('width', '140%');
        f.setAttribute('height', '400%');
        f.setAttribute('color-interpolation-filters', 'sRGB');
        var fe = document.createElementNS(ns, 'feGaussianBlur');
        fe.setAttribute('stdDeviation', '0 0');
        f.appendChild(fe);
        svg.appendChild(f);
        c.fe = fe;
        c.ref = 'url(#' + id + ')';
      });
      this.el.appendChild(svg);
    };

    Odometer.prototype.setBlur = function (c, sigma) {
      if (blurMode === 'none' || sigma < 0.05) { c.col.style.filter = ''; return; }
      if (blurMode === 'vertical') {
        c.fe.setAttribute('stdDeviation', '0 ' + sigma.toFixed(2));
        c.col.style.filter = c.ref;
      } else {
        c.col.style.filter = 'blur(' + sigma.toFixed(2) + 'px)';
      }
    };

    Odometer.prototype.settle = function () {
      cancelAnimationFrame(this.raf);
      this.cols.forEach(function (c) {
        c.cur = c.digit;
        c.strip.style.transform = offsetT(c.digit);
        c.col.style.opacity = 1;
        c.col.style.filter = '';
      });
      this.glyphs.forEach(function (g) {
        g.col.style.opacity = 1;
        g.strip.style.transform = 'translateY(0)';
      });
    };

    Odometer.prototype.setValue = function (value, opts) {
      opts = opts || {};
      var text = this.toText(value);
      var rebuilt = text.replace(/\d/g, '#') !== this.key;
      this.render(text);
      if (this.reduced || opts.animate === false) { this.settle(); return 0; }
      return this.animate(opts.delay || 0, rebuilt || !!opts.fromZero);
    };

    Odometer.prototype.play = function (delay) {
      return this.setValue(this.text, { delay: delay, fromZero: true });
    };

    Odometer.prototype.animate = function (delay, fromZero) {
      var self = this;
      cancelAnimationFrame(this.raf);

      var n = this.cols.length;
      var total = fromZero ? (parseFloat(this.el.dataset.duration) || TOTAL_DURATION) : UPDATE_DURATION;
      var base = fromZero ? Math.min(BASE_DURATION, total) : total * 0.6;
      var fontPx = parseFloat(getComputedStyle(this.el).fontSize) || 100;
      var stepPx = n ? this.cols[0].strip.firstElementChild.getBoundingClientRect().height || fontPx : fontPx;

      var gamma = DAMPING_RANGE[0] + (DAMPING_RANGE[1] - DAMPING_RANGE[0]) * magnetism;
      var freq = FREQ_RANGE[0] + (FREQ_RANGE[1] - FREQ_RANGE[0]) * frequency;
      var swingRows = inertia * SWING_MAX * fontPx / stepPx;
      var swingT = Math.min(SETTLE_MAX, 3.9 / gamma);

      var anims = [];
      this.cols.forEach(function (c, i) {
        if (fromZero) {
          c.cur = 0;
          c.strip.style.transform = offsetT(0);
          c.col.style.opacity = MIN_OPACITY;
          c.col.style.filter = '';
        }
        var dist = (((c.digit - c.cur) % 10) + 10) % 10;
        var turns = fromZero ? Math.round(MIN_TURNS + (n > 1 ? (MAX_TURNS - MIN_TURNS) * i / (n - 1) : 0)) : 0;
        var rows = turns * 10 + dist;
        if (rows < 0.001) { c.cur = c.digit; return; }
        var D = n > 1 ? base + i * (total - base) / (n - 1) : total;
        anims.push({
          c: c,
          from: c.cur,
          rows: rows,
          D: D,
          end: D,
          amp: 0,
          minOp: fromZero ? MIN_OPACITY : UPDATE_MIN_OPACITY
        });
      });

      var last = anims[anims.length - 1];
      if (last && swingRows > 0.002) {
        last.amp = swingRows;
        last.gamma = gamma;
        last.freq = freq;
        last.lead = 0.3 / freq;
        last.t0 = last.D - last.lead;
        last.T = swingT;
        last.end = last.t0 + last.T;
      }

      var arrive = anims.reduce(function (m, a) { return Math.max(m, a.D); }, 0);
      var finish = anims.reduce(function (m, a) { return Math.max(m, a.end); }, 0);
      var withGlyphs = fromZero && this.glyphs.length > 0;
      var glyphStart = arrive + 0.4 * Math.max(finish - arrive, 0);
      var end = delay + finish;
      if (withGlyphs) end = Math.max(end, delay + glyphStart + GLYPH_FADE);

      if (!fromZero) {
        this.glyphs.forEach(function (g) { g.col.style.opacity = 1; g.strip.style.transform = 'translateY(0)'; });
      } else {
        this.glyphs.forEach(function (g) {
          g.col.style.opacity = 0;
          g.strip.style.transform = 'translateY(' + GLYPH_LIFT + 'em)';
        });
      }

      var start = performance.now() + delay * 1000;

      function frame(now) {
        var t = (now - start) / 1000, done = true, blurring = false;
        var tt = Math.max(t, 0);

        anims.forEach(function (a) {
          var travel = travelAt(tt, a);
          var pos = (((a.from + travel) % 10) + 10) % 10;
          a.c.cur = pos;
          a.c.strip.style.transform = offsetT(pos);

          var dt = 0.004;
          var speed = Math.abs(travelAt(tt + dt, a) - travel) / dt * stepPx;
          var sigma = (t <= 0 || t >= a.end) ? 0 : Math.min(MAX_BLUR, speed * BLUR_PER_SPEED);
          if (sigma >= 0.05 && blurMode !== 'none') blurring = true;
          self.setBlur(a.c, sigma);

          a.c.col.style.opacity = (a.minOp + (1 - a.minOp) * clamp01(travel / a.rows)).toFixed(3);

          if (t < a.end) done = false;
        });

        if (withGlyphs) {
          var q = glyphEase(clamp01((t - glyphStart) / GLYPH_FADE));
          self.glyphs.forEach(function (g) {
            g.col.style.opacity = q.toFixed(3);
            g.strip.style.transform = 'translateY(' + ((1 - q) * GLYPH_LIFT).toFixed(4) + 'em)';
          });
          if (t < glyphStart + GLYPH_FADE) done = false;
        }

        perfFrame(now, blurring);

        if (!done) { self.raf = requestAnimationFrame(frame); return; }

        anims.forEach(function (a) {
          a.c.cur = a.c.digit;
          a.c.strip.style.transform = offsetT(a.c.digit);
          a.c.col.style.opacity = 1;
          a.c.col.style.filter = '';
        });
      }

      this.raf = requestAnimationFrame(frame);
      return end;
    };

    var counters = Array.prototype.map.call(els, function (el) { return new Odometer(el); });
    window.odometers = counters;

    var row = els[0].closest('[data-odometer-row]') || els[0].parentElement;

    function fetchStats() {
      var url = row.dataset.statsUrl;
      if (!url) return Promise.resolve({});
      return fetch(url)
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .catch(function (e) {
          if (window.console) console.error('[odometer] ошибка загрузки значений', e);
          return {};
        });
    }

    function pickValue(c, data) {
      var v = data && data[c.el.dataset.key];
      if (v === undefined || v === null) v = c.el.dataset.value;
      if (v === undefined || v === null) return null;
      var num = Number(v);
      return isNaN(num) ? v : num;
    }

    function applyData(data) {
      counters.forEach(function (c) {
        var v = pickValue(c, data);
        if (v !== null) c.render(c.toText(v));
      });
    }
    function playAll() {
      counters.forEach(function (c, i) { c.play(i * COUNTER_DELAY); });
    }

    window.updateOdometers = function (data) {
      counters.forEach(function (c) {
        var v = data && data[c.el.dataset.key];
        if (v !== undefined && v !== null) c.setValue(Number(v));
      });
    };

    var fontsReady = (document.fonts && document.fonts.load)
      ? document.fonts.load('700 100px "Open Sans"').catch(function () { })
      : Promise.resolve();
    Promise.all([fontsReady, fetchStats()]).then(function (r) {
      applyData(r[1]);

      if (!('IntersectionObserver' in window)) { playAll(); return; }

      var io = new IntersectionObserver(function (entries) {
        var n = 0;
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          e.target.odometer.play(n++ * COUNTER_DELAY);
        });
      }, { threshold: 0.4 });

      counters.forEach(function (c) { io.observe(c.el); });
    });
  }
}

DigitsCounter.init();
