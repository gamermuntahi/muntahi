(() => {
  "use strict";

  const fogAssets = Array.from({ length: 7 }, (_, index) => `images/fog/fog_${index + 1}.png`);
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

  const random = (min, max) => Math.random() * (max - min) + min;

  const createAtmosphere = () => {
    if (document.querySelector(".forest-atmosphere-root")) return;

    const root = document.createElement("div");
    root.className = "forest-atmosphere-root";
    root.setAttribute("aria-hidden", "true");

    const ground = document.createElement("div");
    ground.className = "forest-atmosphere-ground";
    root.appendChild(ground);

    const treeLine = document.createElement("div");
    treeLine.className = "forest-atmosphere-treeline";
    treeLine.innerHTML = '<i class="fa-solid fa-tree"></i>'.repeat(9);
    root.appendChild(treeLine);

    const fogRoot = document.createElement("div");
    fogRoot.className = "cinematic-fog-root";
    fogAssets.forEach((asset, index) => {
      const layer = document.createElement("img");
      const side = index % 3 === 1 ? (index % 2 ? "right" : "left") : "center";
      layer.className = `cinematic-fog-layer cinematic-fog-layer--${index + 1}`;
      layer.src = asset;
      layer.alt = "";
      layer.decoding = "async";
      layer.dataset.fogSide = side;
      layer.style.setProperty("--fog-x", `${random(-18, 18).toFixed(2)}%`);
      layer.style.setProperty("--fog-y", `${random(-4, 17).toFixed(2)}vh`);
      layer.style.setProperty("--fog-scale", random(.86, 1.2).toFixed(2));
      layer.style.setProperty("--fog-rotate", `${random(-4, 4).toFixed(2)}deg`);
      layer.style.setProperty("--fog-opacity", random(.22, .52).toFixed(2));
      layer.style.setProperty("--fog-speed", `${random(25, 48).toFixed(1)}s`);
      layer.style.setProperty("--fog-delay", `${random(-35, 0).toFixed(1)}s`);
      layer.style.setProperty("--fog-depth", random(.35, 1).toFixed(2));
      fogRoot.appendChild(layer);
    });
    root.appendChild(fogRoot);
    document.body.prepend(root);

    const atmosphericLayers = [...root.querySelectorAll(".cinematic-fog-layer, .forest-atmosphere-treeline")];
    let pointerX = 0;
    let pointerY = 0;
    let scrollY = window.scrollY;
    let frame = 0;

    const render = () => {
      frame = 0;
      const x = (pointerX / Math.max(window.innerWidth, 1) - .5);
      const y = (pointerY / Math.max(window.innerHeight, 1) - .5);
      atmosphericLayers.forEach((layer) => {
        const depth = Number(layer.style.getPropertyValue("--fog-depth")) || (layer.classList.contains("forest-atmosphere-treeline") ? .8 : .5);
        layer.style.setProperty("--atmosphere-mouse-x", `${(x * depth * 18).toFixed(2)}px`);
        layer.style.setProperty("--atmosphere-mouse-y", `${(y * depth * 8).toFixed(2)}px`);
        layer.style.setProperty("--atmosphere-scroll-y", `${(scrollY * depth * -.018).toFixed(2)}px`);
      });
    };
    const requestRender = () => { if (!frame) frame = requestAnimationFrame(render); };

    if (!reducedMotionQuery.matches && finePointerQuery.matches) {
      window.addEventListener("pointermove", (event) => { pointerX = event.clientX; pointerY = event.clientY; requestRender(); }, { passive: true });
    }
    if (!reducedMotionQuery.matches) {
      window.addEventListener("scroll", () => { scrollY = window.scrollY; requestRender(); }, { passive: true });
    }
    requestRender();
  };

  const setupReveals = () => {
    const targets = document.querySelectorAll("main > section, main > header, main > .contact-footer, main > .creation-filters, main > .creations-grid, main > .about-cta");
    targets.forEach((element) => element.setAttribute("data-scroll-reveal", ""));
    if (reducedMotionQuery.matches || !("IntersectionObserver" in window)) {
      targets.forEach((element) => element.classList.add("scroll-reveal-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries, instance) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("scroll-reveal-visible");
      instance.unobserve(entry.target);
    }), { threshold: .08, rootMargin: "0px 0px -8%" });
    targets.forEach((element) => { element.classList.add("scroll-reveal-target"); observer.observe(element); });
  };

  const init = () => { createAtmosphere(); setupReveals(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
