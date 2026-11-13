/*
  Анимация создания базы
 */

// Длительность раскрытия/сворачивания, мс
const USERS_TAB_DURATION = 400;

class PopupBaseObserver {
  static init() {
    const observer = new MutationObserver(() => {
      const popupSteps = document.querySelectorAll('.popup__step.popup-base-created.active');
      const popups = document.querySelectorAll('.popup-base-created.popup_show');

      popupSteps.forEach(step => PopupBaseObserver.process(step));
      popups.forEach(popup => PopupBaseObserver.process(popup));

      PopupBaseObserver.scheduleUsersTabReset();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    PopupBaseObserver.initUsersTab();
  }

  static process(container) {
    const usersTab = container.querySelector('[data-users-tab]');
    if (usersTab && !usersTab.classList.contains('active')) return;

    const addBaseCreat = container.querySelector('.add-base-creat');
    const popupContent = container.querySelector('.popup-content-creat');

    if (addBaseCreat && popupContent && !addBaseCreat.classList.contains('active') && !popupContent.classList.contains('hidden')) {
      addBaseCreat.classList.add('active');

      const finish = () => {
        if (usersTab) {
          if (!addBaseCreat.classList.contains('active')) return;
          PopupBaseObserver.revealUsersList(popupContent);
        } else {
          popupContent.classList.add('hidden');
          requestAnimationFrame(() => {
            if (window.refreshShowMore) window.refreshShowMore();
          });
        }
      };

      const animatedLine = addBaseCreat.querySelector('.line span');
      if (animatedLine) {
        const clonedLine = animatedLine.cloneNode(true);
        animatedLine.parentNode.replaceChild(clonedLine, animatedLine);
        clonedLine.addEventListener('animationend', finish, { once: true });
      } else {
        finish();
      }
    }
  }

  static revealUsersList(content) {
    clearTimeout(content._timer);

    content.style.overflow = 'hidden';
    content.style.height = content.offsetHeight + 'px';

    content.classList.add('loaded');
    if (window.refreshShowMore) window.refreshShowMore();

    content._timer = setTimeout(() => {
      content.style.transition = `height ${USERS_TAB_DURATION}ms ease`;
      content.style.height = content.scrollHeight + 'px';

      content._timer = setTimeout(() => {
        PopupBaseObserver.clearInline(content);
      }, USERS_TAB_DURATION);
    }, 30);
  }

  static clearInline(el) {
    el.style.removeProperty('height');
    el.style.removeProperty('overflow');
    el.style.removeProperty('transition');
  }

  static initUsersTab() {
    const setOpen = (tab, container, isOpen) => {
      const content = container.querySelector('.popup-content-creat');
      if (!content) return;

      clearTimeout(content._timer);
      tab.classList.toggle('active', isOpen);

      if (isOpen) {
        content.classList.add('open');

        PopupBaseObserver.process(container);
        if (window.refreshShowMore) window.refreshShowMore();

        content.style.overflow = 'hidden';
        content.style.height = '0px';
        content.style.transition = `height ${USERS_TAB_DURATION}ms ease`;
        content.offsetHeight;
        content.style.height = content.scrollHeight + 'px';

        content._timer = setTimeout(() => {
          PopupBaseObserver.clearInline(content);
        }, USERS_TAB_DURATION);
      } else {
        content.style.overflow = 'hidden';
        content.style.height = content.offsetHeight + 'px';
        content.style.transition = `height ${USERS_TAB_DURATION}ms ease`;
        content.offsetHeight;
        content.style.height = '0px';

        content._timer = setTimeout(() => {
          content.classList.remove('open');
          PopupBaseObserver.clearInline(content);

          const showMoreBlock = content.querySelector('[data-showmore]');
          if (showMoreBlock && showMoreBlock.classList.contains('_showmore-active')) {
            showMoreBlock.classList.remove('_showmore-active');
            if (window.refreshShowMore) window.refreshShowMore();
          }
        }, USERS_TAB_DURATION);
      }
    };

    document.addEventListener('click', (e) => {
      const tab = e.target.closest('[data-users-tab]');
      if (!tab) return;
      const container = tab.closest('.popup-base-created');
      if (!container) return;
      setOpen(tab, container, !tab.classList.contains('active'));
    });

    document.addEventListener('click', (e) => {
      const collapse = e.target.closest('[data-users-collapse]');
      if (!collapse) return;
      const container = collapse.closest('.popup-base-created');
      const tab = container && container.querySelector('[data-users-tab]');
      if (!tab) return;

      e.stopPropagation();
      setOpen(tab, container, false);
    }, true);
  }

  static scheduleUsersTabReset() {
    document.querySelectorAll('[data-users-tab]').forEach((tab) => {
      const container = tab.closest('.popup-base-created');
      if (!container || container._usersResetTimer) return;

      const isShown = () => container.classList.contains('popup_show') || container.classList.contains('active');
      if (isShown()) return;

      const content = container.querySelector('.popup-content-creat');
      const dirty = tab.classList.contains('active') || (content && content.classList.contains('loaded'));
      if (!dirty) return;

      container._usersResetTimer = setTimeout(() => {
        container._usersResetTimer = null;
        if (!isShown()) PopupBaseObserver.resetUsersTab(container);
      }, 600);
    });
  }

  static resetUsersTab(container) {
    const tab = container.querySelector('[data-users-tab]');
    const content = container.querySelector('.popup-content-creat');
    const loader = container.querySelector('.add-base-creat');
    if (!tab) return;

    tab.classList.remove('active');

    if (content) {
      clearTimeout(content._timer);
      content.classList.remove('open', 'loaded');
      PopupBaseObserver.clearInline(content);

      const showMoreBlock = content.querySelector('[data-showmore]');
      if (showMoreBlock) showMoreBlock.classList.remove('_showmore-active');
    }
    if (loader) loader.classList.remove('active');
  }
}

PopupBaseObserver.init();
