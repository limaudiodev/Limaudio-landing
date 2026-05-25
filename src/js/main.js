(function () {
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const mobileMenu = document.getElementById("mobileMenu");

  let escapeHandler = null;
  let overlayClickHandler = null;

  function validateElements() {
    const missing = [];
    if (!burgerBtn) missing.push("#burgerBtn");
    if (!mobileOverlay) missing.push("#mobileOverlay");
    if (!mobileMenu) missing.push("#mobileMenu");

    if (missing.length > 0) {
      console.error(
        `Отсутствуют необходимые элементы для мобильного меню: ${missing.join(", ")}`,
      );
      return false;
    }
    return true;
  }

  function isMenuOpen() {
    return mobileOverlay && mobileOverlay.classList.contains("open");
  }

  function openMobileMenu() {
    if (!validateElements()) return;
    if (isMenuOpen()) return;

    mobileOverlay.classList.add("open");
    mobileMenu.classList.add("open");
    burgerBtn.classList.add("active");
    document.body.style.overflow = "hidden";

    burgerBtn.setAttribute("aria-expanded", "true");
    burgerBtn.setAttribute("aria-label", "Закрыть меню");

    if (escapeHandler) {
      document.removeEventListener("keydown", escapeHandler);
    }
    if (overlayClickHandler && mobileOverlay) {
      mobileOverlay.removeEventListener("click", overlayClickHandler);
    }

    escapeHandler = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMobileMenu();
      }
    };

    overlayClickHandler = (e) => {
      if (e.target === mobileOverlay) {
        closeMobileMenu();
      }
    };

    document.addEventListener("keydown", escapeHandler);
    mobileOverlay.addEventListener("click", overlayClickHandler);
  }

  function closeMobileMenu() {
    if (!validateElements()) return;
    if (!isMenuOpen()) return;

    mobileOverlay.classList.remove("open");
    mobileMenu.classList.remove("open");
    burgerBtn.classList.remove("active");
    document.body.style.overflow = "";

    burgerBtn.setAttribute("aria-expanded", "false");
    burgerBtn.setAttribute("aria-label", "Открыть меню");

    if (burgerBtn && burgerBtn.offsetParent !== null) {
      burgerBtn.focus();
    }

    if (escapeHandler) {
      document.removeEventListener("keydown", escapeHandler);
      escapeHandler = null;
    }
    if (overlayClickHandler && mobileOverlay) {
      mobileOverlay.removeEventListener("click", overlayClickHandler);
      overlayClickHandler = null;
    }
  }

  if (burgerBtn) {
    burgerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (isMenuOpen()) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  } else {
    const observer = new MutationObserver(() => {
      const newBurgerBtn = document.getElementById("burgerBtn");
      if (newBurgerBtn && !burgerBtn) {
        newBurgerBtn.addEventListener("click", (e) => {
          e.preventDefault();
          if (isMenuOpen()) {
            closeMobileMenu();
          } else {
            openMobileMenu();
          }
        });
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && isMenuOpen()) {
      closeMobileMenu();
    }
  });
})();
