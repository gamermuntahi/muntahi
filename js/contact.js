document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = document.querySelectorAll(".contact-card");

    root.classList.toggle("reduced-motion", reducedMotion);
    root.classList.toggle("touch-environment", !finePointer);

    let frame = 0;
    const updateWorld = () => {
        frame = 0;
        const range = Math.max(root.scrollHeight - window.innerHeight, 1);
        root.style.setProperty("--scroll-progress", Math.min(window.scrollY / range, 1).toFixed(4));
        root.style.setProperty("--scroll-y", `${window.scrollY.toFixed(1)}px`);
        root.style.setProperty("--scroll-grid-y", `${(window.scrollY * -.04).toFixed(1)}px`);
    };
    const requestWorldUpdate = () => {
        if (!frame) frame = requestAnimationFrame(updateWorld);
    };

    window.addEventListener("scroll", requestWorldUpdate, { passive: true });
    window.addEventListener("resize", requestWorldUpdate, { passive: true });
    if (finePointer && !reducedMotion) {
        window.addEventListener("pointermove", (event) => {
            const normalizedX = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
            const normalizedY = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
            root.style.setProperty("--pointer-x", `${event.clientX}px`);
            root.style.setProperty("--pointer-y", `${event.clientY}px`);
            root.style.setProperty("--world-x-shift", (normalizedX * 2).toFixed(4));
            root.style.setProperty("--world-y-shift", (normalizedY * 2).toFixed(4));
            root.style.setProperty("--world-x-percent", `${(normalizedX * 4).toFixed(2)}%`);
            root.style.setProperty("--world-y-percent", `${(normalizedY * 4).toFixed(2)}%`);
            root.style.setProperty("--world-x-px", `${(normalizedX * 20).toFixed(1)}px`);
        }, { passive: true });
    }
    root.style.setProperty("--world-x-percent", "0%" );
    root.style.setProperty("--world-y-percent", "0%" );
    root.style.setProperty("--world-x-px", "0px" );
    updateWorld();

    if (!reducedMotion && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, instance) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("depth-visible");
                instance.unobserve(entry.target);
            });
        }, { threshold: 0.15 });

        document.querySelectorAll(".contact-header, .contact-grid, .contact-card, .contact-footer").forEach((element, index) => {
            element.classList.add("depth-entrance", `reveal-${index % 3}`);
            element.style.setProperty("--entrance-index", index);
            observer.observe(element);
        });
    }

    if (!finePointer || reducedMotion) return;

    cards.forEach((card) => {
        let cardFrame = 0;
        let pointerX = 0;
        let pointerY = 0;
        const render = () => {
            cardFrame = 0;
            const rect = card.getBoundingClientRect();
            const x = pointerX / Math.max(rect.width, 1) - 0.5;
            const y = pointerY / Math.max(rect.height, 1) - 0.5;
            card.style.setProperty("--tilt-x", `${(-y * 3).toFixed(2)}deg`);
            card.style.setProperty("--tilt-y", `${(x * 3).toFixed(2)}deg`);
            card.style.setProperty("--glow-x", `${(pointerX / rect.width) * 100}%`);
            card.style.setProperty("--glow-y", `${(pointerY / rect.height) * 100}%`);
            card.style.setProperty("--arrow-shift", `${(x * 5).toFixed(2)}px`);
        };
        card.addEventListener("pointerenter", () => card.classList.add("interaction-active"), { passive: true });
        card.addEventListener("pointermove", (event) => {
            const rect = card.getBoundingClientRect();
            pointerX = event.clientX - rect.left;
            pointerY = event.clientY - rect.top;
            if (!cardFrame) cardFrame = requestAnimationFrame(render);
        }, { passive: true });
        card.addEventListener("pointerleave", () => {
            card.classList.remove("interaction-active");
            card.style.setProperty("--tilt-x", "0deg");
            card.style.setProperty("--tilt-y", "0deg");
            card.style.setProperty("--arrow-shift", "0px");
        }, { passive: true });
    });
});
