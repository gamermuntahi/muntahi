document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       1. CUSTOM CURSOR TRACKING
    ========================= */

    const cursor = document.querySelector(".cursor");
    const follower = document.querySelector(".cursor-follower");
    const root = document.documentElement;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const world = {
        targetX: window.innerWidth * 0.5,
        targetY: window.innerHeight * 0.5,
        currentX: window.innerWidth * 0.5,
        currentY: window.innerHeight * 0.5,
        scrollY: window.scrollY,
        frame: 0,
        dirty: true
    };

    const renderWorld = () => {
        world.frame = 0;
        world.currentX += (world.targetX - world.currentX) * 0.13;
        world.currentY += (world.targetY - world.currentY) * 0.13;

        const viewportWidth = Math.max(window.innerWidth, 1);
        const viewportHeight = Math.max(window.innerHeight, 1);
        const pointerX = world.currentX / viewportWidth;
        const pointerY = world.currentY / viewportHeight;
        const totalHeight = Math.max(
            document.documentElement.scrollHeight - viewportHeight,
            1
        );
        const scrollProgress = Math.min(world.scrollY / totalHeight, 1);

        root.style.setProperty("--world-x", pointerX.toFixed(4));
        root.style.setProperty("--world-y", pointerY.toFixed(4));
        root.style.setProperty("--world-x-shift", `${((pointerX - 0.5) * 2).toFixed(4)}`);
        root.style.setProperty("--world-y-shift", `${((pointerY - 0.5) * 2).toFixed(4)}`);
        root.style.setProperty("--world-x-percent", `${((pointerX - 0.5) * 4).toFixed(2)}%`);
        root.style.setProperty("--world-y-percent", `${((pointerY - 0.5) * 4).toFixed(2)}%`);
        root.style.setProperty("--world-x-px", `${((pointerX - 0.5) * -20).toFixed(1)}px`);
        root.style.setProperty("--world-y-px", `${((pointerY - 0.5) * -14).toFixed(1)}px`);
        root.style.setProperty("--hero-content-x", `${((pointerX - 0.5) * -3).toFixed(1)}px`);
        root.style.setProperty("--hero-content-y", `${((pointerY - 0.5) * -2).toFixed(1)}px`);
        root.style.setProperty("--orb-x", `${((pointerX - 0.5) * 18).toFixed(1)}px`);
        root.style.setProperty("--orb-y", `${((pointerY - 0.5) * 14).toFixed(1)}px`);
        root.style.setProperty("--ring-one-x", `${((pointerX - 0.5) * 8).toFixed(1)}px`);
        root.style.setProperty("--ring-one-y", `${((pointerY - 0.5) * 6).toFixed(1)}px`);
        root.style.setProperty("--ring-two-x", `${((pointerX - 0.5) * -12).toFixed(1)}px`);
        root.style.setProperty("--ring-two-y", `${((pointerY - 0.5) * -8).toFixed(1)}px`);
        root.style.setProperty("--pointer-x", `${world.targetX.toFixed(1)}px`);
        root.style.setProperty("--pointer-y", `${world.targetY.toFixed(1)}px`);
        root.style.setProperty("--scroll-y", `${world.scrollY.toFixed(1)}px`);
        root.style.setProperty("--scroll-progress", scrollProgress.toFixed(4));
        root.style.setProperty("--scroll-grid-y", `${(scrollProgress * -24).toFixed(1)}px`);

        if (follower && finePointer && !reducedMotion) {
            follower.style.transform =
                `translate3d(${world.currentX - 18}px, ${world.currentY - 18}px, 0)`;
        }

        const pointerSettled =
            Math.abs(world.targetX - world.currentX) < 0.08 &&
            Math.abs(world.targetY - world.currentY) < 0.08;

        if (!pointerSettled || world.dirty) {
            world.dirty = false;
            world.frame = requestAnimationFrame(renderWorld);
        }
    };

    const requestWorldFrame = () => {
        world.dirty = true;
        if (!world.frame) world.frame = requestAnimationFrame(renderWorld);
    };

    if (finePointer) {
        window.addEventListener("pointermove", (event) => {
            world.targetX = event.clientX;
            world.targetY = event.clientY;

            if (cursor) {
                cursor.style.transform =
                    `translate3d(${world.targetX - 4}px, ${world.targetY - 4}px, 0)`;
            }

            requestWorldFrame();
        }, { passive: true });
    } else {
        root.classList.add("touch-environment");
    }

    if (reducedMotion) root.classList.add("reduced-motion");
    requestWorldFrame();


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

    const progressBar = document.getElementById("scrollProgress");

    function updateScrollProgress() {
        world.scrollY = window.scrollY;
        requestWorldFrame();

        if (!progressBar) return;

        const totalHeight = Math.max(
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight,
            1
        );

        progressBar.style.transform =
            `scaleX(${Math.min(world.scrollY / totalHeight, 1).toFixed(4)})`;
    }

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", requestWorldFrame, { passive: true });
    updateScrollProgress();


    /* =========================
       4. FADE-IN ANIMATIONS
    ========================= */

    const fadeElements = document.querySelectorAll(".fade-in");

    if (reducedMotion || !("IntersectionObserver" in window)) {
        fadeElements.forEach((element) => element.classList.add("appear"));
    } else {
        const fadeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("appear");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -6%" });

        fadeElements.forEach((element) => fadeObserver.observe(element));
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

// Theme switching is shared by every page through js/site.js.
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

    /* =========================
       7. MINECRAFT BORDER EASTER EGG
    ========================= */

    const miningLayer = document.createElement("div");
    miningLayer.className = "mc-border-mining";
    miningLayer.setAttribute("aria-label", "Mineable grass blocks");
    document.body.appendChild(miningLayer);

    const shovelCursor = document.createElement("span");
    const shovelImage = document.createElement("img");
    shovelCursor.className = "mc-shovel-cursor";
    shovelCursor.setAttribute("aria-hidden", "true");
    shovelImage.className = "mc-shovel-cursor__image";
    shovelImage.src = "images/shovel.png";
    shovelImage.alt = "";
    shovelImage.draggable = false;
    shovelCursor.appendChild(shovelImage);
    document.body.appendChild(shovelCursor);

    let shovelFrame = 0;
    let shovelX = 0;
    let shovelY = 0;
    const renderShovelCursor = () => {
        shovelFrame = 0;
        shovelCursor.style.left = `${shovelX}px`;
        shovelCursor.style.top = `${shovelY}px`;
    };
    const updateShovelCursor = (event) => {
        shovelX = event.clientX;
        shovelY = event.clientY;
        if (!shovelFrame) shovelFrame = requestAnimationFrame(renderShovelCursor);
    };
    const hideShovelCursor = () => {
        shovelCursor.classList.remove("is-visible", "is-swinging");
    };
    const showShovelCursor = () => {
        if (!reducedMotion) shovelCursor.classList.remove("is-swinging");
        shovelCursor.classList.add("is-visible");
    };
    const swingShovelCursor = () => {
        if (reducedMotion) return;
        shovelCursor.classList.remove("is-swinging");
        void shovelCursor.offsetWidth;
        shovelCursor.classList.add("is-swinging");
    };

    if (finePointer) {
        miningLayer.addEventListener("pointermove", updateShovelCursor, { passive: true });
    }

    const miningBlocks = new Set();
    const maxMiningBlocks = 4;
    const previousPositions = { left: [], right: [] };
    const heroSection = document.querySelector(".hero");
    let miningBlockId = 0;

    const isHeroVisible = () => {
        if (!heroSection) return false;
        const bounds = heroSection.getBoundingClientRect();
        return bounds.bottom > 0 && bounds.top < window.innerHeight;
    };

    const hideMiningTooltipsOverHero = () => {
        if (!isHeroVisible()) return;
        miningBlocks.forEach((block) => block.classList.remove("is-tooltip-visible"));
    };

    const randomBetween = (minimum, maximum) =>
        Math.random() * (maximum - minimum) + minimum;

    function getMiningPosition(side) {
        const viewportHeight = Math.max(window.innerHeight, 320);
        const edgePadding = viewportHeight < 600 ? 82 : 105;
        const minimumTop = edgePadding;
        const maximumTop = Math.max(minimumTop + 1, viewportHeight - edgePadding);
        const sameSideBlocks = [...miningBlocks].filter(
            (block) => block.dataset.side === side && !block.classList.contains("is-breaking")
        );
        const minimumGap = window.innerWidth <= 768 ? 92 : 125;
        let candidate = minimumTop;
        let attempts = 0;

        do {
            candidate = randomBetween(minimumTop, maximumTop);
            attempts += 1;
        } while (
            attempts < 24 &&
            sameSideBlocks.some((block) =>
                Math.abs(parseFloat(block.dataset.topPixel || "0") - candidate) < minimumGap
            )
        );

        const lastPosition = previousPositions[side].at(-1);
        if (Number.isFinite(lastPosition) && Math.abs(lastPosition - candidate) < minimumGap) {
            candidate = candidate < viewportHeight / 2
                ? Math.min(maximumTop, candidate + minimumGap)
                : Math.max(minimumTop, candidate - minimumGap);
        }

        previousPositions[side].push(candidate);
        previousPositions[side] = previousPositions[side].slice(-4);
        return candidate;
    }

    function createMiningParticles(block) {
        if (reducedMotion) return;

        const bounds = block.getBoundingClientRect();
        const colors = ["#6d963c", "#47752f", "#76502d", "#4b321f", "#9aba4e"];

        for (let index = 0; index < 12; index += 1) {
            const particle = document.createElement("span");
            const angle = (Math.PI * 2 * index) / 12 + randomBetween(-0.24, 0.24);
            const distance = randomBetween(28, 68);
            particle.className = "mc-break-particle";
            particle.setAttribute("aria-hidden", "true");
            particle.style.left = `${bounds.left + bounds.width / 2}px`;
            particle.style.top = `${bounds.top + bounds.height / 2}px`;
            particle.style.setProperty("--mc-particle-x", `${Math.cos(angle) * distance}px`);
            particle.style.setProperty("--mc-particle-y", `${Math.sin(angle) * distance + 22}px`);
            particle.style.setProperty("--mc-particle-size", `${randomBetween(5, 10).toFixed(1)}px`);
            particle.style.setProperty(
                "--mc-particle-color",
                colors[Math.floor(Math.random() * colors.length)]
            );
            miningLayer.appendChild(particle);
            window.setTimeout(() => particle.remove(), 650);
        }
    }

    function scheduleMiningSpawn(delay = randomBetween(2600, 6200)) {
        window.setTimeout(() => {
            if (miningBlocks.size < maxMiningBlocks && document.body.contains(miningLayer)) {
                spawnMiningBlock();
            }
        }, reducedMotion ? Math.max(delay, 3500) : delay);
    }

    function destroyMiningBlock(block) {
        if (!miningBlocks.has(block)) return;

        createMiningParticles(block);
        block.classList.add("is-breaking");
        block.setAttribute("aria-hidden", "true");
        hideShovelCursor();
        document.documentElement.classList.remove("mc-mining-hover");

        window.setTimeout(() => {
            miningBlocks.delete(block);
            block.remove();
            scheduleMiningSpawn();
        }, reducedMotion ? 20 : 260);
    }

    function mineGrassBlock(event) {
        event.preventDefault();
        event.stopPropagation();

        const block = event.currentTarget;
        if (!miningBlocks.has(block) || block.classList.contains("is-mining")) return;

        block.classList.remove("is-tooltip-visible");
        block.classList.add("is-mining");
        block.disabled = true;
        block.setAttribute("aria-label", "Mining grass block");
        document.documentElement.classList.remove("mc-mining-hover");
        swingShovelCursor();

        const crackSteps = reducedMotion
            ? [[1, 20], [2, 65], [3, 110]]
            : [[1, 180], [2, 430], [3, 700]];

        crackSteps.forEach(([stage, delay]) => {
            window.setTimeout(() => {
                if (miningBlocks.has(block)) {
                    block.classList.add(`is-cracked-${stage}`);
                    swingShovelCursor();
                }
            }, delay);
        });

        window.setTimeout(
            () => destroyMiningBlock(block),
            reducedMotion ? 160 : 980
        );
    }

    function spawnMiningBlock(preferredSide) {
        if (miningBlocks.size >= maxMiningBlocks) return;

        const side = preferredSide || (Math.random() < .5 ? "left" : "right");
        const topPixel = getMiningPosition(side);
        const block = document.createElement("button");
        const floatWrapper = document.createElement("span");
        const image = document.createElement("img");
        const glint = document.createElement("span");
        const cracks = document.createElement("span");
        const tooltip = document.createElement("span");

        miningBlockId += 1;
        block.type = "button";
        block.className = "mc-grass-block";
        block.dataset.side = side;
        block.dataset.topPixel = topPixel.toFixed(1);
        block.setAttribute("aria-label", "Mine grass block");
        block.style.setProperty("--mc-top", `${topPixel.toFixed(1)}px`);
        block.style.setProperty("--mc-size", `${randomBetween(58, 82).toFixed(1)}px`);
        block.style.setProperty("--mc-rotation", `${randomBetween(-12, 12).toFixed(1)}deg`);
        block.style.setProperty("--mc-float-distance", `${randomBetween(5, 10).toFixed(1)}px`);
        block.style.setProperty("--mc-float-time", `${randomBetween(3.8, 5.8).toFixed(2)}s`);
        block.style.setProperty("--mc-float-delay", `${randomBetween(-4, 0).toFixed(2)}s`);

        floatWrapper.className = "mc-grass-block__float";
        image.className = "mc-grass-block__image";
        image.src = "images/grass-block.webp";
        image.alt = "";
        image.draggable = false;
        glint.className = "mc-grass-block__glint";
        cracks.className = "mc-grass-block__cracks";
        tooltip.className = "mc-grass-block__tooltip";
        tooltip.id = `mc-mining-tooltip-${miningBlockId}`;
        tooltip.textContent = "CLICK TO MINE";
        tooltip.setAttribute("role", "tooltip");
        block.setAttribute("aria-describedby", tooltip.id);

        floatWrapper.append(image, glint, cracks, tooltip);
        block.appendChild(floatWrapper);
        miningLayer.appendChild(block);
        miningBlocks.add(block);

        block.addEventListener("click", mineGrassBlock);
        block.addEventListener("pointerenter", (event) => {
            if (block.classList.contains("is-mining")) return;
            block.classList.remove("is-tooltip-visible");
            if (finePointer) {
                updateShovelCursor(event);
                showShovelCursor();
                document.documentElement.classList.add("mc-mining-hover");
            }
        });
        block.addEventListener("pointerleave", () => {
            hideShovelCursor();
            document.documentElement.classList.remove("mc-mining-hover");
        });
        block.addEventListener("focus", () => block.classList.remove("is-tooltip-visible"));

        requestAnimationFrame(() => {
            requestAnimationFrame(() => block.classList.add("is-spawned"));
        });

        window.setTimeout(() => {
            if (
                miningBlocks.has(block) &&
                !isHeroVisible() &&
                !block.classList.contains("is-mining") &&
                !block.matches(":hover, :focus-visible")
            ) {
                block.classList.add("is-tooltip-visible");
            }
        }, 3000);
    }

    function repositionMiningBlocks() {
        ["left", "right"].forEach((side) => {
            const sideBlocks = [...miningBlocks].filter(
                (block) => block.dataset.side === side && !block.classList.contains("is-breaking")
            );
            const viewportHeight = Math.max(window.innerHeight, 320);
            const edgePadding = viewportHeight < 600 ? 82 : 105;
            const usableHeight = Math.max(viewportHeight - edgePadding * 2, 1);

            sideBlocks.forEach((block, index) => {
                const segmentCenter = edgePadding + usableHeight * ((index + .5) / sideBlocks.length);
                const segmentSize = usableHeight / sideBlocks.length;
                const topPixel = Math.min(
                    viewportHeight - edgePadding,
                    Math.max(edgePadding, segmentCenter + randomBetween(-segmentSize * .16, segmentSize * .16))
                );
                block.dataset.topPixel = topPixel.toFixed(1);
                block.style.setProperty("--mc-top", `${topPixel.toFixed(1)}px`);
            });
        });
    }

    function startMiningEasterEgg() {
        const initialMiningSides = ["left", "right", "left", "right"];
        initialMiningSides.forEach((side, index) => {
            window.setTimeout(() => spawnMiningBlock(side), 700 + index * 420);
        });
    }

    if (document.body.classList.contains("site-loader-active")) {
        const loaderObserver = new MutationObserver(() => {
            if (document.body.classList.contains("site-loader-active")) return;
            loaderObserver.disconnect();
            startMiningEasterEgg();
        });
        loaderObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    } else {
        startMiningEasterEgg();
    }

    window.addEventListener("scroll", hideMiningTooltipsOverHero, { passive: true });

    let miningResizeTimer = 0;
    window.addEventListener("resize", () => {
        hideMiningTooltipsOverHero();
        window.clearTimeout(miningResizeTimer);
        miningResizeTimer = window.setTimeout(repositionMiningBlocks, 140);
    }, { passive: true });

    window.addEventListener("blur", () => {
        hideShovelCursor();
        document.documentElement.classList.remove("mc-mining-hover");
    });

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