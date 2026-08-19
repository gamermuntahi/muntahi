const cards =
         document.querySelectorAll(".creation-card");

      const creationImages = [
        "images/deffen.jpg",
        "images/fog_1.png",
        "images/fog_2.png",
        "images/fog_3.png",
        "images/fog_4.png",
        "images/fog_5.png",
        "images/fog_7.png",
        "images/me2.png",
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

        card.addEventListener("click", () => {

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
