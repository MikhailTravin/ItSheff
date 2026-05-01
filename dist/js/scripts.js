const modules_flsModules = {};

let bodyLockStatus = true;
let bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    setTimeout((() => {
      lockPaddingElements.forEach((lockPaddingElement => {
        lockPaddingElement.style.paddingRight = "";
      }));
      document.body.style.paddingRight = "";
      document.documentElement.classList.remove("lock");
    }), delay);
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
let bodyLock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
    lockPaddingElements.forEach((lockPaddingElement => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    }));
    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.classList.add("lock");
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
function functions_FLS(message) {
  setTimeout((() => {
    if (window.FLS) console.log(message);
  }), 0);
}

let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout((() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout((() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideToggle = (target, duration = 500) => {
  if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
};

function getHash() {
  if (location.hash) { return location.hash.replace('#', ''); }
}

function dataMediaQueries(array, dataSetValue) {
  const media = Array.from(array).filter(function (item) {
    return item.dataset[dataSetValue];
  });

  if (media.length) {
    const breakpointsArray = media.map(item => {
      const params = item.dataset[dataSetValue];
      const paramsArray = params.split(",");
      return {
        value: paramsArray[0],
        type: paramsArray[1] ? paramsArray[1].trim() : "max",
        item: item
      };
    });

    const mdQueries = uniqArray(
      breakpointsArray.map(item => `(${item.type}-width: ${item.value}px),${item.value},${item.type}`)
    );

    const mdQueriesArray = mdQueries.map(breakpoint => {
      const [query, value, type] = breakpoint.split(",");
      const matchMedia = window.matchMedia(query);
      const itemsArray = breakpointsArray.filter(item => item.value === value && item.type === type);
      return { itemsArray, matchMedia };
    });

    return mdQueriesArray;
  }
}

function uniqArray(array) {
  return array.filter(function (item, index, self) {
    return self.indexOf(item) === index;
  });
}

//========================================================================================================================================================

const moreButtons = document.querySelectorAll('.btn-more');

if (moreButtons) {
  moreButtons.forEach(button => {
    const cabinetBlock = button.closest('.block-cabinet-bottom');
    if (!cabinetBlock) return;

    const dropdown = cabinetBlock.querySelector('.block-cabinet-bottom__dropdown');
    if (!dropdown) return;

    dropdown.hidden = true;

    button.addEventListener('click', (e) => {
      e.preventDefault();

      const span = button.querySelector('span');
      const isOpening = dropdown.hidden;

      _slideToggle(dropdown, 300);

      if (span) {
        span.textContent = isOpening ? 'Свернуть' : 'Развернуть';
      }
    });
  });
}

//========================================================================================================================================================

//Количество
function formQuantity() {
  document.addEventListener("click", function (e) {
    let targetElement = e.target;
    if (targetElement.closest('[data-quantity-plus]') || targetElement.closest('[data-quantity-minus]')) {
      const quantityElement = targetElement.closest('[data-quantity]');
      const valueElement = quantityElement.querySelector('[data-quantity-value]');
      let value = parseInt(valueElement.value) || 0;

      if (targetElement.closest('[data-quantity-plus]')) {
        value++;
        if (quantityElement.dataset.quantityMax && +quantityElement.dataset.quantityMax < value) {
          value = quantityElement.dataset.quantityMax;
        }
      } else {
        value--;
        if (quantityElement.dataset.quantityMin) {
          if (+quantityElement.dataset.quantityMin > value) {
            value = quantityElement.dataset.quantityMin;
          }
        } else if (value < 1) {
          value = 1;
        }
      }
      valueElement.value = value;
    }
  });
}
formQuantity();

//========================================================================================================================================================

const cardsSubscriptions = document.querySelectorAll('.card-subscriptions');

if (cardsSubscriptions) {
  function isMobile() {
    return window.innerWidth <= 992;
  }

  function closeAllCards() {
    cardsSubscriptions.forEach(card => {
      card.classList.remove('active');
    });
    document.body.classList.remove('card-subscriptions-open');
  }

  function openCard(card) {
    closeAllCards();
    card.classList.add('active');
    document.body.classList.add('card-subscriptions-open');
  }

  cardsSubscriptions.forEach(card => {
    const clickableArea = card.querySelector('.card-subscriptions__items');

    if (clickableArea) {
      clickableArea.addEventListener('click', function (e) {
        e.stopPropagation();
        if (isMobile()) {
          if (card.classList.contains('active')) {
            closeAllCards();
          } else {
            openCard(card);
          }
        }
      });
    }
  });

  document.body.addEventListener('click', function (e) {
    if (isMobile()) {
      const activeCard = document.querySelector('.card-subscriptions.active');
      if (activeCard) {
        const isClickInsideCard = activeCard.contains(e.target);
        const isClickInsideHover = activeCard.querySelector('.card-subscriptions-hover')?.contains(e.target);

        if (!isClickInsideCard && !isClickInsideHover) {
          closeAllCards();
        }
      }
    }
  });

  window.addEventListener('resize', function () {
    if (!isMobile()) {
      closeAllCards();
    }
  });

  document.querySelectorAll('.card-subscriptions-hover button, .card-subscriptions-hover .quantity').forEach(element => {
    element.addEventListener('click', function (e) {
      //e.stopPropagation();
    });
  });
}

//========================================================================================================================================================

//Спойлер
function spollers() {
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
      spollersArray.forEach((spollersBlock => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
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
      }));
    }

    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
      let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
      if (spollerTitles.length) {
        spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
        spollerTitles.forEach((spollerTitle => {
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
        }));
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
      const spollersBlock = button.closest('[data-spollers]');
      const spollerItem = button.closest('.cabinet-orders-spollers__item');

      if (spollersBlock && spollerItem) {
        const spollerTitle = spollerItem.querySelector('[data-spoller]');

        if (spollerTitle && spollerTitle.classList.contains('_spoller-active')) {
          const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;

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
        const spollersBlock = spollerTitle.closest("[data-spollers]");

        const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;

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
      const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
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
        if (!el.closest("[data-spollers]")) {
          spollersClose.forEach((spollerClose => {
            const spollersBlock = spollerClose.closest("[data-spollers]");
            const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
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
spollers();
window.addEventListener('resize', function () {
  spollers();
});

//========================================================================================================================================================

//Табы
function tabs() {
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

  function setTitlePosition(tabsMediaArray, matchMedia) {
    tabsMediaArray.forEach(tabsMediaItem => {
      tabsMediaItem = tabsMediaItem.item;
      let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]');
      let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]');
      let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]');
      let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]');
      tabsTitleItems = Array.from(tabsTitleItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
      tabsContentItems = Array.from(tabsContentItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
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
          if (index === 0) {
            tabsTitleItems[index].classList.add('_tab-active');
            tabsContentItem.hidden = false;
          } else {
            tabsTitleItems[index].classList.remove('_tab-active');
            tabsContentItem.hidden = true;
          }
        }
      });
    });
  }

  function initTabs(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*');
    let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
    const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

    if (tabsActiveHashBlock) {
      const tabsActiveTitle = tabsBlock.querySelector('[data-tabs-titles]>._tab-active');
      tabsActiveTitle ? tabsActiveTitle.classList.remove('_tab-active') : null;
    }
    if (tabsContent.length) {
      tabsContent.forEach((tabsContentItem, index) => {
        tabsTitles[index].setAttribute('data-tabs-title', '');
        tabsContentItem.setAttribute('data-tabs-item', '');

        const isSpollerMode = tabsBlock.classList.contains('_tab-spoller');

        if (!isSpollerMode) {
          if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
            tabsTitles[index].classList.add('_tab-active');
          } else if (!tabsActiveHashBlock && index === 0) {
            tabsTitles[index].classList.add('_tab-active');
          }
        } else {
          tabsTitles[index].classList.remove('_tab-active');
        }

        tabsContentItem.hidden = !tabsTitles[index].classList.contains('_tab-active');
      });
    }
    setTabsStatus(tabsBlock);
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
  }

  function setTabsAction(e) {
    const el = e.target;
    if (el.closest('[data-tabs-title]')) {
      const tabTitle = el.closest('[data-tabs-title]');
      const tabsBlock = tabTitle.closest('[data-tabs]');
      const isSpollerMode = tabsBlock.classList.contains('_tab-spoller');

      if (!tabsBlock.querySelector('._slide')) {
        if (isSpollerMode) {
          const contentItem = tabsBlock.querySelector(`[data-tabs-item="${tabTitle.getAttribute('data-tabs-title')}"]`);

          if (tabTitle.classList.contains('_tab-active')) {
            tabTitle.classList.remove('_tab-active');
          } else {
            let activeTitles = tabsBlock.querySelectorAll('[data-tabs-title]._tab-active');
            activeTitles.forEach(activeTitle => {
              activeTitle.classList.remove('_tab-active');
            });
            tabTitle.classList.add('_tab-active');
          }
        } else {
          if (!tabTitle.classList.contains('_tab-active')) {
            let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title]._tab-active');
            tabActiveTitle = Array.from(tabActiveTitle).filter(item => item.closest('[data-tabs]') === tabsBlock);
            if (tabActiveTitle.length) tabActiveTitle[0].classList.remove('_tab-active');
            tabTitle.classList.add('_tab-active');
          }
        }
        setTabsStatus(tabsBlock);
      }
      e.preventDefault();
    }
  }
}
tabs();

//========================================================================================================================================================

const notificationIcon = document.querySelector('.header-notifications');

if (notificationIcon) {
  const documentElement = document.documentElement;

  function isDesktop() {
    return window.innerWidth >= 1201;
  }

  function isMobile() {
    return window.innerWidth <= 1200;
  }

  function closeOtherMenu() {
    if (isMobile()) {
      if (documentElement.classList.contains('menu-open')) {
        documentElement.classList.remove('menu-open');
      }
    }
  }

  function handleClick(event) {
    event.stopPropagation();
    event.preventDefault();

    closeOtherMenu();

    if (documentElement.classList.contains('open-notifications')) {
      documentElement.classList.remove('open-notifications');
    } else {
      documentElement.classList.add('open-notifications');
    }
  }

  function handleMouseEnter() {
    documentElement.classList.add('open-notifications');
  }

  function handleMouseLeave() {
    documentElement.classList.remove('open-notifications');
  }

  function handleClickOutside(event) {
    const notifications = document.querySelector('.header-notifications');
    if (notifications && !notifications.contains(event.target)) {
      documentElement.classList.remove('open-notifications');
    }
  }

  if (isDesktop()) {
    notificationIcon.addEventListener('mouseenter', handleMouseEnter);
    notificationIcon.addEventListener('mouseleave', handleMouseLeave);
  } else {
    notificationIcon.addEventListener('click', handleClick);
  }

  document.addEventListener('click', handleClickOutside);

  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (isDesktop()) {
        notificationIcon.removeEventListener('click', handleClick);
        notificationIcon.addEventListener('mouseenter', handleMouseEnter);
        notificationIcon.addEventListener('mouseleave', handleMouseLeave);
        documentElement.classList.remove('open-notifications');
      } else {
        notificationIcon.removeEventListener('mouseenter', handleMouseEnter);
        notificationIcon.removeEventListener('mouseleave', handleMouseLeave);
        notificationIcon.addEventListener('click', handleClick);
        documentElement.classList.remove('open-notifications');
      }

      if (documentElement.classList.contains('menu-open')) {
        documentElement.classList.remove('menu-open');
      }
    }, 250);
  });
}

