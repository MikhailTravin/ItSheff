/**
 * Детали в кабинете
 * ------------------------------------------------------------
 * Кнопки редактирования в .cabinet-details-descr.
 *
 * Класс:      CabinetDetails
 * Включается: если на странице есть `.cabinet-details-descr__buttons`
 * Зависит от: —
 * Страницы:   invoices-auto-payment, invoices-details, invoices
 */

class CabinetDetails {
  static init() {
    const cabinetDetailsButtons = document.querySelectorAll('.cabinet-details-descr__buttons');

    if (cabinetDetailsButtons) {
      cabinetDetailsButtons.forEach(container => {
        const editButton = container.querySelector('.btn-edit-details');
        const checkMessage = container.querySelector('p');

        function simulateClick() {
          editButton.classList.add('disabled');

          if (checkMessage) {
            checkMessage.style.display = 'block';
          }

          setTimeout(() => {
            editButton.classList.remove('disabled');
            if (checkMessage) {
              checkMessage.style.display = 'none';
            }
          }, 3000);
        }

        editButton.addEventListener('click', function (e) {
          e.preventDefault();
          simulateClick();
        });
      });
    }
  }
}

CabinetDetails.init();
