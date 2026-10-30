/**
 * Попапы
 * ------------------------------------------------------------
 * Класс Popup (открытие/закрытие, шаги, фокус-трап, hash) + глобальный экземпляр modules_flsModules.popup и делегирование кликов по [data-popup].
 *
 * Класс:      Popup
 * Включается: если на странице есть `[data-popup]` или `.popup`
 * Зависит от: forms/form-validate, core/menu, core/helpers
 * Страницы:   20 из 29 (все, кроме: account-blocked, databases-empty, documents-detail1, documents-detail2, documents, invoices-empty, loader-progress, subscriptions-restoring, subscriptions-restoring2)
 */

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
    this._isShowingBtnSent = false;
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

  showBtnByDataAttribute(popupElement) {
    if (!popupElement) return;
    const btnWithDataAttr = popupElement.querySelector('[data-btn]');
    if (!btnWithDataAttr) return;
    const btnValue = btnWithDataAttr.getAttribute(this.options.attributeBtnButton);
    if (btnValue && btnValue !== "") {
      let targetElement = document.querySelector(btnValue);
      if (targetElement) {
        if (this.currentBtnSentElement && this.currentBtnSentElement !== targetElement) {
          this.hideBtnSentWithAnimation(this.currentBtnSentElement);
        }
        this.currentBtnSentElement = targetElement;
        setTimeout(() => {
          this.showBtnSentWithAnimation(targetElement);
          this.startBtnSentTimer(2500);
          this.setupBtnSentHoverHandlers(targetElement);
        }, 500);
      }
    }
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
              this.startBtnSentTimer(2500);
              this.setupBtnSentHoverHandlers(targetElement);
            }, 500);
          }
        }
      }
    }.bind(this));

    document.addEventListener("click", function (e) {
      const popupElement = e.target.closest(`.${this.options.classes.popup}`);
      if (popupElement && popupElement.classList.contains(this.options.classes.popupActive)) {
        const popupContent = popupElement.querySelector(`.${this.options.classes.popupContent}`);
        const isClickOnContent = popupContent && (e.target === popupContent || popupContent.contains(e.target));
        if (!isClickOnContent) {
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
          return;
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

  nextStep(popupElement) {
    if (!popupElement) return;

    let steps = popupElement.querySelector('.popup__content .popup__step');
    let container = popupElement.querySelector('.popup__content');

    if (!steps) {
      steps = popupElement.querySelector('.popup__wrapper .popup__step');
      container = popupElement.querySelector('.popup__wrapper');
    }

    if (!steps || !container) return;

    const allSteps = container.querySelectorAll('.popup__step');
    if (allSteps.length === 0) return;

    let currentIndex = -1;
    allSteps.forEach((step, index) => {
      if (step.classList.contains('active')) {
        currentIndex = index;
      }
    });

    if (currentIndex === -1) {
      allSteps.forEach((step, index) => {
        if (step.style.display !== 'none' && !step.classList.contains('active')) {
          step.classList.add('active');
          currentIndex = index;
        }
      });
    }

    if (currentIndex === -1) {
      allSteps[0].classList.add('active');
      allSteps[0].style.display = '';
      currentIndex = 0;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < allSteps.length) {
      allSteps[currentIndex].classList.remove('active');
      allSteps[currentIndex].style.display = 'none';
      allSteps[nextIndex].classList.add('active');
      allSteps[nextIndex].style.display = '';
    }
  }

  prevStep(popupElement) {
    if (!popupElement) return;

    let steps = popupElement.querySelector('.popup__content .popup__step');
    let container = popupElement.querySelector('.popup__content');

    if (!steps) {
      steps = popupElement.querySelector('.popup__wrapper .popup__step');
      container = popupElement.querySelector('.popup__wrapper');
    }

    if (!steps || !container) return;

    const allSteps = container.querySelectorAll('.popup__step');
    if (allSteps.length === 0) return;

    let currentIndex = -1;
    allSteps.forEach((step, index) => {
      if (step.classList.contains('active')) {
        currentIndex = index;
      }
    });

    if (currentIndex === -1) {
      allSteps.forEach((step, index) => {
        if (step.style.display !== 'none' && !step.classList.contains('active')) {
          step.classList.add('active');
          currentIndex = index;
        }
      });
    }

    if (currentIndex === -1) {
      allSteps[0].classList.add('active');
      allSteps[0].style.display = '';
      currentIndex = 0;
    }

    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      allSteps[currentIndex].classList.remove('active');
      allSteps[currentIndex].style.display = 'none';
      allSteps[prevIndex].classList.add('active');
      allSteps[prevIndex].style.display = '';
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
    if (this._isShowingBtnSent) return;

    if (element.classList.contains(this.options.classes.btnSentOpen)) {
      const elementId = element.getAttribute('id') || element.getAttribute('data-id');
      if (elementId && this.btnSentHideTimeouts[elementId]) {
        clearTimeout(this.btnSentHideTimeouts[elementId]);
        delete this.btnSentHideTimeouts[elementId];
      }
      this.stopBtnSentTimer();
      this.startBtnSentTimer(2500);
      return;
    }

    this._isShowingBtnSent = true;

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
      this._isShowingBtnSent = false;
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
        resetPopupSteps(this.targetOpen.element);
        if (typeof window.refreshShowMore === 'function') {
          requestAnimationFrame(() => window.refreshShowMore());
        }
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
    let elementToClose = this.previousOpen.element;

    if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
      this.previousOpen.selector = selectorValue;
    }

    if (selectorValue && selectorValue.nodeType === 1) {
      elementToClose = selectorValue;
    }

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
    if (elementToClose) {
      elementToClose.classList.remove(this.options.classes.popupActive);
      const videoElement = elementToClose.querySelector("video");
      if (videoElement) videoElement.pause();
      elementToClose.setAttribute("aria-hidden", "true");

      const forms = elementToClose.querySelectorAll('form');
      forms.forEach(form => {
        FormValidate.formClean(form);
      });

      setTimeout(() => {
        resetPopupSteps(elementToClose);
      }, 300);
    }
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

function resetPopupSteps(popup) {
  if (!popup) return;

  let steps = popup.querySelector('.popup__content .popup__step');
  let container = popup.querySelector('.popup__content');

  if (!steps) {
    steps = popup.querySelector('.popup__wrapper .popup__step');
    container = popup.querySelector('.popup__wrapper');
  }

  if (!steps || !container) return;

  const allSteps = container.querySelectorAll('.popup__step');
  if (allSteps.length === 0) return;

  allSteps.forEach((step, index) => {
    if (index === 0) {
      step.classList.add('active');
      step.style.display = '';
    } else {
      step.classList.remove('active');
      step.style.display = 'none';
    }
  });

  const errorElements = popup.querySelectorAll('._form-error');
  errorElements.forEach(el => el.classList.remove('_form-error'));

  const formErrorMessages = popup.querySelectorAll('.form__error');
  formErrorMessages.forEach(el => el.remove());

  const formInputTels = popup.querySelectorAll('.form-input-tel');
  formInputTels.forEach(el => el.classList.remove('_form-error'));

  const formSelects = popup.querySelectorAll('.form-select');
  formSelects.forEach(el => el.classList.remove('_form-error'));
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
