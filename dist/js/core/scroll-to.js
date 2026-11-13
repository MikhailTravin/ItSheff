/*
  Плавная прокрутка к блоку
 */

const GOTO_DEBUG = true; // выключить: false

const gotoLog = (...args) => {
  if (GOTO_DEBUG) console.log('[goto]', ...args);
};
let gotoSession = 0;
['wheel', 'touchstart', 'keydown'].forEach((type) => {
  window.addEventListener(type, () => { gotoSession++; }, { passive: true });
});

const isHeaderFixed = () => {
  const header = document.querySelector('header.header');
  if (!header) return false;
  const position = getComputedStyle(header).position;
  return position === 'fixed' || position === 'sticky';
};

const gotoClamp = (y) => {
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  return Math.min(Math.max(y, 0), max);
};

const gotoResolve = (rawTop, useHeader, forcedTop) => {
  if (!useHeader) {
    return { offset: 0, dest: gotoClamp(rawTop), top: undefined };
  }

  if (typeof window.headerResolveScroll === 'function') {
    return window.headerResolveScroll(rawTop, forcedTop);
  }

  const header = document.querySelector('header.header');
  const offset = Math.max(0, Math.round(header.getBoundingClientRect().bottom));
  return { offset, dest: gotoClamp(rawTop - offset), top: undefined };
};

const gotoPrepareHeader = (plan) => {
  if (typeof window.headerPrepareScroll === 'function') {
    window.headerPrepareScroll(plan);
  }
};

const gotoSettle = (el, useHeader, offsetTop, plan, session, attempt = 0) => {
  const QUIET_MS = 300;
  const MAX_ATTEMPTS = 3;
  const startedAt = performance.now();
  let lastY = window.scrollY;
  let quietSince = startedAt;

  const step = (now) => {
    if (session !== gotoSession) return;

    const y = window.scrollY;
    if (Math.abs(y - lastY) > 0.5) {
      lastY = y;
      quietSince = now;
    }

    if (now - startedAt > 5000) return;
    if (now - quietSince < QUIET_MS) {
      requestAnimationFrame(step);
      return;
    }

    const rawTop = el.getBoundingClientRect().top + window.scrollY - offsetTop;

    const next = typeof window.headerResolveScroll === 'function' || !useHeader
      ? gotoResolve(rawTop, useHeader, plan.top)
      : { ...plan, dest: gotoClamp(rawTop - plan.offset) };

    const diff = next.dest - window.scrollY;

    if (Math.abs(diff) <= 2) {
      return;
    }

    if (attempt >= MAX_ATTEMPTS) {
      return;
    }

    if (useHeader) gotoPrepareHeader(next);
    window.scrollTo({ top: next.dest, behavior: 'instant' });
    gotoSettle(el, useHeader, offsetTop, next, session, attempt + 1);
  };

  requestAnimationFrame(step);
};

let gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
  const targetBlockElement = document.querySelector(targetBlock);

  if (!targetBlockElement) {
    return;
  }

  if (document.documentElement.classList.contains('menu-open')) {
    if (typeof menuClose === 'function') {
      menuClose();
    }
  }

  const session = ++gotoSession;

  const elTop = targetBlockElement.getBoundingClientRect().top + window.scrollY;
  const rawTop = elTop - offsetTop;

  const useHeader = noHeader && isHeaderFixed();
  const plan = gotoResolve(rawTop, useHeader);

  if (useHeader) gotoPrepareHeader(plan);

  if (typeof SmoothScroll !== 'undefined') {
    const options = {
      speedAsDuration: true,
      speed: speed,
      header: '',
      offset: elTop - plan.dest,
      easing: 'easeOutQuad',
    };
    new SmoothScroll().animateScroll(targetBlockElement, '', options);
  } else {
    window.scrollTo({
      top: plan.dest,
      behavior: 'smooth',
    });
  }

  gotoSettle(targetBlockElement, useHeader, offsetTop, plan, session);
};