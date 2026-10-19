// Анимация цифр
function digitsCounter() {
    const VISIBLE_THRESHOLD = 0.5;

    function digitsCountersInit(digitsCountersItems) {
        const digitsCounters = digitsCountersItems
            ? digitsCountersItems
            : document.querySelectorAll("[data-digits-counter]");

        digitsCounters.forEach(digitsCounter => {
            if (digitsCounter.hasAttribute('data-go')) return;
            const element = digitsCounter.closest('[data-watch]') || digitsCounter;
            if (!isElementVisible(element, VISIBLE_THRESHOLD)) return;
            startCounterAnimation(digitsCounter);
        });
    }

    function isElementVisible(element, threshold = 0.5) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const elementHeight = rect.height;
        if (elementHeight === 0) return false;
        return (visibleHeight / elementHeight) >= threshold
            && rect.top < windowHeight && rect.bottom > 0;
    }

    function getWatchAppearDuration(watchEl) {
        if (!watchEl) return 0;
        const style = window.getComputedStyle(watchEl);
        const durations = style.transitionDuration
            .split(',')
            .map(v => v.trim())
            .map(v => v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000)
            .filter(v => !isNaN(v));
        return durations.length ? Math.max(...durations) : 0;
    }

    function startCounterAnimation(digitsCounter) {
        digitsCounter.setAttribute('data-go', '');

        const plusSpan = digitsCounter.querySelector('.counter-plus');
        if (plusSpan) plusSpan.classList.remove('is-visible');

        const raw = (digitsCounter.dataset.originalValue || '0').replace(/\s/g, '');
        digitsCounter.dataset.originalValue = raw;

        Array.from(digitsCounter.childNodes).forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) node.remove();
        });

        let numberNode = digitsCounter.querySelector('.counter-number');
        if (!numberNode) {
            numberNode = document.createElement('span');
            numberNode.className = 'counter-number';
            digitsCounter.insertBefore(numberNode, digitsCounter.firstChild);
        }
        numberNode.textContent = '0';

        const watchEl = digitsCounter.closest('[data-watch]');
        const cardDelay = watchEl ? (parseInt(watchEl.dataset.watchDelay, 10) || 0) : 0;
        const appearDuration = getWatchAppearDuration(watchEl);
        const totalDelay = cardDelay + appearDuration;

        setTimeout(() => {
            digitsCountersAnimate(numberNode, plusSpan);
        }, totalDelay);
    }

    function digitsCountersAnimate(numberNode, plusSpan) {
        const digitsCounter = numberNode.closest('[data-digits-counter]');
        const duration = parseFloat(digitsCounter.dataset.digitsCounterSpeed) || 1000;
        const originalValue = digitsCounter.dataset.originalValue;
        const hasDecimal = originalValue.includes(',') || originalValue.includes('.');
        const numericValue = parseFloat(originalValue.replace(',', '.'));
        const decimalPlaces = hasDecimal
            ? (originalValue.split(/[,.]/)[1] || '').length
            : 0;
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            let currentValue = progress * numericValue;
            currentValue = decimalPlaces > 0
                ? parseFloat(currentValue.toFixed(decimalPlaces))
                : Math.floor(currentValue);
            numberNode.textContent = formatNumber(currentValue, decimalPlaces);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                numberNode.textContent = formatNumber(numericValue, decimalPlaces);
                if (plusSpan) {
                    requestAnimationFrame(() => plusSpan.classList.add('is-visible'));
                }
                digitsCounter.removeAttribute('data-go');
            }
        };
        window.requestAnimationFrame(step);
    }

    function formatNumber(value, decimalPlaces) {
        if (decimalPlaces > 0) {
            return value.toFixed(decimalPlaces).replace('.', ',');
        }
        return Math.floor(value).toString();
    }

    function digitsCounterAction(e) {
        const entry = e.detail.entry;
        if (!entry.isIntersecting) return;
        const target = entry.target;
        const counters = target.querySelectorAll("[data-digits-counter]");
        if (counters.length) digitsCountersInit(counters);
    }

    function initIntersectionObserver() {
        const counters = document.querySelectorAll("[data-digits-counter]");
        if (!('IntersectionObserver' in window)) {
            digitsCountersInit();
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= VISIBLE_THRESHOLD) {
                    const counter = entry.target;
                    if (!counter.hasAttribute('data-go')) startCounterAnimation(counter);
                }
            });
        }, { threshold: VISIBLE_THRESHOLD });
        counters.forEach(counter => observer.observe(counter));
    }

    document.addEventListener("watcherCallback", digitsCounterAction);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initIntersectionObserver);
    } else {
        initIntersectionObserver();
    }

    setTimeout(() => digitsCountersInit(), 100);
}

digitsCounter();

//========================================================================================================================================================

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

//========================================================================================================================================================

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

//========================================================================================================================================================

const sliderNews = document.querySelector('.block-news__slider');

if (sliderNews) {
    const filterNews = document.querySelector('.filter-news');
    const buttons = Array.from(filterNews.querySelectorAll('.filter-news__title'));
    const slides = Array.from(sliderNews.querySelectorAll('.swiper-slide'));
    let newsSwiper = null;
    const mq = window.matchMedia('(max-width: 1250px)');

    function setDesktopFilter(index) {
        buttons.forEach((b, i) => b.classList.toggle('active', i === index));
        slides.forEach((s, i) => { s.style.display = i === index ? '' : 'none'; });
    }

    function bindDesktopClicks() {
        buttons.forEach((btn, i) => { btn.onclick = () => setDesktopFilter(i); });
    }

    function initSwiper() {
        if (newsSwiper) return;
        slides.forEach(s => (s.style.display = ''));

        newsSwiper = new Swiper('.block-news__slider', {
            observer: true,
            observeParents: true,
            slidesPerView: 'auto',
            spaceBetween: 0,
            speed: 400,
            freeMode: {
                enabled: true,
                sticky: false,
                momentum: true,
                momentumRatio: 0.5,
            },
            preloadImages: true,
            on: {
                slideChange(sw) {
                    const i = sw.realIndex;
                    buttons.forEach((b, idx) => b.classList.toggle('active', idx === i));
                }
            }
        });

        buttons.forEach((btn, i) => {
            btn.onclick = () => newsSwiper.slideToLoop(i, 400);
        });

        buttons.forEach((b, i) => b.classList.toggle('active', i === newsSwiper.realIndex));
    }

    function destroySwiper() {
        if (!newsSwiper) return;
        newsSwiper.destroy(true, true);
        newsSwiper = null;
        bindDesktopClicks();
        setDesktopFilter(0);
    }

    function handleBreakpoint(e) {
        if (e.matches) initSwiper();
        else destroySwiper();
    }

    if (mq.matches) initSwiper();
    else { bindDesktopClicks(); setDesktopFilter(0); }

    mq.addEventListener('change', handleBreakpoint);
}

//========================================================================================================================================================

function blockReviews() {
    const init = () => {
        const root = document.querySelector(".block-reviews");
        if (!root) return;

        const cards = root.querySelector(".block-reviews__cards");
        const buttons = root.querySelector(".block-reviews__buttons");
        const btnMore = root.querySelector(".btn-more-reviews");
        const btnAll = root.querySelector(".btn-all-reviews");
        if (!cards || !buttons || !btnMore || !btnAll) return;

        const STEP = parseInt(cards.dataset.reviewsStep, 10) || 6;
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

blockReviews();