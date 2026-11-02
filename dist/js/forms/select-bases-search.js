/**
 * Поиск по базам
 * ------------------------------------------------------------
 * .select-bases-search
 *
 * Класс:      SelectBasesSearch
 * Включается: если на странице есть `.select-bases-search`
 * Зависит от: —
 * Страницы:   users
 */

class SelectBasesSearch {
  static init() {
    const searchContainers = document.querySelectorAll('.select-bases-search');

    if (searchContainers) {
      searchContainers.forEach(container => {
        const input = container.querySelector('input');
        const closeButton = container.querySelector('.select-bases-search__close');

        if (!input || !closeButton) {
          return;
        }

        const toggleCloseButton = () => {
          if (input.value.trim() !== '') {
            closeButton.style.display = 'flex';
          } else {
            closeButton.style.display = 'none';
          }
        };

        toggleCloseButton();

        input.addEventListener('input', toggleCloseButton);

        closeButton.addEventListener('click', () => {
          input.value = '';
          input.dispatchEvent(new Event('input'));
          input.focus();
        });
      });
    }
  }
}

SelectBasesSearch.init();
