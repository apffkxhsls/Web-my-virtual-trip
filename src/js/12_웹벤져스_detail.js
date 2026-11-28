const aboutPhotos = document.querySelectorAll(".about img");
setupPhotoLightbox(aboutPhotos, document.getElementById("about-lightbox"));

const favoriteStorageKey = "mvt_favorite_places";

function loadFavoritePlaceIds() {
    const savedFavorites = localStorage.getItem(favoriteStorageKey);

    if (savedFavorites === null) {
        return [];
    }

    return JSON.parse(savedFavorites);
}

function isFavoritePlace(favoritePlaceIds, placeId) {
    for (let i = 0; i < favoritePlaceIds.length; i++) {
        if (favoritePlaceIds[i] === placeId) {
            return true;
        }
    }

    return false;
}

function showFavoriteIcon(button, saved) {
    let buttonClass = "place-favorite";
    if (button.id === "place-modal-favorite") {
        buttonClass += " place-modal-favorite";
    }

    if (saved) {
        buttonClass += " place-favorite-saved";
    }
    button.setAttribute("class", buttonClass);
}

function toggleFavoritePlace(placeId) {
    const favoritePlaceIds = loadFavoritePlaceIds();
    const wasSaved = isFavoritePlace(favoritePlaceIds, placeId);
    const updatedFavorites = [];

    for (let i = 0; i < favoritePlaceIds.length; i++) {
        if (favoritePlaceIds[i] !== placeId) {
            updatedFavorites.push(favoritePlaceIds[i]);
        }
    }

    if (!wasSaved) {
        updatedFavorites.push(placeId);
    }

    localStorage.setItem(favoriteStorageKey, JSON.stringify(updatedFavorites));
    showFavoriteIcon(document.getElementById("favorite-" + placeId), !wasSaved);
    return !wasSaved;
}

const cityStatus = document.getElementById("city-status");
const placeModal = document.getElementById("place-modal");
const modalFavorite = document.getElementById("place-modal-favorite");
const modalImage = document.getElementById("place-modal-image");
const previousPhotoButton = document.getElementById("place-modal-prev");
const nextPhotoButton = document.getElementById("place-modal-next");
const thumbnailList = document.getElementById("place-modal-thumbnails");
let selectedPlace = null;
let selectedPhotoIndex = 0;

function setPhoto(image, photo) {
    image.setAttribute("src", photo.src);
    image.setAttribute("alt", photo.alt);
}

function showPlacePhoto(index) {
    const photo = selectedPlace.images[index];
    selectedPhotoIndex = index;
    setPhoto(modalImage, photo);

    const thumbnailButtons = thumbnailList.querySelectorAll("button");
    for (let i = 0; i < thumbnailButtons.length; i++) {
        if (i === index) {
            thumbnailButtons[i].setAttribute("class", "selected-photo");
        } else {
            thumbnailButtons[i].setAttribute("class", "");
        }
    }
}

function preparePlaceGallery() {
    const images = selectedPlace.images;
    let display = "none";
    if (images.length > 1) {
        display = "flex";
    }
    previousPhotoButton.style.display = display;
    nextPhotoButton.style.display = display;
    thumbnailList.style.display = display;

    thumbnailList.innerHTML = "";
    for (let i = 0; i < images.length && images.length > 1; i++) {
        const button = document.createElement("button");
        button.setAttribute("type", "button");
        button.setAttribute("title", "사진 " + (i + 1));
        const image = document.createElement("img");
        setPhoto(image, images[i]);
        button.appendChild(image);
        button.addEventListener("click", function () {
            showPlacePhoto(i);
        });
        thumbnailList.appendChild(button);
    }

    showPlacePhoto(0);
}

function showPlaceInfoRow(field, value) {
    const label = document.getElementById("place-modal-" + field + "-label");
    const detail = document.getElementById("place-modal-" + field);
    if (value) {
        label.style.display = "flex";
        detail.style.display = "block";
        detail.innerText = value;
    } else {
        label.style.display = "none";
        detail.style.display = "none";
    }
}

