/**
 * Кнопки заказа в кабинете
 * ------------------------------------------------------------
 * .cabinet-tabs-act-order__button
 *
 * Класс:      CabinetOrderButtons
 * Включается: если на странице есть `.cabinet-tabs-act-order__button`
 * Зависит от: —
 * Страницы:   invoices-auto-payment, invoices-details, invoices
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
