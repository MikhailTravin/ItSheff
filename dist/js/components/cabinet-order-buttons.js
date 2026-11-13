/**
  Кнопки заказа в кабинете
 */

class CabinetOrderButtons {
  static init() {
    const cabinetOrderButtons = document.querySelectorAll('.cabinet-tabs-act-order__button');

    if (cabinetOrderButtons.length) {
      cabinetOrderButtons.forEach(button => {
        button.addEventListener('click', function (event) {
          event.stopPropagation();

          if (this.classList.contains('active')) {
            this.classList.remove('active');
          } else {
            cabinetOrderButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
          }
        });
      });
    }
  }
}

CabinetOrderButtons.init();