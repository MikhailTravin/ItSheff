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
  function getMinValue(quantityElement, currentValue) {
    if (quantityElement.dataset.quantityMin !== undefined) {
      return +quantityElement.dataset.quantityMin;
    }
    return currentValue;
  }

  function updateButtonsState(quantityElement) {
    const valueElement = quantityElement.querySelector('[data-quantity-value]');
    const plusButton = quantityElement.querySelector('[data-quantity-plus]');
    const minusButton = quantityElement.querySelector('[data-quantity-minus]');

    if (!valueElement) return;

    const value = parseInt(valueElement.value) || 0;
    const min = getMinValue(quantityElement, value);
    const max = quantityElement.dataset.quantityMax ? +quantityElement.dataset.quantityMax : null;

    if (value <= min) {
      minusButton?.classList.add('disabled');
    } else {
      minusButton?.classList.remove('disabled');
    }

    if (max !== null && value >= max) {
      plusButton?.classList.add('disabled');
    } else {
      plusButton?.classList.remove('disabled');
    }
  }

  function initAllQuantity() {
    document.querySelectorAll('[data-quantity]').forEach(quantityElement => {
      updateButtonsState(quantityElement);
    });
  }

  document.addEventListener("click", function (e) {
    let targetElement = e.target;
    const plusBtn = targetElement.closest('[data-quantity-plus]');
    const minusBtn = targetElement.closest('[data-quantity-minus]');

    if (plusBtn || minusBtn) {
      if ((plusBtn && plusBtn.classList.contains('disabled')) ||
        (minusBtn && minusBtn.classList.contains('disabled'))) {
        e.preventDefault();
        return;
      }

      const quantityElement = targetElement.closest('[data-quantity]');
      const valueElement = quantityElement.querySelector('[data-quantity-value]');
      let value = parseInt(valueElement.value) || 0;

      if (plusBtn) {
        value++;
        if (quantityElement.dataset.quantityMax && +quantityElement.dataset.quantityMax < value) {
          value = +quantityElement.dataset.quantityMax;
        }
      } else if (minusBtn) {
        value--;
        const currentMin = getMinValue(quantityElement, value + 1);
        if (value < currentMin) {
          value = currentMin;
        }
      }

      valueElement.value = value;
      updateButtonsState(quantityElement);
    }
  });

  initAllQuantity();
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
      attributeBtnButton: "data-btn",
      fixElementSelector: "[data-lp]",
      youtubeAttribute: "data-popup-youtube",
      youtubePlaceAttribute: "data-popup-youtube-place",
      setAutoplayYoutube: true,
      classes: {
        popup: "popup",
        popupContent: "popup__content",
        popupActive: "popup_show",
        bodyActive: "popup-show",
        btnSentOpen: "btn-sent-open"
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
    this._popupToOpenOnOutsideClick = null;
    this._currentPopupSelector = null;
    this._closing = false;
    this.currentBtnSentElement = null;
    this.btnSentTimeout = null;
    this.btnSentRemainingTime = null;
    this.btnSentStartTime = null;
    this._btnSentMouseEnter = null;
    this._btnSentMouseLeave = null;
    this.btnSentAnimationTimeout = null;
    this.btnSentHideTimeouts = {};
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
        this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton);
        if (this._dataValue && "error" !== this._dataValue) {
          if (!this.isOpen) this.lastFocusEl = buttonOpen;
          this.targetOpen.selector = this._dataValue;
          this._selectorOpen = true;
          this.open();
          return;
        }
        return;
      }
    }.bind(this));

    document.addEventListener("click", function (e) {
      const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
      if (buttonClose && !buttonClose.hasAttribute(this.options.attributeOpenButton)) {
        e.preventDefault();
        this.close();
        return;
      }
    }.bind(this));

    document.addEventListener("click", function (e) {
      const btnButton = e.target.closest(`[${this.options.attributeBtnButton}]`);
      if (btnButton) {
        e.preventDefault();
        const btnValue = btnButton.getAttribute(this.options.attributeBtnButton);
        if (btnValue && btnValue !== "") {
          let targetElement = document.querySelector(btnValue);
          if (targetElement) {
            if (this.currentBtnSentElement && this.currentBtnSentElement !== targetElement) {
              this.hideBtnSentWithAnimation(this.currentBtnSentElement);
            }
            this.currentBtnSentElement = targetElement;
            setTimeout(() => {
              this.showBtnSentWithAnimation(targetElement);
              this.startBtnSentTimer(5000);
              this.setupBtnSentHoverHandlers(targetElement);
            }, 500);
          }
        }
        setTimeout(function () {
          if (this.isOpen) {
            this.close();
          }
        }.bind(this), 100);
      }
    }.bind(this));

    document.addEventListener("click", function (e) {
      const popupElement = e.target.closest(`.${this.options.classes.popup}`);
      if (popupElement && popupElement.classList.contains(this.options.classes.popupActive)) {
        const popupContent = popupElement.querySelector(`.${this.options.classes.popupContent}`);
        const isClickOnContent = popupContent && (e.target === popupContent || popupContent.contains(e.target));
        const isClickOnPopup = e.target === popupElement || e.target.closest('.popup') === popupElement;
        if (!isClickOnContent && isClickOnPopup) {
          e.preventDefault();
          e.stopPropagation();
          if (this._popupToOpenOnOutsideClick) {
            const popupToOpen = this._popupToOpenOnOutsideClick;
            this._popupToOpenOnOutsideClick = null;
            this.close();
            setTimeout(function () {
              this.targetOpen.selector = popupToOpen;
              this._selectorOpen = true;
              this.open();
            }.bind(this), 100);
          } else {
            this.close();
          }
        }
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
        if (window.location.hash) this._openToHash();
        else this.close(this.targetOpen.selector);
      }.bind(this));
      window.addEventListener("load", function () {
        if (window.location.hash) this._openToHash();
      }.bind(this));
    }
  }

  getBtnSentDirection(element) {
    if (!element) return 'bottom';
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementCenter = rect.top + rect.height / 2;
    if (elementCenter < windowHeight / 2) {
      return 'top';
    }
    return 'bottom';
  }

  showBtnSentWithAnimation(element) {
    if (this.btnSentAnimationTimeout) {
      clearTimeout(this.btnSentAnimationTimeout);
      this.btnSentAnimationTimeout = null;
    }
    const elementId = element.getAttribute('id') || element.getAttribute('data-id');
    if (elementId && this.btnSentHideTimeouts[elementId]) {
      clearTimeout(this.btnSentHideTimeouts[elementId]);
      delete this.btnSentHideTimeouts[elementId];
    }
    element.style.display = 'flex';
    element.style.transition = 'none';
    element.style.opacity = '0';
    const direction = this.getBtnSentDirection(element);
    if (direction === 'bottom') {
      element.style.transform = 'translateY(24px)';
    } else {
      element.style.transform = 'translateY(-24px)';
    }
    element.classList.add(this.options.classes.btnSentOpen);
    element.offsetHeight;
    this.btnSentAnimationTimeout = setTimeout(() => {
      element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
      this.btnSentAnimationTimeout = null;
    }, 10);
  }

  hideBtnSentWithAnimation(element) {
    if (this.btnSentAnimationTimeout) {
      clearTimeout(this.btnSentAnimationTimeout);
      this.btnSentAnimationTimeout = null;
    }
    element.style.transition = 'opacity 0.5s ease';
    element.style.opacity = '0';
    const elementId = element.getAttribute('id') || element.getAttribute('data-id');
    if (elementId) {
      this.btnSentHideTimeouts[elementId] = setTimeout(() => {
        if (!element.classList.contains(this.options.classes.btnSentOpen) || element.style.opacity === '0') {
          element.classList.remove(this.options.classes.btnSentOpen);
          element.style.display = 'none';
          element.style.transition = 'none';
          element.style.opacity = '';
          element.style.transform = '';
          delete this.btnSentHideTimeouts[elementId];
        }
      }, 500);
    } else {
      setTimeout(() => {
        element.classList.remove(this.options.classes.btnSentOpen);
        element.style.display = 'none';
        element.style.transition = 'none';
        element.style.opacity = '';
        element.style.transform = '';
      }, 500);
    }
  }

  startBtnSentTimer(duration) {
    if (this.btnSentTimeout) {
      clearTimeout(this.btnSentTimeout);
    }
    this.btnSentStartTime = Date.now();
    this.btnSentRemainingTime = duration;
    this.btnSentTimeout = setTimeout(() => {
      this.hideBtnSent();
    }, duration);
  }

  pauseBtnSentTimer() {
    if (this.btnSentTimeout && this.btnSentRemainingTime > 0) {
      clearTimeout(this.btnSentTimeout);
      this.btnSentTimeout = null;
      const elapsed = Date.now() - this.btnSentStartTime;
      this.btnSentRemainingTime = Math.max(0, this.btnSentRemainingTime - elapsed);
    }
  }

  resumeBtnSentTimer() {
    if (this.currentBtnSentElement && this.btnSentRemainingTime > 0) {
      this.btnSentStartTime = Date.now();
      this.btnSentTimeout = setTimeout(() => {
        this.hideBtnSent();
      }, this.btnSentRemainingTime);
    }
  }

  stopBtnSentTimer() {
    if (this.btnSentTimeout) {
      clearTimeout(this.btnSentTimeout);
      this.btnSentTimeout = null;
    }
    this.btnSentRemainingTime = null;
    this.btnSentStartTime = null;
  }

  hideBtnSent() {
    if (this.currentBtnSentElement) {
      this.hideBtnSentWithAnimation(this.currentBtnSentElement);
      const elementToClear = this.currentBtnSentElement;
      this.currentBtnSentElement = null;
      this.stopBtnSentTimer();
      setTimeout(() => {
        if (elementToClear && !elementToClear.classList.contains(this.options.classes.btnSentOpen)) {
          elementToClear.style.transition = '';
          elementToClear.style.opacity = '';
          elementToClear.style.transform = '';
        }
      }, 550);
    }
  }

  setupBtnSentHoverHandlers(element) {
    element.removeEventListener('mouseenter', this._btnSentMouseEnter);
    element.removeEventListener('mouseleave', this._btnSentMouseLeave);
    this._btnSentMouseEnter = () => {
      this.pauseBtnSentTimer();
    };
    this._btnSentMouseLeave = () => {
      this.resumeBtnSentTimer();
    };
    element.addEventListener('mouseenter', this._btnSentMouseEnter);
    element.addEventListener('mouseleave', this._btnSentMouseLeave);
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
        this._currentPopupSelector = this.targetOpen.selector;
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
        if (!this._reopen) !this.bodyLock ? bodyLock() : null;
        else this._reopen = false;
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
    if (this.youTubeCode) {
      if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
      }
    }
    this.previousOpen.element.classList.remove(this.options.classes.popupActive);
    const videoElement = this.previousOpen.element.querySelector("video");
    if (videoElement) videoElement.pause();
    this.previousOpen.element.setAttribute("aria-hidden", "true");
    if (!this._reopen) {
      document.documentElement.classList.remove(this.options.classes.bodyActive);
      !this.bodyLock ? bodyUnlock() : null;
      this.isOpen = false;
      this._currentPopupSelector = null;
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
    this._closing = false;
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

function menuOpen() {
  bodyLock();
  document.documentElement.classList.add("menu-open");
}

function menuClose() {
  bodyUnlock();
  document.documentElement.classList.remove("menu-open");
}

function CabinetMenus() {
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', CabinetMenus);
} else {
  CabinetMenus();
}

modules_flsModules.popup = new Popup({});

document.addEventListener('click', function (e) {
  const openButton = e.target.closest('[data-popup]');
  if (openButton && modules_flsModules.popup) {
    e.preventDefault();
    const selector = openButton.getAttribute('data-popup');
    if (selector && selector !== 'error') {
      if (!modules_flsModules.popup.isOpen) {
        modules_flsModules.popup.lastFocusEl = openButton;
      }
      modules_flsModules.popup.targetOpen.selector = selector;
      modules_flsModules.popup._selectorOpen = true;
      modules_flsModules.popup.open();
    }
    return;
  }

  const closeButton = e.target.closest('[data-close]');
  if (closeButton && !closeButton.hasAttribute('data-popup') && modules_flsModules.popup && modules_flsModules.popup.isOpen) {
    e.preventDefault();
    modules_flsModules.popup.close();
    return;
  }
}, true);

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

//Маска
const telephone = document.querySelectorAll('.telephone');
if (telephone) {
  Inputmask({
    "mask": "+7 (999) 999 - 99 - 99",
    "showMaskOnHover": false,
  }).mask(telephone);
}

//Маска
const inputTimer = document.querySelectorAll('.input-timer');
if (inputTimer) {
  Inputmask({
    "mask": "99 : 99",
    "showMaskOnHover": false,
  }).mask(inputTimer);
}

//Маска
const inputCalendar = document.querySelectorAll('.input-calendar');
if (inputCalendar) {
  Inputmask({
    "mask": "99 / 99 / 9999",
    "showMaskOnHover": false,
  }).mask(inputCalendar);
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
        const parentContainer = viewpassBlock.closest('.form__input'); // Получаем родителя

        if (input) {
          const isActive = viewpassBlock.classList.contains('_viewpass-active');
          input.setAttribute("type", isActive ? "password" : "text");
          viewpassBlock.classList.toggle('_viewpass-active');

          if (parentContainer) {
            parentContainer.classList.toggle('_viewpass-active');
          }
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

//Звездный рейтинг
function formRating() {
  const ratings = document.querySelectorAll('[data-rating]');

  ratings.forEach(rating => {
    const ratingValue = +rating.dataset.ratingValue || 0;
    const ratingSize = +rating.dataset.ratingSize || 5;
    const isSet = rating.dataset.rating === 'set';

    formRatingInit(rating, ratingSize);
    formRatingSet(rating, ratingValue);

    if (isSet && ratingValue > 0) {
      const textContainer = rating.closest('.popup-other-rating')?.querySelector('.popup-other-rating__text');
      if (textContainer) {
        textContainer.classList.add('active');
        updateRatingText(textContainer, ratingValue);
      }
    }
  });

  document.addEventListener('click', formRatingAction);

  function formRatingAction(e) {
    const targetElement = e.target.closest('.rating__input');
    if (!targetElement) return;

    const ratingValue = +targetElement.value;
    const rating = targetElement.closest('.rating');
    const isSet = rating.dataset.rating === 'set';

    if (isSet) {
      formRatingSet(rating, ratingValue);

      const textContainer = rating.closest('.popup-other-rating')?.querySelector('.popup-other-rating__text');
      if (textContainer) {
        textContainer.classList.add('active');
        updateRatingText(textContainer, ratingValue);
      }
    }
  }

  function formRatingInit(rating, ratingSize) {
    let ratingItems = `<div class="rating__items">`;
    for (let index = 0; index < ratingSize; index++) {
      ratingItems += `
        <label class="rating__item">
          <input class="rating__input" type="radio" name="rating" value="${index + 1}">
        </label>`;
    }
    ratingItems += `</div>`;
    rating.insertAdjacentHTML("beforeend", ratingItems);
  }

  function formRatingSet(rating, value) {
    const ratingItems = rating.querySelectorAll('.rating__item');
    const resultFullItems = parseInt(value);
    const resultPartItem = value - resultFullItems;

    const radioInputs = rating.querySelectorAll('.rating__input');
    radioInputs.forEach((input, idx) => {
      if (idx + 1 === Math.ceil(value)) {
        input.checked = true;
      } else {
        input.checked = false;
      }
    });

    ratingItems.forEach((ratingItem, index) => {
      ratingItem.classList.remove('rating__item--active');
      ratingItem.querySelector('span')?.remove();

      if (index <= (resultFullItems - 1)) {
        ratingItem.classList.add('rating__item--active');
      }
      if (index === resultFullItems && resultPartItem) {
        ratingItem.insertAdjacentHTML("beforeend", `<span style="width:${resultPartItem * 100}%"></span>`);
      }
    });
  }

  function updateRatingText(textContainer, ratingValue) {
    const ratingTexts = {
      1: 'Очень плохо',
      2: 'Посредственно',
      3: 'Удовлетворительно',
      4: 'Хорошо',
      5: 'Отлично'
    };

    textContainer.textContent = ratingTexts[ratingValue] || 'Оценка';
  }
}

formRating();

//========================================================================================================================================================

class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.recordingStartTime = null;
    this.timerInterval = null;
    this.onStopCallback = null;
  }

  async startRecording() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioFile = this.createAudioFile();
        if (this.onStopCallback) {
          this.onStopCallback(audioFile);
        }
      };

      this.mediaRecorder.start(100);
      this.recordingStartTime = Date.now();
      this.startTimer();

      return true;
    } catch (error) {
      console.error('Ошибка доступа к микрофону:', error);
      alert('Не удалось получить доступ к микрофону. Пожалуйста, проверьте разрешения.');
      return false;
    }
  }

  startTimer() {
    const timeElement = document.querySelector('.recording-time');
    if (timeElement && this.timerInterval === null) {
      this.timerInterval = setInterval(() => {
        if (this.recordingStartTime) {
          const elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
          const minutes = Math.floor(elapsed / 60);
          const seconds = elapsed % 60;
          timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
      }, 1000);
    }
  }

  stopRecording() {
    return new Promise((resolve) => {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        const originalCallback = this.onStopCallback;
        this.onStopCallback = (audioFile) => {
          if (originalCallback) originalCallback(audioFile);
          resolve(audioFile);
        };

        this.mediaRecorder.stop();

        if (this.timerInterval) {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
        }

        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = null;
        }
      } else {
        resolve(null);
      }
    });
  }

  createAudioFile() {
    const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
    const audioFile = new File([audioBlob], `recording_${Date.now()}.webm`, {
      type: 'audio/webm',
      lastModified: Date.now()
    });
    return audioFile;
  }

  setOnStopCallback(callback) {
    this.onStopCallback = callback;
  }
}

