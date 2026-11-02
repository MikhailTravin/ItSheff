/**
 * Уведомления в шапке
 * ------------------------------------------------------------
 * Выпадающий список уведомлений сайта.
 *
 * Класс:      HeaderNotifications
 * Включается: если на странице есть `.header .header-notifications`
 * Зависит от: —
 * Страницы:   14 из 29 (все, кроме: account-access, account-blocked, documents-detail1, documents-detail2, documents, home, invoices-auto-payment, invoices-details, invoices, loader-login-error, loader-login, loader-progress, loader, login, registration)
 */

class HeaderNotifications {
  static init() {
    const notifications = document.querySelector('.header .header-notifications');

    if (notifications) {
      const notificationIcon = notifications;
      const documentElement = document.documentElement;

      function isDesktop() {
        return window.innerWidth >= 1201;
      }

      function isMobile() {
        return window.innerWidth <= 1200;
      }

      function closeOtherMenu() {
        if (isMobile()) {
          if (documentElement.classList.contains('menu-open')) {
            documentElement.classList.remove('menu-open');
          }
        }
      }

      function handleClick(event) {
        event.stopPropagation();
        event.preventDefault();
        closeOtherMenu();
        if (documentElement.classList.contains('open-notifications')) {
          documentElement.classList.remove('open-notifications');
        } else {
          documentElement.classList.add('open-notifications');
        }
      }

      function handleMouseEnter() {
        documentElement.classList.add('open-notifications');
      }

      function handleMouseLeave() {
        documentElement.classList.remove('open-notifications');
      }

      function handleClickOutside(event) {
        if (!notificationIcon.contains(event.target)) {
          documentElement.classList.remove('open-notifications');
        }
      }

      if (isDesktop()) {
        notificationIcon.addEventListener('mouseenter', handleMouseEnter);
        notificationIcon.addEventListener('mouseleave', handleMouseLeave);
      } else {
        notificationIcon.addEventListener('click', handleClick);
      }

      document.addEventListener('click', handleClickOutside);

      let resizeTimer;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          if (isDesktop()) {
            notificationIcon.removeEventListener('click', handleClick);
            notificationIcon.addEventListener('mouseenter', handleMouseEnter);
            notificationIcon.addEventListener('mouseleave', handleMouseLeave);
            documentElement.classList.remove('open-notifications');
          } else {
            notificationIcon.removeEventListener('mouseenter', handleMouseEnter);
            notificationIcon.removeEventListener('mouseleave', handleMouseLeave);
            notificationIcon.addEventListener('click', handleClick);
            documentElement.classList.remove('open-notifications');
          }
          if (documentElement.classList.contains('menu-open')) {
            documentElement.classList.remove('menu-open');
          }
        }, 250);
      });
    }
  }
}

HeaderNotifications.init();
