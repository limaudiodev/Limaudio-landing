(function () {
  const MOBILE_BREAKPOINT = 768;

  const burgerBtn = document.getElementById("burgerBtn");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const mobileMenu = document.getElementById("mobileMenu");

  let escapeHandler = null;
  let overlayClickHandler = null;
  let resizeHandler = null;
  let mutationObserver = null;

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
    return mobileOverlay?.classList.contains("open") ?? false;
  }

  function toggleMenu(shouldOpen) {
    if (!validateElements()) return;

    const isOpen = isMenuOpen();
    if (isOpen === shouldOpen) return;

    mobileOverlay.classList.toggle("open", shouldOpen);
    mobileMenu.classList.toggle("open", shouldOpen);
    burgerBtn.classList.toggle("active", shouldOpen);
    document.body.style.overflow = shouldOpen ? "hidden" : "";

    burgerBtn.setAttribute("aria-expanded", String(shouldOpen));
    burgerBtn.setAttribute(
      "aria-label",
      shouldOpen ? "Закрыть меню" : "Открыть меню",
    );

    if (shouldOpen) {
      setupCloseHandlers();
    } else {
      removeCloseHandlers();
      if (burgerBtn.offsetParent !== null) {
        burgerBtn.focus();
      }
    }
  }

  function setupCloseHandlers() {
    removeCloseHandlers();

    escapeHandler = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        toggleMenu(false);
      }
    };

    overlayClickHandler = (e) => {
      if (e.target === mobileOverlay) {
        toggleMenu(false);
      }
    };

    document.addEventListener("keydown", escapeHandler);
    mobileOverlay.addEventListener("click", overlayClickHandler);
  }

  function removeCloseHandlers() {
    if (escapeHandler) {
      document.removeEventListener("keydown", escapeHandler);
      escapeHandler = null;
    }
    if (overlayClickHandler && mobileOverlay) {
      mobileOverlay.removeEventListener("click", overlayClickHandler);
      overlayClickHandler = null;
    }
  }

  function cleanup() {
    removeCloseHandlers();
    if (resizeHandler) {
      window.removeEventListener("resize", resizeHandler);
    }
    if (mutationObserver) {
      mutationObserver.disconnect();
    }
  }

  function init() {
    if (burgerBtn) {
      burgerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleMenu(!isMenuOpen());
      });
    } else {
      mutationObserver = new MutationObserver(() => {
        const newBurgerBtn = document.getElementById("burgerBtn");
        if (newBurgerBtn) {
          newBurgerBtn.addEventListener("click", (e) => {
            e.preventDefault();
            toggleMenu(!isMenuOpen());
          });
          cleanup();
        }
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    resizeHandler = () => {
      if (window.innerWidth >= MOBILE_BREAKPOINT && isMenuOpen()) {
        toggleMenu(false);
      }
    };

    window.addEventListener("resize", resizeHandler);

    window.addEventListener("beforeunload", cleanup);
  }

  init();
})();
