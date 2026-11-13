/*
  Табы
 */

class Tabs {
  static init() {
    const tabs = document.querySelectorAll('[data-tabs]');
    let tabsActiveHash = [];

    if (tabs.length > 0) {
      const hash = getHash();
      if (hash && hash.startsWith('tab-')) {
        tabsActiveHash = hash.replace('tab-', '').split('-');
      }
      tabs.forEach((tabsBlock, index) => {
        tabsBlock.classList.add('_tab-init');
        tabsBlock.setAttribute('data-tabs-index', index);
        tabsBlock.addEventListener("click", setTabsAction);
        initTabs(tabsBlock);
      });

      let mdQueriesArray = dataMediaQueries(tabs, "tabs");
      if (mdQueriesArray && mdQueriesArray.length) {
        mdQueriesArray.forEach(mdQueriesItem => {
          mdQueriesItem.matchMedia.addEventListener("change", function () {
            setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
          });
          setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
      }
    }

    function updateCartOpenClass() {
      const cartTabs = document.querySelectorAll('[data-tabs-cart]');
      const hasActive = Array.from(cartTabs).some(el => el.classList.contains('_tab-active'));
      document.documentElement.classList.toggle('tabs-cart-open', hasActive);
    }

    updateCartOpenClass();

    function setTitlePosition(tabsMediaArray, matchMedia) {
      tabsMediaArray.forEach(tabsMediaItem => {
        tabsMediaItem = tabsMediaItem.item;
        let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]');
        let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]');
        let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]');
        let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]');
        tabsTitleItems = Array.from(tabsTitleItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
        tabsContentItems = Array.from(tabsContentItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
        const defaultIndex = Number(tabsMediaItem.dataset.tabsDefault || 0);
        tabsContentItems.forEach((tabsContentItem, index) => {
          if (matchMedia.matches) {
            tabsContent.append(tabsTitleItems[index]);
            tabsContent.append(tabsContentItem);
            tabsMediaItem.classList.add('_tab-spoller');
            tabsTitleItems[index].classList.remove('_tab-active');
            tabsContentItem.hidden = true;
          } else {
            tabsTitles.append(tabsTitleItems[index]);
            tabsMediaItem.classList.remove('_tab-spoller');
            if (index === defaultIndex) {
              tabsTitleItems[index].classList.add('_tab-active');
              tabsContentItem.hidden = false;
            } else {
              tabsTitleItems[index].classList.remove('_tab-active');
              tabsContentItem.hidden = true;
            }
          }
        });
      });
      updateCartOpenClass();
    }

    function initTabs(tabsBlock) {
      const belongs = el => el.closest('[data-tabs]') === tabsBlock;

      const tabsTitles = Array.from(tabsBlock.querySelectorAll('[data-tabs-titles]>*')).filter(belongs);
      const tabsContent = Array.from(tabsBlock.querySelectorAll('[data-tabs-body]>*')).filter(belongs);

      const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
      const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

      let defaultIndex = tabsTitles.findIndex(t => t.classList.contains('_tab-active'));
      if (defaultIndex < 0) defaultIndex = 0;

      const activeIndex = tabsActiveHashBlock ? Number(tabsActiveHash[1]) : defaultIndex;

      if (tabsContent.length) {
        const isSpollerMode = tabsBlock.classList.contains('_tab-spoller');

        tabsTitles.forEach(title => {
          title.setAttribute('data-tabs-title', '');
          title.classList.remove('_tab-active');
        });

        tabsContent.forEach((tabsContentItem, index) => {
          tabsContentItem.setAttribute('data-tabs-item', '');

          const isActive = !isSpollerMode && index === activeIndex;

          if (isActive && tabsTitles[index]) tabsTitles[index].classList.add('_tab-active');
          tabsContentItem.hidden = !isActive;
        });

        tabsBlock.dataset.tabsDefault = activeIndex;
      }
      setTabsStatus(tabsBlock);
      updateCartOpenClass();
    }

    function setTabsStatus(tabsBlock) {
      let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
      let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
      const tabsBlockIndex = tabsBlock.dataset.tabsIndex;

      function isTabsAnimate(tabsBlock) {
        if (tabsBlock.hasAttribute('data-tabs-animate')) {
          return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
        }
        return false;
      }
      const tabsBlockAnimate = isTabsAnimate(tabsBlock);

      if (tabsContent.length > 0) {
        const isHash = tabsBlock.hasAttribute('data-tabs-hash');
        tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
        tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
        tabsContent.forEach((tabsContentItem, index) => {
          if (tabsTitles[index].classList.contains('_tab-active')) {
            if (tabsBlockAnimate) {
              _slideDown(tabsContentItem, tabsBlockAnimate);
            } else {
              tabsContentItem.hidden = false;
            }
            if (isHash && !tabsContentItem.closest('.popup')) {
              setHash(`tab-${tabsBlockIndex}-${index}`);
            }
          } else {
            if (tabsBlockAnimate) {
              _slideUp(tabsContentItem, tabsBlockAnimate);
            } else {
              tabsContentItem.hidden = true;
            }
          }
        });
      }
      updateCartOpenClass();
    }

    function setTabsAction(e) {
      const el = e.target;
      if (el.closest('[data-tabs-title]')) {
        const tabTitle = el.closest('[data-tabs-title]');
        const tabsBlock = tabTitle.closest('[data-tabs]');
        if (e.currentTarget !== tabsBlock) return;
        const isSpollerMode = tabsBlock.classList.contains('_tab-spoller');
        const ownActiveTitles = () =>
          Array.from(tabsBlock.querySelectorAll('[data-tabs-title]._tab-active'))
            .filter(t => t.closest('[data-tabs]') === tabsBlock);

        if (!tabsBlock.querySelector('._slide')) {
          if (isSpollerMode) {
            if (tabTitle.classList.contains('_tab-active')) {
              tabTitle.classList.remove('_tab-active');
            } else {
              ownActiveTitles().forEach(activeTitle => {
                activeTitle.classList.remove('_tab-active');
              });
              tabTitle.classList.add('_tab-active');
            }
          } else {
            if (!tabTitle.classList.contains('_tab-active')) {
              ownActiveTitles().forEach(t => t.classList.remove('_tab-active'));
              tabTitle.classList.add('_tab-active');
            }
          }
          setTabsStatus(tabsBlock);
        }
        e.preventDefault();
      }
      updateCartOpenClass();
    }
  }
}

Tabs.init();
