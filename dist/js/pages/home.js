/** Вертикальный ротатор слов в заголовке */
class HomeRotator {
    static init() {
        const rotator = document.querySelector('.rotator');
        if (rotator) {
            const items = Array.from(rotator.querySelectorAll('.rotator-item'));

            const firstClone = items[0].cloneNode(true);
            firstClone.classList.add('rotator-item');
            rotator.appendChild(firstClone);

            const allItems = Array.from(rotator.querySelectorAll('.rotator-item'));
            const realCount = items.length;
            let current = 0;
            let animating = false;

            function moveTo(index) {
                allItems.forEach((el, i) => {
                    el.style.transform = `translateY(-${index * 100}%)`;
                });
            }

            setInterval(() => {
                if (animating) return;
                animating = true;

                current++;
                moveTo(current);

                if (current === realCount) {
                    setTimeout(() => {
                        allItems.forEach(el => el.classList.add('no-transition'));
                        current = 0;
                        moveTo(0);

                        void rotator.offsetHeight;

                        allItems.forEach(el => el.classList.remove('no-transition'));
                        animating = false;
                    }, 600);
                } else {
                    setTimeout(() => { animating = false; }, 600);
                }
            }, 3000);
        }
    }
}

HomeRotator.init();

/** Видео-анимация .pic1-anim с запасной картинкой */
class PicAnimations {
    static init() {
        let picAnim = document.querySelectorAll('.pic1-anim');

        if (picAnim) {
            picAnim.forEach((wrap) => {
                const video = wrap.querySelector('.pic1-anim__video');
                const fallback = wrap.querySelector('.pic1-anim__fallback');
                if (!video) return;

                const showVideo = () => wrap.classList.add('is-playing');
                const showFallback = () => {
                    wrap.classList.remove('is-playing');
                    if (fallback) fallback.style.display = '';
                };

                video.addEventListener('playing', showVideo, { once: true });

                video.addEventListener('error', showFallback, { once: true });
                video.addEventListener('stalled', showFallback, { once: true });
                video.addEventListener('abort', showFallback, { once: true });

                if (video.readyState === 0 && video.networkState === video.NETWORK_NO_SOURCE) {
                    showFallback();
                    return;
                }

                setTimeout(() => {
                    if (video.paused || video.readyState < 2) showFallback();
                }, 3000);

                const tryPlay = video.play();
                if (tryPlay && typeof tryPlay.catch === 'function') {
                    tryPlay.catch(() => showFallback());
                }

                document.addEventListener('visibilitychange', () => {
                    if (!document.hidden && !wrap.classList.contains('is-playing')) {
                        const p = video.play();
                        if (p && typeof p.catch === 'function') p.catch(() => { });
                    }
                });
            });
        }
    }
}

PicAnimations.init();

