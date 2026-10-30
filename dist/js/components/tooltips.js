/**
 * Подсказки
 * ------------------------------------------------------------
 * .tooltips-button — открытие/закрытие подсказок.
 *
 * Класс:      Tooltips
 * Включается: если на странице есть `.tooltips-button` или `.tooltips`
 * Зависит от: —
 * Страницы:   invoices-auto-payment, invoices-details, invoices, loader, subscriptions-empty, subscriptions, support
 */

class Tooltips {
  static init() {
    Tooltips.initFocusHints();

    const questionButtons = document.querySelectorAll('.tooltips-button');

    if (questionButtons.length) {

      function handleTooltipClick(e) {
        e.stopPropagation();
        const tooltip = this.closest('.tooltips');
        if (tooltip) {
          tooltip.classList.toggle('active');
        }
      }

      function bindEvents() {
        questionButtons.forEach(button => {
          button.removeEventListener('click', handleTooltipClick);

          if (window.innerWidth <= 992) {
            button.addEventListener('click', handleTooltipClick);
          }
        });
      }

      function closeTooltipsOnOutsideClick(e) {
        if (window.innerWidth <= 992) {
          const isTooltipButton = e.target.closest('.tooltips');
          if (!isTooltipButton) {
            document.querySelectorAll('.tooltips.active').forEach(tooltip => {
              tooltip.classList.remove('active');
            });
          }
        }
      }

      bindEvents();
      window.addEventListener('resize', bindEvents);
      document.addEventListener('click', closeTooltipsOnOutsideClick);
    }
  }

  /**
   * Подсказка у поля телефона: появляется, пока поле в фокусе,
   * гаснет при потере фокуса или через LIFETIME мс.
   */
  static initFocusHints() {
    const LIFETIME = 5000;

    document.querySelectorAll('.tooltips').forEach((tooltip) => {
      const scope = tooltip.closest('.form__input') || tooltip.parentElement;
      const phone = scope && scope.querySelector('input.tel, input.telephone, input.telephone2');
      if (!phone) return;

      let timer;
      const hide = () => {
        clearTimeout(timer);
        tooltip.classList.remove('is-focus');
      };

      phone.addEventListener('focus', () => {
        tooltip.classList.add('is-focus');
        clearTimeout(timer);
        timer = setTimeout(hide, LIFETIME);
      });
      phone.addEventListener('blur', hide);
    });
  }
}

Tooltips.init();
