class PopupSystems {
  static init() {
    const popup = document.querySelector('.popup-system');
    if (!popup) return;

    const body = popup.querySelector('.popup-systems__body');
    const block = popup.querySelector('.popup-systems-block');
    const btnOut = popup.querySelector('[data-users-out]');
    const btnBack = popup.querySelector('[data-users-out-back]');
    const btnTab = popup.querySelector('[data-users-tab]');
    const btnClose = popup.querySelectorAll('[data-close]');

    if (!body || !block || !btnOut) return;

    const DURATION = 300;
    let timer = null;

    const cleanStyles = () => {
      clearTimeout(timer);
      body.style.height = '';
      body.style.overflow = '';
      body.style.transition = '';
      block.style.opacity = '';
      block.style.transition = '';
    };

    const openConfirm = () => {
      if (body.classList.contains('is-confirm')) return;

      cleanStyles();

      const startHeight = body.offsetHeight;

      body.classList.add('is-confirm');
      btnOut.classList.add('active');
      block.style.display = 'flex';

      const endHeight = body.offsetHeight;

      if (startHeight === endHeight) return;

      body.style.overflow = 'hidden';
      body.style.height = `${startHeight}px`;
      block.style.opacity = '0';

      body.offsetHeight;

      body.style.transition = `height ${DURATION}ms ease`;
      block.style.transition = `opacity ${DURATION}ms ease`;
      body.style.height = `${endHeight}px`;
      block.style.opacity = '1';

      timer = setTimeout(cleanStyles, DURATION);
    };

    const closeConfirm = () => {
      if (!body.classList.contains('is-confirm')) return;
      cleanStyles();
      block.style.display = 'none';
      body.classList.remove('is-confirm');
      btnOut.classList.remove('active');
    };

    btnOut.addEventListener('click', openConfirm);

    if (btnBack) btnBack.addEventListener('click', closeConfirm);

    if (btnTab) btnTab.addEventListener('click', closeConfirm);

    btnClose.forEach((btn) => btn.addEventListener('click', closeConfirm));
  }
}

PopupSystems.init();
