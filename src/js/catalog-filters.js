(function () {
  const MOBILE_MQ = window.matchMedia("(max-width: 768px)");
  const MODAL_TRANSITION_MS = 350;

  const openBtn = document.getElementById("catalogFiltersBtn");
  const modal = document.getElementById("catalogFiltersModal");
  const slot = document.getElementById("catalogFiltersSlot");
  const modalBody = document.getElementById("catalogFiltersModalBody");
  const filters = document.getElementById("catalogFilters");
  const dialog = modal?.querySelector(".catalog-filters-modal__dialog");

  if (!openBtn || !modal || !slot || !modalBody || !filters || !dialog) {
    return;
  }

  const closeTriggers = modal.querySelectorAll("[data-filters-close]");
  const applyBtn = filters.querySelector(".btn-black-bg-black");

  let closeTimer = null;

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

    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    setOpenState(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        modal.classList.add("catalog-filters-modal--open");
      });
    });
  }

  function closeModal(instant) {
    if (modal.hidden && !isModalOpen()) {
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
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      finishClose();
      return;
    }

    if (closeTimer) {
      clearTimeout(closeTimer);
    }

    closeTimer = window.setTimeout(() => {
      closeTimer = null;
      finishClose();
    }, MODAL_TRANSITION_MS);
  }

  openBtn.addEventListener("click", () => {
    if (!isMobile()) {
      return;
    }

    if (isModalOpen()) {
      closeModal();
    } else {
      openModal();
    }
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => closeModal());
  });

  if (applyBtn) {
    applyBtn.addEventListener("click", () => closeModal());
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isModalOpen()) {
      closeModal();
    }
  });

  MOBILE_MQ.addEventListener("change", placeFilters);
  placeFilters();
})();
