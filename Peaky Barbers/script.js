document.addEventListener("DOMContentLoaded", function () {

    const bookingLinks = document.querySelectorAll(
        'a[href="#"]'
    );

    bookingLinks.forEach(function (link) {

        if (link.textContent.trim().includes("Записаться")) {

            link.addEventListener("click", function (event) {

                event.preventDefault();

                openBookingModal();

            });

        }

    });

    function openBookingModal() {

        if (document.querySelector(".booking-modal")) {
            return;
        }

        const modal = document.createElement("div");

        modal.className = "booking-modal";

        modal.innerHTML = `

            <div class="booking-overlay"></div>

            <div class="booking-window">

                <button class="booking-close">
                    ×
                </button>

                <p class="booking-label">
                    PEAKY BARBERS
                </p>

                <h2>
                    Записаться
                    

                    в Peaky
                </h2>

                <p class="booking-text">
                    Выберите удобный способ связи
                    и договоритесь о времени
                    с мастером.
                </p>

                <div class="booking-actions">

                    <a
                        href="tel:+79673127911"
                        class="booking-action booking-phone"
                    >
                        <span>ПОЗВОНИТЬ</span>
                        <strong>+7 967 312 79 11</strong>
                    </a>

                    <a
                        href="https://wa.me/79673127911"
                        target="_blank"
                        class="booking-action booking-whatsapp"
                    >
                        <span>WHATSAPP</span>
                        <strong>Написать мастеру</strong>
                    </a>

                </div>

                <p class="booking-address">
                    Краснодар · ул. имени 40-летия Победы, 18
                </p>

            </div>
        `;

        document.body.appendChild(modal);

        setTimeout(function () {
            modal.classList.add("booking-modal-visible");
        }, 10);

        const closeButton =
            modal.querySelector(".booking-close");

        const overlay =
            modal.querySelector(".booking-overlay");

        closeButton.addEventListener(
            "click",
            closeBookingModal
        );

        overlay.addEventListener(
            "click",
            closeBookingModal
        );

        document.addEventListener(
            "keydown",
            handleEscape
        );

        function handleEscape(event) {

            if (event.key === "Escape") {
                closeBookingModal();
            }

        }

        function closeBookingModal() {

            modal.classList.remove(
                "booking-modal-visible"
            );

            setTimeout(function () {

                modal.remove();

            }, 350);

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        }

    }
    
    /* ========================================
   ACTIVE NAVIGATION
======================================== */

let currentPage =
    window.location.pathname.split("/").pop();

/* Главная страница */

if (
    !currentPage ||
    currentPage === "/" ||
    currentPage === "index"
) {
    currentPage = "index.html";
}

const navLinks =
    document.querySelectorAll(".nav a");

navLinks.forEach(function (link) {

    const linkPage =
        link.getAttribute("href");

    if (linkPage === currentPage) {

        link.classList.add("active");

    }

});
/* =========================================
   NEW SCROLL REVEAL
========================================= */

const revealItems = document.querySelectorAll(
    "main section:not(.hero), .offer-card, .work-card, .barber-page-card, .about-block, .contact-block"
);

const revealImages = document.querySelectorAll(
    ".image-placeholder, .barber-page-photo, .about-photo, .about-final-photo"
);

const revealObserver = new IntersectionObserver(
    function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15
    }
);

revealItems.forEach(function (element, index) {

    element.classList.add("reveal-on-scroll");

    element.style.transitionDelay =
        Math.min(index * 0.08, 0.32) + "s";

    revealObserver.observe(element);
});

revealImages.forEach(function (element, index) {

    element.classList.add("reveal-image");

    element.style.transitionDelay =
        Math.min(index * 0.06, 0.24) + "s";

    revealObserver.observe(element);
});
const backToTop = document.querySelector('.back-to-top');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};
});