/** Слайдер новостей: Swiper на узких экранах, фильтр-табы на десктопе */
class NewsSlider {
    static init() {
        const sliderNews = document.querySelector('.block-news__slider');

        if (sliderNews) {
            const filterNews = document.querySelector('.filter-news');
            const buttons = Array.from(filterNews.querySelectorAll('.filter-news__title'));
            const slides = Array.from(sliderNews.querySelectorAll('.swiper-slide'));
            let newsSwiper = null;
            const mq = window.matchMedia('(max-width: 1250px)');
            const preloaded = new Set();

            function preloadImages(root) {
                if (!root) return;
                root.querySelectorAll('img').forEach(img => {
                    const src = img.getAttribute('src');
                    if (!src || preloaded.has(src)) return;
                    preloaded.add(src);
                    const pre = new Image();
                    pre.decoding = 'async';
                    pre.src = src;
                });
            }

            function preloadAll() {
                slides.forEach(slide => preloadImages(slide));
            }

            function setDesktopFilter(index) {
                buttons.forEach((b, i) => b.classList.toggle('active', i === index));
                slides.forEach((s, i) => {
                    const active = i === index;
                    s.style.display = active ? '' : 'none';
                    if (active) preloadImages(s);
                });
            }

            function bindDesktopClicks() {
                buttons.forEach((btn, i) => {
                    btn.onclick = () => {
                        setDesktopFilter(i);
                        preloadAll();
                    };
                });
            }

            function initSwiper() {
                if (newsSwiper) return;
                slides.forEach(s => (s.style.display = ''));

                newsSwiper = new Swiper('.block-news__slider', {
                    observer: true,
                    observeParents: true,
                    slidesPerView: 'auto',
                    spaceBetween: 16,
                    speed: 400,
                    freeMode: {
                        enabled: true,
                        sticky: false,
                        momentum: true,
                        momentumRatio: 0.5,
                    },
                    preloadImages: true,
                    on: {
                        init(sw) {
                            const i = sw.realIndex;
                            buttons.forEach((b, idx) => b.classList.toggle('active', idx === i));
                            preloadAll();
                        },
                        slideChange(sw) {
                            const i = sw.realIndex;
                            buttons.forEach((b, idx) => b.classList.toggle('active', idx === i));
                            if (slides[i]) preloadImages(slides[i]);
                        }
                    }
                });

                buttons.forEach((btn, i) => {
                    btn.onclick = () => {
                        newsSwiper.slideToLoop(i, 400);
                        preloadAll();
                    };
                });

                buttons.forEach((b, i) => b.classList.toggle('active', i === newsSwiper.realIndex));
            }

            function destroySwiper() {
                if (!newsSwiper) return;
                newsSwiper.destroy(true, true);
                newsSwiper = null;
                bindDesktopClicks();
                setDesktopFilter(0);
                preloadAll();
            }

            function handleBreakpoint(e) {
                if (e.matches) initSwiper();
                else destroySwiper();
            }

            if (mq.matches) initSwiper();
            else {
                bindDesktopClicks();
                setDesktopFilter(0);
                preloadAll();
            }

            mq.addEventListener('change', handleBreakpoint);
        }
    }
}

NewsSlider.init();

