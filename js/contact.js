document.addEventListener("DOMContentLoaded", () => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cards = document.querySelectorAll(".contact-card");

    if (!reducedMotion && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, instance) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("depth-visible");
                instance.unobserve(entry.target);
            });
        }, { threshold: 0.15 });

        document.querySelectorAll(".contact-header, .contact-grid, .contact-footer").forEach((element) => {
            element.classList.add("depth-entrance");
            observer.observe(element);
        });
    }

    if (!finePointer || reducedMotion) return;

    cards.forEach((card) => {
        let frame = 0;
        let pointerX = 0;
        let pointerY = 0;

        const render = () => {
            frame = 0;
            const rect = card.getBoundingClientRect();
            const x = pointerX / rect.width - 0.5;
            const y = pointerY / rect.height - 0.5;
            card.style.setProperty("--tilt-x", `${(-y * 3).toFixed(2)}deg`);
            card.style.setProperty("--tilt-y", `${(x * 3).toFixed(2)}deg`);
            card.style.setProperty("--glow-x", `${(pointerX / rect.width) * 100}%`);
            card.style.setProperty("--glow-y", `${(pointerY / rect.height) * 100}%`);
        };

        card.addEventListener("pointerenter", () => card.classList.add("interaction-active"), { passive: true });
        card.addEventListener("pointermove", (event) => {
            pointerX = event.offsetX;
            pointerY = event.offsetY;
            if (!frame) frame = requestAnimationFrame(render);
        }, { passive: true });
        card.addEventListener("pointerleave", () => {
            card.classList.remove("interaction-active");
            card.style.setProperty("--tilt-x", "0deg");
            card.style.setProperty("--tilt-y", "0deg");
        }, { passive: true });
    });
});
