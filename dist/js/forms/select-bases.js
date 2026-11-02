/**
 * Выбор баз в попапе
 * ------------------------------------------------------------
 * .popup-select-bases — сбросить / выбрать все.
 *
 * Класс:      SelectBases
 * Включается: если на странице есть `.popup-select-bases`
 * Зависит от: —
 * Страницы:   cart, databases, subscriptions, users
 */

class SelectBases {
  static init() {
    const selectBases = document.querySelectorAll('.popup-select-bases');
    if (selectBases) {
      selectBases.forEach(container => {
        const resetBtn = container.querySelector('.select-btn-reset');
        const selectAllBtn = container.querySelector('.select-btn-all');

        const checkboxes = container.querySelectorAll('.select-bases-showmore__checkboxes .checkbox__input');

        const resetCheckboxes = () => {
          checkboxes.forEach(checkbox => {
            checkbox.checked = false;
          });
          checkboxes.forEach(checkbox => {
            const changeEvent = new Event('change', { bubbles: true });
            checkbox.dispatchEvent(changeEvent);
          });
        };

        const selectAllCheckboxes = () => {
          checkboxes.forEach(checkbox => {
            checkbox.checked = true;
          });
          checkboxes.forEach(checkbox => {
            const changeEvent = new Event('change', { bubbles: true });
            checkbox.dispatchEvent(changeEvent);
          });
        };

        if (resetBtn) {
          resetBtn.removeEventListener('click', resetCheckboxes);
          resetBtn.addEventListener('click', resetCheckboxes);
        }

        if (selectAllBtn) {
          selectAllBtn.removeEventListener('click', selectAllCheckboxes);
          selectAllBtn.addEventListener('click', selectAllCheckboxes);
        }
      });
    }
  }
}

SelectBases.init();
