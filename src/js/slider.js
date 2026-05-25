function initProposalSwipers() {
  const allSwipers = document.querySelectorAll(".proposalSwiper");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  allSwipers.forEach((swiperContainer, containerIndex) => {
    const uniqueClass = `proposalSwiper_${containerIndex}`;
    swiperContainer.classList.add(uniqueClass);

    const autoplayConfig = prefersReducedMotion
      ? false
      : {
          delay: 500,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          stopOnLastSlide: false,
          waitForTransition: true,
        };

    const swiper = new Swiper(`.${uniqueClass}`, {
      scrollbar: {
        el: swiperContainer.querySelector(".proposal-scrollbar"),
        draggable: true,
      },
      autoplay: autoplayConfig,
      speed: prefersReducedMotion ? 300 : 600,
      loop: true,

      a11y: {
        enabled: true,
        prevSlideMessage: "Предыдущий слайд",
        nextSlideMessage: "Следующий слайд",
        paginationBulletMessage: "Перейти к слайду {{index}}",
      },
    });

    if (!prefersReducedMotion) {
      swiper.autoplay.stop();
    }

    const scrollbarContainer =
      swiperContainer.querySelector(".custom-scrollbar");
    if (scrollbarContainer) {
      scrollbarContainer.innerHTML = "";
      const originalSlides = Array.from(swiper.slides).filter(
        (slide) => !slide.classList.contains("swiper-slide-duplicate"),
      );
      const slidesCount = originalSlides.length;

      for (let i = 0; i < slidesCount; i++) {
        const tick = document.createElement("div");
        tick.classList.add("tick");
        tick.setAttribute("role", "tab");
        tick.setAttribute("aria-label", `Перейти к слайду ${i + 1}`);
        if (i === 0) tick.classList.add("active");

        const slideIndex = i;
        tick.addEventListener("click", () => {
          swiper.slideToLoop(slideIndex);
        });

        scrollbarContainer.appendChild(tick);
      }

      swiper.on("slideChange", function () {
        const activeIndex = swiper.realIndex; // realIndex игнорирует клоны
        const ticks = scrollbarContainer.querySelectorAll(".tick");
        ticks.forEach((tick, idx) => {
          if (idx === activeIndex) {
            tick.classList.add("active");
            tick.setAttribute("aria-selected", "true");
          } else {
            tick.classList.remove("active");
            tick.setAttribute("aria-selected", "false");
          }
        });
      });
    }

    if (prefersReducedMotion) {
      swiperContainer.swiper = swiper;
      return;
    }

    let isHovering = false;
    let timeoutId = null;
    let pauseTimeoutId = null;

    const startAutoplay = () => {
      if (isHovering && swiper.autoplay && !swiper.autoplay.running) {
        swiper.autoplay.start();
      }
    };

    const stopAutoplay = () => {
      if (swiper.autoplay && swiper.autoplay.running) {
        swiper.autoplay.stop();
      }
    };

    const originalSlides = Array.from(
      swiperContainer.querySelectorAll(".swiper-slide"),
    ).filter((slide) => !slide.classList.contains("swiper-slide-duplicate"));

    originalSlides.forEach((slide) => {
      slide.addEventListener("mouseenter", () => {
        isHovering = true;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(startAutoplay, 100);
      });

      slide.addEventListener("mouseleave", () => {
        isHovering = false;
        clearTimeout(timeoutId);
        stopAutoplay();
      });
    });

    if (scrollbarContainer) {
      scrollbarContainer.addEventListener("mouseenter", () => {
        if (isHovering) stopAutoplay();
      });

      scrollbarContainer.addEventListener("mouseleave", () => {
        if (isHovering) startAutoplay();
      });

      // Клик по tick - пауза на 3 секунды
      scrollbarContainer.querySelectorAll(".tick").forEach((tick) => {
        tick.addEventListener("click", () => {
          if (isHovering) {
            stopAutoplay();
            clearTimeout(pauseTimeoutId); // ✅ ИСПРАВЛЕНО: очищаем предыдущий таймаут
            pauseTimeoutId = setTimeout(() => {
              if (isHovering) startAutoplay();
            }, 3000);
          }
        });
      });
    }

    swiperContainer.swiper = swiper;
  });
}

const style = document.createElement("style");
style.textContent = `
  @media (prefers-reduced-motion: reduce) {
    .proposalSwiper .swiper-slide,
    .proposalSwiper .swiper-wrapper,
    .proposalSwiper .tick {
      transition: none !important;
    }
  }
  
  /* Улучшенные стили для доступности */
  .custom-scrollbar {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-top: 16px;
  }
  
  .tick {
    width: 40px;
    height: 4px;
    background-color: #ccc;
    cursor: pointer;
    transition: background-color 0.3s ease;
    border-radius: 2px;
  }
  
  .tick.active {
    background-color: #007aff;
  }
  
  .tick:hover {
    background-color: #999;
  }
  
  .tick:focus-visible {
    outline: 2px solid #007aff;
    outline-offset: 2px;
  }
`;
document.head.appendChild(style);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProposalSwipers);
} else {
  initProposalSwipers();
}
