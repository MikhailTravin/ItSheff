/**
 * Меню шапки
 * ------------------------------------------------------------
 * Бургер, выпадающие пункты меню.
 *
 * Класс:      HeaderMenu
 * Включается: если на странице есть `.header-menu`
 * Зависит от: —
 * Страницы:   21 из 29 (все, кроме: account-access, account-blocked, loader-login-error, loader-login, loader-progress, loader, login, registration)
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

/**
 * Поведение шапки при прокрутке (Fix / Quick Return)
 * ------------------------------------------------------------
 * Режим задаётся атрибутом на <header class="header" data-header-mode="...">:
 *
 *   fix          — шапка просто fixed, скрипт ничего не делает (Услуги)
 *   quick        — Quick Return для верхнего меню `.header__top`.
 *                  Всё, что ниже (`.header-bottom`, субменю), остаётся fixed.
 *                  ЛК: шапка целиком уезжает/возвращается.
 *                  Услуги-продукт: уезжает только верхнее меню, субменю прилипает к верху.
 *   quick-extra  — лендинги: основное меню fixed, а доп. контент над ним
 *                  `.header-extra` ведёт себя как static, но возвращается при скролле вверх.
 *
 * Принцип (как в quick-return-header-1x.html):
 *   offset = clamp(offset - delta, -высота_скрываемого_блока, 0)
 *   transform: translateY(offset) на всех блоках шапки.
 *   Скрываемый блок уезжает на свою высоту, остальные «встают» к верху экрана.
 *
 * CSS-переменные на <html> (для sticky-блоков под шапкой):
 *   --header-visible — сколько px шапки сейчас видно сверху (меняется при скролле)
 *   --header-height  — полная высота шапки (постоянная)
 *   Пример: top: calc(20px + var(--header-visible, 0px));
 *
 * Класс:      HeaderScroll
 * Включается: если на странице есть `.header[data-header-mode="quick|quick-extra"]`
 * Зависит от: —  (меню на мобильном не прячется, пока открыто — см. isLocked)
 */

class HeaderScroll {
  static init() {
    const header = document.querySelector('.header[data-header-mode]');
    if (!header) return;

    const mode = header.dataset.headerMode;
    const root = document.documentElement;

    // fix: двигать ничего не надо, но переменные для sticky-блоков отдаём всегда.
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

    // Блок, который скрывается при скролле вниз и возвращается при скролле вверх.
    const hideEl = header.querySelector(
      mode === 'quick-extra' ? ':scope > .header-extra' : ':scope > .header__top'
    );
    if (!hideEl) return;

    // Блоки, которые двигаются вместе со скроллом.
    // .header-bottom__right (fixed-панель на мобильном) сюда не входит специально:
    // transform у родителя ломает position: fixed.
    const moving = Array.from(
      header.querySelectorAll(':scope > .header-extra, :scope > .header__top, :scope > .header-bottom')
    );

    const REVEAL_MULTIPLIER = 1; // скорость возврата вверх (1 = 1:1 со скроллом)
    const HIDE_MULTIPLIER = 1; // скорость скрытия вниз
    const SMOOTHING_MS = 55; // сглаживание: меньше — точнее, больше — мягче
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const getScrollY = () =>
      clamp(window.scrollY, 0, Math.max(0, root.scrollHeight - window.innerHeight));

    // На мобильном, пока открыто меню или уведомления, шапку не прячем.
    const isLocked = () =>
      window.innerWidth <= 1200 &&
      (root.classList.contains('menu-open') || root.classList.contains('open-notifications'));

    let height = 0;
    let fullHeight = 0;
    let previousY = getScrollY();
    let target = 0; // расчётная позиция (1:1 со скроллом)
    let rendered = 0; // видимая позиция (плавно догоняет расчётную)
    let direction = 0;
    let frame = null;
    let lastTime = 0;

    function paint() {
      const value = rendered ? `translate3d(0, ${rendered}px, 0)` : '';
      moving.forEach((el) => {
        el.style.transform = value;
      });
      hideEl.inert = height > 0 && rendered <= -height + 0.1;
      // Сколько пикселей шапки сейчас видно сверху окна — для sticky-блоков.
      root.style.setProperty('--header-visible', `${Math.max(0, fullHeight + rendered)}px`);
    }

    function animate(time) {
      frame = null;
      const elapsed = lastTime ? Math.min(time - lastTime, 64) : 1000 / 60;
      lastTime = time;
      const alpha = reducedMotion.matches ? 1 : 1 - Math.exp(-elapsed / SMOOTHING_MS);
      rendered += (target - rendered) * alpha;
      if (Math.abs(target - rendered) < 0.1) rendered = target;
      paint();
      if (rendered !== target) frame = requestAnimationFrame(animate);
      else lastTime = 0;
    }

    function schedule() {
      if (frame === null) frame = requestAnimationFrame(animate);
    }

    function onScroll() {
      const currentY = getScrollY();
      const delta = currentY - previousY;

      if (isLocked()) {
        target = 0;
        previousY = currentY;
        schedule();
        return;
      }

      if (delta !== 0) {
        const nextDirection = Math.sign(delta);
        // При развороте продолжаем с видимой позиции, без «доигрывания» старого движения.
        if (direction && nextDirection !== direction) target = rendered;
        direction = nextDirection;
        target = clamp(
          target - delta * (delta < 0 ? REVEAL_MULTIPLIER : HIDE_MULTIPLIER),
          -height,
          0
        );
      }
      if (currentY === 0) target = 0;
      previousY = currentY;
      schedule();
    }

    function measure() {
      const wasHidden = height > 0 && target <= -height;
      height = hideEl.getBoundingClientRect().height;
      root.style.setProperty('--header-quick-height', `${height}px`);
      fullHeight = header.offsetHeight;
      root.style.setProperty('--header-height', `${fullHeight}px`);
      target = wasHidden ? -height : clamp(target, -height, 0);
      rendered = clamp(rendered, -height, 0);
      previousY = getScrollY();
      schedule();
    }

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(header);
    resizeObserver.observe(hideEl);

    // Открыли меню / уведомления на мобильном — сразу показываем шапку.
    new MutationObserver(() => {
      if (isLocked()) {
        target = 0;
        schedule();
      }
    }).observe(root, { attributes: true, attributeFilter: ['class'] });

    // Клавиатурная навигация: фокус внутри шапки показывает её.
    header.addEventListener('focusin', (event) => {
      if (event.target.matches(':focus-visible')) {
        target = 0;
        schedule();
      }
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pageshow', () => {
      previousY = getScrollY();
      target = rendered = 0;
      direction = 0;
      paint();
    });

    measure();
    paint();
  }
}

HeaderScroll.init();