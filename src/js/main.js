const burgerBtn = document.getElementById("burgerBtn");
const mobileOverlay = document.getElementById("mobileOverlay");
const mobileMenu = document.getElementById("mobileMenu");

function openMobileMenu() {
  mobileOverlay.classList.add("open");
  mobileMenu.classList.add("open");
  burgerBtn.classList.add("active");
  document.body.style.overflow = "hidden";
  burgerBtn.setAttribute("aria-label", "Закрыть меню");
}

function closeMobileMenu() {
  mobileOverlay.classList.remove("open");
  mobileMenu.classList.remove("open");
  burgerBtn.classList.remove("active");
  document.body.style.overflow = "";
  burgerBtn.setAttribute("aria-label", "Открыть меню");
}

burgerBtn.addEventListener("click", () => {
  if (mobileOverlay.classList.contains("open")) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
});
