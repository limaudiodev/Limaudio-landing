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
        el: swiperContainer.querySelector(".custom-scrollbar"),
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

// Инициализация переключения цветов для proposal__card
function initProposalColorSwitchers() {
  const proposalCards = document.querySelectorAll(".proposal__card");

  proposalCards.forEach((card) => {
    const colorButtons = card.querySelectorAll(".proposal__color button");
    const proposalSwiper = card.querySelector(".proposalSwiper");

    if (!colorButtons.length || !proposalSwiper) return;

    // Данные изображений для каждого цвета
    const colorImages = {
      gray: [
        "./src/images/proposal/KEF_Q_Concerto_ Meta3.webp",
        "./src/images/proposal/gray.webp",
        "./src/images/proposal/KEF_Q_Concerto_ Meta4.webp",
      ],
      white: [
        "./src/images/proposal/white.webp",
        "./src/images/acoustics.webp",
        "./src/images/ready/ready-min.webp",
      ],
      black: [
        "./src/images/kef_kc_62.webp",
        "./src/images/proposal/black.webp",
        "./src/images/kef_ci3160.webp",
      ],
    };

    function updateColorSelection(selectedColor) {
      // Обновляем состояние кнопок
      colorButtons.forEach((btn) => {
        const isPressed = btn.dataset.sort === selectedColor;
        btn.setAttribute("aria-pressed", isPressed);
      });

      // Получаем swiper instance
      const swiper = proposalSwiper.swiper;
      if (!swiper || !colorImages[selectedColor]) return;

      const newSlides = colorImages[selectedColor]
        .map(
          (src) =>
            `<div class="swiper-slide"><img src="${src}" alt="${selectedColor}" /></div>`,
        )
        .join("");

      proposalSwiper.querySelector(".swiper-wrapper").innerHTML = newSlides;

      // Убираем класс активности со всех слайдов
      proposalSwiper.querySelectorAll(".swiper-slide").forEach((slide) => {
        slide.classList.remove("swiper-slide-thumb-active");
      });

      swiper.update();

      // Небольшая задержка для корректного переключения слайда
      setTimeout(() => {
        swiper.slideToLoop(0);

        // Вручную добавляем класс активного слайда
        const firstSlide = proposalSwiper.querySelector(".swiper-slide");
        if (firstSlide) {
          firstSlide.classList.add("swiper-slide-thumb-active");
        }
      }, 50);
    }

    // Устанавливаем серый цвет по умолчанию
    updateColorSelection("gray");

    colorButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const color = this.dataset.sort;
        updateColorSelection(color);
      });
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initProposalSwipers();
    // Небольшая задержка, чтобы слайдеры успели инициализироваться
    setTimeout(() => {
      initProposalColorSwitchers();
    }, 100);
  });
} else {
  initProposalSwipers();
  setTimeout(() => {
    initProposalColorSwitchers();
  }, 100);
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