/** Блок отзывов: «показать ещё» / «все отзывы» */
class BlockReviews {
    static init() {
        const init = () => {
            const root = document.querySelector(".block-reviews");
            if (!root) return;

            const cards = root.querySelector(".block-reviews__cards");
            const buttons = root.querySelector(".block-reviews__buttons");
            const btnMore = root.querySelector(".btn-more-reviews");
            const btnAll = root.querySelector(".btn-all-reviews");
            if (!cards || !buttons || !btnMore || !btnAll) return;

            let STEP = 6;
            const MIN_VISIBLE = 60;
            const DURATION = 800;
            const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
            const TOP_CLASSES = ["card2", "card3", "card4"];
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            const items = Array.from(cards.querySelectorAll(":scope > .card-review"));
            let shownCount = null;
            let isFull = false;
            let crop = 0;
            let full = 0;

            const topOf = (el) => el.offsetTop + (parseFloat(getComputedStyle(el).paddingTop) || 0);
            const sorted = () =>
                items
                    .map((el) => ({ el, top: topOf(el), left: el.offsetLeft }))
                    .sort((a, b) => a.top - b.top || a.left - b.left);
            const isShown = (top, height) => top < height - MIN_VISIBLE;
            const shownAt = (height) => sorted().filter(({ top }) => isShown(top, height)).length;

            const heightFor = (count) => {
                const list = sorted();
                if (count >= list.length) return full;
                const last = list[count - 1].top;
                const next = list[count].top;
                const h = Math.max(last + MIN_VISIBLE + 1, Math.min(next + MIN_VISIBLE, last + 320));
                return h >= full - 40 ? full : h;
            };

            const topCardsWanted = () => {
                const columns = new Map();
                items.forEach((el) => {
                    const x = Math.round(el.offsetLeft);
                    const top = el.offsetTop;
                    const cur = columns.get(x);
                    if (!cur || top < cur.top) columns.set(x, { el, top });
                });
                return Array.from(columns.entries())
                    .sort((a, b) => a[0] - b[0])
                    .slice(1, 4)
                    .map(([, { el }], i) => [el, TOP_CLASSES[i]]);
            };

            const retag = () => {
                for (let i = 0; i < 4; i++) {
                    const want = topCardsWanted();
                    const tagged = items.filter((el) => TOP_CLASSES.some((c) => el.classList.contains(c)));
                    const same =
                        tagged.length === want.length && want.every(([el, c]) => el.classList.contains(c));
                    if (same) return;
                    items.forEach((el) => el.classList.remove(...TOP_CLASSES));
                    want.forEach(([el, c]) => el.classList.add(c));
                }
            };

            const layout = () => {
                const prevTransition = cards.style.transition;
                cards.style.transition = "none";
                cards.classList.remove("is-crop");
                cards.style.removeProperty("--crop");
                cards.style.removeProperty("--full");

                if (isFull) {
                    retag();
                    cards.style.transition = prevTransition;
                    return;
                }

                const cssHeight = cards.offsetHeight;
                cards.classList.add("is-crop");
                retag();
                full = cards.offsetHeight;
                crop = shownCount === null ? cssHeight : heightFor(shownCount);

                if (shownCount === null) {
                    const initialVisible = shownAt(crop);
                    STEP = initialVisible * 2;
                }

                if (shownCount === null && full - crop < MIN_VISIBLE) {
                    isFull = true;
                    cards.classList.remove("is-crop");
                    cards.classList.add("is-expanded");
                    buttons.classList.add("is-done");
                } else {
                    cards.style.setProperty("--full", `${full}px`);
                    cards.style.setProperty("--crop", `${crop}px`);
                }
                void cards.offsetHeight;
                cards.style.transition = prevTransition;
            };

            const go = (count) => {
                const list = sorted();
                const H = heightFor(count);
                const reachedFull = H >= full;

                const entering = list.filter(
                    ({ top }) => !isShown(top, crop) && (reachedFull || isShown(top, H))
                );

                cards.style.setProperty("--crop", `${H}px`);
                crop = H;
                shownCount = reachedFull ? items.length : shownAt(H);

                if (!reduceMotion) {
                    entering.forEach(({ el }, i) => {
                        el.animate(
                            [
                                { opacity: 0, transform: "translateY(60px)" },
                                { opacity: 1, transform: "translateY(0)" },
                            ],
                            { duration: DURATION, delay: i * 80, easing: EASING, fill: "backwards" }
                        );
                    });
                }

                if (reachedFull) {
                    isFull = true;
                    cards.classList.add("is-expanded");
                    buttons.classList.add("is-done");
                    btnAll.classList.add("is-visible");
                    setTimeout(() => {
                        cards.classList.remove("is-crop");
                        cards.style.removeProperty("--crop");
                        cards.style.removeProperty("--full");
                    }, (reduceMotion ? 0 : DURATION) + 100);
                }
            };

            const shownNow = () => (shownCount === null ? shownAt(crop) : shownCount);

            btnMore.addEventListener("click", () => {
                go(shownNow() + STEP);
                btnAll.classList.add("is-visible");
            });
            btnAll.addEventListener("click", () => go(items.length));

            layout();

            let timer = 0;
            window.addEventListener("resize", () => {
                clearTimeout(timer);
                timer = setTimeout(layout, 150);
            });
            if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
        };

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", init);
        } else {
            init();
        }
    }
}

BlockReviews.init();

/** Витрина кабинета [data-cabinet]: вкладки и автопереключение */
class CabinetShowcase {
    static init() {
        document.querySelectorAll('[data-cabinet]').forEach((root) => CabinetShowcase.setup(root));
    }

