/**
 * Кнопки «Ещё»
 * ------------------------------------------------------------
 * Раскрытие скрытых блоков по кнопке .btn-more.
 *
 * Класс:      MoreButtons
 * Включается: если на странице есть `.btn-more`
 * Зависит от: core/helpers
 * Страницы:   invoices-auto-payment, invoices-details, invoices, loader, subscriptions
 */

class MoreButtons {
  static init() {
    const moreButtons = document.querySelectorAll('.btn-more');

    if (moreButtons) {
      moreButtons.forEach(button => {
        const cabinetBlock = button.closest('.block-cabinet-bottom');
        if (!cabinetBlock) return;

        const dropdown = cabinetBlock.querySelector('.block-cabinet-bottom__dropdown');
        if (!dropdown) return;

        dropdown.hidden = true;

        button.addEventListener('click', (e) => {
          e.preventDefault();

          const span = button.querySelector('span');
          const isOpening = dropdown.hidden;

          _slideToggle(dropdown, 300);

          if (span) {
            span.textContent = isOpening ? 'Свернуть' : 'Развернуть';
          }
        });
      });
    }
  }
}

MoreButtons.init();
