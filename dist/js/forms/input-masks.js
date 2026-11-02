/**
 * Маски ввода
 * ------------------------------------------------------------
 * Inputmask для .telephone, .telephone2, .input-timer.
 *
 * Класс:      InputMasks
 * Включается: если на странице есть `.telephone` или `.telephone2` или `.input-timer`
 * Зависит от: vendor/inputmask.min
 * Страницы:   cart, databases, home, services-product, services
 */

class InputMasks {
  static init() {
    const telephone = document.querySelectorAll('.telephone');
    if (telephone) {
      Inputmask({
        "mask": "+7 (999) 999-99-99",
        "showMaskOnHover": false,
      }).mask(telephone);
    }

    //Маска
    const telephone2 = document.querySelectorAll('.telephone2');
    if (telephone2) {
      Inputmask({
        "mask": "(999) 999-99-99",
        "showMaskOnHover": false,
      }).mask(telephone2);
    }

    //Маска
    const inputTimer = document.querySelectorAll('.input-timer');
    if (inputTimer) {
      Inputmask({
        "mask": "99 : 99",
        "showMaskOnHover": false,
      }).mask(inputTimer);
    }
  }
}

InputMasks.init();
