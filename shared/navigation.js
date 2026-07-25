(function () {
  const config = window.WICOLLY_SITE || {};
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-site-nav]");

  if (toggle && nav) {
    const closeMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.removeAttribute("data-open");
    };

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      nav.toggleAttribute("data-open", open);
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        toggle.focus();
      }
    });
  }

  document.querySelectorAll("[data-contact]").forEach((link) => {
    const channel = link.dataset.contact;
    const phone = channel === "blacklight" ? config.blacklightWhatsApp : config.technologyWhatsApp;
    if (!phone) return;
    const message = link.dataset.message || "Olá! Vim pelo site wicolly.com.br.";
    link.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();