const headerMenu = document.querySelector('.header-menu');

if (headerMenu) {
  const burger = document.querySelector('.header__burger');
  const menuButton = document.querySelector('.header-menu-button');
  const documentElement = document.documentElement;
  let isHoverActive = false;

  function isDesktop() {
    return window.innerWidth >= 1201;
  }

  function isMobile() {
    return window.innerWidth <= 1200;
  }

  function closeNotifications() {
    if (isMobile()) {
      if (documentElement.classList.contains('open-notifications')) {
        documentElement.classList.remove('open-notifications');
      }
    }
  }

  function onMouseEnter() {
    if (isDesktop()) {
      documentElement.classList.add('menu-open');
    }
  }

  function onMouseLeave() {
    if (isDesktop()) {
      documentElement.classList.remove('menu-open');
    }
  }

  function onBurgerClick(e) {
    if (isMobile()) {
      e.preventDefault();
      e.stopPropagation();

      if (documentElement.classList.contains('menu-open')) {
        documentElement.classList.remove('menu-open');
      } else {
        closeNotifications();
        documentElement.classList.add('menu-open');
      }
    }
  }

  function updateHandlers() {
    const menuButtons = document.querySelectorAll('.header-menu-button');
    if (!menuButtons.length) return;

    if (isDesktop() && !isHoverActive) {
      menuButtons.forEach(button => {
        button.addEventListener('mouseenter', onMouseEnter);
        button.addEventListener('mouseleave', onMouseLeave);
      });
      isHoverActive = true;
    } else if (isMobile() && isHoverActive) {
      menuButtons.forEach(button => {
        button.removeEventListener('mouseenter', onMouseEnter);
        button.removeEventListener('mouseleave', onMouseLeave);
      });
      documentElement.classList.remove('menu-open');
      isHoverActive = false;
    }
  }

  if (burger) {
    burger.addEventListener('click', onBurgerClick);
  }

  document.addEventListener('click', (e) => {
    if (isMobile()) {
      const isClickInsideMenu = headerMenu && headerMenu.contains(e.target);
      const isClickOnBurger = burger && burger.contains(e.target);

      if (!isClickInsideMenu && !isClickOnBurger) {
        documentElement.classList.remove('menu-open');
      }
    }
  });

  if (headerMenu) {
    const menuLinks = headerMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (isMobile()) {
          documentElement.classList.remove('menu-open');
        }
      });
    });

    headerMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  updateHandlers();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateHandlers();

      if (isMobile()) {
        if (documentElement.classList.contains('menu-open')) {
          documentElement.classList.remove('menu-open');
        }
        if (documentElement.classList.contains('open-notifications')) {
          documentElement.classList.remove('open-notifications');
        }
      } else if (isDesktop() && documentElement.classList.contains('menu-open')) {
        documentElement.classList.remove('menu-open');
      }
    }, 150);
  });
}

