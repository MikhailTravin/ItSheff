/**
 * Колонки заявок
 * ------------------------------------------------------------
 * .block-applications__column
 *
 * Класс:      ApplicationsColumns
 * Включается: если на странице есть `.block-applications__column`
 * Зависит от: core/helpers
 * Страницы:   loader, support
 */

class ApplicationsColumns {
  static init() {
    const moreButtons = document.querySelectorAll('.btn-more');

    let applicationsColumns = document.querySelectorAll('.block-applications__column');
    if (applicationsColumns) {
      applicationsColumns.forEach(column => {
        const moreButtons = column.querySelectorAll('.block-applications-more');
        const bottomBlock = column.querySelector('.block-applications-bottom');

        if (bottomBlock && !bottomBlock.hasAttribute('hidden')) {
          bottomBlock.hidden = true;
        }

        const openApplication = () => {
          column.classList.add('active');
          _slideDown(bottomBlock, 500);
        };

        const closeApplication = () => {
          column.classList.remove('active');
          _slideUp(bottomBlock, 500);
        };

        const toggleApplication = () => {
          if (bottomBlock.hidden) {
            openApplication();
          } else {
            closeApplication();
          }
        };

        moreButtons.forEach(button => {
          button.addEventListener('click', (e) => {
            e.preventDefault();
            toggleApplication();
          });
        });
      });
    }
  }
}

ApplicationsColumns.init();
