class HeaderHeight {
  static init() {
    const header = document.querySelector('.header');
    if (!header) return;

    const headerTop = header.querySelector('.header__top');
    if (!headerTop) return;

    const headerBottom = header.querySelector('.header-bottom');
    const canHideTop = !!headerBottom;
    const body = document.body;

    let lastScrollY = window.scrollY;
    let isHidden = false;
    let ticking = false;

    let topH = 0;
    let bottomH = 0;

    function measure() {
      topH = headerTop ? headerTop.offsetHeight : 0;
      bottomH = headerBottom ? headerBottom.offsetHeight : 0;
    }

    function getVisibleHeight() {
      return (canHideTop && isHidden) ? bottomH : topH + bottomH;
    }

    function applyHeaderHeight() {
      const full = topH + bottomH;
      const visible = getVisibleHeight();

      document.documentElement.style.setProperty('--header-height-full', full + 'px');
      document.documentElement.style.setProperty('--header-height', visible + 'px');
      document.documentElement.style.setProperty('--header-top-height', topH + 'px');
    }

    function updateHeaderHeight() {
      measure();
      applyHeaderHeight();
    }

    function setHidden(hidden) {
      if (hidden && !canHideTop) return;
      if (hidden === isHidden) return;
      isHidden = hidden;

      if (hidden) {
        header.classList.add('_header-hidden');
        header.classList.remove('_header-fast');
        body.classList.remove('_header-fast');
      } else {
        header.classList.add('_header-fast');
        body.classList.add('_header-fast');
        header.classList.remove('_header-hidden');

        setTimeout(() => {
          header.classList.remove('_header-fast');
          body.classList.remove('_header-fast');
        }, 280);
      }

      applyHeaderHeight();
    }

    const SCROLL_THRESHOLD = 10;
    const START_HIDE_AFTER = 100;

    function onScroll() {
      if (body.classList.contains('_lock')) {
        ticking = false;
        return;
      }

      const currentY = window.scrollY;
      const diff = currentY - lastScrollY;

      if (Math.abs(diff) < SCROLL_THRESHOLD) {
        ticking = false;
        return;
      }

      if (canHideTop) {
        if (diff > 0 && currentY > START_HIDE_AFTER) {
          setHidden(true);
        } else if (diff < 0) {
          setHidden(false);
        }

        if (currentY <= START_HIDE_AFTER && isHidden) {
          setHidden(false);
        }
      }

      lastScrollY = currentY;
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(onScroll);
          ticking = true;
        }
      },
      { passive: true }
    );

    window.addEventListener('resize', updateHeaderHeight);
    window.addEventListener('load', updateHeaderHeight);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(updateHeaderHeight);
    }

    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(updateHeaderHeight);
      ro.observe(headerTop);
      if (headerBottom) ro.observe(headerBottom);
    }

    updateHeaderHeight();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => HeaderHeight.init());
} else {
  HeaderHeight.init();
}
