/*
  Меню шапки
 */

class HeaderMenu {
  static init() {
    const headerMenu = document.querySelector('.header-menu');

    if (headerMenu) {
      const burger = document.querySelector('.header__burger');
      const menuButton = document.querySelector('.header-menu-button');
      const documentElement = document.documentElement;
      let isHoverActive = false;

      function isDesktop() {
        return window.innerWidth >= 1201;
      }

      function isMobile() {
        return window.innerWidth <= 1200;
      }

      function closeNotifications() {
        if (isMobile()) {
          if (documentElement.classList.contains('open-notifications')) {
            documentElement.classList.remove('open-notifications');
          }
        }
      }

      function onMouseEnter() {
        if (isDesktop()) {
          documentElement.classList.add('menu-open');
        }
      }

      function onMouseLeave() {
        if (isDesktop()) {
          documentElement.classList.remove('menu-open');
        }
      }

      function onBurgerClick(e) {
        if (isMobile()) {
          e.preventDefault();
          e.stopPropagation();

          if (documentElement.classList.contains('menu-open')) {
            documentElement.classList.remove('menu-open');
          } else {
            closeNotifications();
            documentElement.classList.add('menu-open');
          }
        }
      }

      function updateHandlers() {
        const menuButtons = document.querySelectorAll('.header-menu-button');
        if (!menuButtons.length) return;

        if (isDesktop() && !isHoverActive) {
          menuButtons.forEach(button => {
            button.addEventListener('mouseenter', onMouseEnter);
            button.addEventListener('mouseleave', onMouseLeave);
          });
          isHoverActive = true;
        } else if (isMobile() && isHoverActive) {
          menuButtons.forEach(button => {
            button.removeEventListener('mouseenter', onMouseEnter);
            button.removeEventListener('mouseleave', onMouseLeave);
          });
          documentElement.classList.remove('menu-open');
          isHoverActive = false;
        }
      }

      if (burger) {
        burger.addEventListener('click', onBurgerClick);
      }

      document.addEventListener('click', (e) => {
        if (isMobile()) {
          const isClickInsideMenu = headerMenu && headerMenu.contains(e.target);
          const isClickOnBurger = burger && burger.contains(e.target);

          if (!isClickInsideMenu && !isClickOnBurger) {
            documentElement.classList.remove('menu-open');
          }
        }
      });

      if (headerMenu) {
        const menuLinks = headerMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
          link.addEventListener('click', () => {
            if (isMobile()) {
              documentElement.classList.remove('menu-open');
            }
          });
        });

        headerMenu.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }

      updateHandlers();

      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          updateHandlers();

          if (isMobile()) {
            if (documentElement.classList.contains('menu-open')) {
              documentElement.classList.remove('menu-open');
            }
            if (documentElement.classList.contains('open-notifications')) {
              documentElement.classList.remove('open-notifications');
            }
          } else if (isDesktop() && documentElement.classList.contains('menu-open')) {
            documentElement.classList.remove('menu-open');
          }
        }, 150);
      });
    }
  }
}

HeaderMenu.init();

/*
  Поведение шапки при прокрутке (Fix / Quick Return)
  ------------------------------------------------------------
  Режим задаётся атрибутом на <header class="header" data-header-mode="...">:

  fix - шапка просто fixed, скрипт ничего не делает (Услуги)
  quick - Quick Return для верхнего меню `.header__top`.
          Всё, что ниже (`.header-bottom`, субменю), остаётся fixed.
          ЛК: шапка целиком уезжает/возвращается.
          Услуги-продукт: уезжает только верхнее меню, субменю прилипает к верху.
  quick-extra - лендинги: основное меню fixed, а доп. контент над ним `.header-extra` ведёт себя как static, но возвращается при скролле вверх.
 */

class HeaderScroll {
  static initBottomReveal(header) {
    const selector = header.dataset.headerBottomTrigger;
    const bottom = header.querySelector(':scope > .header-bottom');
    if (!selector || !bottom) return;

    const triggers = Array.from(document.querySelectorAll(selector));
    if (!triggers.length) return;

    let shown = null;
    let ticking = false;

    const update = () => {
      ticking = false;
      const target = triggers.find((el) => el.getClientRects().length);
      if (!target) return;

      const show = target.getBoundingClientRect().bottom <= header.offsetHeight;
      if (show === shown) return;

      shown = show;
      header.classList.toggle('header--bottom-visible', show);
      bottom.inert = !show;
    };

    const request = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    window.addEventListener('pageshow', request);
    update();
  }

