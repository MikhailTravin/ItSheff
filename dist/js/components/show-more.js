/**
 * Показать больше
 * ------------------------------------------------------------
 * [data-showmore]; экспортирует window.refreshShowMore().
 *
 * Класс:      ShowMore
 * Включается: если на странице есть `[data-showmore]`
 * Зависит от: core/helpers
 * Страницы:   cart, databases, home, loader, services-product, services, subscriptions, users
 */

class ShowMore {
  static init() {
    window.addEventListener("load", function (e) {
      const showMoreBlocks = document.querySelectorAll('[data-showmore]');
      let showMoreBlocksRegular;
      let mdQueriesArray;

      if (showMoreBlocks.length) {
        showMoreBlocksRegular = Array.from(showMoreBlocks).filter(function (item) {
          return !item.dataset.showmoreMedia;
        });
        showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;

        document.addEventListener("click", showMoreActions);
        window.addEventListener("resize", showMoreActions);

        mdQueriesArray = buildMediaGroups(showMoreBlocks);
        if (mdQueriesArray && mdQueriesArray.length) {
          mdQueriesArray.forEach((mdQueriesItem, i) => {
            mdQueriesItem.matchMedia.addEventListener("change", function (ev) {
              initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            });
          });
          initItemsMedia(mdQueriesArray);
        }
      }

      function buildMediaGroups(blocks) {
        const map = new Map();
        blocks.forEach(block => {
          const raw = block.dataset.showmoreMedia;
          if (!raw) return;
          const query = raw.trim();
          if (!map.has(query)) map.set(query, []);
          map.get(query).push({ value: query, type: 'max', item: block });
        });
        return Array.from(map.entries()).map(([query, items]) => ({
          matchMedia: window.matchMedia(query),
          itemsArray: items
        }));
      }

      function initItemsMedia(mdQueriesArray) {
        mdQueriesArray.forEach((mdQueriesItem, i) => {
          initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
      }
      function initItems(showMoreBlocks, matchMedia) {
        showMoreBlocks.forEach((showMoreBlock, i) => {
          initItem(showMoreBlock, matchMedia);
        });
      }
      function initItem(showMoreBlock, matchMedia = false) {
        showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;

        let showMoreContent = showMoreBlock.querySelectorAll('[data-showmore-content]');
        let showMoreButton = showMoreBlock.querySelectorAll('[data-showmore-button]');
        showMoreContent = Array.from(showMoreContent).filter(item => item.closest('[data-showmore]') === showMoreBlock)[0];
        showMoreButton = Array.from(showMoreButton).filter(item => item.closest('[data-showmore]') === showMoreBlock)[0];

        if (!showMoreContent) return;

        if (matchMedia && !matchMedia.matches) {
          showMoreContent.style.removeProperty('height');
          showMoreContent.style.removeProperty('overflow');
          showMoreBlock.classList.remove('_showmore-active');
          if (showMoreButton) showMoreButton.hidden = true;
          return;
        }

        const showMoreType = showMoreBlock.dataset.showmore ? showMoreBlock.dataset.showmore.split(',')[0] : 'size';
        const showMoreTypeValue = parseInt(showMoreContent.dataset.showmoreContent) || 3;

        if (showMoreType === 'items' && showMoreContent.children.length <= showMoreTypeValue) {
          showMoreContent.style.removeProperty('height');
          showMoreContent.style.removeProperty('overflow');
          showMoreBlock.classList.remove('_showmore-active');
          if (showMoreButton) showMoreButton.hidden = true;
          return;
        }

        const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
        const originalHeight = getOriginalHeight(showMoreContent);

        if (hiddenHeight < originalHeight - 1) {
          _slideUp(showMoreContent, 0, showMoreBlock.classList.contains('_showmore-active') ? originalHeight : hiddenHeight);
          if (showMoreButton) showMoreButton.hidden = false;
        } else {
          _slideDown(showMoreContent, 0, hiddenHeight);
          if (showMoreButton) showMoreButton.hidden = true;
        }
      }
      function getHeight(showMoreBlock, showMoreContent) {
        let hiddenHeight = 0;
        const showMoreType = showMoreBlock.dataset.showmore ? showMoreBlock.dataset.showmore.split(',')[0] : 'size';
        const rowGap = parseFloat(getComputedStyle(showMoreContent).rowGap) ? parseFloat(getComputedStyle(showMoreContent).rowGap) : 0;
        if (showMoreType === 'items') {
          const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? parseInt(showMoreContent.dataset.showmoreContent) : 3;
          const showMoreItems = showMoreContent.children;
          const itemsToShow = Math.min(showMoreTypeValue, showMoreItems.length);
          for (let index = 0; index < itemsToShow; index++) {
            const showMoreItem = showMoreItems[index];
            const marginTop = parseFloat(getComputedStyle(showMoreItem).marginTop) || 0;
            const marginBottom = parseFloat(getComputedStyle(showMoreItem).marginBottom) || 0;
            let itemHeight = showMoreItem.offsetHeight;
            const spollerBody = showMoreItem.querySelector('[data-spoller] + *');
            if (spollerBody && !spollerBody.hidden) {
              itemHeight = showMoreItem.offsetHeight - spollerBody.offsetHeight;
            }
            hiddenHeight += itemHeight + marginTop;
            if (index < itemsToShow - 1) hiddenHeight += marginBottom;
          }
          if (itemsToShow > 1) {
            rowGap ? hiddenHeight += (itemsToShow - 1) * rowGap : null;
          }
        } else {
          const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 150;
          hiddenHeight = showMoreTypeValue;
        }
        return hiddenHeight;
      }
      function getOriginalHeight(showMoreContent) {
        let parentHidden;
        let hiddenHeight = showMoreContent.offsetHeight;
        showMoreContent.style.removeProperty('height');
        showMoreContent.style.removeProperty('overflow');
        if (showMoreContent.closest(`[hidden]`)) {
          parentHidden = showMoreContent.closest(`[hidden]`);
          parentHidden.hidden = false;
        }
        let originalHeight = showMoreContent.offsetHeight;
        parentHidden ? parentHidden.hidden = true : null;
        showMoreContent.style.height = `${hiddenHeight}px`;
        return originalHeight;
      }
      function showMoreActions(e) {
        const targetEvent = e.target;
        const targetType = e.type;
        if (targetType === 'click') {
          if (targetEvent.closest('[data-showmore-button]')) {
            const showMoreButton = targetEvent.closest('[data-showmore-button]');
            const showMoreBlock = showMoreButton.closest('[data-showmore]');
            const showMoreContent = showMoreBlock.querySelector('[data-showmore-content]');
            const showMoreSpeed = showMoreBlock.dataset.showmoreButton ? showMoreBlock.dataset.showmoreButton : '500';
            const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
            if (!showMoreContent.classList.contains('_slide')) {
              showMoreBlock.classList.contains('_showmore-active') ? _slideUp(showMoreContent, showMoreSpeed, hiddenHeight) : _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
              showMoreBlock.classList.toggle('_showmore-active');
            }
          }
        } else if (targetType === 'resize') {
          requestAnimationFrame(() => {
            showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
            mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null;
          });
        }
      }

      window.refreshShowMore = function () {
        const blocks = document.querySelectorAll('[data-showmore]');
        if (!blocks.length) return;
        const regular = Array.from(blocks).filter(item => !item.dataset.showmoreMedia);
        if (regular.length) initItems(regular);
        const mdArr = buildMediaGroups(blocks);
        if (mdArr && mdArr.length) initItemsMedia(mdArr);
      };
    });
  }
}

ShowMore.init();
