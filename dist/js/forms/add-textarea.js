/*
  Добавление textarea
 */

class AddTextarea {
  static init() {
    const addButton = document.querySelector('.add-textarea');
    if (addButton) {
      const textareaBlock = document.querySelector('.popup-other__body .form-textarea');

      textareaBlock.style.display = 'none';

      addButton.addEventListener('click', function () {
        textareaBlock.style.display = 'block';
        addButton.style.display = 'none';
      });
    }
  }
}

AddTextarea.init();