//========================================================================================================================================================

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

//========================================================================================================================================================

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

//========================================================================================================================================================

const cabinetDetailsButtons = document.querySelectorAll('.cabinet-details-descr__buttons');

if (cabinetDetailsButtons) {
  cabinetDetailsButtons.forEach(container => {
    const editButton = container.querySelector('.btn-edit-details');
    const checkMessage = container.querySelector('p');


    function simulateClick() {
      editButton.classList.add('disabled');

      if (checkMessage) {
        checkMessage.style.display = 'block';
      }

      setTimeout(() => {
        editButton.classList.remove('disabled');
        if (checkMessage) {
          checkMessage.style.display = 'none';
        }
      }, 3000);
    }

    editButton.addEventListener('click', function (e) {
      e.preventDefault();
      simulateClick();
    });
  });
}

//========================================================================================================================================================

//Попап
class Popup {
  constructor(options) {
    let config = {
      logging: true,
      init: true,
      attributeOpenButton: "data-popup",
      attributeCloseButton: "data-close",
      fixElementSelector: "[data-lp]",
      youtubeAttribute: "data-popup-youtube",
      youtubePlaceAttribute: "data-popup-youtube-place",
      setAutoplayYoutube: true,
      classes: {
        popup: "popup",
        popupContent: "popup__content",
        popupActive: "popup_show",
        bodyActive: "popup-show"
      },
      focusCatch: true,
      closeEsc: true,
      bodyLock: true,
      hashSettings: {
        goHash: true
      },
      on: {
        beforeOpen: function () { },
        afterOpen: function () { },
        beforeClose: function () { },
        afterClose: function () { }
      }
    };
    this.youTubeCode;
    this.isOpen = false;
    this.targetOpen = {
      selector: false,
      element: false
    };
    this.previousOpen = {
      selector: false,
      element: false
    };
    this.lastClosed = {
      selector: false,
      element: false
    };
    this._dataValue = false;
    this.hash = false;
    this._reopen = false;
    this._selectorOpen = false;
    this.lastFocusEl = false;
    this._focusEl = ["a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'];
    this.options = {
      ...config,
      ...options,
      classes: {
        ...config.classes,
        ...options?.classes
      },
      hashSettings: {
        ...config.hashSettings,
        ...options?.hashSettings
      },
      on: {
        ...config.on,
        ...options?.on
      }
    };
    this.bodyLock = false;
    this.previousMenuState = false;
    this.options.init ? this.initPopups() : null;
  }
  initPopups() {
    this.eventsPopup();
  }
  eventsPopup() {
    document.addEventListener("click", function (e) {
      const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
      if (buttonOpen) {
        e.preventDefault();
        this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
        this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
        if ("error" !== this._dataValue) {
          if (!this.isOpen) this.lastFocusEl = buttonOpen;
          this.targetOpen.selector = `${this._dataValue}`;
          this._selectorOpen = true;
          this.open();
          return;
        }
        return;
      }
      const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
      if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
    }.bind(this));
    document.addEventListener("keydown", function (e) {
      if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
      if (this.options.focusCatch && 9 == e.which && this.isOpen) {
        this._focusCatch(e);
        return;
      }
    }.bind(this));
    if (this.options.hashSettings.goHash) {
      window.addEventListener("hashchange", function () {
        if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
      }.bind(this));
      window.addEventListener("load", function () {
        if (window.location.hash) this._openToHash();
      }.bind(this));
    }
  }
  open(selectorValue) {
    if (bodyLockStatus) {
      this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
      if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
        this.targetOpen.selector = selectorValue;
        this._selectorOpen = true;
      }
      if (this.isOpen) {
        this._reopen = true;
        this.close();
      }
      if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
      if (!this._reopen) this.previousActiveElement = document.activeElement;
      this.targetOpen.element = document.querySelector(this.targetOpen.selector);
      if (this.targetOpen.element) {
        this.previousMenuState = document.documentElement.classList.contains('menu-open');
        if (this.previousMenuState) {
          if (typeof menuClose === 'function') {
            menuClose();
          } else {
            document.documentElement.classList.remove("menu-open");
            if (typeof bodyUnlock === 'function') bodyUnlock();
          }
        }
        if (this.youTubeCode) {
          const codeVideo = this.youTubeCode;
          const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
          const iframe = document.createElement("iframe");
          iframe.setAttribute("allowfullscreen", "");
          const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
          iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
          iframe.setAttribute("src", urlVideo);
          if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
          }
          this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
        }
        const videoElement = this.targetOpen.element.querySelector("video");
        if (videoElement) {
          videoElement.muted = true;
          videoElement.currentTime = 0;
          videoElement.play().catch((e => console.error("Autoplay error:", e)));
        }
        if (this.options.hashSettings.location) {
          this._getHash();
          this._setHash();
        }
        this.options.on.beforeOpen(this);
        document.dispatchEvent(new CustomEvent("beforePopupOpen", {
          detail: {
            popup: this
          }
        }));
        this.targetOpen.element.classList.add(this.options.classes.popupActive);
        document.documentElement.classList.add(this.options.classes.bodyActive);
        if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
        this.targetOpen.element.setAttribute("aria-hidden", "false");
        this.previousOpen.selector = this.targetOpen.selector;
        this.previousOpen.element = this.targetOpen.element;
        this._selectorOpen = false;
        this.isOpen = true;
        this.options.on.afterOpen(this);
        document.dispatchEvent(new CustomEvent("afterPopupOpen", {
          detail: {
            popup: this
          }
        }));
      }
    }
  }
  close(selectorValue) {
    if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
    if (!this.isOpen || !bodyLockStatus) return;
    this.options.on.beforeClose(this);
    document.dispatchEvent(new CustomEvent("beforePopupClose", {
      detail: {
        popup: this
      }
    }));
    if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
    this.previousOpen.element.classList.remove(this.options.classes.popupActive);
    const videoElement = this.previousOpen.element.querySelector("video");
    if (videoElement) videoElement.pause();
    this.previousOpen.element.setAttribute("aria-hidden", "true");
    if (!this._reopen) {
      document.documentElement.classList.remove(this.options.classes.bodyActive);
      !this.bodyLock ? bodyUnlock() : null;
      this.isOpen = false;
      if (this.previousMenuState) {
        if (typeof menuOpen === 'function') {
          menuOpen();
        } else {
          document.documentElement.classList.add("menu-open");
          if (typeof bodyLock === 'function') bodyLock();
        }
      }
    }
    document.dispatchEvent(new CustomEvent("afterPopupClose", {
      detail: {
        popup: this
      }
    }));
    this.options.on.afterClose(this);
  }
  _getHash() {
    if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
  }
  _openToHash() {
    let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
    const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
    if (buttons && classInHash) this.open(classInHash);
  }
  _setHash() {
    history.pushState("", "", this.hash);
  }
  _removeHash() {
    history.pushState("", "", window.location.href.split("#")[0]);
  }
  _focusCatch(e) {
    const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
    const focusArray = Array.prototype.slice.call(focusable);
    const focusedIndex = focusArray.indexOf(document.activeElement);
    if (e.shiftKey && 0 === focusedIndex) {
      focusArray[focusArray.length - 1].focus();
      e.preventDefault();
    }
    if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
      focusArray[0].focus();
      e.preventDefault();
    }
  }
}
modules_flsModules.popup = new Popup({});