    static setup(root) {
        const items = [...root.querySelectorAll('[data-cabinet-item]')];
        const tabs = items.map((item) => item.querySelector('[data-cabinet-tab]'));
        const bodies = items.map((item) => item.querySelector('[data-cabinet-body]'));
        const track = root.querySelector('[data-cabinet-track]');
        const sticky = root.querySelector('[data-cabinet-sticky]');

        const slidesContainer = root.querySelector('.block-home-cabinet__videos');
        const slides = slidesContainer ? [...slidesContainer.querySelectorAll('[data-cabinet-slide]')] : [];
        const videos = slides.map((slide) => slide.querySelector('video'));

        const originalParent = slidesContainer?.parentElement;
        const originalNextSibling = slidesContainer?.nextElementSibling;
        const spollersList = items[0]?.parentElement || null;

        const n = items.length;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const mobileBreakpoint = 1101;
        const scrollMinWidthRaw = parseFloat(root.dataset.scrollMinWidth);
        const scrollMinWidth = Number.isFinite(scrollMinWidthRaw) ? scrollMinWidthRaw : mobileBreakpoint + 1;

        const headerEl = document.querySelector(root.dataset.header || '.header');
        let topOffset = 0;

        function measureTopOffset() {
            const fixed = parseFloat(root.dataset.headerOffset);
            if (Number.isFinite(fixed)) return fixed;
            if (!headerEl) return 0;
            const pos = getComputedStyle(headerEl).position;
            if (pos !== 'fixed' && pos !== 'sticky') return 0;
            return Math.max(0, Math.round(headerEl.getBoundingClientRect().bottom));
        }

        const num = (v, d) => {
            const x = parseFloat(v);
            return Number.isFinite(x) ? x : d;
        };

        // 1 скролл-шаг колеса мыши ≈ 100px. Цикл слайда = 2 (переход) + 2 (удержание) = 4 шага
        const stepPx = num(root.dataset.stepPx, 100);
        const transitionPx = num(root.dataset.transitionSteps, 2) * stepPx;
        const holdPx = num(root.dataset.holdSteps, 2) * stepPx;
        const cyclePx = transitionPx + holdPx;
        const totalPx = (n - 1) * cyclePx + holdPx;

        const ACCORDION_AT = num(root.dataset.accordionAt, 0.45);
        const PLAY_AT = num(root.dataset.playAt, 0.1);
        const STOP_AT = 0.9;

        // Новый слайд въезжает снизу-справа (вверх и справа налево), прижимаясь к аккордеону.
        // SHIFT_X / SHIFT_Y — стартовое смещение в % от размера слайда.
        const SHIFT_X = num(root.dataset.shiftX, 70);
        const SHIFT_Y = num(root.dataset.shiftY, 45);
        // Уходящий слайд смещается вверх-влево на эту долю от смещения входящего
        const OUT_RATIO = 0.25;

        const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
        const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b);

        let current = -1;
        let pos = 0;
        let scrollMode = false;
        let inView = true;
        let lastWant = new Set([0]);
        let raf = 0;
        let tweenRaf = 0;
        let resizeTimer;

        function playVideo(video) {
            if (!video) return;
            const src = video.dataset.src;
            if (!src) return;
            if (!video.getAttribute('src')) {
                video.src = src;
                video.load();
            }
            if (video.paused) video.play().catch(() => { });
        }

        function stopVideo(video) {
            if (!video) return;
            if (!video.paused) video.pause();
            if (video.getAttribute('src') && video.currentTime !== 0) video.currentTime = 0;
        }

        function applyPlayback(want) {
            lastWant = want;
            videos.forEach((video, i) => {
                if (inView && want.has(i)) playVideo(video);
                else if (!inView) video?.pause();
                else stopVideo(video);
            });
        }

