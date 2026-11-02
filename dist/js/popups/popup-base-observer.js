/**
 * Анимация создания базы
 * ------------------------------------------------------------
 * MutationObserver: запускает анимацию линии в попапе «база создаётся».
 *
 * Класс:      PopupBaseObserver
 * Включается: если на странице есть `.popup-base-created`
 * Зависит от: —
 * Страницы:   cart, databases, home, invoices-auto-payment, invoices-details, invoices, loader, services-product, services-store, services, subscriptions
 */

class PopupBaseObserver {
  static init() {
    const observer = new MutationObserver(() => {
      const popupSteps = document.querySelectorAll('.popup__step.popup-base-created.active');
      const popups = document.querySelectorAll('.popup-base-created.popup_show');

      const processElement = (container) => {
        const addBaseCreat = container.querySelector('.add-base-creat');
        const popupContent = container.querySelector('.popup-content-creat');

        if (addBaseCreat && popupContent && !addBaseCreat.classList.contains('active') && !popupContent.classList.contains('hidden')) {
          addBaseCreat.classList.add('active');

          const animatedLine = addBaseCreat.querySelector('.line span');
          if (animatedLine) {
            const clonedLine = animatedLine.cloneNode(true);
            animatedLine.parentNode.replaceChild(clonedLine, animatedLine);

            clonedLine.addEventListener('animationend', () => {
              popupContent.classList.add('hidden');
            }, { once: true });
          } else {
            popupContent.classList.add('hidden');
          }
        }
      };

      popupSteps.forEach(step => processElement(step));
      popups.forEach(popup => processElement(popup));
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
  }
}

PopupBaseObserver.init();
