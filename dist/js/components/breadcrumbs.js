/**
 * Хлебные крошки
 * ------------------------------------------------------------
 * Скрытие переполнения .breadcrumbs2, пересчёт при resize.
 *
 * Класс:      Breadcrumbs
 * Включается: если на странице есть `.breadcrumbs2`
 * Зависит от: —
 * Страницы:   home, invoices-auto-payment, invoices-details, invoices, loader-login-error, loader-login, loader-progress, loader, services-product, services
 */

class Breadcrumbs {
  static update() {
    document.querySelectorAll('.breadcrumbs2').forEach((wrap) => {
      const ul = wrap.querySelector('ul');
      if (!ul) return;
      wrap.classList.toggle('is-overflow', ul.scrollWidth > ul.clientWidth);
    });
  }
}

Breadcrumbs.update();
window.addEventListener('resize', () => Breadcrumbs.update());
