/**
 * Пагинация блока
 * ------------------------------------------------------------
 * «Показать ещё» в .block-pagination.
 *
 * Класс:      BlockPagination
 * Включается: если на странице есть `.block-pagination`
 * Зависит от: —
 * Страницы:   invoices-auto-payment, invoices-details, invoices
 */

class BlockPagination {
  static init() {
    const paginationBlocks = document.querySelectorAll('.block-pagination');

    if (paginationBlocks) {
      paginationBlocks.forEach(block => {
        const button = block.querySelector('.btn-more');
        const loader = block.querySelector('.orange-loader');

        if (button && loader) {
          button.addEventListener('click', () => {
            button.style.display = 'none';
            loader.style.display = 'flex';

            setTimeout(() => {
              button.style.display = 'flex';
              loader.style.display = 'none';
            }, 2000);
          });
        }
      });
    }
  }
}

BlockPagination.init();
