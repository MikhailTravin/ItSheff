/*
  Кастомные селекты
 */

class FormSelect {
  static init() {
    const titlesList = document.querySelectorAll('.form-select__titles');

    if (titlesList) {
      function updateSelectedCountry(selectContainer, selectedCountryCode, selectedFlagSrc, selectedCountryName, mask) {
        const phoneInput = selectContainer.querySelector('.form-select__value input');
        let currentPhoneNumber = phoneInput ? phoneInput.value : '';

        const flagImg = selectContainer.querySelector('.form-select__titles img');
        if (flagImg && selectedFlagSrc) {
          flagImg.src = selectedFlagSrc;
          flagImg.alt = selectedCountryName;
        }

        const countryCodeSpan = selectContainer.querySelector('.form-select__value span');
        if (countryCodeSpan && selectedCountryCode) {
          countryCodeSpan.textContent = selectedCountryCode;
        }

        const titlesSpan = selectContainer.querySelector('.form-select__titles span:not(.form-select__arrow)');
        const hasValueSpan = selectContainer.querySelector('.form-select__value span');

        if (!hasValueSpan && titlesSpan && selectedCountryName) {
          titlesSpan.textContent = selectedCountryName;
        }

        if (phoneInput) {
          if (currentPhoneNumber) {
            phoneInput.value = currentPhoneNumber;
          }

          phoneInput.setAttribute('placeholder', mask.replace(/9/g, '0'));

          if (typeof Inputmask !== 'undefined') {
            Inputmask({
              "mask": mask,
              "showMaskOnHover": false,
            }).mask(phoneInput);
          }

          phoneInput.dispatchEvent(new CustomEvent('maskview:refresh'));
        }
      }

      function getSelectedCountryData(radioInput) {
        const label = radioInput.closest('.options__item');
        const flagImg = label.querySelector('.options__img img');
        const countryNameSpan = label.querySelector('.options__text');
        const countryCode = radioInput.getAttribute('countryCode') || '+7';
        const mask = radioInput.getAttribute('data-mask') || '(999) 999-99-99';

        return {
          code: countryCode,
          flagSrc: flagImg ? flagImg.src : '',
          countryName: countryNameSpan ? countryNameSpan.textContent : '',
          mask: mask
        };
      }

      titlesList.forEach(title => {
        title.addEventListener('click', function (e) {
          e.stopPropagation();
          const parentSelect = this.closest('.form-select');
          if (parentSelect) {
            parentSelect.classList.toggle('active');
          }
        });
      });

      document.addEventListener('click', function (e) {
        if (!e.target.closest('.form-select')) {
          const allSelects = document.querySelectorAll('.form-select');
          allSelects.forEach(select => {
            select.classList.remove('active');
          });
        }
      });

      const allRadioInputs = document.querySelectorAll('.options__input');
      allRadioInputs.forEach(radio => {
        radio.addEventListener('change', function (e) {
          if (this.checked) {
            const parentSelect = this.closest('.form-select');

            if (parentSelect) {
              const countryData = getSelectedCountryData(this);
              updateSelectedCountry(
                parentSelect,
                countryData.code,
                countryData.flagSrc,
                countryData.countryName,
                countryData.mask
              );
              parentSelect.classList.remove('active');
            }
          }
        });
      });

      const checkedRadios = document.querySelectorAll('.options__input:checked');
      checkedRadios.forEach(radio => {
        const parentSelect = radio.closest('.form-select');
        if (parentSelect) {
          const countryData = getSelectedCountryData(radio);
          updateSelectedCountry(
            parentSelect,
            countryData.code,
            countryData.flagSrc,
            countryData.countryName,
            countryData.mask
          );
        }
      });
    }
  }
}

FormSelect.init();
