/*
  Кнопка «Наверх»
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
