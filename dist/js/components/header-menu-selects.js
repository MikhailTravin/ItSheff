/**
 * Выпадающие селекты меню
 * ------------------------------------------------------------
 * .header-menu-select
 *
 * Класс:      HeaderMenuSelects
 * Включается: если на странице есть `.header-menu-select`
 * Зависит от: core/scroll-to
 * Страницы:   home, invoices-auto-payment, invoices-details, invoices, services-product, services-store, services
 */

class HeaderMenuSelects {
  static init() {
    const menuSelects = document.querySelectorAll('.header-menu-select');

    if (menuSelects.length) {
      menuSelects.forEach(function (menuSelect) {
        const menuTitle = menuSelect.querySelector('.header-menu-select__title');
        const menuTitleSpan = menuTitle.querySelector('span');
        const menuTitleIconWrap = menuTitle.querySelector('.services-store-menu__icon2');
        const menuTitleImg = menuTitle.querySelector('img');
        const menuLinks = menuSelect.querySelectorAll('.header-menu-select__link');

        menuTitle.addEventListener('click', function (e) {
          e.stopPropagation();
          menuSelect.classList.toggle('active');
        });

        menuLinks.forEach(function (link) {
          link.addEventListener('click', function (e) {
            e.stopPropagation();

            menuLinks.forEach(function (item) {
              item.classList.remove('active');
            });

            this.classList.add('active');

            const linkText = this.querySelector('span').textContent.trim();
            menuTitleSpan.textContent = linkText;

            const linkSvgWrap = this.querySelector('.services-store-menu__icon2 svg');
            const linkImg = this.querySelector('img');

            if (linkSvgWrap) {
              const useEl = linkSvgWrap.querySelector('use');
              const href = useEl ? useEl.getAttribute('xlink:href') : null;
              const width = linkSvgWrap.getAttribute('width');
              const height = linkSvgWrap.getAttribute('height');

              if (menuTitleImg) menuTitleImg.remove();

              let titleSvgWrap = menuTitle.querySelector('.services-store-menu__icon2');
              if (!titleSvgWrap) {
                titleSvgWrap = document.createElement('div');
                titleSvgWrap.className = 'services-store-menu__icon2';
                menuTitle.insertBefore(titleSvgWrap, menuTitleSpan);
              }

              let titleSvg = titleSvgWrap.querySelector('svg');
              if (!titleSvg) {
                titleSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                titleSvg.setAttribute('aria-hidden', 'true');
                titleSvgWrap.appendChild(titleSvg);
              }

              if (width) titleSvg.setAttribute('width', width);
              if (height) titleSvg.setAttribute('height', height);

              let titleUse = titleSvg.querySelector('use');
              if (!titleUse) {
                titleUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                titleSvg.appendChild(titleUse);
              }
              if (href) titleUse.setAttribute('xlink:href', href);
            } else if (linkImg) {
              const src = linkImg.getAttribute('src');
              const alt = linkImg.getAttribute('alt') || '';

              const existingSvgWrap = menuTitle.querySelector('.services-store-menu__icon2');
              if (existingSvgWrap) existingSvgWrap.remove();

              let titleImg = menuTitle.querySelector('img');
              if (!titleImg) {
                titleImg = document.createElement('img');
                menuTitle.insertBefore(titleImg, menuTitleSpan);
              }
              titleImg.setAttribute('src', src);
              titleImg.setAttribute('alt', alt);
            }

            menuSelect.classList.remove('active');

            if (this.hasAttribute('data-goto')) {
              const selector = this.dataset.goto || '';
              const noHeader = this.hasAttribute('data-goto-header');
              const speed = this.dataset.gotoSpeed
                ? parseInt(this.dataset.gotoSpeed, 10)
                : 500;
              const offsetTop = this.dataset.gotoTop
                ? parseInt(this.dataset.gotoTop, 10)
                : 0;

              if (selector && typeof gotoBlock === 'function') {
                gotoBlock(selector, noHeader, speed, offsetTop);
              }
            }
          });
        });

        document.addEventListener('click', function (e) {
          if (!menuSelect.contains(e.target)) {
            menuSelect.classList.remove('active');
          }
        });
      });
    }
  }
}

HeaderMenuSelects.init();
