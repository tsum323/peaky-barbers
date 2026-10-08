document.addEventListener("DOMContentLoaded", function () {

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* ========================================
       BOOKING MODAL
    ======================================== */

    const bookingLinks = document.querySelectorAll("[data-booking]");

    bookingLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            event.preventDefault();

            openBookingModal(link);

        });

    });

    function openBookingModal(opener) {

        const existing = document.querySelector(".booking-modal");

        if (existing) {

            /* Окно ещё открыто — второй клик ничего не делает.
               Окно в процессе закрытия — убираем его сразу и открываем заново */

            if (!existing.classList.contains("is-closing")) {
                return;
            }

            existing.remove();
        }

        const modal = document.createElement("div");

        modal.className = "booking-modal";

        modal.innerHTML = `

            <div class="booking-overlay"></div>

            <div
                class="booking-window"
                role="dialog"
                aria-modal="true"
                aria-labelledby="booking-title"
            >

                <button
                    type="button"
                    class="booking-close"
                    aria-label="Закрыть"
                >
                    ×
                </button>

                <p class="booking-label">
                    PEAKY BARBERS
                </p>

                <h2 id="booking-title">
                    Записаться<br>
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
                        rel="noopener noreferrer"
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

        const openedAt = Date.now();
        const scrollY = window.scrollY;

        document.body.appendChild(modal);

        /* Блокируем прокрутку под окном (в том числе в iOS Safari) */

        document.body.style.top = -scrollY + "px";
        document.body.classList.add("booking-open");

        setTimeout(function () {
            if (!modal.classList.contains("is-closing")) {
                modal.classList.add("booking-modal-visible");
            }
        }, 10);

        const closeButton = modal.querySelector(".booking-close");
        const overlay = modal.querySelector(".booking-overlay");
        const focusable = modal.querySelectorAll("button, a[href]");
        const firstFocusable = focusable[0];
        const lastFocusable = focusable[focusable.length - 1];

        closeButton.focus();

        closeButton.addEventListener("click", closeBookingModal);

        /* Второй клик двойного нажатия по «Записаться» попадает
           на затемнение — его не считаем закрытием */

        overlay.addEventListener("click", function () {
            if (Date.now() - openedAt > 400) {
                closeBookingModal();
            }
        });
        document.addEventListener("keydown", handleKeydown);

        function handleKeydown(event) {

            if (event.key === "Escape") {
                closeBookingModal();
                return;
            }

            /* Фокус не уходит за пределы окна */

            if (event.key === "Tab") {

                if (event.shiftKey && document.activeElement === firstFocusable) {
                    event.preventDefault();
                    lastFocusable.focus();
                } else if (!event.shiftKey && document.activeElement === lastFocusable) {
                    event.preventDefault();
                    firstFocusable.focus();
                }

            }

        }

        function closeBookingModal() {

            if (modal.classList.contains("is-closing")) {
                return;
            }

            modal.classList.add("is-closing");
            modal.classList.remove("booking-modal-visible");

            document.removeEventListener("keydown", handleKeydown);
            document.body.classList.remove("booking-open");
            document.body.style.top = "";
            window.scrollTo({ top: scrollY, behavior: "instant" });

            setTimeout(function () {
                modal.remove();
            }, 350);

            if (opener) {
                opener.focus({ preventScroll: true });
            }

        }

    }

    /* ========================================
       MAP: прокрутка страницы не застревает на карте
    ======================================== */

    document.querySelectorAll(".map-wrap").forEach(function (wrap) {

        const shield = wrap.querySelector(".map-shield");

        if (shield) {
            shield.addEventListener("click", function () {
                wrap.classList.add("is-active");
            });
        }

    });

    /* ========================================
       FOOTER YEAR
    ======================================== */

    document.querySelectorAll("[data-year]").forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });

    /* ========================================
       ACTIVE NAVIGATION
    ======================================== */

    let currentPage = window.location.pathname.split("/").pop();

    /* Главная страница и адреса без .html */

    if (!currentPage) {
        currentPage = "index.html";
    } else if (!currentPage.includes(".")) {
        currentPage += ".html";
    }

    const navLinks = document.querySelectorAll(".nav a");

    navLinks.forEach(function (link) {

        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }

    });

    /* ========================================
       SCROLL REVEAL
    ======================================== */

    /* Карточки появляются по отдельности,
       поэтому их секции целиком не анимируются */

    const revealCards = ".offer-card, .barber-page-card";

    const revealSections = Array.from(
        document.querySelectorAll("main section:not(.hero)")
    ).filter(function (section) {
        return !section.querySelector(revealCards);
    });

    const revealImages = document.querySelectorAll(
        ".barber-page-photo, .about-photo, .about-final-photo"
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

    /* Задержка считается внутри группы соседних элементов */

    function siblingIndex(element, list) {
        return Array.from(element.parentElement.children)
            .filter(function (child) {
                return list.includes(child);
            })
            .indexOf(element);
    }

    function setupReveal(elements, className, step, maxDelay) {

        const list = Array.from(elements);

        list.forEach(function (element) {

            element.classList.add(className);

            element.style.transitionDelay =
                Math.min(siblingIndex(element, list) * step, maxDelay) + "s";

            /* После появления возвращаем элементу
               его собственные transition для hover */

            element.addEventListener("transitionend", function cleanup(event) {

                if (event.target !== element || event.propertyName !== "opacity") {
                    return;
                }

                element.classList.remove(className, "is-visible");
                element.style.transitionDelay = "";
                element.removeEventListener("transitionend", cleanup);

            });

            revealObserver.observe(element);

        });

    }

    if (!reduceMotion) {
        setupReveal(revealSections, "reveal-on-scroll", 0, 0);
        setupReveal(document.querySelectorAll(revealCards), "reveal-on-scroll", 0.08, 0.32);
        setupReveal(revealImages, "reveal-image", 0.06, 0.24);
    }

    /* ========================================
       BACK TO TOP
    ======================================== */

    const backToTop = document.querySelector(".back-to-top");

    if (backToTop) {

        function toggleBackToTop() {
            backToTop.classList.toggle("show", window.scrollY > 400);
        }

        toggleBackToTop();

        window.addEventListener("scroll", toggleBackToTop, { passive: true });

        backToTop.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: reduceMotion ? "auto" : "smooth"
            });
        });

    }

});
