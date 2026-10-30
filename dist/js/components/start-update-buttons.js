/**
 * Кнопки запуска обновления
 * ------------------------------------------------------------
 * .popup-start-update__btn
 *
 * Класс:      StartUpdateButtons
 * Включается: если на странице есть `.popup-start-update__btn`
 * Зависит от: —
 * Страницы:   databases
 */

class StartUpdateButtons {
  static init() {
    const startUpdateBtn = document.querySelectorAll('.popup-start-update__btn');

    if (startUpdateBtn.length) {
      startUpdateBtn.forEach(button => {
        button.addEventListener('click', function (event) {
          event.stopPropagation();

          if (this.classList.contains('active')) {
            this.classList.remove('active');
          } else {
            startUpdateBtn.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
          }
        });
      });
    }
  }
}

StartUpdateButtons.init();
