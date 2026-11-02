/**
 * Меню объектов кабинета
 * ------------------------------------------------------------
 * Перенос пунктов в «Ещё» в .cabinet-objects-bottom.
 *
 * Класс:      CabinetMenus
 * Включается: если на странице есть `.cabinet-objects-bottom`
 * Зависит от: —
 * Страницы:   databases, users
 */

class CabinetMenus {
  static init() {
    const allContainers = document.querySelectorAll('.cabinet-objects-bottom');

    if (allContainers.length === 0) return;

    function saveOriginalOrder(container) {
      const mainList = container.querySelector('.cabinet-objects-bottom__main ul');
      if (!mainList) return;

      if (!container._originalHTML) {
        container._originalHTML = mainList.innerHTML;
      }
    }

    function restoreOriginalOrder(container) {
      const mainList = container.querySelector('.cabinet-objects-bottom__main ul');
      const moreList = container.querySelector('.cabinet-objects-bottom__more-list');
      const mainBlock = container.querySelector('.cabinet-objects-bottom__main');
      const checkboxesBlock = container.querySelector('.cabinet-objects-bottom__checkboxes');

      if (!mainList || !moreList) return;

      if (checkboxesBlock) {
        checkboxesBlock.style.display = '';
        const clonedCheckboxes = moreList.querySelector('.cabinet-objects-bottom__more-checkboxes');
        if (clonedCheckboxes) {
          clonedCheckboxes.remove();
        }
      }

      const itemsInMain = Array.from(mainList.querySelectorAll('li'));
      const itemsInMore = Array.from(moreList.querySelectorAll('li'));
      const allItems = [...itemsInMain, ...itemsInMore];

      if (allItems.length === 0) return;

      allItems.sort((a, b) => {
        const indexA = parseInt(a.getAttribute('data-original-index')) || 0;
        const indexB = parseInt(b.getAttribute('data-original-index')) || 0;
        return indexA - indexB;
      });

      mainList.innerHTML = '';
      moreList.innerHTML = '';

      allItems.forEach(item => {
        mainList.appendChild(item);
      });

      if (mainBlock) {
        mainBlock.style.display = '';
      }
    }

    function handleResponsiveMenu(container) {
      const body = container.querySelector('.cabinet-objects-bottom__body');
      const listContainer = container.querySelector('.cabinet-objects-bottom__list');
      const mainList = container.querySelector('.cabinet-objects-bottom__main ul');
      const moreBlock = container.querySelector('.cabinet-objects-bottom__more');
      const moreList = container.querySelector('.cabinet-objects-bottom__more-list');
      const btn = container.querySelector('.cabinet-objects-bottom__contents .btn');
      const mainBlock = container.querySelector('.cabinet-objects-bottom__main');

      if (!body || !mainList || !moreBlock || !moreList || !listContainer) return;

      function markOriginalOrder() {
        const items = mainList.querySelectorAll('li');
        items.forEach((item, index) => {
          if (!item.hasAttribute('data-original-index')) {
            item.setAttribute('data-original-index', index);
          }
        });
      }

      function getGap(list) {
        const style = window.getComputedStyle(list);
        const gap = parseInt(style.gap) || 20;
        return gap;
      }

      function getElementWidths(list) {
        const items = list.querySelectorAll('li');
        const widths = [];

        items.forEach((item, index) => {
          const width = item.offsetWidth;
          const computedStyle = window.getComputedStyle(item);
          const marginLeft = parseInt(computedStyle.marginLeft) || 0;
          const marginRight = parseInt(computedStyle.marginRight) || 0;
          const totalWidth = width + marginLeft + marginRight;

          widths.push({
            index,
            originalIndex: parseInt(item.getAttribute('data-original-index')) || index,
            width,
            totalWidth,
          });
        });

        return widths;
      }

      function moveAllToMore() {
        restoreOriginalOrder(container);
        markOriginalOrder();

        const items = Array.from(mainList.querySelectorAll('li'));
        const checkboxesBlock = container.querySelector('.cabinet-objects-bottom__checkboxes');

        if (checkboxesBlock && window.innerWidth <= 750) {
          moreList.innerHTML = '';
          const checkboxesClone = checkboxesBlock.cloneNode(true);
          const checkboxesLi = document.createElement('li');
          checkboxesLi.className = 'cabinet-objects-bottom__more-checkboxes';
          checkboxesLi.appendChild(checkboxesClone);
          moreList.appendChild(checkboxesLi);
          checkboxesBlock.style.display = 'none';
        }

        if (items.length === 0) return;

        items.forEach((item) => {
          moreList.appendChild(item);
        });

        if (mainBlock) {
          mainBlock.style.display = 'none';
        }

        moreBlock.style.display = 'flex';
      }

      function checkAndMoveItems() {
        const windowWidth = window.innerWidth;

        if (windowWidth >= 1501) {
          restoreOriginalOrder(container);
          markOriginalOrder();

          if (mainBlock) {
            mainBlock.style.display = '';
          }

          moreBlock.style.display = 'none';
          return;
        }

        if (windowWidth <= 992) {
          moveAllToMore();
          return;
        }

        restoreOriginalOrder(container);
        markOriginalOrder();

        if (mainBlock) {
          mainBlock.style.display = '';
        }

        moreBlock.style.display = 'none';

        const contents = container.querySelector('.cabinet-objects-bottom__contents');
        if (!contents) return;

        const contentsWidth = contents.clientWidth;
        const contentsStyle = window.getComputedStyle(contents);
        const contentsPaddingLeft = parseInt(contentsStyle.paddingLeft) || 0;
        const contentsPaddingRight = parseInt(contentsStyle.paddingRight) || 0;
        const contentsGap = parseInt(contentsStyle.gap) || 40;

        let btnWidth = 0;
        if (btn) {
          btnWidth = btn.offsetWidth;
        }

        let checkboxesWidth = 0;
        const checkboxesBlock = container.querySelector('.cabinet-objects-bottom__checkboxes');
        if (checkboxesBlock) {
          checkboxesWidth = checkboxesBlock.offsetWidth;
        }

        const availableForList = contentsWidth - contentsPaddingLeft - contentsPaddingRight - btnWidth - contentsGap - checkboxesWidth;
        const elementWidths = getElementWidths(mainList);

        if (elementWidths.length === 0) return;

        const gap = getGap(mainList);
        const totalElementsWidth = elementWidths.reduce((sum, item) => sum + item.totalWidth, 0);
        const totalWithGaps = totalElementsWidth + (elementWidths.length - 1) * gap;
        const moreBlockWidth = 150;
        const listGap = 40;
        const effectiveAvailable = availableForList - moreBlockWidth - listGap;

        if (totalWithGaps > effectiveAvailable) {
          moreBlock.style.display = 'flex';

          const items = Array.from(mainList.querySelectorAll('li'));
          let currentWidth = totalWithGaps;
          let movedItems = [];

          for (let i = items.length - 1; i >= 1; i--) {
            if (currentWidth <= effectiveAvailable) break;

            const item = items[i];
            const itemWidth = elementWidths[i];

            movedItems.unshift(item);
            currentWidth -= (itemWidth.totalWidth + gap);
          }

          if (movedItems.length > 0) {
            movedItems.forEach(item => {
              moreList.appendChild(item);
            });
          } else {
            moreBlock.style.display = 'none';
          }
        }
      }

      container._checkAndMoveItems = checkAndMoveItems;
      markOriginalOrder();
    }

    function initGlobalDropdownHandler() {
      if (document._dropdownClickHandler) {
        document.removeEventListener('click', document._dropdownClickHandler);
      }

      const clickHandler = function (e) {
        const titleButton = e.target.closest('.cabinet-objects-bottom__titles');

        if (titleButton) {
          e.stopPropagation();
          e.preventDefault();

          const parent = titleButton.closest('.cabinet-objects-bottom__more');

          if (parent) {
            document.querySelectorAll('.cabinet-objects-bottom__more.active').forEach(item => {
              if (item !== parent) {
                item.classList.remove('active');
              }
            });

            parent.classList.toggle('active');
          }
        } else {
          const isInsideDropdown = e.target.closest('.cabinet-objects-bottom__dropdown');

          if (!isInsideDropdown) {
            document.querySelectorAll('.cabinet-objects-bottom__more.active').forEach(item => {
              item.classList.remove('active');
            });
          }
        }
      };

      document.addEventListener('click', clickHandler);
      document._dropdownClickHandler = clickHandler;

      document.querySelectorAll('.cabinet-objects-bottom__dropdown').forEach(dropdown => {
        dropdown.addEventListener('click', function (e) {
          e.stopPropagation();
        });
      });
    }

    allContainers.forEach((container) => {
      saveOriginalOrder(container);
      handleResponsiveMenu(container);
    });

    initGlobalDropdownHandler();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const containers = document.querySelectorAll('.cabinet-objects-bottom');
        if (containers.length === 0) return;
        containers.forEach((container) => {
          if (container._checkAndMoveItems) {
            container._checkAndMoveItems();
          }
        });
      }, 250);
    });

    setTimeout(() => {
      const containers = document.querySelectorAll('.cabinet-objects-bottom');
      if (containers.length === 0) return;
      containers.forEach(container => {
        if (container._checkAndMoveItems) {
          container._checkAndMoveItems();
        }
      });
    }, 100);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CabinetMenus.init());
} else {
  CabinetMenus.init();
}
