/**
 * Попап «Системы»
 * ------------------------------------------------------------
 * .popup-systems__name.button-out
 *
 * Класс:      PopupSystems
 * Включается: если на странице есть `.popup-systems__name.button-out`
 * Зависит от: —
 * Страницы:   loader, subscriptions
 */

class PopupSystems {
  static init() {
    const btnOut = document.querySelector('.popup-systems__name.button-out');

    if (btnOut) {
      const bottom = document.querySelector('.popup-systems__bottom');
      const block = document.querySelector('.popup-systems-block');
      const btnNext = document.querySelector('.popup-systems-block .btn-next');

      btnOut.addEventListener('click', () => {
        bottom.style.display = 'none';
        block.style.display = 'flex';
      });

      if (btnNext) {
        btnNext.addEventListener('click', () => {
          block.style.display = 'none';
          bottom.style.display = '';
        });
      }
    }
  }
}

PopupSystems.init();
