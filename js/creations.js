const cards =
         document.querySelectorAll(".creation-card");
      const root = document.documentElement;
      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let worldFrame = 0;

      const updateWorld = () => {
        worldFrame = 0;
        const scrollRange = Math.max(root.scrollHeight - window.innerHeight, 1);
        const progress = Math.min(window.scrollY / scrollRange, 1);
        root.style.setProperty("--scroll-progress", progress.toFixed(4));
        root.style.setProperty("--scroll-y", `${window.scrollY.toFixed(1)}px`);
        root.style.setProperty("--ambient-x", `${((window.innerWidth * .5) - (window.innerWidth * .5))}px`);
        root.style.setProperty("--ambient-y", `${(progress * -35).toFixed(1)}px`);
      };

      const requestWorldUpdate = () => {
        if (!worldFrame) worldFrame = requestAnimationFrame(updateWorld);
      };

      window.addEventListener("scroll", requestWorldUpdate, { passive: true });
      window.addEventListener("resize", requestWorldUpdate, { passive: true });

      if (finePointer && !reducedMotion) {
        window.addEventListener("pointermove", (event) => {
          root.style.setProperty("--pointer-x", `${event.clientX}px`);
          root.style.setProperty("--pointer-y", `${event.clientY}px`);
          const normalizedX = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
          const normalizedY = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
          root.style.setProperty("--world-x-shift", (normalizedX * 2).toFixed(4));
          root.style.setProperty("--world-y-shift", (normalizedY * 2).toFixed(4));
          root.style.setProperty("--ambient-x", `${(normalizedX * 24).toFixed(1)}px`);
          root.style.setProperty("--ambient-y", `${(normalizedY * 18).toFixed(1)}px`);
        }, { passive: true });
      } else {
        root.classList.add("touch-environment");
      }

      if (reducedMotion) root.classList.add("reduced-motion");
      requestWorldUpdate();

      root.style.setProperty("--ambient-x", "0px");
      root.style.setProperty("--ambient-y", "0px");

      const creationImages = [
        "images/deffen.jpg",
        "images/fog/fog_1.png",
        "images/fog/fog_2.png",
        "images/fog/fog_3.png",
        "images/fog/fog_4.png",
        "images/fog/fog_5.png",
        "images/fog/fog_6.png",
        "images/fog/fog_7.png",
        "images/shrf.jpg",
        "images/sun_rays.png",
        "images/titan.png"
      ];

      function shuffleImages(images) {
        const shuffled = [...images];

        for (let index = shuffled.length - 1; index > 0; index--) {
          const randomIndex = Math.floor(Math.random() * (index + 1));
          [shuffled[index], shuffled[randomIndex]] =
            [shuffled[randomIndex], shuffled[index]];
        }

        return shuffled;
      }

      const randomizedImages = shuffleImages(creationImages);

      cards.forEach((card, index) => {
        const image = randomizedImages[index % randomizedImages.length];
        const imageElement = card.querySelector(".creation-image img");

        card.dataset.image = image;

        if (imageElement) {
          imageElement.src = image;
          imageElement.alt = card.dataset.title || "Creation";
          imageElement.style.display = "block";
        }
      });

      const filterButtons =
        document.querySelectorAll(".filter-btn");

      const emptyState =
        document.getElementById("emptyState");

      const modal =
        document.getElementById("creationModal");

      const modalClose =
        document.getElementById("modalClose");

      const modalTitle =
        document.getElementById("modalTitle");

      const modalCategory =
        document.getElementById("modalCategory");

      const modalDescription =
        document.getElementById("modalDescription");

      const modalImage =
        document.getElementById("modalImage");

      const modalLinks =
        document.getElementById("modalLinks");


      /* =====================================
         FILTER
      ====================================== */

      filterButtons.forEach((button) => {

        button.addEventListener("click", () => {

          filterButtons.forEach((btn) => {
            btn.classList.remove("active");
          });

          button.classList.add("active");

          const filter =
            button.dataset.filter;

          let visible = 0;

          cards.forEach((card) => {

            const matches =
              filter === "all" ||
              card.classList.contains(filter);

            card.style.display =
              matches ? "flex" : "none";

            if (matches) {
              visible++;
              card.classList.remove("filter-emerge");
              requestAnimationFrame(() => card.classList.add("filter-emerge"));
            }

          });

          emptyState.style.display =
            visible === 0 ? "block" : "none";

        });

      });


      /* =====================================
         LINK ICON DETECTION
      ====================================== */

      function getCardLinks(card) {

        const links = [];

        const anchors =
          card.querySelectorAll(
            ".link-icons a"
          );

        anchors.forEach((link) => {

          const href =
            link.getAttribute("href");

          const icon =
            link.querySelector("i");

          let label = "Link";
          let iconClass =
            "fa-solid fa-link";

          if (
            icon &&
            icon.classList.contains(
              "fa-github"
            )
          ) {
            label = "GitHub";
            iconClass =
              "fa-brands fa-github";
          }

          else if (
            icon &&
            icon.classList.contains(
              "fa-youtube"
            )
          ) {
            label = "YouTube";
            iconClass =
              "fa-brands fa-youtube";
          }

          else if (
            icon &&
            icon.classList.contains(
              "fa-globe"
            )
          ) {
            label = "Website";
            iconClass =
              "fa-solid fa-globe";
          }

          else if (
            icon &&
            icon.classList.contains(
              "fa-discord"
            )
          ) {
            label = "Discord";
            iconClass =
              "fa-brands fa-discord";
          }

          else if (
            icon &&
            icon.classList.contains(
              "fa-roblox"
            )
          ) {
            label = "Roblox";
            iconClass =
              "fa-brands fa-roblox";
          }

          else if (
            icon &&
            icon.classList.contains(
              "fa-steam"
            )
          ) {
            label = "Steam";
            iconClass =
              "fa-brands fa-steam";
          }

          links.push({
            href,
            label,
            icon: iconClass
          });

        });

        return links;
      }


      /* =====================================
         OPEN MODAL
      ====================================== */

      cards.forEach((card) => {

        card.addEventListener("click", (event) => {
          if (event.target.closest("a")) return;

          modalTitle.textContent =
            card.dataset.title || "Project";

          modalCategory.textContent =
            card.dataset.category || "CREATION";

          modalDescription.textContent =
            card.dataset.description ||
            "No description available.";

          const image =
            card.dataset.image;

          if (image) {

            modalImage.src = image;

            modalImage.alt =
              card.dataset.title || "Creation";

            modalImage.style.display =
              "block";

          } else {

            modalImage.style.display =
              "none";

          }


          /* Connected links */

          modalLinks.innerHTML = "";

          const links =
            getCardLinks(card);

          if (links.length === 0) {

            const privateLink =
              document.createElement("span");

            privateLink.className =
              "modal-link";

            privateLink.innerHTML =
              `
                <i class="fa-solid fa-lock"></i>
                Private project
              `;

            modalLinks.appendChild(
              privateLink
            );

          } else {

            links.forEach((link) => {

              const anchor =
                document.createElement("a");

              anchor.className =
                "modal-link";

              anchor.href =
                link.href;

              anchor.target =
                "_blank";

              anchor.rel =
                "noopener noreferrer";

              anchor.innerHTML =
                `
                  <i class="${link.icon}"></i>
                  ${link.label}
                  <i
                    class="fa-solid fa-arrow-up-right-from-square"
                  ></i>
                `;

              modalLinks.appendChild(
                anchor
              );

            });

          }


          modal.classList.add("active");

          modal.setAttribute(
            "aria-hidden",
            "false"
          );

          document.body.style.overflow =
            "hidden";

        });

      });


      /* =====================================
         CLOSE MODAL
      ====================================== */

      function closeModal() {

        modal.classList.remove(
          "active"
        );

        modal.setAttribute(
          "aria-hidden",
          "true"
        );

        document.body.style.overflow =
          "";

      }


      modalClose.addEventListener(
        "click",
        closeModal
      );


      modal.addEventListener(
        "click",
        (event) => {

          if (
            event.target === modal
          ) {
            closeModal();
          }

        }
      );


      document.addEventListener(
        "keydown",
        (event) => {

          if (
            event.key === "Escape" &&
            modal.classList.contains(
              "active"
            )
          ) {
            closeModal();
          }

        }
      );

      /* =====================================
         ADDITIVE CARD DEPTH
      ====================================== */

      if (!reducedMotion && "IntersectionObserver" in window) {
        const entranceObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("depth-visible");
            observer.unobserve(entry.target);
          });
        }, { threshold: 0.12, rootMargin: "0px 0px -7%" });

        document.querySelectorAll(".creations-header, .creation-filters, .creation-card").forEach((element, index) => {
          element.classList.add("depth-entrance");
          element.style.setProperty("--entrance-index", index);
          entranceObserver.observe(element);
        });
      }

      if (finePointer && !reducedMotion) {
        cards.forEach((card) => {
          let frame = 0;
          let pointerX = 0;
          let pointerY = 0;

          const renderTilt = () => {
            frame = 0;
            const rect = card.getBoundingClientRect();
            const x = pointerX / rect.width - 0.5;
            const y = pointerY / rect.height - 0.5;
            card.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
            card.style.setProperty("--tilt-y", `${(x * 5).toFixed(2)}deg`);
            card.style.setProperty("--glow-x", `${(pointerX / rect.width) * 100}%`);
            card.style.setProperty("--glow-y", `${(pointerY / rect.height) * 100}%`);
            card.style.setProperty("--image-shift-x", `${(x * -12).toFixed(2)}px`);
            card.style.setProperty("--image-shift-y", `${(y * -12).toFixed(2)}px`);
            card.style.setProperty("--content-shift-x", `${(x * 4).toFixed(2)}px`);
            card.style.setProperty("--content-shift-y", `${(y * 3).toFixed(2)}px`);
            card.style.setProperty("--shadow-x", `${(x * -24).toFixed(2)}px`);
            card.style.setProperty("--shadow-y", `${(y * -18 + 20).toFixed(2)}px`);
          };

          card.addEventListener("pointerenter", () => card.classList.add("interaction-active"), { passive: true });
          card.addEventListener("pointermove", (event) => {
            pointerX = event.offsetX;
            pointerY = event.offsetY;
            if (!frame) frame = requestAnimationFrame(renderTilt);
          }, { passive: true });
          card.addEventListener("pointerleave", () => {
            card.classList.remove("interaction-active");
            card.style.setProperty("--tilt-x", "0deg");
            card.style.setProperty("--tilt-y", "0deg");
            card.style.setProperty("--image-shift-x", "0px");
            card.style.setProperty("--image-shift-y", "0px");
            card.style.setProperty("--content-shift-x", "0px");
            card.style.setProperty("--content-shift-y", "0px");
            card.style.setProperty("--shadow-x", "0px");
            card.style.setProperty("--shadow-y", "20px");
          }, { passive: true });
        });
      }
