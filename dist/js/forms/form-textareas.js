/**
 * Textarea-блоки
 * ------------------------------------------------------------
 * .form-textarea — счётчики, кнопки отправки.
 *
 * Класс:      FormTextareas
 * Включается: если на странице есть `.form-textarea`
 * Зависит от: —
 * Страницы:   loader, support
 */

class FormTextareas {
  static init() {
    const formBlocks = document.querySelectorAll('.form-textarea');
    if (formBlocks) {
      formBlocks.forEach(block => {
        const textarea = block.querySelector('textarea');
        const submitBtn = block.querySelector('button[type="submit"]');

        if (!textarea) return;

        let minHeight = 143;

        const computedStyle = window.getComputedStyle(textarea);
        const cssMinHeight = parseInt(computedStyle.minHeight);
        if (!isNaN(cssMinHeight) && cssMinHeight > 0) {
          minHeight = cssMinHeight;
        } else {
          const checkMinHeight = () => {
            if (window.innerWidth <= 700) {
              return 156;
            } else if (window.innerWidth <= 992) {
              return 153;
            } else {
              return 143;
            }
          };
          minHeight = checkMinHeight();

          window.addEventListener('resize', () => {
            minHeight = checkMinHeight();
            autoResize();
          });
        }

        function autoResize() {
          textarea.style.height = '';
          const maxHeight = window.innerHeight * 0.8;
          const scrollHeight = textarea.scrollHeight;
          let targetHeight = scrollHeight;

          if (targetHeight > maxHeight) {
            targetHeight = maxHeight;
            textarea.style.overflowY = 'auto';
          } else {
            textarea.style.overflowY = 'hidden';
          }

          if (targetHeight < minHeight) {
            targetHeight = minHeight;
          }

          textarea.style.height = targetHeight + 'px';
        }

        function resetHeight() {
          textarea.style.height = '';
          textarea.style.overflowY = '';
          setTimeout(autoResize, 0);
        }

        textarea.addEventListener('input', autoResize);
        textarea.addEventListener('keydown', () => setTimeout(autoResize, 0));
        window.addEventListener('resize', autoResize);

        autoResize();

        if (submitBtn) {
          submitBtn.addEventListener('click', function () {
            resetHeight();
          });
        }
      });
    }
  }
}

FormTextareas.init();