function initFileUploaders() {
  const formTextarea = document.querySelectorAll('.form-textarea__bottom');

  formTextarea.forEach(container => {
    const resultsContainer = container.querySelector('.form-textarea__results');
    const audioRecordBtn = container.querySelector('.audio-record .record-button');
    const recordingIndicator = container.querySelector('.recording-indicator');
    const stopRecordingBtn = container.querySelector('.stop-recording');
    const fileInput = container.querySelector('.file-input input[type="file"]');

    if (!resultsContainer) return;

    const recorder = new AudioRecorder();
    let isRecording = false;

    function updateResultsActive() {
      if (resultsContainer.children.length > 0) {
        resultsContainer.classList.add('active');
      } else {
        resultsContainer.classList.remove('active');
      }
    }

    function animateTitle(titleElement, closeElement) {
      if (!titleElement) return;

      if (closeElement) {
        closeElement.style.opacity = '0';
        closeElement.style.pointerEvents = 'none';
      }

      titleElement.classList.add('active');

      setTimeout(() => {
        titleElement.classList.remove('active');

        if (closeElement) {
          closeElement.style.opacity = '1';
          closeElement.style.pointerEvents = 'auto';
        }
      }, 5000);
    }

    function createFileBlock(file, type) {
      const resultDiv = document.createElement('div');
      resultDiv.className = 'form-textarea__result';

      let iconHtml = '';
      if (type === 'audio') {
        iconHtml = `
                    <svg aria-hidden="true" width="10" height="15">
                        <use xlink:href="img/sprite.svg#mic-voice"></use>
                    </svg>
                `;
      } else {
        iconHtml = `
                    <svg aria-hidden="true" width="14" height="16">
                        <use xlink:href="img/sprite.svg#documents"></use>
                    </svg>
                `;
      }

      const closeHtml = `
                <svg aria-hidden="true" width="10" height="10">
                    <use xlink:href="img/sprite.svg#close"></use>
                </svg>
            `;

      resultDiv.innerHTML = `
                <div class="form-textarea__titles">
                    <div class="form-textarea__icon">
                        ${iconHtml}
                    </div>
                    <div class="form-textarea__title">
                        <span class="text">${escapeHtml(file.name)}</span>
                        <div class="line">
                            <span></span>
                        </div>
                    </div>
                </div>
                <div class="form-textarea__close" style="opacity: 0; pointer-events: none; transition: opacity 0.3s ease;">
                    ${closeHtml}
                </div>
            `;

      const titleDiv = resultDiv.querySelector('.form-textarea__title');
      const closeDiv = resultDiv.querySelector('.form-textarea__close');

      if (closeDiv) {
        closeDiv.addEventListener('click', () => {
          resultDiv.remove();
          updateResultsActive();
        });
      }

      return { resultDiv, titleDiv, closeDiv };
    }

    function addAudioFile(audioFile) {
      if (!audioFile) return;
      const { resultDiv, titleDiv, closeDiv } = createFileBlock(audioFile, 'audio');
      resultsContainer.appendChild(resultDiv);
      animateTitle(titleDiv, closeDiv);
      updateResultsActive();
    }

    function escapeHtml(str) {
      return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
      });
    }

    recorder.setOnStopCallback((audioFile) => {
      addAudioFile(audioFile);
      if (audioRecordBtn && recordingIndicator) {
        audioRecordBtn.style.display = 'flex';
        recordingIndicator.style.display = 'none';
      }
      isRecording = false;
    });

    if (audioRecordBtn && recordingIndicator) {
      audioRecordBtn.addEventListener('click', async () => {
        if (isRecording) return;

        audioRecordBtn.style.display = 'none';
        recordingIndicator.style.display = 'flex';

        const timeElement = container.querySelector('.recording-time');
        if (timeElement) timeElement.textContent = '00:00';

        const started = await recorder.startRecording();
        if (started) {
          isRecording = true;
        } else {
          audioRecordBtn.style.display = 'flex';
          recordingIndicator.style.display = 'none';
        }
      });
    }

    if (stopRecordingBtn) {
      stopRecordingBtn.addEventListener('click', async () => {
        if (isRecording) {
          await recorder.stopRecording();
        }
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
          const { resultDiv, titleDiv, closeDiv } = createFileBlock(file, 'document');
          resultsContainer.appendChild(resultDiv);
          animateTitle(titleDiv, closeDiv);
        });
        updateResultsActive();
        fileInput.value = '';
      });
    }

    updateResultsActive();
  });
}
initFileUploaders();

