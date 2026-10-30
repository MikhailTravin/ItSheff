/**
 * Добавление textarea
 * ------------------------------------------------------------
 * .add-textarea
 *
 * Класс:      AddTextarea
 * Включается: если на странице есть `.add-textarea`
 * Зависит от: —
 * Страницы:   support
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
