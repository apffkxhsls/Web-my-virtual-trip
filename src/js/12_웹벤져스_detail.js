const aboutPhotos = document.querySelectorAll(".about img");
const aboutLightbox = document.getElementById("about-lightbox");
const lightboxImage = document.getElementById("about-lightbox-image");
const lightboxCloseButton = document.getElementById("about-lightbox-close");

function openAboutLightbox(event) {
    lightboxImage.setAttribute("src", event.target.src);
    lightboxImage.setAttribute("alt", event.target.alt);
    aboutLightbox.style.display = "flex";
}

function closeAboutLightbox() {
    aboutLightbox.style.display = "none";
}

for (let i = 0; i < aboutPhotos.length; i++) {
    aboutPhotos[i].addEventListener("click", openAboutLightbox);
}

lightboxCloseButton.addEventListener("click", closeAboutLightbox);

aboutLightbox.addEventListener("click", function (event) {
    if (event.target.id === "lightbox-shade" || event.target.className === "about-lightbox-photo") {
        closeAboutLightbox();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeAboutLightbox();
    }
});

const favoriteStorageKey = "mvt_favorite_places";
const placeLinks = document.querySelectorAll(".place-link");
const placeFavoriteButtons = document.querySelectorAll(".place-card .place-favorite");

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

const savedFavoritePlaceIds = loadFavoritePlaceIds();

for (let i = 0; i < placeFavoriteButtons.length; i++) {
    const button = placeFavoriteButtons[i];
    const placeId = placeLinks[i].id;
    showFavoriteIcon(button, isFavoritePlace(savedFavoritePlaceIds, placeId));
    button.addEventListener("click", function () {
        toggleFavoritePlace(placeId);
    });
}

const placeStatus = document.getElementById("place-status");
const placeModal = document.getElementById("place-modal");
const modalFavorite = document.getElementById("place-modal-favorite");
const modalImage = document.getElementById("place-modal-image");
const previousPhotoButton = document.getElementById("place-modal-prev");
const nextPhotoButton = document.getElementById("place-modal-next");
const thumbnailList = document.getElementById("place-modal-thumbnails");
const thumbnailButtons = document.querySelectorAll(".place-modal-thumbnails button");
const thumbnailImages = document.querySelectorAll(".place-modal-thumbnails img");
let places = [];
let placeLoadError = false;
let selectedPlace = null;
let selectedPhotoIndex = 0;

fetch("../data/12_kyoto_places.json")
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
        placeLoadError = true;
        placeStatus.style.display = "block";
        placeStatus.innerText = "명소 정보를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.";
    })
    .then(function (data) {
        if (!placeLoadError) {
            places = data.places;
            placeStatus.style.display = "none";
            placeStatus.innerText = "";
        }
    })
    .catch(function () {
        placeLoadError = true;
        placeStatus.style.display = "block";
        placeStatus.innerText = "명소 정보를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.";
    });

function showPlacePhoto(index) {
    const photo = selectedPlace.images[index];
    selectedPhotoIndex = index;
    modalImage.setAttribute("src", photo.src);
    modalImage.setAttribute("alt", photo.alt);

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

    for (let i = 0; i < images.length && images.length > 1; i++) {
        thumbnailImages[i].setAttribute("src", images[i].src);
        thumbnailImages[i].setAttribute("alt", images[i].alt);
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

for (let i = 0; i < placeLinks.length; i++) {
    const link = placeLinks[i];
    link.addEventListener("click", function (event) {
        event.preventDefault();
        if (placeLoadError) {
            return;
        }
        if (places.length === 0) {
            placeStatus.style.display = "block";
            placeStatus.innerText = "명소 정보를 불러오는 중입니다. 잠시 후 다시 눌러 주세요.";
            return;
        }

        const placeId = link.id;
        for (let j = 0; j < places.length; j++) {
            if (places[j].id === placeId) {
                placeStatus.style.display = "none";
                placeStatus.innerText = "";
                openPlaceModal(places[j]);
                return;
            }
        }
        placeStatus.style.display = "block";
        placeStatus.innerText = "선택한 명소 정보를 찾을 수 없습니다.";
    });
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

for (let i = 0; i < thumbnailButtons.length; i++) {
    thumbnailButtons[i].addEventListener("click", function () {
        showPlacePhoto(i);
    });
}

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

setupMoreButton("places-more", ".places-list .place-card");
setupMoreButton("restaurants-more", ".restaurant-list .restaurant-item");
