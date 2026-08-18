const DeviceDetector = {
    isMobileSize(breakpoint = 768) {
        return window.innerWidth <= breakpoint;
    },

    watchMobileView(callback, breakpoint = 768) {
        const update = () => {
            callback(this.isMobileSize(breakpoint));
        };

        window.addEventListener("resize", update);
        update();

        return () => {
            window.removeEventListener("resize", update);
        };
    }
};


const menu = document.querySelector(".menu");
const mobileButton = document.getElementById("mobileMenuButton");
const mobileMenu = document.getElementById("mobileMenu");

if (menu && mobileButton && mobileMenu) {
    DeviceDetector.watchMobileView((isMobile) => {
        if (isMobile) {
            menu.style.display = "none";
            mobileButton.style.display = "block";
            return;
        }

        menu.style.display = "";
        mobileButton.style.display = "none";
        mobileMenu.classList.remove("active");
        mobileButton.setAttribute("aria-expanded", "false");
    });

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