function menuOpen() {
  bodyLock();
  document.documentElement.classList.add("menu-open");
}
function menuClose() {
  bodyUnlock();
  document.documentElement.classList.remove("menu-open");
}

//========================================================================================================================================================

const stepForm = document.querySelector('.popup-details-tabs__steps');

if (stepForm) {

  const steps = stepForm.querySelectorAll('.popup-details-tabs__step');
  const paginationTitles = document.querySelectorAll('.popup-details-pagination__title');
  const paginationBlock = document.querySelector('.popup-details-pagination');
  const navigation = document.querySelector('.popup-details-tabs__navigation');
  const popupTitleP = document.querySelector('.popup__titles p');

  const matchBtn = document.querySelector('.btn-match');
  const noMatchBtn = document.querySelector('.btn-nomatch');
  const actualAddressForm = document.querySelector('.step3 .form');

  const tabButtons = document.querySelectorAll('.popup-details-tabs__title');
  const tabBodies = document.querySelectorAll('.popup-details-tabs__body');

  function setPaginationVisibility(visible) {
    if (paginationBlock) {
      paginationBlock.style.display = visible ? 'grid' : 'none';
    }
  }

  function updatePopupTitleFromButton(button) {
    if (popupTitleP && button) {
      const buttonText = button.textContent.trim();
      popupTitleP.textContent = buttonText;
    }
  }

  function switchTab(index) {
    tabButtons.forEach(btn => {
      btn.classList.remove('_tab-active');
    });
    if (tabButtons[index]) {
      tabButtons[index].classList.add('_tab-active');
    }

    tabBodies.forEach(body => {
      body.style.display = 'none';
    });
    if (tabBodies[index]) {
      tabBodies[index].style.display = 'block';
    }

    updatePopupTitleFromButton(tabButtons[index]);

    if (index !== 0) {
      setPaginationVisibility(false);
    } else {
      setPaginationVisibility(true);
      const currentStepIndex = getCurrentStepIndex();
      updatePopupTitleText(currentStepIndex);
    }
  }

  function updatePopupTitleText(currentIndex) {
    if (popupTitleP && paginationTitles[currentIndex]) {
      const span = paginationTitles[currentIndex].querySelector('span');
      if (span) {
        let text = span.textContent.trim();
        if (paginationBlock && paginationBlock.style.display !== 'none') {
          popupTitleP.textContent = text;
        }
      }
    }
  }

  function toggleNavigationVisibility(currentIndex) {
    if (navigation) {
      if (currentIndex === 0) {
        navigation.style.display = 'grid';
      } else {
        navigation.style.display = 'none';
      }
    }
  }

  function setAddressFormVisible(visible) {
    if (actualAddressForm) {
      actualAddressForm.style.display = visible ? 'flex' : 'none';
    }
  }

  function setMatchActive(isMatch) {
    if (isMatch) {
      if (matchBtn) matchBtn.classList.add('active');
      if (noMatchBtn) noMatchBtn.classList.remove('active');
      setAddressFormVisible(false);
    } else {
      if (noMatchBtn) noMatchBtn.classList.add('active');
      if (matchBtn) matchBtn.classList.remove('active');
      setAddressFormVisible(true);
    }
  }

  if (matchBtn) {
    matchBtn.addEventListener('click', function (e) {
      e.preventDefault();
      setMatchActive(true);
    });
  }

  if (noMatchBtn) {
    noMatchBtn.addEventListener('click', function (e) {
      e.preventDefault();
      setMatchActive(false);
    });
  }

  function getCurrentStepIndex() {
    for (let i = 0; i < steps.length; i++) {
      if (steps[i].classList.contains('active')) {
        return i;
      }
    }
    return 0;
  }

  function updatePagination(currentIndex) {
    for (let i = 0; i <= currentIndex; i++) {
      if (paginationTitles[i]) {
        paginationTitles[i].classList.add('active');
      }
    }

    for (let i = currentIndex + 1; i < paginationTitles.length; i++) {
      if (paginationTitles[i]) {
        paginationTitles[i].classList.remove('active');
      }
    }
  }

  function updateStep(index) {
    steps.forEach(step => {
      step.classList.remove('active');
    });

    if (steps[index]) {
      steps[index].classList.add('active');
    }

    updatePagination(index);
    toggleNavigationVisibility(index);
    updatePopupTitleText(index);

    if (index === 2) {
      const isMatchActiveNow = matchBtn && matchBtn.classList.contains('active');
      if (matchBtn && !matchBtn.classList.contains('active') && noMatchBtn && !noMatchBtn.classList.contains('active')) {
        setMatchActive(true);
      } else {
        setMatchActive(isMatchActiveNow !== false);
      }
    }
  }

  function nextStep() {
    let currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1) {
      updateStep(currentIndex + 1);
    }
  }

  function prevStep() {
    let currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      updateStep(currentIndex - 1);
    }
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('.btn-details-next')) {
      e.preventDefault();
      nextStep();
    }
    if (e.target.closest('.btn-details-prev')) {
      e.preventDefault();
      prevStep();
    }
  });

  tabButtons.forEach((btn, idx) => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      switchTab(idx);
    });
  });

  const activeStepIndex = getCurrentStepIndex();

  const activeTabIndex = 0;

  updatePagination(activeStepIndex);
  toggleNavigationVisibility(activeStepIndex);
  updatePopupTitleText(activeStepIndex);

  tabBodies.forEach((body, idx) => {
    body.style.display = idx === activeTabIndex ? 'block' : 'none';
  });

  setPaginationVisibility(true);

  if (popupTitleP && paginationTitles[activeStepIndex]) {
    const span = paginationTitles[activeStepIndex].querySelector('span');
    if (span) {
      popupTitleP.textContent = span.textContent.trim();
    }
  }

  if (activeStepIndex === 2) {
    if (noMatchBtn && noMatchBtn.classList.contains('active')) {
      setAddressFormVisible(true);
    } else {
      if (matchBtn && !matchBtn.classList.contains('active')) {
        setMatchActive(true);
      }
    }
  }
}

