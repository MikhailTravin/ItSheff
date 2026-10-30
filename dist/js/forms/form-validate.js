/**
 * Валидация форм
 * ------------------------------------------------------------
 * Статический класс FormValidate: getErrors(form), formClean(form), addError/removeError, проверка e-mail, календаря, чисел.
 *
 * Класс:      FormValidate
 * Включается: если на странице есть `form` или `[data-popup]` или `.popup`
 * Зависит от: core/helpers, core/shared-refs
 * Страницы:   22 из 29 (все, кроме: account-blocked, documents-detail1, documents-detail2, documents, invoices-empty, subscriptions-restoring, subscriptions-restoring2)
 */

class FormValidate {
  static getErrorContainer(formRequiredItem) {
    if (formRequiredItem.closest('.input-btn')) {
      return formRequiredItem.closest('.input-btn');
    }
    if (formRequiredItem.closest('.form-input-tel')) {
      return formRequiredItem.closest('.form-input-tel');
    }
    if (formRequiredItem.classList.contains('form-select')) {
      const formInputTel = formRequiredItem.closest('.form-input-tel');
      if (formInputTel) return formInputTel;
    }
    const formInput = formRequiredItem.closest('.form__input');
    if (formInput) return formInput;

    return formRequiredItem.parentElement;
  }

  static getAllErrorContainers(formRequiredItem) {
    const containers = [];

    const formInput = formRequiredItem.closest('.form__input');
    if (formInput) containers.push(formInput);

    if (formRequiredItem.closest('.input-btn')) {
      containers.push(formRequiredItem.closest('.input-btn'));
    }
    if (formRequiredItem.closest('.form-input-tel')) {
      containers.push(formRequiredItem.closest('.form-input-tel'));
    }

    containers.push(formRequiredItem.parentElement);

    return containers;
  }

  static getErrors(form) {
    let error = 0;
    let formRequiredItems = form.querySelectorAll('*[data-required]');
    if (formRequiredItems.length) {
      const processedCalendars = new Set();

      formRequiredItems.forEach(formRequiredItem => {
        if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {

          const calendar = formRequiredItem.closest('.calendar');
          if (calendar && formRequiredItem.closest('.date-picker-sections')) {

            if (!processedCalendars.has(calendar)) {
              processedCalendars.add(calendar);
              error += this.validateCalendar(calendar);
            }
          } else {
            error += this.validateInput(formRequiredItem);
          }
        }
      });
    }
    return error;
  }

  static validateCalendar(calendar) {
    if (!calendar) return 0;

    const dayInput = calendar.querySelector('.day-input');
    const monthInput = calendar.querySelector('.month-input');
    const yearInput = calendar.querySelector('.year-input');
    const calendarInput = calendar.querySelector('.calendar__input');

    if (!dayInput || !monthInput || !yearInput) return 0;

    const dayValue = dayInput.value.trim();
    const monthValue = monthInput.value.trim();
    const yearValue = yearInput.value.trim();

    if (dayValue && monthValue && yearValue) {
      this.removeCalendarError(calendar);
      return 0;
    }
    calendar.classList.add('_form-error');

    [dayInput, monthInput, yearInput].forEach(input => {
      input.classList.add('_form-error');
    });

    if (calendarInput) {
      calendarInput.classList.add('_form-error');
    }

    const oldError = calendar.querySelector('.form__error');
    if (oldError) oldError.remove();

    const errorText = dayInput.dataset.error || 'Заполните дату';

    calendar.insertAdjacentHTML('beforeend',
      `<div class="form__error">${errorText}</div>`
    );

    return 1;
  }

  static removeCalendarError(calendar) {
    if (!calendar) return;

    const dayInput = calendar.querySelector('.day-input');
    const monthInput = calendar.querySelector('.month-input');
    const yearInput = calendar.querySelector('.year-input');
    const calendarInput = calendar.querySelector('.calendar__input');

    calendar.classList.remove('_form-error');

    [dayInput, monthInput, yearInput].forEach(input => {
      if (input) {
        input.classList.remove('_form-error');
        input.classList.add('_form-success');
      }
    });

    if (calendarInput) {
      calendarInput.classList.remove('_form-error');
      calendarInput.classList.add('_form-success');
    }

    const calendarErrors = calendar.querySelectorAll('.form__error');
    calendarErrors.forEach(error => error.remove());
  }

  static isNumberConditionFailed(formRequiredItem) {
    if (!formRequiredItem.hasAttribute('data-error-number')) return false;
    const value = formRequiredItem.value ? formRequiredItem.value.trim() : '';
    const minLength = formRequiredItem.hasAttribute('data-min-length')
      ? parseInt(formRequiredItem.dataset.minLength, 10)
      : 2;
    return value.length > 0 && value.length < minLength;
  }

  static getErrorText(formRequiredItem) {
    if (this.isNumberConditionFailed(formRequiredItem)) {
      return formRequiredItem.dataset.errorNumber;
    }
    return formRequiredItem.dataset.error || '';
  }