  static init() {
    const header = document.querySelector('.header[data-header-mode]');
    if (!header) return;

    HeaderScroll.initBottomReveal(header);

    const mode = header.dataset.headerMode;
    const root = document.documentElement;

    if (mode !== 'quick' && mode !== 'quick-extra') {
      const setFixed = () => {
        const h = `${header.offsetHeight}px`;
        root.style.setProperty('--header-height', h);
        root.style.setProperty('--header-visible', h);
      };
      new ResizeObserver(setFixed).observe(header);
      setFixed();
      return;
    }

    const hideEl = header.querySelector(
      mode === 'quick-extra' ? ':scope > .header-extra' : ':scope > .header__top'
    );
    if (!hideEl) return;

    const moving = Array.from(
      header.querySelectorAll(':scope > .header-extra, :scope > .header__top, :scope > .header-bottom')
    );

    const DURATION_MS = 400;
    const MIN_DURATION_MS = 200;
    const THRESHOLD_PX = 6;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const getScrollY = () =>
      clamp(window.scrollY, 0, Math.max(0, root.scrollHeight - window.innerHeight));

    const isLocked = () =>
      window.innerWidth <= 1200 &&
      (root.classList.contains('menu-open') || root.classList.contains('open-notifications'));

    let height = 0;
    let fullHeight = 0;
    let previousY = getScrollY();
    let rendered = 0;
    let hidden = false;
    let accumulated = 0;
    let anim = null;
    let frame = null;
    let lastVisible = -1;
    let lastInert = null;

    function paint() {
      const value = rendered ? `translate3d(0, ${rendered}px, 0)` : '';
      moving.forEach((el) => {
        el.style.transform = value;
      });

      const inert = height > 0 && rendered <= -height + 0.1;
      if (inert !== lastInert) {
        hideEl.inert = inert;
        lastInert = inert;
      }

      const visible = Math.round(Math.max(0, fullHeight + rendered));
      if (visible !== lastVisible) {
        root.style.setProperty('--header-visible', `${visible}px`);
        lastVisible = visible;
      }
    }

    function tick(time) {
      frame = null;
      if (!anim) return;

      const { from, to, start, duration } = anim;
      const p = duration > 0 ? clamp((time - start) / duration, 0, 1) : 1;
      rendered = from + (to - from) * easeOutCubic(p);

      if (p >= 1) {
        rendered = to;
        anim = null;
      }
      paint();
      if (anim) frame = requestAnimationFrame(tick);
    }

    function animateTo(isHidden) {
      hidden = isHidden;
      const to = isHidden ? -height : 0;
      if (rendered === to) {
        anim = null;
        return;
      }
      const distance = Math.abs(to - rendered);
      const duration = reducedMotion.matches || height <= 0
        ? 0
        : Math.max(MIN_DURATION_MS, DURATION_MS * (distance / height));

      anim = { from: rendered, to, start: performance.now(), duration };
      if (frame === null) frame = requestAnimationFrame(tick);
    }

    function onScroll() {
      const currentY = getScrollY();
      const delta = currentY - previousY;
      previousY = currentY;

      if (isLocked()) {
        accumulated = 0;
        if (hidden || rendered !== 0) animateTo(false);
        return;
      }

      if (currentY <= 0) {
        accumulated = 0;
        if (hidden || rendered !== 0) animateTo(false);
        return;
      }

      if (delta === 0) return;

      if (Math.sign(delta) !== Math.sign(accumulated)) accumulated = 0;
      accumulated += delta;

      if (accumulated > THRESHOLD_PX && !hidden) {
        accumulated = 0;
        animateTo(true);
      } else if (accumulated < -THRESHOLD_PX && hidden) {
        accumulated = 0;
        animateTo(false);
      }
    }

    function measure() {
      height = hideEl.getBoundingClientRect().height;
      root.style.setProperty('--header-quick-height', `${height}px`);
      fullHeight = header.offsetHeight;
      root.style.setProperty('--header-height', `${fullHeight}px`);
      anim = null;
      rendered = hidden ? -height : 0;
      previousY = getScrollY();
      paint();
    }

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(header);
    resizeObserver.observe(hideEl);

    new MutationObserver(() => {
      if (isLocked()) animateTo(false);
    }).observe(root, { attributes: true, attributeFilter: ['class'] });

    header.addEventListener('focusin', (event) => {
      if (event.target.matches(':focus-visible')) animateTo(false);
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pageshow', () => {
      previousY = getScrollY();
      accumulated = 0;
      hidden = false;
      anim = null;
      rendered = 0;
      lastVisible = -1;
      lastInert = null;
      paint();
    });

    measure();
  }
}

HeaderScroll.init();