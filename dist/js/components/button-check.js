/*
  Кнопки-чекбоксы
 */

class ButtonCheck {
  static init() {
    const btnCheck = document.querySelectorAll('.btn-check');

    if (btnCheck) {
      btnCheck.forEach(button => {
        button.addEventListener('click', function () {
          const parent = this.closest('.input-btn-check');

          if (!parent) return;

          parent.classList.add('active');

          setTimeout(() => {
            parent.classList.remove('active');
          }, 5000);
        });
      });
    }
  }
}

ButtonCheck.init();
