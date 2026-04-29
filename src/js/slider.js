var swiper = new Swiper(".proposalSwiper", {
  scrollbar: {
    el: ".proposal-scrollbar",
    draggable: true,
  },
});

const scrollbar = document.querySelector(".custom-scrollbar");
const slidesCount = swiper.slides.length;

for (let i = 0; i < slidesCount; i++) {
  const tick = document.createElement("div");
  tick.classList.add("tick");
  if (i === 0) tick.classList.add("active");

  tick.addEventListener("click", () => {
    swiper.slideTo(i);
  });

  scrollbar.appendChild(tick);
}

swiper.on("slideChange", function () {
  const activeIndex = swiper.activeIndex;
  document
    .querySelectorAll(".custom-scrollbar .dots")
    .forEach((tick, index) => {
      if (index === activeIndex) {
        tick.classList.add("active");
      } else {
        tick.classList.remove("active");
      }
    });
});
