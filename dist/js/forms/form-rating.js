/**
 * Звёздный рейтинг
 * ------------------------------------------------------------
 * [data-rating] — выбор оценки звёздами.
 *
 * Класс:      FormRating
 * Включается: если на странице есть `[data-rating]`
 * Зависит от: —
 * Страницы:   loader, support
 */

class FormRating {
  static init() {
    const ratings = document.querySelectorAll('[data-rating]');

    ratings.forEach(rating => {
      const ratingValue = +rating.dataset.ratingValue || 0;
      const ratingSize = +rating.dataset.ratingSize || 5;
      const isSet = rating.dataset.rating === 'set';

      formRatingInit(rating, ratingSize);
      formRatingSet(rating, ratingValue);

      if (isSet && ratingValue > 0) {
        const textContainer = rating.closest('.popup-other-rating')?.querySelector('.popup-other-rating__text');
        if (textContainer) {
          textContainer.classList.add('active');
          updateRatingText(textContainer, ratingValue);
        }
      }
    });

    document.addEventListener('click', formRatingAction);
    document.addEventListener('touchstart', formRatingTouchAction, { passive: false });

    function formRatingTouchAction(e) {
      const targetElement = e.target.closest('.rating__input');
      if (!targetElement) return;

      const rating = targetElement.closest('.rating');
      const isSet = rating.dataset.rating === 'set';

      if (isSet) {
        e.preventDefault();
        const ratingValue = +targetElement.value;
        targetElement.checked = true;
        formRatingSet(rating, ratingValue);

        const textContainer = rating.closest('.popup-other-rating')?.querySelector('.popup-other-rating__text');
        if (textContainer) {
          textContainer.classList.add('active');
          updateRatingText(textContainer, ratingValue);
        }
      }
    }

    function formRatingAction(e) {
      const targetElement = e.target.closest('.rating__input');
      if (!targetElement) return;

      const ratingValue = +targetElement.value;
      const rating = targetElement.closest('.rating');
      const isSet = rating.dataset.rating === 'set';

      if (isSet) {
        formRatingSet(rating, ratingValue);

        const textContainer = rating.closest('.popup-other-rating')?.querySelector('.popup-other-rating__text');
        if (textContainer) {
          textContainer.classList.add('active');
          updateRatingText(textContainer, ratingValue);
        }
      }
    }

    function formRatingInit(rating, ratingSize) {
      let ratingItems = `<div class="rating__items">`;
      for (let index = 0; index < ratingSize; index++) {
        ratingItems += `
        <label class="rating__item">
          <input class="rating__input" type="radio" name="rating" value="${index + 1}">
        </label>`;
      }
      ratingItems += `</div>`;
      rating.insertAdjacentHTML("beforeend", ratingItems);

      rating.addEventListener('dblclick', function (e) {
        e.preventDefault();
        e.stopPropagation();
      });

      rating.addEventListener('touchstart', function (e) {
        if (e.target.closest('.rating__input')) {
          e.preventDefault();
        }
      }, { passive: false });

      rating.addEventListener('touchend', function (e) {
        if (e.target.closest('.rating__input')) {
          e.preventDefault();
        }
      }, { passive: false });

      rating.addEventListener('touchmove', function (e) {
        if (e.target.closest('.rating__input')) {
          e.preventDefault();
        }
      }, { passive: false });

      rating.addEventListener('gesturestart', function (e) {
        e.preventDefault();
      });

      rating.addEventListener('gesturechange', function (e) {
        e.preventDefault();
      });

      rating.addEventListener('gestureend', function (e) {
        e.preventDefault();
      });
    }

    function formRatingSet(rating, value) {
      const ratingItems = rating.querySelectorAll('.rating__item');
      const resultFullItems = parseInt(value);
      const resultPartItem = value - resultFullItems;

      const radioInputs = rating.querySelectorAll('.rating__input');
      radioInputs.forEach((input, idx) => {
        if (idx + 1 === Math.ceil(value)) {
          input.checked = true;
        } else {
          input.checked = false;
        }
      });

      ratingItems.forEach((ratingItem, index) => {
        ratingItem.classList.remove('rating__item--active');
        ratingItem.querySelector('span')?.remove();

        if (index <= (resultFullItems - 1)) {
          ratingItem.classList.add('rating__item--active');
        }
        if (index === resultFullItems && resultPartItem) {
          ratingItem.insertAdjacentHTML("beforeend", `<span style="width:${resultPartItem * 100}%"></span>`);
        }
      });
    }

    function updateRatingText(textContainer, ratingValue) {
      const ratingTexts = {
        1: 'Очень плохо',
        2: 'Посредственно',
        3: 'Удовлетворительно',
        4: 'Хорошо',
        5: 'Отлично'
      };

      textContainer.textContent = ratingTexts[ratingValue] || 'Оценка';
    }
  }
}

FormRating.init();
