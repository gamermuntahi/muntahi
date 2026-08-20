(() => {
  "use strict";

  const themes = ["normal", "red", "green"];
  const storageKey = "portfolio-theme";
  const icons = {
    normal: "fa-face-meh",
    red: "fa-face-smile",
    green: "fa-face-laugh-beam"
  };

  const readTheme = () => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      return themes.includes(saved) ? saved : "normal";
    } catch (_) {
      return "normal";
    }
  };

  const applyTheme = (theme, persist = false) => {
    const selected = themes.includes(theme) ? theme : "normal";
    document.documentElement.dataset.theme = selected;

    if (persist) {
      try {
        window.localStorage.setItem(storageKey, selected);
      } catch (_) {
        // Storage can be unavailable in privacy-restricted contexts.
      }
    }

    document.querySelectorAll("[data-theme-toggle], #searchBtn").forEach((button) => {
      const icon = button.querySelector("i");
      if (icon) {
        Object.values(icons).forEach((className) => icon.classList.remove(className));
        icon.classList.add(icons[selected]);
      }
      const nextTheme = themes[(themes.indexOf(selected) + 1) % themes.length];
      button.setAttribute("aria-label", `Current theme: ${selected}. Switch to ${nextTheme} theme`);
      button.setAttribute("title", `Switch to ${nextTheme} theme`);
    });
  };

  applyTheme(readTheme());

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(document.documentElement.dataset.theme || readTheme());

    document.querySelectorAll("[data-theme-toggle], #searchBtn").forEach((button) => {
      button.addEventListener("click", () => {
        const current = document.documentElement.dataset.theme || "normal";
        const next = themes[(themes.indexOf(current) + 1) % themes.length];
        applyTheme(next, true);
      });
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealTargets = document.querySelectorAll("[data-scroll-reveal]");

    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -7%" });

    revealTargets.forEach((element) => {
      element.classList.add("reveal-on-scroll");
      revealObserver.observe(element);
    });
  });
})();
