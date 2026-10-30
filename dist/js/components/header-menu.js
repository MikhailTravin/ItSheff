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
