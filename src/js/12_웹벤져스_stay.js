let stays = [];

fetch("../data/12_웹벤져스_stay.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        stays = data;
        displayStays(stays);

    })
    .catch(function (error) {
        console.log("숙소 데이터를 불러오지 못했습니다.", error);
    });

function displayStays(data) {
    const stayList = document.querySelector(".stay-list");

    stayList.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        const stay = data[i];

        stayList.innerHTML +=
            '<article class="stay-card">' +
            '<div class="stay-image">' +
            '<img class="stay" src="' + stay.image + '" alt="숙소 객실">' +

            '<button type="button" class="favorite-button">' +
            '<img class="favorite"' +
            ' src="../res/icons/12_ic_favorite.svg"' +
            ' alt="' + stay.name + ' 찜하기">' +
            '<img class="favorite-filled"' +
            ' src="../res/icons/12_ic_favorite_filled.svg"' +
            ' alt="' + stay.name + ' 찜하기">' +
            '</button>' +
            '</div>' +

            '<div class="stay-info">' +
            '<div class="stay-info-top">' +
            '<p class="stay-location">' + stay.location + '</p>' +
            '<p class="stay-rating">' +
            '<img src="../res/icons/12_ic_star.svg" alt="평점">' +
            '<span>' + stay.rating + '</span>' +
            '</p>' +
            '</div>' +

            '<h3>' + stay.name + '</h3>' +
            '<p class="stay-features">' + stay.features + '</p>' +
            '<p class="stay-capacity">' +
            stay.baseGuests + '인 기준 - 최대 ' +
            stay.maxGuests + '인' +
            '</p>' +
            '<p class="stay-price">' +
            '<strong>' + stay.price.toLocaleString("ko-KR") + '원</strong>' +
            '<span>/ 1박</span>' +
            '</p>' +
            '</div>' +
            '</article>';
    }
}

const typeCheckboxes = document.querySelectorAll('input[name="type"]');
const priceCheckboxes = document.querySelectorAll('input[name="price"]');
const sortSelect = document.querySelector("#sort");
sortSelect.addEventListener("change", filterStays);

for (let i = 0; i < typeCheckboxes.length; i++) {
    typeCheckboxes[i].addEventListener("change", filterStays);
}

for (let i = 0; i < priceCheckboxes.length; i++) {
    priceCheckboxes[i].addEventListener("change", filterStays);
}

function filterStays() {
    const selectedTypes = [];
    const selectedPrices = [];

    for (let i = 0; i < typeCheckboxes.length; i++) {
        if (typeCheckboxes[i].checked) {
            selectedTypes.push(typeCheckboxes[i].value);
        }
    }

    for (let i = 0; i < priceCheckboxes.length; i++) {
        if (priceCheckboxes[i].checked) {
            selectedPrices.push(priceCheckboxes[i].value);
        }
    }

    const filteredStays = stays.filter(function (stay) {
        let typeMatch = selectedTypes.length === 0;
        let priceMatch = selectedPrices.length === 0;

        for (let i = 0; i < selectedTypes.length; i++) {
            if (stay.type === selectedTypes[i]) {
                typeMatch = true;
            }
        }

        for (let i = 0; i < selectedPrices.length; i++) {
            const price = selectedPrices[i];

            if (price === "under-100000" && stay.price < 100000) {
                priceMatch = true;
            }

            if (
                price === "100000to200000" &&
                stay.price >= 100000 &&
                stay.price < 200000
            ) {
                priceMatch = true;
            }

            if (price === "over200000" && stay.price >= 200000) {
                priceMatch = true;
            }
        }

        return typeMatch && priceMatch;
    });

    if (sortSelect.value === "price-low") {
        filteredStays.sort(function (a, b) {
            return a.price - b.price;
        });
    } else if (sortSelect.value === "rating-high") {
        filteredStays.sort(function (a, b) {
            return b.rating - a.rating;
        });
    } else if (selectedPrices.length > 0) {
        filteredStays.sort(function (a, b) {
            return a.price - b.price;
        });
    }

    displayStays(filteredStays);
}