//========================================================================================================================================================

const titlesList = document.querySelectorAll('.form-select__titles');

if (titlesList) {
  function updateSelectedCountry(selectContainer, selectedCountryCode, selectedFlagSrc, selectedCountryName, mask) {
    const phoneInput = selectContainer.querySelector('.form-select__value input');
    let currentPhoneNumber = phoneInput ? phoneInput.value : '';

    const flagImg = selectContainer.querySelector('.form-select__titles img');
    if (flagImg && selectedFlagSrc) {
      flagImg.src = selectedFlagSrc;
      flagImg.alt = selectedCountryName;
    }

    const countryCodeSpan = selectContainer.querySelector('.form-select__value span');
    if (countryCodeSpan && selectedCountryCode) {
      countryCodeSpan.textContent = selectedCountryCode;
    }

    const titlesSpan = selectContainer.querySelector('.form-select__titles span:not(.form-select__arrow)');
    const hasValueSpan = selectContainer.querySelector('.form-select__value span');

    if (!hasValueSpan && titlesSpan && selectedCountryName) {
      titlesSpan.textContent = selectedCountryName;
    }

    if (phoneInput) {
      if (currentPhoneNumber) {
        phoneInput.value = currentPhoneNumber;
      }

      phoneInput.setAttribute('placeholder', mask);

      if (typeof Inputmask !== 'undefined') {
        Inputmask({
          "mask": mask,
          "showMaskOnHover": false,
        }).mask(phoneInput);
      }
    }
  }

  function getSelectedCountryData(radioInput) {
    const label = radioInput.closest('.options__item');
    const flagImg = label.querySelector('.options__img img');
    const countryNameSpan = label.querySelector('.options__text');
    const countryCode = radioInput.getAttribute('countryCode') || '+7';
    const mask = radioInput.getAttribute('data-mask') || '(999) 999-99-99';

    return {
      code: countryCode,
      flagSrc: flagImg ? flagImg.src : '',
      countryName: countryNameSpan ? countryNameSpan.textContent : '',
      mask: mask
    };
  }

  titlesList.forEach(title => {
    title.addEventListener('click', function (e) {
      e.stopPropagation();
      const parentSelect = this.closest('.form-select');
      if (parentSelect) {
        parentSelect.classList.toggle('active');
      }
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.form-select')) {
      const allSelects = document.querySelectorAll('.form-select');
      allSelects.forEach(select => {
        select.classList.remove('active');
      });
    }
  });

  const allRadioInputs = document.querySelectorAll('.options__input');
  allRadioInputs.forEach(radio => {
    radio.addEventListener('change', function (e) {
      if (this.checked) {
        const parentSelect = this.closest('.form-select');

        if (parentSelect) {
          const countryData = getSelectedCountryData(this);
          updateSelectedCountry(
            parentSelect,
            countryData.code,
            countryData.flagSrc,
            countryData.countryName,
            countryData.mask
          );
          parentSelect.classList.remove('active');
        }
      }
    });
  });

  const checkedRadios = document.querySelectorAll('.options__input:checked');
  checkedRadios.forEach(radio => {
    const parentSelect = radio.closest('.form-select');
    if (parentSelect) {
      const countryData = getSelectedCountryData(radio);
      updateSelectedCountry(
        parentSelect,
        countryData.code,
        countryData.flagSrc,
        countryData.countryName,
        countryData.mask
      );
    }
  });
}

//========================================================================================================================================================

const observer = new MutationObserver(() => {
  const popups = document.querySelectorAll('.popup-base-created.popup_show');

  popups.forEach(popup => {
    const addBaseCreat = popup.querySelector('.add-base-creat');
    const popupContent = popup.querySelector('.popup-content-creat');

    if (addBaseCreat && popupContent && !addBaseCreat.classList.contains('active')) {
      addBaseCreat.classList.add('active');

      const animatedLine = addBaseCreat.querySelector('.line span');
      if (animatedLine) {
        animatedLine.addEventListener('animationend', () => {
          popupContent.classList.add('hidden');
        }, { once: true });
      } else {
        popupContent.classList.add('hidden');
      }
    }
  });
});
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['class']
});

//========================================================================================================================================================

const questionButtons = document.querySelectorAll('.tooltips-button');

