/**
 * Меню «три точки» в таблицах
 * ------------------------------------------------------------
 * Выпадающее меню действий строки таблицы.
 *
 * Класс:      TableMeatballs
 * Включается: если на странице есть `.cabinet-table-meatballs__button`
 * Зависит от: —
 * Страницы:   invoices-auto-payment, invoices-details, invoices
 */

class TableMeatballs {
  static init() {
    const meatballsButtons = document.querySelectorAll('.cabinet-table-meatballs__button');

    if (meatballsButtons) {
      meatballsButtons.forEach(button => {
        button.addEventListener('click', function (event) {
          event.stopPropagation();

          const parentBlock = this.closest('.cabinet-table-meatballs');

          if (parentBlock) {
            if (parentBlock.classList.contains('active')) {
              parentBlock.classList.remove('active');
              return;
            }

            const allActiveMenus = document.querySelectorAll('.cabinet-table-meatballs.active');
            allActiveMenus.forEach(menu => {
              menu.classList.remove('active');
            });

            parentBlock.classList.add('active');
          }
        });
      });

      document.addEventListener('click', function (event) {
        const isInsideMeatballs = event.target.closest('.cabinet-table-meatballs');

        if (!isInsideMeatballs) {
          const allActiveMenus = document.querySelectorAll('.cabinet-table-meatballs.active');
          allActiveMenus.forEach(menu => {
            menu.classList.remove('active');
          });
        }
      });
    }
  }
}

TableMeatballs.init();