function openPlaceModal(place) {
    selectedPlace = place;
    document.getElementById("place-modal-title").innerText = place.nameKo;
    document.getElementById("place-modal-name-en").innerText = place.nameEn;
    document.getElementById("place-modal-description").innerText = place.description;
    document.getElementById("place-modal-map").setAttribute("href", place.mapUrl);
    showPlaceInfoRow("location", place.location);
    showPlaceInfoRow("hours", place.hours);
    showPlaceInfoRow("admission", place.admission);
    showPlaceInfoRow("duration", place.duration);
    showFavoriteIcon(modalFavorite, isFavoritePlace(loadFavoritePlaceIds(), place.id));
    preparePlaceGallery();
    placeModal.style.display = "flex";
}

function closePlaceModal() {
    placeModal.style.display = "none";
    selectedPlace = null;
}

modalFavorite.addEventListener("click", function () {
    showFavoriteIcon(modalFavorite, toggleFavoritePlace(selectedPlace.id));
});

previousPhotoButton.addEventListener("click", function () {
    let index = selectedPhotoIndex - 1;
    if (index < 0) {
        index = selectedPlace.images.length - 1;
    }
    showPlacePhoto(index);
});

nextPhotoButton.addEventListener("click", function () {
    let index = selectedPhotoIndex + 1;
    if (index === selectedPlace.images.length) {
        index = 0;
    }
    showPlacePhoto(index);
});

document.getElementById("place-modal-close").addEventListener("click", closePlaceModal);
placeModal.addEventListener("click", function (event) {
    if (event.target.id === "place-modal-shade") {
        closePlaceModal();
    }
});
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closePlaceModal();
    }
});

function setupMoreButton(buttonId, cardSelector) {
    const cards = document.querySelectorAll(cardSelector);
    const button = document.getElementById(buttonId);
    const buttonText = document.querySelector("#" + buttonId + " .more-text");
    const arrow = document.querySelector("#" + buttonId + " .more-icon");
    const initialCardCount = 4;
    if (cards.length <= initialCardCount) {
        button.style.display = "none";
        return;
    }
    let expanded = false;

    button.addEventListener("click", function () {
        expanded = !expanded;

        for (let i = initialCardCount; i < cards.length; i++) {
            if (expanded) {
                cards[i].style.display = "flex";
            } else {
                cards[i].style.display = "none";
            }
        }

        if (expanded) {
            buttonText.innerText = "접기";
            arrow.setAttribute("src", "../res/icons/12_ic_chevron_up.svg");
        } else {
            buttonText.innerText = "더보기";
            arrow.setAttribute("src", "../res/icons/12_ic_chevron_down.svg");
        }
    });
}

function showPlaces(places) {
    const list = document.getElementById("places-list");
    const favorites = loadFavoritePlaceIds();
    for (let i = 0; i < places.length; i++) {
        const place = places[i];
        const card = document.createElement("article");
        card.setAttribute("class", "place-card");
        card.innerHTML =
            '<a class="card-link place-link" href="#place-modal">' +
                '<img alt=""><div class="place-description"><h3></h3><p></p></div>' +
                '<span class="press-shade"></span></a>' +
            '<button type="button" class="place-favorite">' +
                '<img class="ui-icon favorite" src="../res/icons/12_ic_favorite.svg" alt="">' +
                '<img class="ui-icon favorite-filled" src="../res/icons/12_ic_favorite_filled.svg" alt=""></button>';
        const link = card.querySelector(".place-link");
        link.setAttribute("id", place.id);
        setPhoto(link.querySelector("img"), place.cardImage);
        link.querySelector("h3").innerText = place.nameKo;
        link.querySelector("p").innerText = place.summary;
        link.addEventListener("click", function (event) {
            event.preventDefault();
            openPlaceModal(place);
        });

        const button = card.querySelector("button");
        button.setAttribute("id", "favorite-" + place.id);
        button.setAttribute("title", place.nameKo + " 찜하기");
        showFavoriteIcon(button, isFavoritePlace(favorites, place.id));
        button.addEventListener("click", function () {
            toggleFavoritePlace(place.id);
        });
        list.appendChild(card);
    }
    setupMoreButton("places-more", ".places-list .place-card");
}

