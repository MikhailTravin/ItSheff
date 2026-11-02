/**
 * Форма доступа к аккаунту
 * ------------------------------------------------------------
 * Форма .form-account-access (письма доступа).
 *
 * Класс:      FormAccountAccess
 * Включается: если на странице есть `.form-account-access`
 * Зависит от: forms/form-validate
 * Страницы:   account-access
 */

class FormAccountAccess {
  static init() {
    document.addEventListener('submit', function (e) {
      const form = e.target.closest('form.form-account-access');
      if (!form) return;

      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const error = !form.hasAttribute('data-no-validate') ? FormValidate.getErrors(form) : 0;

      if (error !== 0) {
        const firstError = form.querySelector('._form-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstError.focus();
        }
        return;
      }

      const input = form.querySelector('input.input');
      const button = form.querySelector('button[type="submit"]');
      const letters = form.querySelector('.form-access-letters');

      if (input) {
        input.setAttribute('value', input.value);
        input.setAttribute('readonly', 'readonly');
        input.classList.add('form-filled');
        FormValidate.removeError(input);
        input.classList.remove('_form-error', '_form-success');
        const containers = FormValidate.getAllErrorContainers(input);
        containers.forEach(container => {
          container.classList.remove('_form-error', '_form-success');
        });
      }

      if (button) {
        button.style.display = 'none';
      }

      if (letters) {
        letters.style.display = 'block';
      }

      form.dispatchEvent(new CustomEvent('formAccountAccessSent', {
        detail: { form: form, input: input }
      }));
    }, true);
  }
}

FormAccountAccess.init();
