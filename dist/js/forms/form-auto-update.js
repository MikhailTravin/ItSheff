/*
  Форма автообновления
 */

class FormAutoUpdate {
  static init() {
    const formAutoUpdate = document.querySelector('.form-auto-update');
    if (formAutoUpdate) {
      const checkbox = formAutoUpdate.querySelector('.checkbox__input');

      function toggleFormCheckedClass() {
        if (checkbox.checked) {
          formAutoUpdate.classList.add('checked');
        } else {
          formAutoUpdate.classList.remove('checked');
        }
      }

      toggleFormCheckedClass();

      checkbox.addEventListener('change', toggleFormCheckedClass);
    }
  }
}

FormAutoUpdate.init();