if (questionButtons.length) {

  function handleTooltipClick(e) {
    e.stopPropagation();
    const tooltip = this.closest('.tooltips');
    if (tooltip) {
      tooltip.classList.toggle('active');
    }
  }

  function bindEvents() {
    questionButtons.forEach(button => {
      button.removeEventListener('click', handleTooltipClick);

      if (window.innerWidth <= 992) {
        button.addEventListener('click', handleTooltipClick);
      }
    });
  }

  function closeTooltipsOnOutsideClick(e) {
    if (window.innerWidth <= 992) {
      const isTooltipButton = e.target.closest('.tooltips');
      if (!isTooltipButton) {
        document.querySelectorAll('.tooltips.active').forEach(tooltip => {
          tooltip.classList.remove('active');
        });
      }
    }
  }

  bindEvents();
  window.addEventListener('resize', bindEvents);
  document.addEventListener('click', closeTooltipsOnOutsideClick);
}

//========================================================================================================================================================

const btnCheck = document.querySelectorAll('.btn-check');

if (btnCheck) {
  btnCheck.forEach(button => {
    button.addEventListener('click', function () {
      const parent = this.closest('.input-btn-check');

      if (!parent) return;

      parent.classList.add('active');

      setTimeout(() => {
        parent.classList.remove('active');
      }, 5000);
    });
  });
}

//========================================================================================================================================================

