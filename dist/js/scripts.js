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
      const valueElement = quantityElement.querySelector('input[type="text"]');
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
      e.stopPropagation();
    });
  });
}

//========================================================================================================================================================

const triggers = document.querySelectorAll('.heading-complex-meatballs__icon');

if (triggers) {
  triggers.forEach(trigger => {
    trigger.addEventListener('click', function (event) {
      event.stopPropagation();
      const meatballsBlock = this.closest('.heading-complex-meatballs');
      if (meatballsBlock) {
        closeOtherMeatballs(meatballsBlock);

        meatballsBlock.classList.toggle('active');
      }
    });
  });

  document.addEventListener('click', function (event) {
    const isClickInside = event.target.closest('.heading-complex-meatballs');
    if (!isClickInside) {
      document.querySelectorAll('.heading-complex-meatballs.active').forEach(block => {
        block.classList.remove('active');
      });
    }
  });

  function closeOtherMeatballs(currentBlock) {
    document.querySelectorAll('.heading-complex-meatballs.active').forEach(block => {
      if (block !== currentBlock) {
        block.classList.remove('active');
      }
    });
  }
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
    if (!menuButton) return;

    if (isDesktop() && !isHoverActive) {
      menuButton.addEventListener('mouseenter', onMouseEnter);
      menuButton.addEventListener('mouseleave', onMouseLeave);
      isHoverActive = true;
    } else if (isMobile() && isHoverActive) {
      menuButton.removeEventListener('mouseenter', onMouseEnter);
      menuButton.removeEventListener('mouseleave', onMouseLeave);
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