//========================================================================================================================================================

//Форма
function formFieldsInit(options = { viewPass: true, autoHeight: false }) {
  document.body.addEventListener("focusin", function (e) {
    const targetElement = e.target;
    if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
      if (!targetElement.hasAttribute('data-no-focus-classes')) {
        targetElement.classList.add('_form-focus');
        targetElement.parentElement.classList.add('_form-focus');
      }
      formValidate.removeError(targetElement);
      targetElement.hasAttribute('data-validate') ? formValidate.removeError(targetElement) : null;
    }
  });
  document.body.addEventListener("focusout", function (e) {
    const targetElement = e.target;
    if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
      if (!targetElement.hasAttribute('data-no-focus-classes')) {
        targetElement.classList.remove('_form-focus');
        targetElement.parentElement.classList.remove('_form-focus');
      }
      targetElement.hasAttribute('data-validate') ? formValidate.validateInput(targetElement) : null;
    }
  });
  if (options.viewPass) {
    document.addEventListener("click", function (e) {
      const targetElement = e.target;
      if (targetElement.closest('.form__viewpass')) {
        const viewpassBlock = targetElement.closest('.form__viewpass');
        const input = viewpassBlock.closest('.form__input').querySelector('input');

        if (input) {
          const isActive = viewpassBlock.classList.contains('_viewpass-active');
          input.setAttribute("type", isActive ? "password" : "text");
          viewpassBlock.classList.toggle('_viewpass-active');
        } else {
          console.error('Input не найден!');
        }
      }
    });
  }
  if (options.autoHeight) {
    const textareas = document.querySelectorAll('textarea[data-autoheight]');
    if (textareas.length) {
      textareas.forEach(textarea => {
        const startHeight = textarea.hasAttribute('data-autoheight-min') ?
          Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
        const maxHeight = textarea.hasAttribute('data-autoheight-max') ?
          Number(textarea.dataset.autoheightMax) : Infinity;
        setHeight(textarea, Math.min(startHeight, maxHeight))
        textarea.addEventListener('input', () => {
          if (textarea.scrollHeight > startHeight) {
            textarea.style.height = `auto`;
            setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
          }
        });
      });
      function setHeight(textarea, height) {
        textarea.style.height = `${height}px`;
      }
    }
  }
}
formFieldsInit({
  viewPass: true,
  autoHeight: false
});

