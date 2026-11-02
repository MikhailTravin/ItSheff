/**
 * Роли пользователя
 * ------------------------------------------------------------
 * .options2__item — выбор роли.
 *
 * Класс:      RoleTabs
 * Включается: если на странице есть `.options2__item`
 * Зависит от: —
 * Страницы:   users
 */

class RoleTabs {
  static init() {
    const roleOptions = document.querySelectorAll('.options2__item');
    const roleDescriptions = document.querySelectorAll('.change-user-role');

    function updateActiveRole(selectedDescr) {
      roleOptions.forEach(option => {
        const radio = option.querySelector('.options2__input');
        const descr = option.getAttribute('data-descr');

        if (descr === selectedDescr) {
          radio.checked = true;
          option.classList.add('active');
        } else {
          radio.checked = false;
          option.classList.remove('active');
        }
      });

      roleDescriptions.forEach(description => {
        const descr = description.getAttribute('data-descr');

        if (descr === selectedDescr) {
          description.classList.add('checked');
          description.hidden = false;
        } else {
          description.classList.remove('checked');
          description.hidden = true;
        }
      });
    }

    roleOptions.forEach(option => {
      option.addEventListener('click', function (e) {
        e.preventDefault();
        const descr = this.getAttribute('data-descr');
        updateActiveRole(descr);
      });

      const radio = option.querySelector('.options2__input');
      if (radio) {
        radio.addEventListener('change', function () {
          if (this.checked) {
            const descr = option.closest('.options2__item').getAttribute('data-descr');
            updateActiveRole(descr);
          }
        });
      }
    });

    const checkedRadio = document.querySelector('.options2__input:checked');
    if (checkedRadio) {
      const parentLabel = checkedRadio.closest('.options2__item');
      const defaultDescr = parentLabel.getAttribute('data-descr');
      updateActiveRole(defaultDescr);
    } else {
      roleDescriptions.forEach(description => {
        description.hidden = true;
      });
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => RoleTabs.init());
} else {
  RoleTabs.init();
}