const calendars = document.querySelectorAll(".calendar");
if (calendars) {

  const closeAllCalendarStates = () => {
    calendars.forEach(calendar => {
      calendar.classList.remove('active');
      calendar.classList.remove('calendar-month-active');
      calendar.classList.remove('calendar-data-active');
    });
    document.documentElement.classList.remove('open-calendar');
  };

  calendars.forEach((calendar, calendarIndex) => {
    const calendarMain = calendar.querySelector(".calendar__main");
    const calHeaderTitle = calendar.querySelector(".calendar__header span");

    const calendarValueBlock = calendar.querySelector(".calendar__value");
    const calendarInput = calendar.querySelector(".input-calendar");

    const isSingleSelect = calendar.classList.contains('calendar-one');

    const monthItems = calendar.querySelectorAll('.calendar-month .calendar-header__dropdown .calendar-header__item');
    const monthsList = [];
    monthItems.forEach(item => {
      const monthSpan = item.querySelector('span');
      if (monthSpan) {
        monthsList.push(monthSpan.textContent.trim());
      }
    });

    const yearItems = calendar.querySelectorAll('.calendar-data .calendar-header__dropdown .calendar-header__item');
    const yearsList = [];
    yearItems.forEach(item => {
      const yearSpan = item.querySelector('span');
      if (yearSpan) {
        yearsList.push(parseInt(yearSpan.textContent.trim()));
      }
    });
    yearsList.sort((a, b) => a - b);

    const getShortMonth = (fullMonthName) => {
      return fullMonthName.substring(0, 3);
    };

    const getMonthNumber = (monthName) => {
      const monthMap = {
        'Январь': '01', 'Февраль': '02', 'Март': '03', 'Апрель': '04',
        'Май': '05', 'Июнь': '06', 'Июль': '07', 'Август': '08',
        'Сентябрь': '09', 'Октябрь': '10', 'Ноябрь': '11', 'Декабрь': '12'
      };
      return monthMap[monthName] || '01';
    };

    const todayTimestamp = Date.now() - (Date.now() % (24 * 60 * 60 * 1000));
    const today = new Date();
    const todayDay = String(today.getDate()).padStart(2, '0');
    const todayMonth = String(today.getMonth() + 1).padStart(2, '0');
    const todayYear = today.getFullYear();

    const getDateObjectFromTimestamp = (timestamp) => {
      let dateObject = new Date(timestamp);
      return {
        year: dateObject.getUTCFullYear(),
        month: String(dateObject.getUTCMonth() + 1).padStart(2, '0'),
        day: String(dateObject.getUTCDate()).padStart(2, '0')
      };
    };

    let selectedStartDate = todayTimestamp;
    let selectedEndDate = null;
    let tempStartDate = todayTimestamp;
    let tempEndDate = null;
    let isSelectingRange = false;
    let hasUserSelected = false;

    let savedDay = todayDay;
    let savedMonth = todayMonth;
    let savedYear = todayYear;
    let savedMonthName = monthsList[today.getMonth()] || '';
    let savedIsRange = false;
    let savedEndDay = null;
    let savedEndMonth = null;
    let savedEndYear = null;

    const getNumberOfDays = (year, month) => {
      return new Date(year, month + 1, 0).getDate();
    };

    const getDayDetails = (args) => {
      let date = args.index - args.firstDay;
      let dayOfWeek = (args.index % 7 + 7) % 7;
      let prevMonth = args.month - 1;
      let nextMonth = args.month + 1;
      let prevYear = args.year;
      let nextYear = args.year;

      if (prevMonth < 0) {
        prevMonth = 11;
        prevYear--;
      }
      if (nextMonth > 11) {
        nextMonth = 0;
        nextYear++;
      }

      let prevMonthDays = getNumberOfDays(prevYear, prevMonth);
      let currentMonthDays = getNumberOfDays(args.year, args.month);

      let displayDate, displayMonth, displayYear;
      if (date < 0) {
        displayDate = prevMonthDays + date + 1;
        displayMonth = prevMonth;
        displayYear = prevYear;
      } else if (date >= currentMonthDays) {
        displayDate = date - currentMonthDays + 1;
        displayMonth = nextMonth;
        displayYear = nextYear;
      } else {
        displayDate = date + 1;
        displayMonth = args.month;
        displayYear = args.year;
      }

      let timestamp = new Date(Date.UTC(displayYear, displayMonth, displayDate)).getTime();
      return {
        date: displayDate,
        day: dayOfWeek,
        month: displayMonth === args.month ? 0 : displayMonth < args.month ? -1 : 1,
        timestamp: timestamp
      };
    };

    const getMonthDetails = (year, month) => {
      let firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
      firstDay = firstDay === 0 ? 6 : firstDay - 1;
      let monthArray = [];
      for (let i = 0; i < 42; i++) {
        monthArray.push(getDayDetails({
          index: i,
          firstDay: firstDay,
          year: year,
          month: month
        }));
      }
      return monthArray;
    };

    let currentMonthIndex = 0;

    const now = new Date();
    const currentMonthName = monthsList[now.getMonth()];
    if (currentMonthName) {
      currentMonthIndex = monthsList.findIndex(m => m === currentMonthName);
      if (currentMonthIndex === -1) currentMonthIndex = 0;
    }

    let currentYear = yearsList[0] || now.getFullYear();
    if (yearsList.length > 0) {
      const closestYear = yearsList.reduce((prev, curr) => {
        return (Math.abs(curr - now.getFullYear()) < Math.abs(prev - now.getFullYear()) ? curr : prev);
      });
      currentYear = closestYear;
    }

    let year = currentYear;
    let month = currentMonthIndex;
    let monthDetails = getMonthDetails(year, month);

    const isDateInRange = (timestamp, start, end) => {
      if (isSingleSelect) {
        return timestamp === start;
      }
      if (!start) return false;
      if (end) {
        return timestamp >= start && timestamp <= end;
      }
      return timestamp === start;
    };

    const setCalBody = (monthDetails, startDate, endDate) => {
      if (!calendarMain) return;

      calendarMain.innerHTML = "";
      monthDetails.forEach(day => {
        let div = document.createElement("div");
        let span = document.createElement("span");

        div.classList.add("cell_wrapper");
        div.classList.add("cal_date");

        if (day.month === 0) {
          div.classList.add("current");
        } else if (day.month === -1) {
          div.classList.add("prev-month");
          div.classList.add("other-month");
        } else if (day.month === 1) {
          div.classList.add("next-month");
          div.classList.add("other-month");
        }

        if (day.timestamp === todayTimestamp && day.month === 0) {
          div.classList.add("isCurrent");
        }

        if (isDateInRange(day.timestamp, startDate, endDate)) {
          div.classList.add("in-range");

          if (!isSingleSelect && startDate && endDate && day.timestamp === startDate) {
            div.classList.add("range-start");
          }
          if (!isSingleSelect && endDate && day.timestamp === endDate && startDate !== endDate) {
            div.classList.add("range-end");
          }
        }

        span.classList.add("cell_item");
        span.innerText = day.date;
        div.setAttribute("data-timestamp", day.timestamp);
        div.appendChild(span);
        calendarMain.appendChild(div);
      });
    };

    const updateMonthSpan = () => {
      const monthSpan = calendar.querySelector('.calendar-month .calendar-header__button span');
      if (monthSpan && monthsList[month]) {
        monthSpan.textContent = getShortMonth(monthsList[month]);
      }

      const yearSpan = calendar.querySelector('.calendar-data .calendar-header__button span');
      if (yearSpan) {
        yearSpan.textContent = year;
      }

      if (calHeaderTitle && monthsList[month]) {
        calHeaderTitle.innerHTML = `${monthsList[month]} ${year}`;
      }
    };

    const updateActiveMonthInDropdown = () => {
      monthItems.forEach((item, index) => {
        if (index === month) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    };

    const updateActiveYearInDropdown = () => {
      yearItems.forEach(item => {
        const yearSpan = item.querySelector('span');
        if (yearSpan && parseInt(yearSpan.textContent) === year) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    };

    const updateSavedValues = (startDate, endDate) => {
      if (startDate) {
        const date = getDateObjectFromTimestamp(startDate);
        savedDay = date.day;
        savedMonth = date.month;
        savedYear = date.year;

        const monthIndex = parseInt(date.month) - 1;
        savedMonthName = monthsList[monthIndex] || '';

        if (endDate && !isSingleSelect) {
          savedIsRange = true;
          const endDateObj = getDateObjectFromTimestamp(endDate);
          savedEndDay = endDateObj.day;
          savedEndMonth = endDateObj.month;
          savedEndYear = endDateObj.year;
        } else {
          savedIsRange = false;
          savedEndDay = null;
          savedEndMonth = null;
          savedEndYear = null;
        }
      }
    };

    const updateDisplayFromSaved = () => {
      if (calendarValueBlock) {
        if (savedIsRange && savedEndDay) {
          calendarValueBlock.innerHTML = `${savedDay} <span>/</span> ${savedMonth} <span>/</span> ${savedYear} - ${savedEndDay} <span>/</span> ${savedEndMonth} <span>/</span> ${savedEndYear}`;
        } else {
          calendarValueBlock.innerHTML = `${savedDay} <span>/</span> ${savedMonth} <span>/</span> ${savedYear}`;
        }

        calendarValueBlock.setAttribute('data-day', savedDay);
        calendarValueBlock.setAttribute('data-month', savedMonth);
        calendarValueBlock.setAttribute('data-year', savedYear);
        calendarValueBlock.setAttribute('data-month-name', savedMonthName);
      }

      if (calendarInput) {
        if (savedIsRange && savedEndDay) {
          calendarInput.value = `${savedDay}-${savedMonth}-${savedYear} - ${savedEndDay}-${savedEndMonth}-${savedEndYear}`;
        } else {
          calendarInput.value = `${savedDay}-${savedMonth}-${savedYear}`;
        }

        calendarInput.setAttribute('data-day', savedDay);
        calendarInput.setAttribute('data-month', savedMonth);
        calendarInput.setAttribute('data-year', savedYear);
        calendarInput.setAttribute('data-month-name', savedMonthName);
      }
    };

    const updateCalendarValueDisplay = (startDate, endDate) => {
      updateSavedValues(startDate, endDate);
      updateDisplayFromSaved();
    };

    const applySelection = () => {
      selectedStartDate = tempStartDate;
      selectedEndDate = tempEndDate;
      hasUserSelected = true;
      updateCalendarValueDisplay(selectedStartDate, selectedEndDate);
      closeCalendar();
    };

    const cancelSelection = () => {
      tempStartDate = selectedStartDate;
      tempEndDate = selectedEndDate;
      setCalBody(monthDetails, tempStartDate, tempEndDate);
      closeCalendar();
    };

    const closeCalendar = () => {
      calendar.classList.remove('active');
      calendar.classList.remove('calendar-month-active');
      calendar.classList.remove('calendar-data-active');
      document.documentElement.classList.remove('open-calendar');
    };

    const openCalendar = () => {
      tempStartDate = selectedStartDate;
      tempEndDate = selectedEndDate;
      isSelectingRange = false;

      setCalBody(monthDetails, tempStartDate, tempEndDate);
      updateCalendarValueDisplay(selectedStartDate, selectedEndDate);

      closeAllCalendarStates();
      calendar.classList.add('active');
      document.documentElement.classList.add('open-calendar');
    };

    const changeMonth = (offset) => {
      let newMonth = month + offset;
      let newYear = year;

      if (newMonth === -1) {
        newMonth = monthsList.length - 1;
        newYear--;
        if (yearsList.length > 0) {
          const currentYearIndex = yearsList.indexOf(newYear);
          if (currentYearIndex !== -1) {
            newYear = yearsList[currentYearIndex];
          } else {
            if (newYear < yearsList[0]) {
              newYear = yearsList[yearsList.length - 1];
            } else if (newYear > yearsList[yearsList.length - 1]) {
              newYear = yearsList[0];
            }
          }
        }
      } else if (newMonth === monthsList.length) {
        newMonth = 0;
        newYear++;
        if (yearsList.length > 0) {
          const currentYearIndex = yearsList.indexOf(newYear);
          if (currentYearIndex !== -1) {
            newYear = yearsList[currentYearIndex];
          } else {
            if (newYear < yearsList[0]) {
              newYear = yearsList[yearsList.length - 1];
            } else if (newYear > yearsList[yearsList.length - 1]) {
              newYear = yearsList[0];
            }
          }
        }
      }

      month = newMonth;
      year = newYear;

      monthDetails = getMonthDetails(year, month);
      updateMonthSpan();
      updateActiveMonthInDropdown();
      updateActiveYearInDropdown();
      setCalBody(monthDetails, tempStartDate, tempEndDate);

      const monthName = monthsList[month];
      savedMonth = getMonthNumber(monthName);
      savedYear = year.toString();
      savedMonthName = monthName;
      updateDisplayFromSaved();
    };

    const changeYear = (offset) => {
      if (yearsList.length === 0) return;

      const currentIndex = yearsList.indexOf(year);

      if (currentIndex !== -1) {
        let newIndex = currentIndex + offset;

        if (newIndex < 0) {
          newIndex = yearsList.length - 1;
        } else if (newIndex >= yearsList.length) {
          newIndex = 0;
        }

        year = yearsList[newIndex];
      } else {
        if (offset === -1) {
          year = yearsList[yearsList.length - 1];
        } else {
          year = yearsList[0];
        }
      }

      monthDetails = getMonthDetails(year, month);
      updateMonthSpan();
      updateActiveYearInDropdown();
      setCalBody(monthDetails, tempStartDate, tempEndDate);

      savedYear = year.toString();
      updateDisplayFromSaved();
    };

    updateMonthSpan();
    updateActiveMonthInDropdown();
    updateActiveYearInDropdown();
    setCalBody(monthDetails, tempStartDate, tempEndDate);

    updateSavedValues(selectedStartDate, selectedEndDate);
    updateDisplayFromSaved();

    const monthPrevBtn = calendar.querySelector('.calendar-month .calendar-header__btn-prev');
    const monthNextBtn = calendar.querySelector('.calendar-month .calendar-header__btn-next');

    if (monthPrevBtn) {
      monthPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        changeMonth(-1);
      });
    }

    if (monthNextBtn) {
      monthNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        changeMonth(1);
      });
    }

    const yearPrevBtn = calendar.querySelector('.calendar-data .calendar-header__btn-prev');
    const yearNextBtn = calendar.querySelector('.calendar-data .calendar-header__btn-next');

    if (yearPrevBtn) {
      yearPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        changeYear(-1);
      });
    }

    if (yearNextBtn) {
      yearNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        changeYear(1);
      });
    }

    if (monthItems.length > 0) {
      monthItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          month = index;
          monthDetails = getMonthDetails(year, month);
          updateMonthSpan();
          updateActiveMonthInDropdown();
          setCalBody(monthDetails, tempStartDate, tempEndDate);
          calendar.classList.remove('calendar-month-active');

          const monthName = monthsList[month];
          savedMonth = getMonthNumber(monthName);
          savedMonthName = monthName;
          updateDisplayFromSaved();
        });
      });
    }

    if (yearItems.length > 0) {
      yearItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const selectedYear = parseInt(item.querySelector('span').textContent);
          if (!isNaN(selectedYear) && yearsList.includes(selectedYear)) {
            year = selectedYear;
            monthDetails = getMonthDetails(year, month);
            updateMonthSpan();
            updateActiveYearInDropdown();
            setCalBody(monthDetails, tempStartDate, tempEndDate);
            calendar.classList.remove('calendar-data-active');

            savedYear = year.toString();
            updateDisplayFromSaved();
          }
        });
      });
    }

    const calendarMonthBlock = calendar.querySelector('.calendar-month');
    if (calendarMonthBlock) {
      const monthSpan = calendarMonthBlock.querySelector('.calendar-header__button span');
      if (monthSpan) {
        monthSpan.addEventListener('click', (e) => {
          e.stopPropagation();

          calendars.forEach(otherCalendar => {
            if (otherCalendar !== calendar) {
              otherCalendar.classList.remove('calendar-month-active');
              otherCalendar.classList.remove('calendar-data-active');
            }
          });

          calendar.classList.remove('calendar-data-active');
          calendar.classList.toggle('calendar-month-active');
        });
      }
    }

    const calendarDataBlock = calendar.querySelector('.calendar-data');
    if (calendarDataBlock) {
      const yearSpan = calendarDataBlock.querySelector('.calendar-header__button span');
      if (yearSpan) {
        yearSpan.addEventListener('click', (e) => {
          e.stopPropagation();

          calendars.forEach(otherCalendar => {
            if (otherCalendar !== calendar) {
              otherCalendar.classList.remove('calendar-month-active');
              otherCalendar.classList.remove('calendar-data-active');
            }
          });

          calendar.classList.remove('calendar-month-active');
          calendar.classList.toggle('calendar-data-active');
        });
      }
    }

    if (calendarMain) {
      calendarMain.addEventListener("click", (e) => {
        e.stopPropagation();

        const target = e.target.closest(".cell_wrapper");

        if (!target) {
          return;
        }

        const cellTimestamp = parseInt(target.getAttribute("data-timestamp"));
        if (!cellTimestamp) {
          return;
        }

        if (isSingleSelect) {
          if (tempStartDate === cellTimestamp) {
            return;
          }
          tempStartDate = cellTimestamp;
          tempEndDate = null;
          updateCalendarValueDisplay(tempStartDate, null);
          setCalBody(monthDetails, tempStartDate, tempEndDate);
        } else {
          if (tempStartDate === null) {
            tempStartDate = cellTimestamp;
            tempEndDate = null;
            isSelectingRange = true;
            updateCalendarValueDisplay(tempStartDate, null);
          } else if (tempStartDate !== null && tempEndDate === null) {
            if (cellTimestamp < tempStartDate) {
              tempEndDate = tempStartDate;
              tempStartDate = cellTimestamp;
            } else if (cellTimestamp > tempStartDate) {
              tempEndDate = cellTimestamp;
            } else {
              tempEndDate = null;
              isSelectingRange = false;
              updateCalendarValueDisplay(tempStartDate, null);
              setCalBody(monthDetails, tempStartDate, tempEndDate);
              return;
            }
            isSelectingRange = false;
            updateCalendarValueDisplay(tempStartDate, tempEndDate);
          } else {
            tempStartDate = cellTimestamp;
            tempEndDate = null;
            isSelectingRange = true;
            updateCalendarValueDisplay(tempStartDate, null);
          }
          setCalBody(monthDetails, tempStartDate, tempEndDate);
        }
      });
    }

    const clearBtn = calendar.querySelector('.calendar-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedStartDate = todayTimestamp;
        selectedEndDate = null;
        tempStartDate = todayTimestamp;
        tempEndDate = null;
        isSelectingRange = false;
        hasUserSelected = false;

        savedDay = todayDay;
        savedMonth = todayMonth;
        savedYear = todayYear;
        savedMonthName = monthsList[today.getMonth()] || '';
        savedIsRange = false;
        savedEndDay = null;
        savedEndMonth = null;
        savedEndYear = null;

        updateCalendarValueDisplay(tempStartDate, tempEndDate);
        setCalBody(monthDetails, tempStartDate, tempEndDate);
      });
    }

    const closeBtn = calendar.querySelector('.calendar-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cancelSelection();
      });
    }

    const applyBtn = calendar.querySelector('.calendar-apply');
    if (applyBtn) {
      applyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (tempStartDate !== selectedStartDate || tempEndDate !== selectedEndDate) {
          applySelection();
        } else {
          closeCalendar();
        }
      });
    }

    const calendarIcon = calendar.querySelector('.calendar__icon');
    if (calendarIcon) {
      calendarIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        if (calendar.classList.contains('active')) {
          closeCalendar();
        } else {
          openCalendar();
        }
      });
    }

    if (calendarInput) {
      calendarInput.addEventListener('click', (e) => {
        e.stopPropagation();
        if (calendar.classList.contains('active')) {
          closeCalendar();
        } else {
          openCalendar();
        }
      });
    }

    updateCalendarValueDisplay(selectedStartDate, selectedEndDate);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.calendar')) {
      closeAllCalendarStates();
    }
  });
}