  static validateInput(formRequiredItem) {
    let error = 0;

    if (formRequiredItem.type === "file") {
      if (formRequiredItem.files && formRequiredItem.files.length > 0) {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
        return 0;
      }

      const uploadContainer = formRequiredItem.closest('.upload-base-files');
      if (uploadContainer) {
        const resultsContainer = uploadContainer.querySelector('.upload-base-files__results');
        if (resultsContainer && resultsContainer.querySelectorAll('.upload-base-files__result').length > 0) {
          this.removeError(formRequiredItem);
          this.addSuccess(formRequiredItem);
          const dropZone = uploadContainer.querySelector('.upload-base-file1');
          if (dropZone) {
            this.removeError(dropZone);
            this.addSuccess(dropZone);
          }
          return 0;
        }
      }

      this.addError(formRequiredItem);
      this.removeSuccess(formRequiredItem);
      error++;
      return error;
    }

    if (formRequiredItem.classList.contains('form-select')) {
      const telInput = formRequiredItem.querySelector('.tel');
      if (telInput && !telInput.value.trim()) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
      return error;
    }

    if (formRequiredItem.dataset.required === "email") {
      formRequiredItem.value = formRequiredItem.value.replace(" ", "");
      if (this.emailTest(formRequiredItem)) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
      this.addError(formRequiredItem);
      this.removeSuccess(formRequiredItem);
      error++;
    } else if (formRequiredItem.dataset.validate === "password-confirm") {
      const passwordInput = document.getElementById('password');
      if (!passwordInput) return error;

      if (formRequiredItem.value !== passwordInput.value) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    } else {
      if (!formRequiredItem.value.trim() || this.isNumberConditionFailed(formRequiredItem)) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    }

    return error;
  }

  static addError(formRequiredItem) {
    formRequiredItem.classList.add('_form-error');

    const containers = this.getAllErrorContainers(formRequiredItem);
    containers.forEach(container => {
      container.classList.add('_form-error');
    });

    const errorContainer = this.getErrorContainer(formRequiredItem);

    const innerError = errorContainer.querySelector('.form__error');
    if (innerError) innerError.remove();

    let nextEl = errorContainer.nextElementSibling;
    if (nextEl && nextEl.classList.contains('form__error')) {
      nextEl.remove();
    }

    const errorText = this.getErrorText(formRequiredItem);
    if (errorText) {
      if (errorContainer.classList.contains('form__input')) {
        errorContainer.insertAdjacentHTML('beforeend',
          `<div class="form__error">${errorText}</div>`
        );
      } else {
        errorContainer.insertAdjacentHTML('afterend',
          `<div class="form__error">${errorText}</div>`
        );
      }
    }
  }

  static removeError(formRequiredItem) {
    formRequiredItem.classList.remove('_form-error');

    const containers = this.getAllErrorContainers(formRequiredItem);
    containers.forEach(container => {
      container.classList.remove('_form-error');
    });

    const errorContainer = this.getErrorContainer(formRequiredItem);

    const innerError = errorContainer.querySelector('.form__error');
    if (innerError) innerError.remove();

    let nextEl = errorContainer.nextElementSibling;
    if (nextEl && nextEl.classList.contains('form__error')) {
      nextEl.remove();
    }

    const formInput = formRequiredItem.closest('.form__input');
    if (formInput && formInput !== errorContainer) {
      const formInputError = formInput.querySelector('.form__error');
      if (formInputError) formInputError.remove();

      let nextFormInputEl = formInput.nextElementSibling;
      if (nextFormInputEl && nextFormInputEl.classList.contains('form__error')) {
        nextFormInputEl.remove();
      }
    }
  }

  static addSuccess(formRequiredItem) {
    formRequiredItem.classList.add('_form-success');
    const containers = this.getAllErrorContainers(formRequiredItem);
    containers.forEach(container => {
      container.classList.add('_form-success');
    });
  }

  static removeSuccess(formRequiredItem) {
    formRequiredItem.classList.remove('_form-success');
    const containers = this.getAllErrorContainers(formRequiredItem);
    containers.forEach(container => {
      container.classList.remove('_form-success');
    });
  }

  static formClean(form) {
    form.reset();
    setTimeout(() => {
      let inputs = form.querySelectorAll('input,textarea');
      for (let index = 0; index < inputs.length; index++) {
        const el = inputs[index];
        el.parentElement.classList.remove('_form-focus');
        el.classList.remove('_form-focus');

        el.classList.remove('_form-success');
        el.parentElement.classList.remove('_form-success');

        el.parentElement.classList.remove('filled');

        FormValidate.removeError(el);

        if (el.classList.contains('telephone') && el.clearFilled) {
          el.clearFilled();
        }
      }

      let checkboxes = form.querySelectorAll('.checkbox__input');
      if (checkboxes.length > 0) {
        for (let index = 0; index < checkboxes.length; index++) {
          const checkbox = checkboxes[index];
          checkbox.checked = false;
          checkbox.classList.remove('_form-success');
          checkbox.closest('.checkbox')?.classList.remove('_form-success');
        }
      }

      form.querySelectorAll('._form-error, ._form-success').forEach(el => {
        el.classList.remove('_form-error', '_form-success');
      });

      form.querySelectorAll('.form__error').forEach(error => error.remove());

      form.querySelectorAll('.calendar').forEach(calendar => {
        FormValidate.removeCalendarError(calendar);
      });

      if (modules_flsModules.select) {
        let selects = form.querySelectorAll('div.select');
        if (selects.length) {
          for (let index = 0; index < selects.length; index++) {
            const select = selects[index].querySelector('select');
            modules_flsModules.select.selectBuild(select);
          }
        }
      }
    }, 0);
  }

  static emailTest(formRequiredItem) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
  }
}
