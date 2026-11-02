/**
 * Опции (options3)
 * ------------------------------------------------------------
 * .options3__input
 *
 * Класс:      Options3
 * Включается: если на странице есть `.options3__input`
 * Зависит от: —
 * Страницы:   subscriptions
 */

class Options3 {
  static init() {
    const options3Input = document.querySelectorAll('.options3__input');

    if (options3Input.length) {
      const btn = document.querySelector('.popup-buttons-cons .btn');
      let updateBtn = () => { };

      if (btn) {
        updateBtn = () => {
          const anyChecked = [...options3Input].some(input => input.checked);
          btn.classList.toggle('disabled', !anyChecked);
          btn.toggleAttribute('disabled', !anyChecked);
          if (anyChecked) {
            btn.setAttribute('href', './');
          } else {
            btn.removeAttribute('href');
          }
        };
      }

      options3Input.forEach(input => {
        input.addEventListener('click', () => {
          const label = input.nextElementSibling;

          if (input.dataset.wasChecked === 'true') {
            input.checked = false;
            input.dataset.wasChecked = 'false';
          } else {
            options3Input.forEach(other => other.dataset.wasChecked = 'false');
            input.dataset.wasChecked = 'true';
          }

          label.classList.add('no-hover');
          label.addEventListener('mouseleave', () => {
            label.classList.remove('no-hover');
          }, { once: true });

          updateBtn();
        });
      });

      updateBtn();
    }
  }
}

Options3.init();
