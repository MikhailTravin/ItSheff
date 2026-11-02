/**
 * Кнопка «Наверх»
 * ------------------------------------------------------------
 * .button-up
 *
 * Класс:      ButtonUp
 * Включается: если на странице есть `.button-up`
 * Зависит от: —
 * Страницы:   documents-detail1
 */

class ButtonUp {
  static init() {
    const buttonUp = document.querySelector('.button-up');

    if (buttonUp) {
      buttonUp.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }
}

ButtonUp.init();
