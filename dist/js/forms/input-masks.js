/*
  Маски ввода
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

    const telephone2 = document.querySelectorAll('.telephone2');
    if (telephone2) {
      Inputmask({
        "mask": "(999) 999-99-99",
        "showMaskOnHover": false,
      }).mask(telephone2);
    }

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
