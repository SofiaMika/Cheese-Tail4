/**
 * Ограничивает число диапазоном от min до max.
 * Принимает три числа и возвращает число без побочных эффектов.
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Рассчитывает прогресс прохождения секции от 0 до 1.
 * Принимает координату начала секции, высоты секции и viewport, а также scrollY.
 * Возвращает 0, если у секции нет доступной дистанции прокрутки.
 */
function calculateBookProgress(
    sectionTop,
    sectionHeight,
    viewportHeight,
    scrollY,
) {
    const scrollDistance = sectionHeight - viewportHeight;

    if (scrollDistance <= 0) {
        return 0;
    }

    return clamp((scrollY - sectionTop) / scrollDistance, 0, 1);
}

/**
 * Преобразует общий прогресс секции в прогресс отдельного элемента.
 * До начала интервала возвращает 0, после конца интервала возвращает 1.
 */
function calculateStepProgress(progress, start, end) {
    const stepDuration = end - start;

    if (stepDuration <= 0) {
        return 0;
    }

    return clamp((progress - start) / stepDuration, 0, 1);
}

function initBookScroll() {
    const bookSection = document.querySelector(".book");

    if (!bookSection) {
        return;
    }

    const bookSteps = [
        { name: "intro", start: 0, end: 0.2 },
        { name: "contents", start: 0.2, end: 0.4 },
        { name: "history", start: 0.4, end: 0.6 },
        { name: "illustration", start: 0.6, end: 0.8 },
        { name: "chapter", start: 0.8, end: 1 },
    ].map((step) => ({
        ...step,
        element: bookSection.querySelector(`[data-book-step="${step.name}"]`),
    }));
    const introLink = bookSection.querySelector(".book__button");
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;

    let sectionTop = 0;
    let sectionHeight = 0;
    let viewportHeight = 0;
    let frameId = null;

    /**
     * Пересчитывает размеры, используемые формулой прогресса.
     * Читает геометрию страницы и сохраняет её внутри initBookScroll.
     */
    function measureBookSection() {
        const sectionRect = bookSection.getBoundingClientRect();

        sectionTop = sectionRect.top + window.scrollY;
        sectionHeight = bookSection.offsetHeight;
        viewportHeight = window.innerHeight;
    }

    /**
     * Записывает общий прогресс прокрутки в CSS-переменную секции.
     * Значение пока не управляет отдельными элементами.
     */
    function updateBookProgress() {
        const progress = calculateBookProgress(
            sectionTop,
            sectionHeight,
            viewportHeight,
            window.scrollY,
        );

        bookSteps.forEach(({ element, start, end }) => {
            if (!element) {
                return;
            }

            const stepProgress = prefersReducedMotion
                ? 1
                : calculateStepProgress(progress, start, end);
            element.style.setProperty(
                "--book-step-progress",
                stepProgress.toFixed(4),
            );
        });

        const introStep = bookSteps[0];
        const isIntroVisible = prefersReducedMotion || progress >= introStep.end;

        introStep.element?.classList.toggle("is-interactive", isIntroVisible);

        if (introLink) {
            introLink.setAttribute("aria-hidden", String(!isIntroVisible));

            if (isIntroVisible) {
                introLink.removeAttribute("tabindex");
            } else {
                introLink.setAttribute("tabindex", "-1");
            }
        }

        frameId = null;
    }

    /**
     * Запрашивает не более одного обновления прогресса за кадр браузера.
     */
    function requestBookProgressUpdate() {
        if (frameId !== null) {
            return;
        }

        frameId = window.requestAnimationFrame(updateBookProgress);
    }

    function handleResize() {
        measureBookSection();
        requestBookProgressUpdate();
    }

    measureBookSection();

    if (prefersReducedMotion) {
        bookSection.classList.add("is-reduced-motion");
    } else {
        bookSection.classList.add("is-scroll-ready");
    }

    updateBookProgress();

    window.addEventListener("scroll", requestBookProgressUpdate, {
        passive: true,
    });
    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleResize, { once: true });
}

if (typeof document !== "undefined") {
    initBookScroll();
}