const themes = ["nature", "history", "food",
    "activity", "resort", "trendy"];

let selected = [false, false, false, false, false, false];

for (let i = 0; i < themes.length; i++) {
    let button = document.getElementById("btn-" + themes[i]);

    button.addEventListener("click", function () {
        selected[i] = !selected[i];
        showThemes();
    });
}

function showThemes() {
    let count = 0;

    for (let i = 0; i < themes.length; i++) {
        if (selected[i]) {
            count++;
        }
    }

    for (let i = 0; i < themes.length; i++) {
        let button = document.getElementById("btn-" + themes[i]);
        let section = document.getElementById(themes[i]);

        if (selected[i]) {
            button.classList.add("selected");
        } else {
            button.classList.remove("selected");
        }

        if (count == 0 || selected[i]) {
            section.style.display = "block";
        } else {
            section.style.display = "none";
        }
    }
}

const bannerContainer = document.querySelector(".banner-container");
const banners = document.querySelectorAll(".theme-banner");
const prevButton = document.getElementById("banner-prev");
const nextButton = document.getElementById("banner-next");

let currentIndex = 0;
let bannerTimer;

function showBanner() {
    bannerContainer.style.transform =
        "translateX(-" + currentIndex * 100 + "%)";
}

function nextBanner() {
    currentIndex++;

    if (currentIndex >= banners.length) {
        currentIndex = 0;
    }

    showBanner();
}

function prevBanner() {
    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = banners.length - 1;
    }

    showBanner();
}

function autoBanner() {
    bannerTimer = setTimeout(function () {
        nextBanner();
        autoBanner();
    }, 5000);
}

prevButton.addEventListener("click", function () {
    clearTimeout(bannerTimer);
    prevBanner();
    autoBanner();
});

nextButton.addEventListener("click", function () {
    clearTimeout(bannerTimer);
    nextBanner();
    autoBanner();
});

autoBanner();

const bannerButtons = document.querySelectorAll(".banner-button");

for (let i = 0; i < bannerButtons.length; i++) {
    bannerButtons[i].addEventListener("click", function () {
        for (let j = 0; j < themes.length; j++) {
            selected[j] = false;
        }

        selected[i] = true;
        showThemes();
    });
}