//========================================================================================================================================================

const startUpdateBtn = document.querySelectorAll('.popup-start-update__btn');

if (startUpdateBtn.length) {
  startUpdateBtn.forEach(button => {
    button.addEventListener('click', function (event) {
      event.stopPropagation();

      if (this.classList.contains('active')) {
        this.classList.remove('active');
      } else {
        startUpdateBtn.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
}

//========================================================================================================================================================

const cabinetOrderButtons = document.querySelectorAll('.cabinet-tabs-act-order__button');

if (cabinetOrderButtons.length) {
  cabinetOrderButtons.forEach(button => {
    button.addEventListener('click', function (event) {
      event.stopPropagation();

      if (this.classList.contains('active')) {
        this.classList.remove('active');
      } else {
        cabinetOrderButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
}

//========================================================================================================================================================

const timers = document.querySelectorAll('.timer');

if (timers) {
  timers.forEach((timer) => {
    const timerInput = timer.querySelector('.timer__input');
    const timerValue = timer.querySelector('.timer__value');
    const timerContent = timer.querySelector('.timer__content');
    const timerItems = timer.querySelectorAll('.timer__item');

    let currentValue = '';

    function updateDisplayValue(time) {
      if (timerValue) {
        timerValue.innerHTML = time.replace(':', ' <span>:</span> ');
      }
      if (timerInput) {
        const input = timerInput.querySelector('.input-timer');
        if (input) input.value = time;
      }
      currentValue = time;
    }

    function setActiveItem(time) {
      timerItems.forEach(item => {
        const itemTime = item.querySelector('span')?.innerText;
        if (itemTime === time) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }

    function selectTime(time) {
      updateDisplayValue(time);
      setActiveItem(time);
      closeDropdown();
    }

    function openDropdown() {
      if (timerContent) timerContent.style.display = 'block';
      timer.classList.add('active');
    }

    function closeDropdown() {
      if (timerContent) timerContent.style.display = 'none';
      timer.classList.remove('active');
    }

    function toggleDropdown() {
      if (timerContent && timerContent.style.display === 'block') {
        closeDropdown();
      } else {
        openDropdown();
      }
    }

    timerItems.forEach(item => {
      item.addEventListener('click', function (e) {
        e.stopPropagation();
        const timeSpan = this.querySelector('span');
        if (timeSpan) {
          selectTime(timeSpan.innerText);
        }
      });
    });

    if (timerInput) {
      timerInput.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleDropdown();
      });
    }

    const activeItem = timer.querySelector('.timer__item.active');
    if (activeItem) {
      const defaultTime = activeItem.querySelector('span')?.innerText;
      if (defaultTime) {
        updateDisplayValue(defaultTime);
        currentValue = defaultTime;
      }
    }
  });

  document.addEventListener('click', function (e) {
    document.querySelectorAll('.timer').forEach(timer => {
      if (!timer.contains(e.target)) {
        const timerContent = timer.querySelector('.timer__content');
        if (timerContent && timerContent.style.display === 'block') {
          timerContent.style.display = 'none';
          timer.classList.remove('active');
        }
      }
    });
  });
}

//========================================================================================================================================================

function showMore() {
  window.addEventListener("load", function (e) {
    const showMoreBlocks = document.querySelectorAll('[data-showmore]');
    let showMoreBlocksRegular;
    let mdQueriesArray;
    if (showMoreBlocks.length) {
      showMoreBlocksRegular = Array.from(showMoreBlocks).filter(function (item, index, self) {
        return !item.dataset.showmoreMedia;
      });
      showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;

      document.addEventListener("click", showMoreActions);
      window.addEventListener("resize", showMoreActions);

      mdQueriesArray = dataMediaQueries(showMoreBlocks, "showmoreMedia");
      if (mdQueriesArray && mdQueriesArray.length) {
        mdQueriesArray.forEach(mdQueriesItem => {
          mdQueriesItem.matchMedia.addEventListener("change", function () {
            initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
          });
        });
        initItemsMedia(mdQueriesArray);
      }
    }
    function initItemsMedia(mdQueriesArray) {
      mdQueriesArray.forEach(mdQueriesItem => {
        initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
    function initItems(showMoreBlocks, matchMedia) {
      showMoreBlocks.forEach(showMoreBlock => {
        initItem(showMoreBlock, matchMedia);
      });
    }
    function initItem(showMoreBlock, matchMedia = false) {
      showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
      let showMoreContent = showMoreBlock.querySelectorAll('[data-showmore-content]');
      let showMoreButton = showMoreBlock.querySelectorAll('[data-showmore-button]');
      showMoreContent = Array.from(showMoreContent).filter(item => item.closest('[data-showmore]') === showMoreBlock)[0];
      showMoreButton = Array.from(showMoreButton).filter(item => item.closest('[data-showmore]') === showMoreBlock)[0];
      const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
      if (matchMedia.matches || !matchMedia) {
        if (hiddenHeight < getOriginalHeight(showMoreContent)) {
          _slideUp(showMoreContent, 0, showMoreBlock.classList.contains('_showmore-active') ? getOriginalHeight(showMoreContent) : hiddenHeight);
          showMoreButton.hidden = false;
        } else {
          _slideDown(showMoreContent, 0, hiddenHeight);
          showMoreButton.hidden = true;
        }
      } else {
        _slideDown(showMoreContent, 0, hiddenHeight);
        showMoreButton.hidden = true;
      }
    }
    function getHeight(showMoreBlock, showMoreContent) {
      let hiddenHeight = 0;
      const showMoreType = showMoreBlock.dataset.showmore ? showMoreBlock.dataset.showmore : 'size';
      const rowGap = parseFloat(getComputedStyle(showMoreContent).rowGap) ? parseFloat(getComputedStyle(showMoreContent).rowGap) : 0;
      if (showMoreType === 'items') {
        const showMoreTypeValue = showMoreContent.dataset.showmoreContent ? showMoreContent.dataset.showmoreContent : 3;
        const showMoreItems = showMoreContent.children;
        for (let index = 1; index < showMoreItems.length; index++) {
          const showMoreItem = showMoreItems[index - 1];
          const marginTop = parseFloat(getComputedStyle(showMoreItem).marginTop) ? parseFloat(getComputedStyle(showMoreItem).marginTop) : 0;
          const marginBottom = parseFloat(getComputedStyle(showMoreItem).marginBottom) ? parseFloat(getComputedStyle(showMoreItem).marginBottom) : 0;
          hiddenHeight += showMoreItem.offsetHeight + marginTop;
          if (index == showMoreTypeValue) break;
          hiddenHeight += marginBottom;
        }
        rowGap ? hiddenHeight += (showMoreTypeValue - 1) * rowGap : null;
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
        showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
        mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null;
      }
    }
  });
}
showMore();

//========================================================================================================================================================

const selectBases = document.querySelectorAll('.popup-select-bases');
if (selectBases) {
  selectBases.forEach(container => {
    const resetBtn = container.querySelector('.select-btn-reset');
    const selectAllBtn = container.querySelector('.select-btn-all');

    const checkboxes = container.querySelectorAll('.select-bases-showmore__checkboxes .checkbox__input');

    const resetCheckboxes = () => {
      checkboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
      checkboxes.forEach(checkbox => {
        const changeEvent = new Event('change', { bubbles: true });
        checkbox.dispatchEvent(changeEvent);
      });
    };

    const selectAllCheckboxes = () => {
      checkboxes.forEach(checkbox => {
        checkbox.checked = true;
      });
      checkboxes.forEach(checkbox => {
        const changeEvent = new Event('change', { bubbles: true });
        checkbox.dispatchEvent(changeEvent);
      });
    };

    if (resetBtn) {
      resetBtn.removeEventListener('click', resetCheckboxes);
      resetBtn.addEventListener('click', resetCheckboxes);
    }

    if (selectAllBtn) {
      selectAllBtn.removeEventListener('click', selectAllCheckboxes);
      selectAllBtn.addEventListener('click', selectAllCheckboxes);
    }
  });
}

//========================================================================================================================================================

const uploadContainer = document.querySelector('.upload-base-files');
if (uploadContainer) {
  const fileInput = uploadContainer.querySelector('input[type="file"]');
  const dropZone = uploadContainer.querySelector('.upload-base-file1');
  const resultsContainer = uploadContainer.querySelector('.upload-base-files__results');
  const maxFileAttr = dropZone ? dropZone.getAttribute('data-max-file') : null;
  const maxFileCount = maxFileAttr ? parseInt(maxFileAttr, 10) : 4;
  const maxFileSize = 5 * 1024 * 1024;
  const submitButton = document.querySelector('button[type="submit"][data-popup="#upload-base-creat"]');

  let filesList = [];
  let activeTimeouts = [];
  let isProcessing = false;

  const errorsList = uploadContainer.querySelectorAll('.upload-base-files__error');
  const sizeError = errorsList[0] || null;
  const countError = errorsList[1] || null;
  const emptyError = errorsList[2] || null;
  const lineParent = uploadContainer.querySelector('.upload-base-file2');

  if (lineParent) {
    const existingLine = lineParent.querySelector('.line');
    if (existingLine) {
      existingLine.remove();
    }
  }

  if (errorsList.length > 0) {
    errorsList.forEach(error => {
      if (error) error.style.display = 'none';
    });
  }
  if (resultsContainer) resultsContainer.innerHTML = '';

  function addActiveToContainer() {
    uploadContainer.classList.add('active');
    const timeout = setTimeout(() => {
      uploadContainer.classList.remove('active');
    }, 5000);
    activeTimeouts.push(timeout);
  }

  function updateUI() {
    if (resultsContainer) {
      if (filesList.length > 0) {
        resultsContainer.classList.add('active');
      } else {
        resultsContainer.classList.remove('active');
      }
    }
  }

  function hideAllErrors() {
    if (sizeError) sizeError.style.display = 'none';
    if (countError) countError.style.display = 'none';
    if (emptyError) emptyError.style.display = 'none';
  }

  function validateFiles(files) {
    const newFiles = [];
    const errors = [];

    hideAllErrors();

    if (filesList.length + files.length > maxFileCount) {
      errors.push('count');
      if (countError) countError.style.display = 'block';
      return { newFiles: [], errors };
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > maxFileSize) {
        if (sizeError) sizeError.style.display = 'block';
        errors.push('size');
        continue;
      }

      newFiles.push(file);
    }

    return { newFiles, errors };
  }

  function createAndAnimateLine(fileIndex, totalFiles) {
    if (!lineParent) return null;

    const line = document.createElement('div');
    line.className = 'line';

    const span = document.createElement('span');
    span.style.width = '0%';
    span.style.transition = 'width 5s ease';
    line.appendChild(span);

    lineParent.appendChild(line);

    setTimeout(() => {
      if (span) {
        span.style.width = '100%';
      }
    }, fileIndex * 100);

    setTimeout(() => {
      if (line && line.parentNode) {
        line.remove();
      }
    }, 5000 + (fileIndex * 100));

    return line;
  }

  function addFilesToUI(files) {
    if (!resultsContainer) return;

    const existingCount = resultsContainer.querySelectorAll('.upload-base-files__result').length;

    files.forEach((file, index) => {
      const resultItem = document.createElement('div');
      resultItem.className = 'upload-base-files__result';

      const nameDiv = document.createElement('div');
      nameDiv.className = 'upload-base-files__name';
      nameDiv.textContent = `${existingCount + index + 1} - ${file.name}`;

      const separatorSpan = document.createElement('span');
      separatorSpan.textContent = '-';

      const deleteDiv = document.createElement('div');
      deleteDiv.className = 'upload-base-files__delete';
      deleteDiv.textContent = 'Удалить';

      resultItem.appendChild(nameDiv);
      resultItem.appendChild(separatorSpan);
      resultItem.appendChild(deleteDiv);

      resultsContainer.appendChild(resultItem);
    });
  }

  function updateFileNames() {
    if (!resultsContainer) return;

    const results = resultsContainer.querySelectorAll('.upload-base-files__result');
    results.forEach((result, idx) => {
      const nameDiv = result.querySelector('.upload-base-files__name');
      if (nameDiv && filesList[idx]) {
        const fileName = filesList[idx].name;
        nameDiv.textContent = `${idx + 1} - ${fileName}`;
      }
    });
  }

  function updateFileInput() {
    if (!fileInput) return;

    const dataTransfer = new DataTransfer();
    filesList.forEach(file => {
      if (file.file) {
        dataTransfer.items.add(file.file);
      }
    });
    fileInput.files = dataTransfer.files;
  }

  function deleteFile(resultItem) {
    if (!resultItem) return;

    const allResults = resultsContainer.querySelectorAll('.upload-base-files__result');
    const indexToRemove = Array.from(allResults).indexOf(resultItem);

    if (indexToRemove !== -1) {
      filesList.splice(indexToRemove, 1);
      resultItem.remove();
      updateFileNames();
      updateUI();
      updateFileInput();
    }
  }

  function processFiles(files) {
    if (isProcessing) {
      return;
    }

    isProcessing = true;

    const { newFiles, errors } = validateFiles(files);

    if (errors.length > 0) {
      isProcessing = false;
      if (fileInput) fileInput.value = '';
      return;
    }

    if (newFiles.length === 0) {
      isProcessing = false;
      if (fileInput) fileInput.value = '';
      return;
    }

    window.hasAttemptedUpload = true;
    addActiveToContainer();

    newFiles.forEach((file, index) => {
      createAndAnimateLine(index, newFiles.length);
    });

    newFiles.forEach(file => {
      const fileObj = {
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      };
      filesList.push(fileObj);
    });

    addFilesToUI(newFiles);
    updateUI();
    updateFileInput();

    if (fileInput) fileInput.value = '';

    setTimeout(() => {
      isProcessing = false;
    }, 500);
  }

  if (fileInput) {
    fileInput.addEventListener('change', function (e) {
      if (this.files && this.files.length > 0) {
        processFiles(Array.from(this.files));
      }
    });
  }

  if (dropZone) {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        processFiles(Array.from(files));
      }
    });
  }

  if (resultsContainer) {
    resultsContainer.addEventListener('click', function (e) {
      const deleteBtn = e.target.closest('.upload-base-files__delete');
      if (deleteBtn) {
        const resultItem = deleteBtn.closest('.upload-base-files__result');
        deleteFile(resultItem);
      }
    });
  }

  if (submitButton) {
    submitButton.addEventListener('click', function (e) {
      if (filesList.length === 0) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        hideAllErrors();
        if (emptyError) emptyError.style.display = 'block';
        return false;
      }
    }, true);
  }

  updateUI();
}

//========================================================================================================================================================

const formAutoUpdate = document.querySelector('.form-auto-update');
if (formAutoUpdate) {
  const checkbox = formAutoUpdate.querySelector('.checkbox__input');

  function toggleFormCheckedClass() {
    if (checkbox.checked) {
      formAutoUpdate.classList.add('checked');
    } else {
      formAutoUpdate.classList.remove('checked');
    }
  }

  toggleFormCheckedClass();

  checkbox.addEventListener('change', toggleFormCheckedClass);
}

//========================================================================================================================================================

const applicationsCards = document.querySelectorAll('.block-applications-cards__card');
if (applicationsCards) {
  const allForms = document.querySelectorAll('.block-applications-cards .form-textarea');

  allForms.forEach(form => {
    form.style.display = 'none';
  });

  function showFormByCard(cardId) {
    allForms.forEach(form => {
      if (form.getAttribute('data-card') === cardId) {
        form.style.display = 'block';
      } else {
        form.style.display = 'none';
      }
    });
  }

  function clearFormByCard(cardId) {
    const form = document.querySelector(`.block-applications-cards .form-textarea[data-card="${cardId}"]`);
    if (!form) return;

    const textarea = form.querySelector('textarea');
    if (textarea) textarea.value = '';

    const fileInputs = form.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
      input.value = '';
    });

    const resultsContainer = form.querySelector('.form-textarea__results');
    if (resultsContainer) resultsContainer.innerHTML = '';
  }

  function removeActiveClass() {
    applicationsCards.forEach(card => card.classList.remove('active'));
  }

  const activeCard = document.querySelector('.block-applications-cards__card.active');
  if (activeCard) {
    const cardId = activeCard.getAttribute('data-card');
    showFormByCard(cardId);
  }

  applicationsCards.forEach(card => {
    card.addEventListener('click', function (event) {
      event.stopPropagation();

      const cardId = this.getAttribute('data-card');
      const isActive = this.classList.contains('active');

      if (isActive) {
        this.classList.remove('active');
        allForms.forEach(form => form.style.display = 'none');
      } else {
        removeActiveClass();
        this.classList.add('active');
        showFormByCard(cardId);
      }
    });
  });
}

//========================================================================================================================================================

let applicationsColumns = document.querySelectorAll('.block-applications__column');
if (applicationsColumns) {
  applicationsColumns.forEach(column => {
    const moreButtons = column.querySelectorAll('.block-applications-more');
    const bottomBlock = column.querySelector('.block-applications-bottom');

    if (bottomBlock && !bottomBlock.hasAttribute('hidden')) {
      bottomBlock.hidden = true;
    }

    const openApplication = () => {
      column.classList.add('active');
      _slideDown(bottomBlock, 500);
    };

    const closeApplication = () => {
      column.classList.remove('active');
      _slideUp(bottomBlock, 500);
    };

    const toggleApplication = () => {
      if (bottomBlock.hidden) {
        openApplication();
      } else {
        closeApplication();
      }
    };

    moreButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        toggleApplication();
      });
    });
  });
}

//========================================================================================================================================================

const addButton = document.querySelector('.add-textarea');
if (addButton) {
  const textareaBlock = document.querySelector('.popup-other__body .form-textarea');

  textareaBlock.style.display = 'none';

  addButton.addEventListener('click', function () {
    textareaBlock.style.display = 'block';
    addButton.style.display = 'none';
  });
}

//========================================================================================================================================================

const searchContainers = document.querySelectorAll('.select-bases-search');

if (searchContainers) {
  searchContainers.forEach(container => {
    const input = container.querySelector('input');
    const closeButton = container.querySelector('.select-bases-search__close');

    if (!input || !closeButton) {
      return;
    }

    const toggleCloseButton = () => {
      if (input.value.trim() !== '') {
        closeButton.style.display = 'flex';
      } else {
        closeButton.style.display = 'none';
      }
    };

    toggleCloseButton();

    input.addEventListener('input', toggleCloseButton);

    closeButton.addEventListener('click', () => {
      input.value = '';
      input.dispatchEvent(new Event('input'));
      input.focus();
    });
  });
}

//========================================================================================================================================================

const btnCopy = document.querySelector('.btn-copy');
if (btnCopy) {
  btnCopy.addEventListener('click', function () {
    const copyTextElement = document.querySelector('.popup-invite-descr__copy');

    const textToCopy = copyTextElement.innerText.trim();

    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    document.body.appendChild(textarea);

    textarea.select();
    document.execCommand('copy');

    document.body.removeChild(textarea);
  });
}

//========================================================================================================================================================

function initRoleTabs() {
  const roleOptions = document.querySelectorAll('.options2__item');
  const roleDescriptions = document.querySelectorAll('.change-user-role');

  function updateActiveRole(selectedDescr) {
    roleOptions.forEach(option => {
      const radio = option.querySelector('.options2__input');
      const descr = option.getAttribute('data-descr');

      if (descr === selectedDescr) {
        radio.checked = true;
        option.classList.add('active');
      } else {
        radio.checked = false;
        option.classList.remove('active');
      }
    });

    roleDescriptions.forEach(description => {
      const descr = description.getAttribute('data-descr');

      if (descr === selectedDescr) {
        description.classList.add('checked');
        description.hidden = false;
      } else {
        description.classList.remove('checked');
        description.hidden = true;
      }
    });
  }

  roleOptions.forEach(option => {
    option.addEventListener('click', function (e) {
      e.preventDefault();
      const descr = this.getAttribute('data-descr');
      updateActiveRole(descr);
    });

    const radio = option.querySelector('.options2__input');
    if (radio) {
      radio.addEventListener('change', function () {
        if (this.checked) {
          const descr = option.closest('.options2__item').getAttribute('data-descr');
          updateActiveRole(descr);
        }
      });
    }
  });

  const checkedRadio = document.querySelector('.options2__input:checked');
  if (checkedRadio) {
    const parentLabel = checkedRadio.closest('.options2__item');
    const defaultDescr = parentLabel.getAttribute('data-descr');
    updateActiveRole(defaultDescr);
  } else {
    roleDescriptions.forEach(description => {
      description.hidden = true;
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRoleTabs);
} else {
  initRoleTabs();
}

//========================================================================================================================================================

const columnsContainer = document.querySelector('.block-cabinet__columns');
if (columnsContainer) {
  const columns = document.querySelectorAll('.block-cabinet__column');
  let draggedColumn = null;
  let cloneColumn = null;
  let offsetX, offsetY;

  columns.forEach(column => {
    const picker = column.querySelector('.cabinet-objects-top__picker');

    if (!picker) return;

    picker.addEventListener('mousedown', initDrag);
    picker.addEventListener('touchstart', initDrag, { passive: false });
  });

  function initDrag(e) {
    const column = e.target.closest('.block-cabinet__column');
    if (!column) return;

    e.preventDefault();
    e.stopPropagation();

    draggedColumn = column;

    const touch = e.touches ? e.touches[0] : e;
    const rect = column.getBoundingClientRect();

    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;

    cloneColumn = column.cloneNode(true);
    cloneColumn.style.position = 'fixed';
    cloneColumn.style.zIndex = '10000';
    cloneColumn.style.pointerEvents = 'none';
    cloneColumn.style.width = rect.width + 'px';
    cloneColumn.style.left = rect.left + 'px';
    cloneColumn.style.top = rect.top + 'px';

    document.body.appendChild(cloneColumn);

    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', onDrag, { passive: false });
    document.addEventListener('touchend', stopDrag);
  }

  function onDrag(e) {
    if (!draggedColumn || !cloneColumn) return;

    e.preventDefault();

    const touch = e.touches ? e.touches[0] : e;

    cloneColumn.style.left = (touch.clientX - offsetX) + 'px';
    cloneColumn.style.top = (touch.clientY - offsetY) + 'px';
  }

  function stopDrag(e) {
    if (!draggedColumn) return;

    const touch = e.touches ?
      (e.changedTouches ? e.changedTouches[0] : { clientX: 0, clientY: 0 }) :
      e;

    const allColumns = document.querySelectorAll('.block-cabinet__column');
    let targetColumn = null;
    let insertBefore = false;

    allColumns.forEach(column => {
      if (column === draggedColumn || column === cloneColumn) return;

      const rect = column.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const distance = Math.abs(touch.clientY - centerY);

      if (distance < 150) {
        targetColumn = column;
        insertBefore = touch.clientY < centerY;
      }
    });

    if (cloneColumn) {
      cloneColumn.remove();
      cloneColumn = null;
    }

    if (targetColumn && targetColumn !== draggedColumn) {
      if (insertBefore) {
        columnsContainer.insertBefore(draggedColumn, targetColumn);
      } else {
        columnsContainer.insertBefore(draggedColumn, targetColumn.nextSibling);
      }
    }

    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('touchend', stopDrag);

    draggedColumn = null;
  }
}

//========================================================================================================================================================

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

//========================================================================================================================================================
