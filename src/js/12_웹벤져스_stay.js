let stays = [];
let selectedRegion = "";
let selectedGuests = 1;
let favoriteStays = [];

const savedFavorites = localStorage.getItem("favoriteStays");

if (savedFavorites !== null) {
    favoriteStays = JSON.parse(savedFavorites);
}

fetch("../data/12_웹벤져스_stay.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        stays = data;
        filterStays();
    })
    .catch(function (error) {
        console.log("숙소 데이터를 불러오지 못했습니다.", error);

        document.querySelector(".stay-list").innerHTML =
            "<p>숙소 정보를 불러오지 못했습니다. 새로고침해주세요.</p>";
    });

function displayStays(data) {
    const stayList = document.querySelector(".stay-list");

    stayList.innerHTML = "";

    if (data.length === 0) {
        stayList.innerHTML = "<p>조건에 맞는 숙소가 없습니다.</p>";
        return;
    }

    for (let i = 0; i < data.length; i++) {
        const stay = data[i];

        let ratingText = stay.rating;

        if (stay.rating % 1 === 0) {
            ratingText = stay.rating + ".0";
        }

        let favoriteClass = "";

        for (let j = 0; j < favoriteStays.length; j++) {
            if (favoriteStays[j] === stay.id) {
                favoriteClass = " is-favorite";
            }
        }

        stayList.innerHTML +=
            '<article class="stay-card">' +
            '<a class="stay-detail-link" id="stay-' + stay.id + '"' +
            ' href="12_웹벤져스_stay-detail.html">' +

            '<div class="stay-image">' +
            '<img class="stay" src="' + stay.image + '" alt="숙소 객실">' +
            '</div>' +

            '<div class="stay-info">' +
            '<div class="stay-info-top">' +
            '<p class="stay-location">' + stay.location + '</p>' +
            '<p class="stay-rating">' +
            '<img src="../res/icons/12_ic_star.svg" alt="평점">' +
            '<span>' + ratingText + '</span>' +
            '</p>' +
            '</div>' +

            '<h3>' + stay.name + '</h3>' +
            '<p class="stay-features">' + stay.features + '</p>' +
            '<p class="stay-capacity">' +
            '기준 ' + stay.baseGuests + '인 / 최대 ' +
            stay.maxGuests + '인' +
            '</p>' +
            '<p class="stay-price">' +
            '<strong>' + stay.price.toLocaleString("ko-KR") + '원</strong>' +
            '<span>/ 1박</span>' +
            '</p>' +
            '</div>' +
            '</a>' +

            '<button type="button" class="favorite-button' + favoriteClass +
            '" value="' + stay.id + '">' +
            '<img class="favorite"' +
            ' src="../res/icons/12_ic_favorite.svg"' +
            ' alt="' + stay.name + ' 찜하기">' +
            '<img class="favorite-filled"' +
            ' src="../res/icons/12_ic_favorite_filled.svg"' +
            ' alt="' + stay.name + ' 찜하기">' +
            '</button>' +
            '</article>';
    }

    const favoriteButtons = document.querySelectorAll(".favorite-button");
    for (let i = 0; i < favoriteButtons.length; i++) {
        favoriteButtons[i].addEventListener("click", toggleFavorite);
    }

    const detailLinks = document.querySelectorAll(".stay-detail-link");
    for (let i = 0; i < detailLinks.length; i++) {
        detailLinks[i].addEventListener("click", function () {
            sessionStorage.setItem("selectedStayId", this.id);
        });
    }
}

const typeCheckboxes = document.querySelectorAll('input[name="type"]');
const priceCheckboxes = document.querySelectorAll('input[name="price"]');
const sortSelect = document.querySelector("#sort");
sortSelect.addEventListener("change", filterStays);
const regionSelect = document.querySelector("#region");
const guestsSelect = document.querySelector("#guests");
const checkinInput = document.querySelector("#checkin");
const checkoutInput = document.querySelector("#checkout");
const searchButton = document.querySelector(".stay-search .search-button");

searchButton.addEventListener("click", function () {
    const checkin = checkinInput.value;
    const checkout = checkoutInput.value;

    if (checkin !== "" || checkout !== "") {
        if (checkin === "" || checkout === "") {
            alert("체크인과 체크아웃 날짜를 모두 선택해주세요.");
            return;
        }

        if (checkout <= checkin) {
            alert("체크아웃은 체크인보다 뒤의 날짜로 선택해주세요.");
            return;
        }
    }

    selectedRegion = regionSelect.value;
    selectedGuests = parseInt(guestsSelect.value);
    filterStays();
});

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

        const regionMatch = selectedRegion === "" || stay.region === selectedRegion;
        const guestsMatch = stay.maxGuests >= selectedGuests;

        return typeMatch && priceMatch && regionMatch && guestsMatch;
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

function toggleFavorite() {
    const stayId = parseInt(this.value);
    let isFavorite = false;

    for (let i = 0; i < favoriteStays.length; i++) {
        if (favoriteStays[i] === stayId) {
            isFavorite = true;
        }
    }

    if (isFavorite) {
        favoriteStays = favoriteStays.filter(function (id) {
            return id !== stayId;
        });
    } else {
        favoriteStays.push(stayId);
    }

    localStorage.setItem(
        "favoriteStays",
        JSON.stringify(favoriteStays)
    );

    console.log("찜한 숙소:", favoriteStays);

    filterStays();
}