function addRatingStars(row, icon) {
    for (let i = 0; i < 5; i++) {
        const star = document.createElement("img");
        star.setAttribute("class", "rating-star");
        star.setAttribute("src", "../res/icons/" + icon);
        star.setAttribute("alt", "");
        row.appendChild(star);
    }
}

function showRestaurants(restaurants) {
    const list = document.getElementById("restaurant-list");
    for (let i = 0; i < restaurants.length; i++) {
        const restaurant = restaurants[i];
        const card = document.createElement("article");
        card.setAttribute("class", "restaurant-item");
        card.innerHTML =
            '<a class="card-link restaurant-link" target="_blank" rel="noopener noreferrer">' +
                '<div class="restaurant-text"><h3></h3><p class="address"></p><p class="category"></p>' +
                '<p class="rating"><span class="rating-value"></span><span class="stars">' +
                '<span class="star-row"></span><span class="star-filled"><span class="star-row"></span></span>' +
                '</span></p></div><img class="restaurant-photo" alt=""><span class="press-shade"></span></a>';
        card.querySelector("a").setAttribute("href", restaurant.mapUrl);
        const name = card.querySelector("h3");
        name.innerText = restaurant.name;
        name.setAttribute("title", restaurant.name);
        const address = card.querySelector(".address");
        address.innerText = restaurant.address;
        address.setAttribute("title", restaurant.address);
        card.querySelector(".category").innerText = restaurant.category;
        if (restaurant.rating === null) {
            card.querySelector(".rating").remove();
        } else {
            card.querySelector(".rating-value").innerText = restaurant.rating;
            const rows = card.querySelectorAll(".star-row");
            addRatingStars(rows[0], "12_ic_star_empty.svg");
            addRatingStars(rows[1], "12_ic_star.svg");
            card.querySelector(".star-filled").style.width = restaurant.rating * 20 + "%";
        }
        setPhoto(card.querySelector(".restaurant-photo"), restaurant.image);
        list.appendChild(card);
    }
    setupMoreButton("restaurants-more", ".restaurant-list .restaurant-item");
}

function showCity(city) {
    document.querySelector("title").innerText = city.nameKo + " 여행 | My Virtual Trip";
    document.querySelector(".country span").innerText = city.country;
    document.querySelector(".hero h1").innerText = city.nameEn;
    document.querySelector(".hero-summary").innerText = city.hero.summary;
    setPhoto(document.querySelector(".hero-image"), city.hero.image);
    document.querySelector(".about h2").innerText = "About " + city.nameEn;
    document.querySelector(".about .section-header p").innerText = city.about.subtitle;
    document.querySelector(".about-description").innerText = city.about.description;
    for (let i = 0; i < aboutPhotos.length; i++) {
        setPhoto(aboutPhotos[i], city.about.images[i]);
    }
    document.querySelector(".places .section-header p").innerText = city.placesSubtitle;
    document.querySelector(".restaurants .section-header p").innerText = city.restaurantsSubtitle;
    showPlaces(city.places);
    showRestaurants(city.restaurants);
    cityStatus.style.display = "none";
    document.getElementById("city-detail").style.display = "block";
}

function loadCity() {
    const params = new URLSearchParams(window.location.search);
    let city = params.get("city");
    if (city === null) {
        city = "kyoto";
    }
    if (city !== "kyoto" && city !== "shanghai" && city !== "busan") {
        cityStatus.innerText = "아직 등록되지 않은 도시입니다.";
        return;
    }

    fetch("../data/12_웹벤져스_" + city + ".json")
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            if (response.status === 404) {
                cityStatus.innerText = "아직 등록되지 않은 도시입니다.";
            } else {
                showCityLoadError();
            }
            return null;
        })
        .then(function (data) {
            if (data !== null) {
                showCity(data);
            }
        })
        .catch(showCityLoadError);
}

function showCityLoadError() {
    cityStatus.innerText = "도시 정보를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.";
}

loadCity();
