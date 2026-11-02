/**
 * Отступы фиксированных блоков
 * ------------------------------------------------------------
 * Отступ снизу у .header-bottom__right / .cabinet-menu / .footer.
 *
 * Класс:      FixedBottomSpacing
 * Включается: если на странице есть `.header-bottom__right` или `.cabinet-menu` или `.footer` или `.main`
 * Зависит от: —
 * Страницы:   все страницы
 */

class FixedBottomSpacing {
  static init() {
    const right = document.querySelector('.header-bottom__right');
    const cabinetMenu = document.querySelector('.cabinet-menu');
    const footer = document.querySelector('.footer');
    const main = document.querySelector('.main');

    if (!right && !cabinetMenu && !footer && !main) return;

    const mq992 = window.matchMedia('(max-width: 992px)');
    const mq700 = window.matchMedia('(max-width: 700px)');

    function updateBottom() {
      if (!right) return;

      if (!mq992.matches) {
        right.style.bottom = '';
        return;
      }

      const cm = document.querySelector('.cabinet-menu');
      right.style.bottom = cm ? cm.offsetHeight + 'px' : '0';
    }

    function isFooterVisible(el) {
      if (!el) return false;
      if (el.classList.contains('footer-none')) return false;
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      return true;
    }

    function getTargetEl() {
      const f = document.querySelector('.footer');
      if (isFooterVisible(f)) return f;
      return document.querySelector('.main');
    }

    function updateMargin() {
      const target = getTargetEl();

      document.querySelectorAll('.footer, .main').forEach((el) => {
        if (el !== target) el.style.marginBottom = '';
      });

      if (!target) return;

      const cm = document.querySelector('.cabinet-menu');

      let total = 0;
      if (right && mq992.matches) total += right.offsetHeight;
      if (cm && mq700.matches) total += cm.offsetHeight;

      target.style.marginBottom = total ? total + 'px' : '';
    }

    function updateAll() {
      updateBottom();
      updateMargin();
    }

    updateAll();

    window.addEventListener('resize', updateAll);
    mq992.addEventListener('change', updateAll);
    mq700.addEventListener('change', updateAll);

    const observer = new MutationObserver(updateAll);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(updateAll);
      const r = document.querySelector('.header-bottom__right');
      const cm = document.querySelector('.cabinet-menu');
      if (r) ro.observe(r);
      if (cm) ro.observe(cm);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => FixedBottomSpacing.init());
} else {
  FixedBottomSpacing.init();
}
