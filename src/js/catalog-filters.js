(function () {
  const MOBILE_MQ = window.matchMedia("(max-width: 768px)");
  const MODAL_TRANSITION_MS = 350;

  const openBtn = document.getElementById("catalogFiltersBtn");
  const modal = document.getElementById("catalogFiltersModal");
  const slot = document.getElementById("catalogFiltersSlot");
  const modalBody = document.getElementById("catalogFiltersModalBody");
  const filters = document.getElementById("catalogFilters");

  if (!openBtn || !modal || !slot || !modalBody || !filters) {
    return;
  }

  const closeTriggers = modal.querySelectorAll("[data-filters-close]");
  const applyBtn = filters.querySelector(".btn-black-bg-black");
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  let closeTimer = null;
  let resizeDebounceTimer = null;

  function isMobile() {
    return MOBILE_MQ.matches;
  }

  function isModalOpen() {
    return modal.classList.contains("catalog-filters-modal--open");
  }

  function setOpenState(isOpen) {
    openBtn.setAttribute("aria-expanded", String(isOpen));
    openBtn.setAttribute("aria-pressed", String(isOpen));
  }

  function placeFilters() {
    const target = isMobile() ? modalBody : slot;

    if (filters.parentElement !== target) {
      target.appendChild(filters);
    }

    if (!isMobile()) {
      closeModal(true);
    }
  }

  function openModal() {
    if (!isMobile() || isModalOpen()) {
      return;
    }

    clearTimeout(closeTimer);
    closeTimer = null;

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    setOpenState(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.classList.add("catalog-filters-modal--open");
        firstFocusable?.focus();
      });
    });
  }

  function clearCloseTimer() {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  }

  function closeModal(instant) {
    if (!isModalOpen()) {
      return;
    }

    modal.classList.remove("catalog-filters-modal--open");
    setOpenState(false);
    document.body.style.overflow = "";

    const finishClose = () => {
      modal.hidden = true;
      if (openBtn.offsetParent !== null) {
        openBtn.focus();
      }
    };

    if (instant) {
      clearCloseTimer();
      finishClose();
      return;
    }

    clearCloseTimer();
    closeTimer = window.setTimeout(() => {
      closeTimer = null;
      finishClose();
    }, MODAL_TRANSITION_MS);
  }

  function handleKeydown(event) {
    if (!isModalOpen()) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key === "Tab") {
      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable?.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable?.focus();
      }
    }
  }

  function handleResize() {
    clearTimeout(resizeDebounceTimer);
    resizeDebounceTimer = setTimeout(placeFilters, 100);
  }

  openBtn.addEventListener("click", () => {
    if (!isMobile()) return;
    isModalOpen() ? closeModal() : openModal();
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => closeModal());
  });

  if (applyBtn) {
    applyBtn.addEventListener("click", () => closeModal());
  }

  document.addEventListener("keydown", handleKeydown);
  MOBILE_MQ.addEventListener("change", handleResize);

  placeFilters();
})();
