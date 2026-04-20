(function () {
  const STAR_COUNT = 5;
  let currentRating = 0;
  let starElements = [];

  const container = document.getElementById("starsContainer");

  function updateStarsUI() {
    for (let i = 0; i < starElements.length; i++) {
      if (i < currentRating) {
        starElements[i].classList.add("selected");
      } else {
        starElements[i].classList.remove("selected");
      }
    }
  }

  function onStarClick(clickedIndex) {
    const newRating = clickedIndex + 1;

    if (currentRating === newRating) {
      currentRating = 0;
    } else {
      currentRating = newRating;
    }

    updateStarsUI();
  }

  function buildStars() {
    container.innerHTML = "";
    starElements = [];

    for (let i = 0; i < STAR_COUNT; i++) {
      const starBtn = document.createElement("button");
      starBtn.className = "star";
      starBtn.innerHTML = "★";
      starBtn.setAttribute("aria-label", `Оценка ${i + 1} звезда`);
      starBtn.setAttribute("data-index", i);
      starBtn.addEventListener(
        "click",
        (function (idx) {
          return function () {
            onStarClick(idx);
          };
        })(i),
      );

      container.appendChild(starBtn);
      starElements.push(starBtn);
    }
    updateStarsUI();
  }

  buildStars();
})();
