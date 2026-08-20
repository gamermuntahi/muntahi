document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeline = document.querySelector(".timeline");

    root.classList.toggle("reduced-motion", reducedMotion);
    root.classList.toggle("touch-environment", !finePointer);

    const updateWorld = () => {
        const range = Math.max(root.scrollHeight - window.innerHeight, 1);
        const progress = Math.min(window.scrollY / range, 1);
        root.style.setProperty("--scroll-progress", progress.toFixed(4));
        root.style.setProperty("--scroll-y", `${window.scrollY.toFixed(1)}px`);
        root.style.setProperty("--timeline-y", `${(progress * -32).toFixed(1)}px`);
    };

    let scrollFrame = 0;
    const requestWorldUpdate = () => {
        if (scrollFrame) return;
        scrollFrame = requestAnimationFrame(() => {
            scrollFrame = 0;
            updateWorld();
        });
    };

    window.addEventListener("scroll", requestWorldUpdate, { passive: true });
    window.addEventListener("resize", requestWorldUpdate, { passive: true });
    updateWorld();

    if (!reducedMotion && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, instance) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("depth-visible");
                instance.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -8%" });

        document.querySelectorAll(".about-hero, .about-stats, .about-section, .about-cta, .timeline-item").forEach((element, index) => {
            element.classList.add("depth-entrance", `reveal-${index % 3}`);
            element.style.setProperty("--entrance-index", index);
            element.style.setProperty("--entrance-delay", `${Math.min(index, 8) * 45}ms`);
            observer.observe(element);
        });
    }

    if (timeline) {
        const updateTimeline = () => {
            const rect = timeline.getBoundingClientRect();
            const visible = Math.max(0, Math.min(1, (window.innerHeight * .78 - rect.top) / Math.max(rect.height, 1)));
            timeline.style.setProperty("--timeline-progress", visible.toFixed(3));
        };
        window.addEventListener("scroll", updateTimeline, { passive: true });
        updateTimeline();
    }

    if (!finePointer || reducedMotion) return;

    document.querySelectorAll(".service-card, .mindset-card, .tech-item").forEach((element) => {
        let frame = 0;
        let pointerX = 0;
        let pointerY = 0;
        const render = () => {
            frame = 0;
            const rect = element.getBoundingClientRect();
            const x = pointerX / Math.max(rect.width, 1) - 0.5;
            const y = pointerY / Math.max(rect.height, 1) - 0.5;
            element.style.setProperty("--tilt-x", `${(-y * 3).toFixed(2)}deg`);
            element.style.setProperty("--tilt-y", `${(x * 3).toFixed(2)}deg`);
            element.style.setProperty("--glow-x", `${(pointerX / rect.width) * 100}%`);
            element.style.setProperty("--glow-y", `${(pointerY / rect.height) * 100}%`);
            element.style.setProperty("--icon-shift-x", `${(x * 5).toFixed(2)}px`);
            element.style.setProperty("--icon-shift-y", `${(y * 5).toFixed(2)}px`);
        };
        element.addEventListener("pointerenter", () => element.classList.add("interaction-active"), { passive: true });
        element.addEventListener("pointermove", (event) => {
            const rect = element.getBoundingClientRect();
            pointerX = event.clientX - rect.left;
            pointerY = event.clientY - rect.top;
            if (!frame) frame = requestAnimationFrame(render);
        }, { passive: true });
        element.addEventListener("pointerleave", () => {
            element.classList.remove("interaction-active");
            element.style.setProperty("--tilt-x", "0deg");
            element.style.setProperty("--tilt-y", "0deg");
            element.style.setProperty("--icon-shift-x", "0px");
            element.style.setProperty("--icon-shift-y", "0px");
        }, { passive: true });
    });
});
