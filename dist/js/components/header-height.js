class HeaderHeight {
  static init() {
    const header = document.querySelector('.header');
    if (!header) return;

    const headerTop = header.querySelector('.header__top');
    if (!headerTop) return;

    const headerBottom = header.querySelector('.header-bottom');
    const canHideTop = !!headerBottom;
    const body = document.body;

    const triggerSelector = header.dataset.headerBottomTrigger;
    const triggers = triggerSelector
      ? Array.from(document.querySelectorAll(triggerSelector))
      : [];
    const hasReveal = !!headerBottom && triggers.length > 0;

    let lastScrollY = window.scrollY;
    let isHidden = false;
    let ticking = false;
    let bottomShown = !hasReveal;

    let programmatic = false;
    let programmaticTimer = null;
    const PROGRAMMATIC_QUIET_MS = 200;

    let topH = 0;
    let bottomH = 0;

    const SCROLL_THRESHOLD = 10;
    const START_HIDE_AFTER = 100;
    const SAFE = 4;

    const lastVars = {};
    function setVar(name, value) {
      if (lastVars[name] === value) return;
      document.documentElement.style.setProperty(name, value);
      lastVars[name] = value;
    }

    function measure() {
      topH = headerTop ? headerTop.offsetHeight : 0;
      bottomH = headerBottom ? headerBottom.offsetHeight : 0;
    }

    function getVisibleHeight() {
      if (hasReveal) {
        return (isHidden ? 0 : topH) + (bottomShown ? bottomH : 0);
      }
      return (canHideTop && isHidden) ? bottomH : topH + bottomH;
    }

    function applyHeaderHeight() {
      const full = topH + (hasReveal ? 0 : bottomH);
      const visible = getVisibleHeight();

      setVar('--header-height', (hasReveal ? full : visible) + 'px');
      setVar('--header-height-full', full + 'px');
      setVar('--header-visible', visible + 'px');
      setVar('--header-top-height', topH + 'px');
      setVar('--header-sub-visible', (bottomShown ? bottomH : 0) + 'px');
    }

    function updateHeaderHeight() {
      measure();
      applyHeaderHeight();
    }

    function getRevealY() {
      const target = triggers.find((el) => el.getClientRects().length);
      if (!target) return null;
      return target.getBoundingClientRect().bottom + window.scrollY - (topH + bottomH);
    }

    function updateBottomReveal() {
      if (!hasReveal) return;

      const revealY = getRevealY();
      if (revealY === null) return;

      const show = window.scrollY >= revealY;
      if (show === bottomShown) return;

      bottomShown = show;
      header.classList.toggle('header--bottom-visible', show);
      headerBottom.inert = !show;

      applyHeaderHeight();
    }

    const buySelector = header.dataset.headerBuyTrigger;
    const buyTriggers = buySelector
      ? Array.from(document.querySelectorAll(buySelector))
      : [];
    let buyShown = null;

    function updateBuyReveal() {
      if (!buyTriggers.length) return;

      const buy = header.querySelector(':scope > .header-bottom__right');
      if (!buy) {
        if (buyShown !== null) {
          buyShown = null;
          header.classList.remove('header--buy-visible');
          const moved = header.querySelector('.header-bottom__right');
          if (moved) moved.inert = false;
        }
        return;
      }

      const target = buyTriggers.find((el) => el.getClientRects().length);
      if (!target) return;

      const show = target.getBoundingClientRect().bottom <= topH;
      if (show === buyShown) return;

      buyShown = show;
      header.classList.toggle('header--buy-visible', show);
      buy.inert = !show;
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

    function endProgrammatic() {
      programmatic = false;
      programmaticTimer = null;
      lastScrollY = window.scrollY;
      updateBottomReveal();
    }

    function holdProgrammatic() {
      programmatic = true;
      clearTimeout(programmaticTimer);
      programmaticTimer = setTimeout(endProgrammatic, PROGRAMMATIC_QUIET_MS);
    }

    function onScroll() {
      updateBottomReveal();
      updateBuyReveal();

      if (programmatic) {
        holdProgrammatic();
        lastScrollY = window.scrollY;
        ticking = false;
        return;
      }

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

    function refresh() {
      updateHeaderHeight();
      updateBottomReveal();
      updateBuyReveal();
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

    window.addEventListener('resize', refresh);
    window.addEventListener('load', refresh);
    window.addEventListener('pageshow', refresh);

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh);
    }

    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(refresh);
      ro.observe(headerTop);
      if (headerBottom) ro.observe(headerBottom);
    }

    function topVisibleAt(destY, fromY) {
      if (!canHideTop) return true;
      if (destY <= START_HIDE_AFTER) return true;
      if (destY > fromY) return false;
      if (destY < fromY) return true;
      return !isHidden;
    }

    function planForTop(rawTop, topV) {
      const topPart = topV ? topH : 0;
      const withSub = topPart + bottomH;

      if (!hasReveal) {
        return { top: topV, bottom: true, offset: withSub, dest: rawTop - withSub };
      }

      const revealY = getRevealY();
      if (revealY === null) {
        return { top: topV, bottom: false, offset: topPart, dest: rawTop - topPart };
      }

      const destWith = rawTop - withSub;
      if (destWith >= revealY + SAFE) {
        return { top: topV, bottom: true, offset: withSub, dest: destWith };
      }

      const destWithout = rawTop - topPart;
      if (destWithout <= revealY - SAFE) {
        return { top: topV, bottom: false, offset: topPart, dest: destWithout };
      }

      return { top: topV, bottom: false, offset: topPart, dest: revealY - SAFE, zone: true };
    }

    window.headerResolveScroll = (rawTop, forcedTop) => {
      const current = window.scrollY;
      const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const frozen = typeof forcedTop === 'boolean';
      const order = frozen ? [forcedTop] : [!isHidden, isHidden];

      let result = null;
      for (const topV of order) {
        const plan = planForTop(rawTop, topV);
        plan.dest = Math.min(Math.max(plan.dest, 0), max);
        if (!result) result = plan;
        if (frozen || topVisibleAt(plan.dest, current) === topV) {
          result = plan;
          break;
        }
      }

      return result;
    };

    window.headerPrepareScroll = (plan) => {
      holdProgrammatic();
      if (canHideTop && plan && typeof plan.top === 'boolean') setHidden(!plan.top);
    };

    window.headerHoldScroll = holdProgrammatic;

    if (hasReveal) headerBottom.inert = !bottomShown;
    refresh();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => HeaderHeight.init());
} else {
  HeaderHeight.init();
}