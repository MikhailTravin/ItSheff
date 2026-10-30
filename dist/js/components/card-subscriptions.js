/**
 * Карточки подписок
 * ------------------------------------------------------------
 * Hover/клик-состояния карточек .card-subscriptions.
 *
 * Класс:      CardSubscriptions
 * Включается: если на странице есть `.card-subscriptions`
 * Зависит от: —
 * Страницы:   loader, subscriptions
 */

class CardSubscriptions {
  static init() {
    const cardsSubscriptions = document.querySelectorAll('.card-subscriptions');

    if (cardsSubscriptions) {
      function isMobile() {
        return window.innerWidth <= 992;
      }

      function closeAllCards() {
        cardsSubscriptions.forEach(card => {
          card.classList.remove('active');
        });
        document.body.classList.remove('card-subscriptions-open');
      }

      function openCard(card) {
        closeAllCards();
        card.classList.add('active');
        document.body.classList.add('card-subscriptions-open');
      }

      cardsSubscriptions.forEach(card => {
        const clickableArea = card.querySelector('.card-subscriptions__items');

        if (clickableArea) {
          clickableArea.addEventListener('click', function (e) {
            e.stopPropagation();
            if (isMobile()) {
              if (card.classList.contains('active')) {
                closeAllCards();
              } else {
                openCard(card);
              }
            }
          });
        }
      });

      document.body.addEventListener('click', function (e) {
        if (isMobile()) {
          const activeCard = document.querySelector('.card-subscriptions.active');
          if (activeCard) {
            const isClickInsideCard = activeCard.contains(e.target);
            const isClickInsideHover = activeCard.querySelector('.card-subscriptions-hover')?.contains(e.target);

            if (!isClickInsideCard && !isClickInsideHover) {
              closeAllCards();
            }
          }
        }
      });

      window.addEventListener('resize', function () {
        if (!isMobile()) {
          closeAllCards();
        }
      });

      document.querySelectorAll('.card-subscriptions-hover button, .card-subscriptions-hover .quantity').forEach(element => {
        element.addEventListener('click', function (e) {
          //e.stopPropagation();
        });
      });
    }
  }
}

CardSubscriptions.init();
