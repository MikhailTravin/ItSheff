/**
 * Спойлеры
 * ------------------------------------------------------------
 * Аккордеоны [data-spollers] / [data-spoller], пересчитываются при resize.
 *
 * Класс:      Spollers
 * Включается: если на странице есть `[data-spollers]` или `[data-spoller]`
 * Зависит от: core/helpers
 * Страницы:   21 из 29 (все, кроме: account-access, account-blocked, loader-login-error, loader-login, loader-progress, loader, login, registration)
 */

class Spollers {
  static init() {
    const spollersArray = document.querySelectorAll("[data-spollers]");
    if (spollersArray.length > 0) {
      const spollersRegular = Array.from(spollersArray).filter((function (item, index, self) {
        return !item.dataset.spollers.split(",")[0];
      }));
      if (spollersRegular.length) initSpollers(spollersRegular);

      spollersArray.forEach(spollersBlock => {
        const mediaQuery = spollersBlock.dataset.spollers;
        if (mediaQuery) {
          const [maxWidth, type] = mediaQuery.split(",");
          const width = parseInt(maxWidth);

          if (type === "max" && window.innerWidth <= width) {
            if (!spollersBlock.classList.contains("_spoller-init")) {
              initSpollers([spollersBlock]);
            }
          } else if (type === "max" && window.innerWidth > width) {
            if (spollersBlock.classList.contains("_spoller-init")) {
              spollersBlock.classList.remove("_spoller-init");
              initSpollerBody(spollersBlock, false);
              spollersBlock.removeEventListener("click", setSpollerAction);
            }
          }
        }
      });

      function initSpollers(spollersArray, matchMedia = false) {
        spollersArray.forEach(spollersBlock => {
          spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;

          const showMoreParent = spollersBlock.closest('[data-showmore]');
          if (spollersBlock.hasAttribute('data-showmore-content') && showMoreParent) {
            spollersBlock = showMoreParent;
          }

          if (matchMedia.matches || !matchMedia) {
            spollersBlock.classList.add("_spoller-init");
            initSpollerBody(spollersBlock);
            spollersBlock.addEventListener("click", setSpollerAction);
            initCloseButtons(spollersBlock);
          } else {
            spollersBlock.classList.remove("_spoller-init");
            initSpollerBody(spollersBlock, false);
            spollersBlock.removeEventListener("click", setSpollerAction);
          }
        });
      }

      function initSpollerBody(spollersBlock, hideSpollerBody = true) {
        let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
        if (spollerTitles.length) {
          spollerTitles = Array.from(spollerTitles).filter(item => {
            return item.closest("[data-spollers]") === spollersBlock
              || item.closest("[data-showmore]") === spollersBlock;
          });
          spollerTitles.forEach(spollerTitle => {
            if (hideSpollerBody) {
              spollerTitle.removeAttribute("tabindex");
              if (!spollerTitle.classList.contains("_spoller-active")) {
                if (spollerTitle.nextElementSibling) {
                  spollerTitle.nextElementSibling.hidden = true;
                }
              }
            } else {
              spollerTitle.setAttribute("tabindex", "-1");
              if (spollerTitle.nextElementSibling) {
                spollerTitle.nextElementSibling.hidden = false;
              }
            }
          });
        }
      }

      function initCloseButtons(spollersBlock) {
        const closeButtons = spollersBlock.querySelectorAll('.cabinet-orders-spollers__button');
        closeButtons.forEach(button => {
          button.removeEventListener('click', closeSpollerHandler);
          button.addEventListener('click', closeSpollerHandler);
        });
      }

      function closeSpollerHandler(e) {
        e.preventDefault();
        e.stopPropagation();

        const button = e.currentTarget;
        const spollersBlock = button.closest('[data-spollers]') || button.closest('[data-showmore]');
        const spollerItem = button.closest('.cabinet-orders-spollers__item');

        if (spollersBlock && spollerItem) {
          const spollerTitle = spollerItem.querySelector('[data-spoller]');

          if (spollerTitle && spollerTitle.classList.contains('_spoller-active')) {
            const spollerSpeed = parseInt(spollersBlock.dataset.spollersSpeed || spollersBlock.dataset.showmoreButton || 500);

            spollerTitle.classList.remove('_spoller-active');
            spollerItem.classList.remove('_spoller-active');

            const contentBlock = spollerTitle.nextElementSibling;
            _slideUp(contentBlock, spollerSpeed);
          }
        }
      }

      function setSpollerAction(e) {
        const el = e.target;

        const isLink = el.closest('a');
        if (isLink) {
          return;
        }

        if (el.closest("[data-spoller]")) {
          const spollerTitle = el.closest("[data-spoller]");

          const spollerItem = spollerTitle.closest(".spollers__item, .cabinet-orders-spollers__item");
          const spollersBlock = spollerTitle.closest("[data-spollers]") || spollerTitle.closest("[data-showmore]");

          const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
          const spollerSpeed = parseInt(spollersBlock.dataset.spollersSpeed || spollersBlock.dataset.showmoreButton || 500);

          if (!spollersBlock.querySelectorAll("._slide").length) {
            if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) {
              hideSpollersBody(spollersBlock);
            }

            spollerTitle.classList.toggle("_spoller-active");
            if (spollerItem) spollerItem.classList.toggle("_spoller-active");

            const contentBlock = spollerTitle.nextElementSibling;
            _slideToggle(contentBlock, spollerSpeed);

            e.preventDefault();
          }
        }
      }

      function hideSpollersBody(spollersBlock) {
        const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
        const spollerSpeed = parseInt(spollersBlock.dataset.spollersSpeed || spollersBlock.dataset.showmoreButton || 500);
        if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
          const spollerItem = spollerActiveTitle.closest(".spollers__item, .cabinet-orders-spollers__item");

          spollerActiveTitle.classList.remove("_spoller-active");
          if (spollerItem) spollerItem.classList.remove("_spoller-active");
          _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
        }
      }

      const spollersClose = document.querySelectorAll("[data-spoller-close]");
      if (spollersClose.length) {
        document.addEventListener("click", (function (e) {
          const el = e.target;
          if (!el.closest("[data-spollers]") && !el.closest("[data-showmore]")) {
            spollersClose.forEach((spollerClose => {
              const spollersBlock = spollerClose.closest("[data-spollers]") || spollerClose.closest("[data-showmore]");
              const spollerSpeed = parseInt(spollersBlock.dataset.spollersSpeed || spollersBlock.dataset.showmoreButton || 500);
              spollerClose.classList.remove("_spoller-active");

              const spollerItem = spollerClose.closest(".spollers__item, .cabinet-orders-spollers__item");
              if (spollerItem) spollerItem.classList.remove("_spoller-active");

              _slideUp(spollerClose.nextElementSibling, spollerSpeed);
            }));
          }
        }));
      }
    }
  }
}

Spollers.init();
window.addEventListener('resize', function () {
  Spollers.init();
});
