/**
 * Счётчик количества
 * ------------------------------------------------------------
 * [data-quantity] с кнопками +/−.
 *
 * Класс:      FormQuantity
 * Включается: если на странице есть `[data-quantity]`
 * Зависит от: —
 * Страницы:   cart, loader, subscriptions
 */

class FormQuantity {
  static init() {
    function getMinValue(quantityElement, fallback = 1) {
      if (quantityElement.dataset.quantityMin !== undefined) {
        return +quantityElement.dataset.quantityMin;
      }
      return fallback;
    }

    function updateButtonsState(quantityElement) {
      const valueElement = quantityElement.querySelector('[data-quantity-value]');
      const plusButton = quantityElement.querySelector('[data-quantity-plus]');
      const minusButton = quantityElement.querySelector('[data-quantity-minus]');

      if (!valueElement) return;

      const value = parseInt(valueElement.value) || 0;
      const min = getMinValue(quantityElement);
      const max = quantityElement.dataset.quantityMax ? +quantityElement.dataset.quantityMax : null;

      if (value <= min) {
        minusButton?.classList.add('disabled');
      } else {
        minusButton?.classList.remove('disabled');
      }

      if (max !== null && value >= max) {
        plusButton?.classList.add('disabled');
      } else {
        plusButton?.classList.remove('disabled');
      }
    }

    function initAllQuantity() {
      document.querySelectorAll('[data-quantity]').forEach(quantityElement => {
        updateButtonsState(quantityElement);
      });
    }

    document.addEventListener("click", function (e) {
      let targetElement = e.target;
      const plusBtn = targetElement.closest('[data-quantity-plus]');
      const minusBtn = targetElement.closest('[data-quantity-minus]');

      if (plusBtn || minusBtn) {
        if ((plusBtn && plusBtn.classList.contains('disabled')) ||
          (minusBtn && minusBtn.classList.contains('disabled'))) {
          e.preventDefault();
          return;
        }

        const quantityElement = targetElement.closest('[data-quantity]');
        const valueElement = quantityElement.querySelector('[data-quantity-value]');
        let value = parseInt(valueElement.value) || 0;

        if (plusBtn) {
          value++;
          if (quantityElement.dataset.quantityMax && +quantityElement.dataset.quantityMax < value) {
            value = +quantityElement.dataset.quantityMax;
          }
        } else if (minusBtn) {
          value--;
          const currentMin = getMinValue(quantityElement);
          if (value < currentMin) {
            value = currentMin;
          }
        }

        valueElement.value = value;
        updateButtonsState(quantityElement);
      }
    });

    // ручной ввод: только цифры, значение держим в пределах min…max
    document.addEventListener('change', function (e) {
      const valueElement = e.target.closest('[data-quantity-value]');
      if (!valueElement) return;

      const quantityElement = valueElement.closest('[data-quantity]');
      const min = getMinValue(quantityElement);
      const max = quantityElement.dataset.quantityMax ? +quantityElement.dataset.quantityMax : Infinity;
      const value = parseInt(valueElement.value, 10);

      valueElement.value = Math.min(Math.max(Number.isNaN(value) ? min : value, min), max);
      updateButtonsState(quantityElement);
    });

    initAllQuantity();
  }
}

FormQuantity.init();
