/**
  Слайдеры рекомендаций
  ------------------------------------------------------------
  Swiper для .block-recommend__slider
 */

class RecommendSliders {
  static baseOptions() {
    return {
      observer: true,
      observeParents: true,
      slidesPerView: "auto",
      spaceBetween: 8,
      slidesPerGroup: 1,
      speed: 400,
      preloadImages: true,

      grabCursor: true,
      freeMode: true,
      freeModeSticky: false,
      freeModeMomentumRatio: 0.6,
    };
  }

  static init() {
    if (document.querySelector('.block-recommend__slider')) {
      const recommendSwiper = new Swiper('.block-recommend__slider', {
        ...RecommendSliders.baseOptions(),
        navigation: {
          prevEl: '.recommend-arrow-prev',
          nextEl: '.recommend-arrow-next',
        },
        breakpoints: {
          768: {
            slidesPerView: "auto",
            spaceBetween: 24,
            slidesPerGroup: 1,
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 24,
            slidesPerGroup: 4,
          },
          1500: {
            slidesPerView: 4,
            spaceBetween: 0,
            slidesPerGroup: 4,
          },
        },
      });
    }

    document.querySelectorAll('.block-recommend__slider.recommend-slider3').forEach((sliderEl) => {
      const block = sliderEl.closest('.block-recommend');
      const prevEl = block.querySelector('.recommend-arrow-prev');
      const nextEl = block.querySelector('.recommend-arrow-next');

      new Swiper(sliderEl, {
        ...RecommendSliders.baseOptions(),
        navigation: {
          prevEl: prevEl,
          nextEl: nextEl,
        },
        breakpoints: {
          768: { slidesPerView: "auto", spaceBetween: 24, slidesPerGroup: 1 },
          1200: { slidesPerView: 3, spaceBetween: 24, slidesPerGroup: 3 },
          1500: { slidesPerView: 3, spaceBetween: 0, slidesPerGroup: 3 },
        },
      });
    });
  }
}

RecommendSliders.init();

/*
  Прокрутка бейджей в карточках рекомендаций
 */

class RecommendBadges {
  static update(el) {
    const max = el.scrollWidth - el.clientWidth;
    const left = el.scrollLeft;
    el.classList.toggle('fade-right', max > 1 && left < max - 1);
    el.classList.toggle('fade-left', left > 1);
  }

  static initOne(el) {
    el.classList.add('swiper-no-swiping');

    const update = () => RecommendBadges.update(el);
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    if ('ResizeObserver' in window) new ResizeObserver(update).observe(el);
    update();

    el.addEventListener('wheel', (e) => {
      if (el.scrollWidth <= el.clientWidth) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      const next = el.scrollLeft + e.deltaY;
      if ((e.deltaY < 0 && el.scrollLeft <= 0) || (e.deltaY > 0 && el.scrollLeft >= max)) return;
      e.preventDefault();
      el.scrollLeft = next;
    }, { passive: false });

    let startX = 0, startLeft = 0, down = false, moved = false;
    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || el.scrollWidth <= el.clientWidth) return;
      down = true; moved = false;
      startX = e.clientX; startLeft = el.scrollLeft;
    });
    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 4) {
        moved = true;
        el.classList.add('dragging');
      }
      if (moved) el.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!down) return;
      down = false;
      el.classList.remove('dragging');
    });
  }

  static init() {
    document.querySelectorAll('.card-recommend__badges').forEach(RecommendBadges.initOne);
  }
}

RecommendBadges.init();