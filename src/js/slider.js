function initProposalSwipers() {
  const allSwipers = document.querySelectorAll(".proposalSwiper");

  allSwipers.forEach((swiperContainer, containerIndex) => {
    const uniqueClass = `proposalSwiper_${containerIndex}`;
    swiperContainer.classList.add(uniqueClass);

    const swiper = new Swiper(`.${uniqueClass}`, {
      scrollbar: {
        el: swiperContainer.querySelector(".proposal-scrollbar"),
        draggable: true,
      },
      autoplay: {
        delay: 500,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
        stopOnLastSlide: false,
      },
      speed: 600,
      loop: true,
    });

    swiper.autoplay.stop();

    const scrollbarContainer =
      swiperContainer.querySelector(".custom-scrollbar");
    if (scrollbarContainer) {
      scrollbarContainer.innerHTML = "";
      const slidesCount = swiper.slides.length;

      for (let i = 0; i < slidesCount; i++) {
        const tick = document.createElement("div");
        tick.classList.add("tick");
        if (i === 0) tick.classList.add("active");

        const slideIndex = i;
        tick.addEventListener("click", () => {
          swiper.slideToLoop(slideIndex);
        });

        scrollbarContainer.appendChild(tick);
      }

      swiper.on("slideChange", function () {
        const activeIndex = swiper.realIndex;
        const ticks = scrollbarContainer.querySelectorAll(".tick");
        ticks.forEach((tick, idx) => {
          if (idx === activeIndex) {
            tick.classList.add("active");
          } else {
            tick.classList.remove("active");
          }
        });
      });
    }

    let isHovering = false;
    let timeoutId = null;

    const startAutoplay = () => {
      if (isHovering && swiper.autoplay && !swiper.autoplay.running) {
        swiper.autoplay.start();
        console.log(`Слайдер ${containerIndex}: автоплей запущен`);
      }
    };

    const stopAutoplay = () => {
      if (swiper.autoplay && swiper.autoplay.running) {
        swiper.autoplay.stop();
        console.log(`Слайдер ${containerIndex}: автоплей остановлен`);
      }
    };

    const slides = swiperContainer.querySelectorAll(".swiper-slide");

    slides.forEach((slide) => {
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
            setTimeout(() => {
              if (isHovering) startAutoplay();
            }, 3000);
          }
        });
      });
    }

    swiperContainer.swiper = swiper;
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProposalSwipers);
} else {
  initProposalSwipers();
}