        function renderSlides(p) {
            slides.forEach((slide, j) => {
                const d = j - p; // d > 0 — слайд ещё впереди (входит), d < 0 — уже ушёл
                const a = Math.abs(d);

                let o;
                if (d > 0) o = clamp((1 - a) / 0.4);
                else o = 1 - clamp((a - 0.35) / 0.65);
                if (a >= 1) o = 0;

                let x;
                let y;
                if (d > 0) {
                    // входящий: из правого нижнего угла вверх и влево до позиции 0,0
                    x = d * SHIFT_X;
                    y = d * SHIFT_Y;
                } else {
                    // уходящий: слегка вверх и влево, остаётся под новым слайдом
                    x = d * SHIFT_X * OUT_RATIO;
                    y = d * SHIFT_Y * OUT_RATIO;
                }

                slide.style.opacity = o.toFixed(3);
                slide.style.visibility = o > 0.001 ? 'visible' : 'hidden';
                slide.style.transform = `translate3d(${x.toFixed(2)}%, ${y.toFixed(2)}%, 0)`;
                slide.style.zIndex = d > 0 ? 2 : 1;
            });
        }

        function setActive(index) {
            if (index === current) return;
            current = index;

            items.forEach((item, i) => {
                const on = i === index;
                const tab = tabs[i];
                item.classList.toggle('is-active', on);
                item.classList.toggle('_spoller-active', on);
                tab.classList.toggle('_spoller-active', on);
                tab.setAttribute('aria-expanded', String(on));
                tab.setAttribute('aria-selected', String(on));
                tab.tabIndex = on ? 0 : -1;
                if (bodies[i]) bodies[i].inert = !on;
            });

            slides.forEach((slide, i) => slide.setAttribute('aria-hidden', String(i !== index)));

            placeVideos(index);
        }

        function placeVideos(index) {
            if (window.innerWidth > mobileBreakpoint) resetContainerPosition();
            else moveContainerAfterActiveItem(index);
        }

        function moveContainerAfterActiveItem(index) {
            if (!slidesContainer || !items[index] || !spollersList) return;
            const activeItem = items[index];
            if (slidesContainer.previousElementSibling === activeItem) return;
            if (activeItem.nextSibling) spollersList.insertBefore(slidesContainer, activeItem.nextSibling);
            else spollersList.appendChild(slidesContainer);
        }

        function resetContainerPosition() {
            if (!slidesContainer || !originalParent) return;
            if (slidesContainer.parentElement === originalParent) return;
            if (originalNextSibling) originalParent.insertBefore(slidesContainer, originalNextSibling);
            else originalParent.appendChild(slidesContainer);
        }

        function readScroll() {
            const rect = track.getBoundingClientRect();
            const y = clamp(topOffset - rect.top, 0, totalPx);
            const i = Math.min(Math.floor(y / cyclePx), n - 1);
            const local = y - i * cyclePx;
            const tn = i < n - 1 && local > holdPx ? clamp((local - holdPx) / transitionPx) : 0;
            return { i, tn };
        }

        function updateFromScroll() {
            raf = 0;
            if (!scrollMode) return;
            const { i, tn } = readScroll();

            pos = i + ease(tn);
            renderSlides(pos);

            setActive(tn >= ACCORDION_AT ? Math.min(i + 1, n - 1) : i);

            const want = new Set([i]);
            if (tn > 0 && tn >= PLAY_AT && i + 1 < n) want.add(i + 1);
            if (tn >= STOP_AT) want.delete(i);
            applyPlayback(want);
        }

        function requestUpdate() {
            if (raf) return;
            raf = requestAnimationFrame(() => (scrollMode ? updateFromScroll() : updateFlow()));
        }

        function tweenTo(k) {
            cancelAnimationFrame(tweenRaf);
            const from = pos;
            const dur = reduceMotion ? 0 : 600;
            const t0 = performance.now();
            const fromIdx = Math.round(from);

            setActive(k);

            const step = (now) => {
                const t = dur ? clamp((now - t0) / dur) : 1;
                pos = from + (k - from) * ease(t);
                renderSlides(pos);
                applyPlayback(t < 1 ? new Set([fromIdx, k]) : new Set([k]));
                if (t < 1) tweenRaf = requestAnimationFrame(step);
            };
            tweenRaf = requestAnimationFrame(step);
        }

        const lineOffset = num(root.dataset.lineOffset, 16);
        const HYST = 40;
        let holdRaf = 0;

