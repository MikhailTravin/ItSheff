/**
 * Слайдеры рекомендаций
 * ------------------------------------------------------------
 * Swiper для .block-recommend__slider.
 *
 * Класс:      RecommendSliders
 * Включается: если на странице есть `.block-recommend__slider`
 * Зависит от: vendor/swiper-8.4.7.min
 * Страницы:   cart-empty, services-product, services-store, services, subscriptions
 */

class RecommendSliders {
  static init() {
    if (document.querySelector('.block-recommend__slider')) {
      const recommendSwiper = new Swiper('.block-recommend__slider', {
        observer: true,
        observeParents: true,
        slidesPerView: "auto",
        spaceBetween: 8,
        slidesPerGroup: 1,
        speed: 400,
        preloadImages: true,
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
        observer: true,
        observeParents: true,
        slidesPerView: "auto",
        spaceBetween: 8,
        slidesPerGroup: 1,
        speed: 400,
        preloadImages: true,
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
