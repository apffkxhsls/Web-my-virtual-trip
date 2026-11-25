const tabs = ["places", "stays", "flights", "plans", "diaries"];

for (let i = 0; i < tabs.length; i++) {
    let button = document.getElementById("tab-" + tabs[i]);
    button.addEventListener("click", function () {
        showTab(i);
    });
}

function showTab(index) {
    for (let i = 0; i < tabs.length; i++) {
        let button = document.getElementById("tab-" + tabs[i]);
        let section = document.getElementById(tabs[i]);

        if (i === index) {
            button.setAttribute("class", "mypage-tab active");
            section.style.display = "block";
        } else {
            button.setAttribute("class", "mypage-tab");
            section.style.display = "none";
        }
    }
}

let favoritePlaces = [];
const savedFavorites = localStorage.getItem("favoritePlaces");

if (savedFavorites !== null) {
    favoritePlaces = JSON.parse(savedFavorites);
}

let places = [];
const favoriteList = document.getElementById("favorite-list");
const favoriteMessage = document.getElementById("favorite-message");

fetch("../data/12_웹벤져스_theme.json")
    .then(response => {
        return response.json();
    })
    .then(result => {
        places = result;
        showFavorites();
    })
    .catch(error => {
        console.log("여행지 데이터를 불러오지 못했습니다.", error);

        favoriteMessage.innerText = "여행지 정보를 불러오지 못했습니다. 새로고침해주세요.";
    });

function showFavorites() {
    favoriteList.innerHTML = "";
    let count = 0;

    for (let i = 0; i < places.length; i++) {
        let place = places[i];
        let isFavorite = false;

        for (let j = 0; j < favoritePlaces.length; j++) {
            if (favoritePlaces[j] === place.id) {
                isFavorite = true;
            }
        }

        if (isFavorite) {
            let card = document.createElement("article");
            card.setAttribute("class", "place-card hover-card");

            let content =
                '<img src="' + place.image + '" alt="' + place.alt + '">' +
                '<div class="place-info"><h3></h3><span class="country"></span><p></p></div>';

            if (place.link != "") {
                card.innerHTML =
                    '<a class="card-content" href="' + place.link + '">' +
                    content + '</a>';
            } else {
                card.innerHTML =
                    '<div class="card-content">' + content + '</div>';
            }

            card.innerHTML +=
                '<button type="button" class="favorite-button">' +
                '<img src="../res/icons/12_ic_favorite_filled.svg" alt="찜 취소"></button>';

            card.querySelector("h3").innerText = place.name;
            card.querySelector(".country").innerText = place.country;
            card.querySelector("p").innerText = place.description;

            let button = card.querySelector("button");
            button.value = place.id;
            button.addEventListener("click", removeFavorite);

            favoriteList.appendChild(card);
            count++;
        }
    }

    if (count === 0) {
        favoriteMessage.style.display = "block";

        if (favoritePlaces.length === 0) {
            favoriteMessage.innerText = "찜한 여행지가 없습니다.";
        } else {
            favoriteMessage.innerText = "현재 불러올 수 있는 찜한 여행지가 없습니다.";
        }
    } else {
        favoriteMessage.style.display = "none";
    }
}

function removeFavorite() {
    let placeId = this.value;
    let saved = localStorage.getItem("favoritePlaces");
    favoritePlaces = [];

    if (saved !== null) {
        favoritePlaces = JSON.parse(saved);
    }

    favoritePlaces = favoritePlaces.filter(function (id) {
        return id !== placeId;
    });

    localStorage.setItem("favoritePlaces", JSON.stringify(favoritePlaces));

    showFavorites();
}

function showPlans() {
    let plans = [];
    let saved = localStorage.getItem("savedPlans");

    if (saved !== null) {
        plans = JSON.parse(saved);
    }

    let list = document.getElementById("plan-list");
    let message = document.getElementById("plan-message");

    list.innerHTML = "";

    if (plans.length === 0) {
        message.style.display = "block";
    } else {
        message.style.display = "none";
    }

    for (let i = 0; i < plans.length; i++) {
        let plan = plans[i];
        let card = document.createElement("article");

        card.setAttribute("class", "plan-card hover-card");

        card.innerHTML =
            '<a href="12_웹벤져스_plan.html" class="card-content plan-info">' +
            '<h3></h3><p><img src="../res/icons/12_ic_location_filled.svg" alt="지역"><span></span></p>' +
            '<p><img src="../res/icons/12_ic_calendar.svg" alt="날짜"><span></span></p></a>';

        card.querySelector("h3").innerText = plan.title;

        let details = card.querySelectorAll("span");
        details[0].innerText = plan.region;
        details[1].innerText = plan.startDate + " ~ " + plan.endDate;

        list.appendChild(card);
    }
}

showTab(0);
showPlans();