let formValidate = {
  getErrors(form) {
    let error = 0;
    let formRequiredItems = form.querySelectorAll('*[data-required]');
    if (formRequiredItems.length) {
      formRequiredItems.forEach(formRequiredItem => {
        if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {
          error += this.validateInput(formRequiredItem);
        }
      });
    }
    return error;
  },
  validateInput(formRequiredItem) {
    let error = 0;

    if (formRequiredItem.dataset.required === "email") {
      formRequiredItem.value = formRequiredItem.value.replace(" ", "");
      if (this.emailTest(formRequiredItem)) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
      this.addError(formRequiredItem);
      this.removeSuccess(formRequiredItem);
      error++;
    } else if (formRequiredItem.dataset.validate === "password-confirm") {
      const passwordInput = document.getElementById('password');
      if (!passwordInput) return error;

      if (formRequiredItem.value !== passwordInput.value) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    } else {
      if (!formRequiredItem.value.trim()) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    }

    return error;
  },
  addError(formRequiredItem) {
    formRequiredItem.classList.add('_form-error');
    formRequiredItem.parentElement.classList.add('_form-error');
    let inputError = formRequiredItem.parentElement.querySelector('.form__error');
    if (inputError) formRequiredItem.parentElement.removeChild(inputError);
    if (formRequiredItem.dataset.error) {
      formRequiredItem.parentElement.insertAdjacentHTML('beforeend', `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
    }
  },
  removeError(formRequiredItem) {
    formRequiredItem.classList.remove('_form-error');
    formRequiredItem.parentElement.classList.remove('_form-error');
    if (formRequiredItem.parentElement.querySelector('.form__error')) {
      formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector('.form__error'));
    }
  },
  addSuccess(formRequiredItem) {
    formRequiredItem.classList.add('_form-success');
    formRequiredItem.parentElement.classList.add('_form-success');
  },
  removeSuccess(formRequiredItem) {
    formRequiredItem.classList.remove('_form-success');
    formRequiredItem.parentElement.classList.remove('_form-success');
  },
  formClean(form) {
    form.reset();
    setTimeout(() => {
      let inputs = form.querySelectorAll('input,textarea');
      for (let index = 0; index < inputs.length; index++) {
        const el = inputs[index];
        el.parentElement.classList.remove('_form-focus');
        el.classList.remove('_form-focus');

        el.classList.remove('_form-success');
        el.parentElement.classList.remove('_form-success');

        el.parentElement.classList.remove('filled');

        formValidate.removeError(el);

        if (el.classList.contains('telephone') && el.clearFilled) {
          el.clearFilled();
        }
      }

      let checkboxes = form.querySelectorAll('.checkbox__input');
      if (checkboxes.length > 0) {
        for (let index = 0; index < checkboxes.length; index++) {
          const checkbox = checkboxes[index];
          checkbox.checked = false;
          checkbox.classList.remove('_form-success');
          checkbox.closest('.checkbox')?.classList.remove('_form-success');
        }
      }

      if (modules_flsModules.select) {
        let selects = form.querySelectorAll('div.select');
        if (selects.length) {
          for (let index = 0; index < selects.length; index++) {
            const select = selects[index].querySelector('select');
            modules_flsModules.select.selectBuild(select);
          }
        }
      }
    }, 0);
  },
  emailTest(formRequiredItem) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
  }
};

function formSubmit() {
  const forms = document.forms;
  if (forms.length) {
    for (const form of forms) {
      form.addEventListener('submit', function (e) {
        const form = e.target;
        formSubmitAction(form, e);
      });
      form.addEventListener('reset', function (e) {
        const form = e.target;
        formValidate.formClean(form);
      });
    }
  }
  async function formSubmitAction(form, e) {
    const error = !form.hasAttribute('data-no-validate') ? formValidate.getErrors(form) : 0;
    if (error === 0) {
      const ajax = form.hasAttribute('data-ajax');
      if (ajax) {
        e.preventDefault();
        const formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
        const formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
        const formData = new FormData(form);

        form.classList.add('_sending');
        const response = await fetch(formAction, {
          method: formMethod,
          body: formData
        });
        if (response.ok) {
          let responseResult = await response.json();
          form.classList.remove('_sending');
          formSent(form, responseResult);
        } else {
          alert("Помилка");
          form.classList.remove('_sending');
        }
      } else if (form.hasAttribute('data-dev')) {
        e.preventDefault();
        formSent(form);
      }
    } else {
      e.preventDefault();
      if (form.querySelector('._form-error') && form.hasAttribute('data-goto-error')) {
        const formGoToErrorClass = form.dataset.gotoError ? form.dataset.gotoError : '._form-error';
        gotoBlock(formGoToErrorClass, true, 1000);
      }
    }
  }
  function formSent(form, responseResult = ``) {
    document.dispatchEvent(new CustomEvent("formSent", {
      detail: {
        form: form
      }
    }));

    const telephoneInputs = form.querySelectorAll('.telephone');
    telephoneInputs.forEach(input => {
      const parent = input.closest('.form__input');
      if (parent) {
        parent.classList.remove('filled');
      }
    });

    setTimeout(() => {
      if (modules_flsModules.popup) {
        const popup = form.dataset.popupMessage;
        popup ? modules_flsModules.popup.open(popup) : null;
      }
    }, 0);

    formValidate.formClean(form);
  }
}
formSubmit();

//========================================================================================================================================================

const databasesЕitles = document.querySelectorAll('.cabinet-databases-bottom__titles');
if (databasesЕitles) {
  databasesЕitles.forEach(title => {
    title.addEventListener('click', function (e) {
      e.stopPropagation();
      const parent = this.parentElement;
      if (parent) {
        parent.classList.toggle('active');
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.cabinet-databases-bottom__titles')) {
      document.querySelectorAll('.cabinet-databases-bottom__main.active, .cabinet-databases-bottom__more.active').forEach(item => {
        item.classList.remove('active');
      });
    }
  });
}