        function cancelHold() {
            cancelAnimationFrame(holdRaf);
            holdRaf = 0;
        }

        function holdPosition(tab, ms, align) {
            cancelHold();
            const docTop = () => tab.getBoundingClientRect().top + window.scrollY;
            let prev = docTop();
            const t0 = performance.now();
            const loop = (now) => {
                const cur = docTop();
                const shift = cur - prev;
                if (Math.abs(shift) > 0.5) {
                    window.scrollBy({ top: shift, behavior: 'instant' });
                    prev = cur;
                }
                if (align) {
                    const delta = docTop() - (topOffset + lineOffset) - window.scrollY;
                    const step = Math.abs(delta) < 1 ? delta : delta * 0.18;
                    if (Math.abs(step) > 0.2) window.scrollBy({ top: step, behavior: 'instant' });
                }
                if (now - t0 < ms) {
                    holdRaf = requestAnimationFrame(loop);
                } else {
                    holdRaf = 0;
                    requestUpdate();
                }
            };
            holdRaf = requestAnimationFrame(loop);
        }

        function updateFlow() {
            raf = 0;
            if (scrollMode || holdRaf || !n) return;

            const line = topOffset + lineOffset;
            let reached = -1;
            items.forEach((item, i) => {
                if (item.getBoundingClientRect().top <= line + 1) reached = i;
            });

            const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
            if (atBottom && items[n - 1].getBoundingClientRect().top < window.innerHeight) reached = n - 1;

            const next = Math.max(reached, 0);
            let target = current;
            if (current < 0 || next > current) target = next;
            else if (next < current && items[current].getBoundingClientRect().top > line + HYST) target = next;

            if (target !== current) {
                holdPosition(tabs[target], reduceMotion ? 100 : 700, false);
                tweenTo(target);
            }
        }

        function goTo(i) {
            if (scrollMode) {
                const top = track.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: top - topOffset + i * cyclePx, behavior: reduceMotion ? 'auto' : 'smooth' });
            } else {
                holdPosition(tabs[i], reduceMotion ? 100 : 700, true);
                if (i !== current) tweenTo(i);
            }
        }

        function setMode() {
            const next = window.innerWidth >= scrollMinWidth && !reduceMotion;
            const changed = next !== scrollMode;
            scrollMode = next;
            root.classList.toggle('is-scroll', scrollMode);

            topOffset = measureTopOffset();
            root.style.setProperty('--cabinet-top', `${topOffset}px`);

            if (track) track.style.height = scrollMode ? `${totalPx + sticky.offsetHeight}px` : '';
            return changed;
        }

        tabs.forEach((tab, i) => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                goTo(i);
            });

            tab.addEventListener('keydown', (e) => {
                const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
                if (e.key in keys) {
                    e.preventDefault();
                    const next = (i + keys[e.key] + n) % n;
                    tabs[next].focus();
                    goTo(next);
                }
            });
        });

        window.addEventListener('scroll', requestUpdate, { passive: true });

        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const changed = setMode();
                if (scrollMode) {
                    placeVideos(Math.max(current, 0));
                    updateFromScroll();
                } else if (changed) {
                    const k = Math.max(current, 0);
                    cancelAnimationFrame(tweenRaf);
                    pos = k;
                    renderSlides(pos);
                    placeVideos(k);
                    applyPlayback(new Set([k]));
                }
            }, 100);
        });

        if ('IntersectionObserver' in window) {
            new IntersectionObserver(
                ([entry]) => {
                    inView = entry.isIntersecting;
                    applyPlayback(lastWant);
                },
                { threshold: 0 }
            ).observe(root);
        }

        root.classList.add('_spoller-init');
        setMode();

        if (scrollMode) {
            updateFromScroll();
        } else {
            pos = 0;
            renderSlides(0);
            setActive(0);
            applyPlayback(new Set([0]));
            requestUpdate();
        }

        requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-ready')));
    }
}

document.addEventListener('DOMContentLoaded', () => CabinetShowcase.init());

