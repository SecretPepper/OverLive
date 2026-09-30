const overlays = [
    {
        name: "Football Scoreboard",
        description: "A very advanced football scoreboard with alot of features.",
        category: "football",
        previews: [
            "images/football-scoreboard/preview-1.png",
            "images/football-scoreboard/preview-2.png",
            "images/football-scoreboard/preview-3.png",
            "images/football-scoreboard/preview-4.png"
        ],
        panel:
            "https://secretpepper.github.io/football-scoreboard/control.html"
    },
];

const PREVIEW_DURATION = 2000;
const FADE_DURATION = 500;

// Keep CSS and JavaScript fade timing synchronized
document.documentElement.style.setProperty(
    "--fade-duration",
    `${FADE_DURATION}ms`
);

const overlayGrid = document.getElementById("overlayGrid");
const overlayCount = document.getElementById("overlayCount");
const noResults = document.getElementById("noResults");
const categoryButtons = document.querySelectorAll(".category");


function createPreview(overlay) {
    const container = document.createElement("div");
    container.className = "preview-container";

    overlay.previews.forEach((imageSource, index) => {
        const image = document.createElement("img");

        image.className = "preview-image";

        if (index === 0) {
            image.classList.add("active");
        }

        image.src = imageSource;
        image.alt = `${overlay.name} preview ${index + 1}`;

        // Load the first image immediately
        // and let the browser lazy-load the others.
        image.loading = index === 0 ? "eager" : "lazy";

        container.appendChild(image);
    });

    const indicator = document.createElement("div");
    indicator.className = "preview-indicator";

    overlay.previews.forEach((_, index) => {
        const dot = document.createElement("span");

        dot.className = "preview-dot";

        if (index === 0) {
            dot.classList.add("active");
        }

        indicator.appendChild(dot);
    });

    container.appendChild(indicator);

    startPreviewLoop(container);

    return container;
}


function startPreviewLoop(container) {
    const images = container.querySelectorAll(".preview-image");
    const dots = container.querySelectorAll(".preview-dot");

    if (images.length <= 1) return;

    let currentIndex = 0;

    function showNextPreview() {
        const currentImage = images[currentIndex];
        const currentDot = dots[currentIndex];

        // Keep the current image completely still
        // for 1800ms.
        setTimeout(() => {

            const nextIndex =
                (currentIndex + 1) % images.length;

            const nextImage = images[nextIndex];
            const nextDot = dots[nextIndex];

            /*
             * Put the next image underneath FIRST.
             *
             * It is already at full opacity.
             */
            nextImage.classList.add("active");

            /*
             * Update the indicator.
             */
            currentDot.classList.remove("active");
            nextDot.classList.add("active");

            /*
             * Now fade the old image away.
             *
             * This happens only during the final 700ms.
             */
            currentImage.classList.add("fading");

            setTimeout(() => {

                /*
                 * Completely remove the old image
                 * after the fade has finished.
                 */
                currentImage.classList.remove(
                    "active",
                    "fading"
                );

                currentIndex = nextIndex;

                /*
                 * Start the next 2500ms cycle.
                 */
                showNextPreview();

            }, FADE_DURATION);

        }, PREVIEW_DURATION - FADE_DURATION);
    }

    showNextPreview();
}


function createOverlayCard(overlay) {
    const card = document.createElement("article");
    card.className = "overlay-card";

    const preview = createPreview(overlay);

    const info = document.createElement("div");
    info.className = "overlay-info";

    const name = document.createElement("div");
    name.className = "overlay-name";

    const title = document.createElement("h3");
    title.textContent = overlay.name;

    const description = document.createElement("p");
    description.textContent = overlay.description;

    name.appendChild(title);
    name.appendChild(description);

    const button = document.createElement("button");
    button.className = "use-button";
    button.textContent = "Use Overlay →";

    button.addEventListener("click", () => {
        window.location.href = overlay.panel;
    });

    info.appendChild(name);
    info.appendChild(button);

    card.appendChild(preview);
    card.appendChild(info);

    return card;
}


function displayOverlays(category = "all") {
    overlayGrid.innerHTML = "";

    const filtered = overlays.filter(overlay => {
        return category === "all" || overlay.category === category;
    });

    overlayCount.textContent = filtered.length;

    if (filtered.length === 0) {
        noResults.style.display = "block";
        return;
    }

    noResults.style.display = "none";

    filtered.forEach(overlay => {
        const card = createOverlayCard(overlay);
        overlayGrid.appendChild(card);
    });
}


categoryButtons.forEach(button => {
    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const category = button.dataset.category;

        displayOverlays(category);
    });
});


displayOverlays();