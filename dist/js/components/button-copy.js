/**
 * Копирование в буфер
 * ------------------------------------------------------------
 * .btn-copy
 *
 * Класс:      ButtonCopy
 * Включается: если на странице есть `.btn-copy`
 * Зависит от: —
 * Страницы:   users
 */

class ButtonCopy {
  static init() {
    const btnCopy = document.querySelector('.btn-copy');
    if (btnCopy) {
      btnCopy.addEventListener('click', function () {
        const copyTextElement = document.querySelector('.popup-invite-descr__copy');

        const textToCopy = copyTextElement.innerText.trim();

        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);

        textarea.select();
        document.execCommand('copy');

        document.body.removeChild(textarea);
      });
    }
  }
}

ButtonCopy.init();
