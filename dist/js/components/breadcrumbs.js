/**
  Хлебные крошки
  ------------------------------------------------------------
  Скрытие переполнения .breadcrumbs2
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
