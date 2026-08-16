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
});