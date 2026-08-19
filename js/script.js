document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       1. CUSTOM CURSOR TRACKING
    ========================= */

    const cursor = document.querySelector(".cursor");
    const follower = document.querySelector(".cursor-follower");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    if (finePointer) {
        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (cursor) {
                cursor.style.transform =
                    `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
            }
        }, { passive: true });
    }

    function renderCursor() {
        if (follower) {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;

            follower.style.transform =
                `translate3d(${followerX - 18}px, ${followerY - 18}px, 0)`;
        }

        requestAnimationFrame(renderCursor);
    }

    if (finePointer && !reducedMotion) {
        renderCursor();
    }


    /* =========================
       2. CURSOR HOVER EFFECT
    ========================= */

    const interactives = document.querySelectorAll(
        "a, button, .round"
    );

    if (finePointer) {
        interactives.forEach((el) => {
            el.addEventListener("mouseenter", () => {
                if (!follower) return;
                follower.classList.add("cursor-hover");
            });

            el.addEventListener("mouseleave", () => {
                if (!follower) return;
                follower.classList.remove("cursor-hover");
            });
        });
    }


    /* =========================
       3. SCROLL PROGRESS BAR
    ========================= */

    const progressBar =
        document.getElementById("scrollProgress");

    function updateScrollProgress() {

        if (!progressBar) return;

        const totalHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;

        const currentScroll = window.scrollY;

        const progressPercentage =
            totalHeight > 0
                ? (currentScroll / totalHeight) * 100
                : 0;

        progressBar.style.width =
            `${progressPercentage}%`;
    }

    window.addEventListener(
        "scroll",
        updateScrollProgress,
        { passive: true }
    );

    updateScrollProgress();


    /* =========================
       4. FADE-IN ANIMATIONS
    ========================= */

    const fadeElements =
        document.querySelectorAll(".fade-in");

    if (reducedMotion) {
        fadeElements.forEach((el) => el.classList.add("appear"));
    } else {
        setTimeout(() => {
            fadeElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add("appear");
                }, index * 120);
            });
        }, 100);
    }


/* =========================
   5. VERTICAL TEXT CAROUSEL
========================= */

const changingText =
    document.getElementById("changing-text");

const words = [
    "Full-Stack Developer",
    "AI Developer",
    "Software Engineer",
    "Game Developer",
    "Tech Entrepreneur"
];

let wordIndex = 0;

if (changingText) {

    changingText.textContent = words[0];

    const wrapper =
        document.createElement("span");

    wrapper.className =
        "changing-text-wrapper";

    changingText.parentNode.insertBefore(
        wrapper,
        changingText
    );

    wrapper.appendChild(changingText);

    function changeWord() {

        /* OLD TEXT: move UP + fade OUT */
        changingText.classList.add(
            "text-slide-out"
        );

        setTimeout(() => {

            wordIndex =
                (wordIndex + 1) % words.length;

            /*
             * Disable transition temporarily
             * and place new text below.
             */
            changingText.style.transition = "none";

            changingText.classList.remove(
                "text-slide-out"
            );

            changingText.classList.add(
                "text-slide-in"
            );

            changingText.textContent =
                words[wordIndex];

            /* Force browser reflow */
            changingText.offsetHeight;

            /* Enable animation */
            changingText.style.transition =
                "transform 0.5s cubic-bezier(.65,0,.35,1), opacity 0.5s ease";

            /* NEW TEXT: move up + fade IN */
            changingText.classList.remove(
                "text-slide-in"
            );

        }, 500);
    }

    /*
     * 1 second waiting
     * + 0.5 second animation
     */
    if (!reducedMotion) {
        setInterval(changeWord, 2500);
    }
}

const moodButton = document.getElementById("searchBtn");
const moodIcons = ["fa-face-meh", "fa-face-smile", "fa-face-laugh-beam"];
let moodIndex = 0;

if (moodButton) {
    moodButton.addEventListener("click", () => {
        const icon = moodButton.querySelector("i");
        if (!icon) return;

        icon.classList.remove(moodIcons[moodIndex]);
        moodIndex = (moodIndex + 1) % moodIcons.length;
        icon.classList.add(moodIcons[moodIndex]);
    });
}
    /* =========================
       6. ADDITIVE DEPTH INTERACTIONS
    ========================= */

    const canUsePointerPhysics = finePointer && !reducedMotion;

    function addDepthTilt(element, options = {}) {
        if (!canUsePointerPhysics || !element) return;

        const maxTilt = options.maxTilt || 5;
        const inner = options.inner ? element.querySelector(options.inner) : null;
        let frame = 0;
        let pointerX = 0;
        let pointerY = 0;

        const render = () => {
            frame = 0;
            const rect = element.getBoundingClientRect();
            const x = pointerX / rect.width - 0.5;
            const y = pointerY / rect.height - 0.5;
            const rotateX = (-y * maxTilt).toFixed(2);
            const rotateY = (x * maxTilt).toFixed(2);

            element.style.setProperty("--tilt-x", `${rotateX}deg`);
            element.style.setProperty("--tilt-y", `${rotateY}deg`);
            element.style.setProperty("--glow-x", `${(pointerX / rect.width) * 100}%`);
            element.style.setProperty("--glow-y", `${(pointerY / rect.height) * 100}%`);

            if (inner) {
                inner.style.setProperty("--image-shift-x", `${(x * -10).toFixed(2)}px`);
                inner.style.setProperty("--image-shift-y", `${(y * -10).toFixed(2)}px`);
            }
        };

        element.addEventListener("pointerenter", (event) => {
            pointerX = event.offsetX;
            pointerY = event.offsetY;
            element.classList.add("interaction-active");
        }, { passive: true });

        element.addEventListener("pointermove", (event) => {
            pointerX = event.offsetX;
            pointerY = event.offsetY;
            if (!frame) frame = requestAnimationFrame(render);
        }, { passive: true });

        element.addEventListener("pointerleave", () => {
            element.classList.remove("interaction-active");
            element.style.setProperty("--tilt-x", "0deg");
            element.style.setProperty("--tilt-y", "0deg");
            if (inner) {
                inner.style.setProperty("--image-shift-x", "0px");
                inner.style.setProperty("--image-shift-y", "0px");
            }
        }, { passive: true });
    }

    function addMagneticMotion(element, strength = 0.16) {
        if (!canUsePointerPhysics || !element) return;

        let frame = 0;
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;

        const render = () => {
            frame = 0;
            currentX += (targetX - currentX) * 0.2;
            currentY += (targetY - currentY) * 0.2;
            element.style.setProperty("--magnetic-x", `${currentX.toFixed(2)}px`);
            element.style.setProperty("--magnetic-y", `${currentY.toFixed(2)}px`);
            if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
                frame = requestAnimationFrame(render);
            }
        };

        element.addEventListener("pointermove", (event) => {
            const rect = element.getBoundingClientRect();
            targetX = (event.clientX - rect.left - rect.width / 2) * strength;
            targetY = (event.clientY - rect.top - rect.height / 2) * strength;
            if (!frame) frame = requestAnimationFrame(render);
        }, { passive: true });

        element.addEventListener("pointerleave", () => {
            targetX = 0;
            targetY = 0;
            if (!frame) frame = requestAnimationFrame(render);
        }, { passive: true });
    }

    document.querySelectorAll(".project-card, .skill-card, .process-card").forEach((card) => {
        addDepthTilt(card, { maxTilt: card.classList.contains("project-card") ? 4 : 3, inner: ".project-image img" });
    });

    document.querySelectorAll(".btn-primary, .text-link, .cta-button").forEach((button) => {
        addMagneticMotion(button, 0.12);
    });

    if (!reducedMotion && "IntersectionObserver" in window) {
        const entranceObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("depth-visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -8%" });

        document.querySelectorAll(".section-label, .skills-heading, .work-heading, .statement-inner, .services-list, .process-grid, .contact-content").forEach((element) => {
            element.classList.add("depth-entrance");
            entranceObserver.observe(element);
        });
    }

    const menu = document.querySelector(".menu");
    const mobileButton = document.getElementById("mobileMenuButton");
    const mobileMenu = document.getElementById("mobileMenu");

    if (menu && mobileButton && mobileMenu) {
        const updateMobileView = () => {
            const isMobile = window.innerWidth <= 768;

            if (isMobile) {
                menu.style.display = "none";
                mobileButton.style.display = "block";
                return;
            }

            menu.style.display = "";
            mobileButton.style.display = "none";
            mobileMenu.classList.remove("active");
            mobileButton.setAttribute("aria-expanded", "false");
        };

        window.addEventListener("resize", updateMobileView);
        updateMobileView();

        mobileButton.addEventListener("click", () => {
            const isOpen = mobileMenu.classList.toggle("active");
            mobileButton.setAttribute("aria-expanded", String(isOpen));
        });

        mobileMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("active");
                mobileButton.setAttribute("aria-expanded", "false");
            });
        });
    }
});