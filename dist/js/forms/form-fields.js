/**
 * Поля формы
 * ------------------------------------------------------------
 * Фокус-классы, показ пароля, автовысота textarea, очистка ошибок при вводе.
 *
 * Класс:      FormFields
 * Включается: если на странице есть `input` или `textarea`
 * Зависит от: forms/form-validate
 * Страницы:   22 из 29 (все, кроме: account-blocked, documents-detail1, documents-detail2, documents, invoices-empty, subscriptions-restoring, subscriptions-restoring2)
 */

class FormFields {
  static init(options = { viewPass: true, autoHeight: false }) {
    document.body.addEventListener("focusin", function (e) {
      const targetElement = e.target;
      if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
        if (!targetElement.hasAttribute('data-no-focus-classes')) {
          targetElement.classList.add('_form-focus');
          targetElement.parentElement.classList.add('_form-focus');
        }
        FormValidate.removeError(targetElement);
        targetElement.hasAttribute('data-validate') ? FormValidate.removeError(targetElement) : null;

        if (targetElement.closest('.date-picker-sections')) {
          FormValidate.removeCalendarError(targetElement.closest('.calendar'));
        }
      }
      if (targetElement.closest('.form-select') && targetElement.closest('.form-select').hasAttribute('data-required')) {
        const formSelect = targetElement.closest('.form-select');
        FormValidate.removeError(formSelect);
      }
    });
    document.body.addEventListener("focusout", function (e) {
      const targetElement = e.target;
      if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
        if (!targetElement.hasAttribute('data-no-focus-classes')) {
          targetElement.classList.remove('_form-focus');
          targetElement.parentElement.classList.remove('_form-focus');
        }
        targetElement.hasAttribute('data-validate') ? FormValidate.validateInput(targetElement) : null;

        if (targetElement.closest('.date-picker-sections') && targetElement.hasAttribute('data-required')) {
          FormValidate.validateCalendar(targetElement.closest('.calendar'));
        }
      }
    });

    document.body.addEventListener("input", function (e) {
      const targetElement = e.target;
      if (targetElement.closest('.date-picker-sections') && targetElement.hasAttribute('data-required')) {
        const calendar = targetElement.closest('.calendar');
        if (calendar) {
          const dayInput = calendar.querySelector('.day-input');
          const monthInput = calendar.querySelector('.month-input');
          const yearInput = calendar.querySelector('.year-input');

          if (dayInput && monthInput && yearInput) {
            const dayValue = dayInput.value.trim();
            const monthValue = monthInput.value.trim();
            const yearValue = yearInput.value.trim();

            if (dayValue && monthValue && yearValue) {
              FormValidate.removeCalendarError(calendar);
            }
          }
        }
      }
    });

    if (options.viewPass) {
      document.addEventListener("click", function (e) {
        const targetElement = e.target;
        if (targetElement.closest('.form__viewpass')) {
          const viewpassBlock = targetElement.closest('.form__viewpass');
          const input = viewpassBlock.closest('.form__input').querySelector('input');
          const parentContainer = viewpassBlock.closest('.form__input');
          if (input) {
            const isActive = viewpassBlock.classList.contains('_viewpass-active');
            input.setAttribute("type", isActive ? "password" : "text");
            viewpassBlock.classList.toggle('_viewpass-active');
            if (parentContainer) {
              parentContainer.classList.toggle('_viewpass-active');
            }
          } else {
            console.error('Input не найден!');
          }
        }
      });
    }
    if (options.autoHeight) {
      const textareas = document.querySelectorAll('textarea[data-autoheight]');
      if (textareas.length) {
        textareas.forEach(textarea => {
          const startHeight = textarea.hasAttribute('data-autoheight-min') ?
            Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
          const maxHeight = textarea.hasAttribute('data-autoheight-max') ?
            Number(textarea.dataset.autoheightMax) : Infinity;
          setHeight(textarea, Math.min(startHeight, maxHeight))
          textarea.addEventListener('input', () => {
            if (textarea.scrollHeight > startHeight) {
              textarea.style.height = `auto`;
              setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
            }
          });
        });
        function setHeight(textarea, height) {
          textarea.style.height = `${height}px`;
        }
      }
    }
  }
}

FormFields.init({
  viewPass: true,
  autoHeight: false
});
