/**
 * Карточки заявок
 * ------------------------------------------------------------
 * .block-applications-cards__card
 *
 * Класс:      ApplicationsCards
 * Включается: если на странице есть `.block-applications-cards__card`
 * Зависит от: —
 * Страницы:   loader, support
 */

class ApplicationsCards {
  static init() {
    const applicationsCards = document.querySelectorAll('.block-applications-cards__card');
    if (applicationsCards) {
      const allForms = document.querySelectorAll('.block-applications-cards .form-textarea');

      allForms.forEach(form => {
        form.style.display = 'none';
      });

      function showFormByCard(cardId) {
        allForms.forEach(form => {
          if (form.getAttribute('data-card') === cardId) {
            form.style.display = 'block';
          } else {
            form.style.display = 'none';
          }
        });
      }

      function clearFormByCard(cardId) {
        const form = document.querySelector(`.block-applications-cards .form-textarea[data-card="${cardId}"]`);
        if (!form) return;

        const textarea = form.querySelector('textarea');
        if (textarea) textarea.value = '';

        const fileInputs = form.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => {
          input.value = '';
        });

        const resultsContainer = form.querySelector('.form-textarea__results');
        if (resultsContainer) resultsContainer.innerHTML = '';
      }

      function removeActiveClass() {
        applicationsCards.forEach(card => card.classList.remove('active'));
      }

      const activeCard = document.querySelector('.block-applications-cards__card.active');
      if (activeCard) {
        const cardId = activeCard.getAttribute('data-card');
        showFormByCard(cardId);
      }

      applicationsCards.forEach(card => {
        card.addEventListener('click', function (event) {
          event.stopPropagation();

          const cardId = this.getAttribute('data-card');
          const isActive = this.classList.contains('active');

          if (isActive) {
            this.classList.remove('active');
            allForms.forEach(form => form.style.display = 'none');
          } else {
            removeActiveClass();
            this.classList.add('active');
            showFormByCard(cardId);
          }
        });
      });
    }
  }
}

ApplicationsCards.init();
