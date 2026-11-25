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
            button.setAttribute("class", "theme-item selected");
        } else {
            button.setAttribute("class", "theme-item");
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
    nextBanner();
    setTimeout(autoBanner, 5000);
}

prevButton.addEventListener("click", prevBanner);
nextButton.addEventListener("click", nextBanner);

setTimeout(autoBanner, 5000);

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

let favoritePlaces = [];

const savedFavorites = localStorage.getItem("favoritePlaces");

if (savedFavorites !== null) {
    favoritePlaces = JSON.parse(savedFavorites);
}

fetch("../data/12_웹벤져스_theme.json")
    .then(response => {
        return response.json();
    })
    .then(result => {
        showPlaces(result);
    })
    .catch(error => {
        console.error("실패", error);
    });

function showPlaces(places) {
    for (let i = 0; i < places.length; i++) {
        let place = places[i];

        let grid = document.querySelector(
            "#" + place.theme + " .places-grid"
        );

        let card = document.createElement("article");

        card.setAttribute("class", "place-card hover-card");

        let favoriteClass = "";

        for (let j = 0; j < favoritePlaces.length; j++) {
            if (favoritePlaces[j] === place.id) {
                favoriteClass = " is-favorite";
            }
        }

        let content =
            '<img src="' + place.image + '" alt="' + place.alt + '">' +
            '<div class="place-info">' +
            '<h3>' + place.name + '</h3>' +
            '<span class="country">' + place.country + '</span>' +
            '<p>' + place.description + '</p>' +
            '</div>';

        if (place.link != "") {
            card.innerHTML =
                '<a href="' + place.link + '" class="place-link">' +
                content +
                '</a>';
        } else {
            card.innerHTML =
                '<div>' +
                content +
                '</div>';
        }

        card.innerHTML +=
            '<button type="button" class="favorite-button' + favoriteClass +
            '" value="' + place.id + '">' +
            '<img class="favorite"' +
            ' src="../res/icons/12_ic_favorite.svg"' +
            ' alt="' + place.name + ' 찜하기">' +
            '<img class="favorite-filled"' +
            ' src="../res/icons/12_ic_favorite_filled.svg"' +
            ' alt="' + place.name + ' 찜하기">' +
            '</button>';

        grid.appendChild(card);
    }

    const favoriteButtons = document.querySelectorAll(".favorite-button");

    for (let i = 0; i < favoriteButtons.length; i++) {
        favoriteButtons[i].addEventListener("click", toggleFavorite);
    }
}

function toggleFavorite() {
    const placeId = this.value;
    let isFavorite = false;

    for (let i = 0; i < favoritePlaces.length; i++) {
        if (favoritePlaces[i] === placeId) {
            isFavorite = true;
        }
    }

    if (isFavorite) {
        favoritePlaces = favoritePlaces.filter(function (id) {
            return id !== placeId;
        });

        this.setAttribute("class", "favorite-button");
    } else {
        favoritePlaces.push(placeId);

        this.setAttribute("class", "favorite-button is-favorite");
    }

    localStorage.setItem(
        "favoritePlaces",
        JSON.stringify(favoritePlaces)
    );
}