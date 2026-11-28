const tabs = ["places", "attractions", "stays", "plans", "diaries"];

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
let places = [];
let regionCities = [];
const favoriteList = document.getElementById("favorite-list");
const favoriteMessage = document.getElementById("favorite-message");

fetch("../data/12_웹벤져스_theme.json")
    .then(response => {
        return response.json();
    })
    .then(result => {
        places = result;
        return fetch("../data/12_웹벤져스_region.json");
    })
    .then(response => {
        return response.json();
    })
    .then(result => {
        regionCities = result.cityList;
        showFavorites();
    })
    .catch(error => {
        console.log("여행지 데이터를 불러오지 못했습니다.", error);

        if (places.length > 0) {
            showFavorites();
        } else {
            favoriteMessage.innerText = "여행지 정보를 불러오지 못했습니다. 새로고침해주세요.";
        }
    });

function findPlace(id) {
    for (let i = 0; i < places.length; i++) {
        if (places[i].id === id) {
            return {
                name: places[i].name,
                image: places[i].image,
                alt: places[i].alt,
                link: places[i].link
            };
        }
    }

    for (let i = 0; i < regionCities.length; i++) {
        if (regionCities[i].id === id) {
            let link = "";

            if (regionCities[i].link !== undefined) {
                link = regionCities[i].link;
            }

            return {
                name: regionCities[i].name,
                image: "../res/images/12_theme-history.jpg",
                alt: regionCities[i].name + " 사진",
                link: link
            };
        }
    }

    return null;
}

function showFavorites() {
    favoritePlaces = [];
    let saved = localStorage.getItem("favoritePlaces");

    if (saved !== null) {
        favoritePlaces = JSON.parse(saved);
    }

    favoriteList.innerHTML = "";
    let count = 0;

    for (let i = 0; i < favoritePlaces.length; i++) {
        let place = findPlace(favoritePlaces[i]);

        if (place !== null) {
            let card = document.createElement("article");
            card.setAttribute("class", "place-card hover-card");

            let content =
                '<img src="' + place.image + '" alt="' + place.alt + '">' +
                '<div class="place-info"><h3></h3></div>';

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

            let button = card.querySelector("button");
            button.value = favoritePlaces[i];
            button.addEventListener("click", removeFavorite);

            favoriteList.appendChild(card);
            count++;
        }
    }

    if (count === 0) {
        favoriteMessage.style.display = "block";
        favoriteMessage.innerText = "찜한 여행지가 없습니다.";
    } else {
        favoriteMessage.style.display = "none";
    }
}

function removeFavorite() {
    let placeId = this.value;

    favoritePlaces = favoritePlaces.filter(function (id) {
        return id !== placeId;
    });

    localStorage.setItem("favoritePlaces", JSON.stringify(favoritePlaces));

    showFavorites();
}

let attractions = [];
const attractionList = document.getElementById("attraction-list");
const attractionMessage = document.getElementById("attraction-message");

fetch("../data/12_kyoto_places.json")
    .then(response => {
        return response.json();
    })
    .then(result => {
        attractions = result.places;
        showFavoriteAttractions();
    })
    .catch(error => {
        console.log("명소 데이터를 불러오지 못했습니다.", error);

        attractionMessage.innerText = "명소 정보를 불러오지 못했습니다. 새로고침해주세요.";
    });

function showFavoriteAttractions() {
    let favoriteAttractions = [];
    let saved = localStorage.getItem("mvt_favorite_places");

    if (saved !== null) {
        favoriteAttractions = JSON.parse(saved);
    }

    attractionList.innerHTML = "";
    let count = 0;

    for (let i = 0; i < attractions.length; i++) {
        let attraction = attractions[i];
        let isFavorite = false;

        for (let j = 0; j < favoriteAttractions.length; j++) {
            if (favoriteAttractions[j] === attraction.id) {
                isFavorite = true;
            }
        }

        if (isFavorite) {
            let card = document.createElement("article");
            card.setAttribute("class", "place-card hover-card");

            card.innerHTML =
                '<a class="card-content" href="12_웹벤져스_detail.html">' +
                '<img src="' + attraction.images[0].src + '" alt="' + attraction.images[0].alt + '">' +
                '<div class="place-info"><h3></h3><span class="country"></span><p></p></div>' +
                '</a>' +
                '<button type="button" class="favorite-button">' +
                '<img src="../res/icons/12_ic_favorite_filled.svg" alt="찜 취소"></button>';

            card.querySelector("h3").innerText = attraction.nameKo;
            card.querySelector(".country").innerText = attraction.location;
            card.querySelector("p").innerText = attraction.nameEn;

            let button = card.querySelector("button");
            button.value = attraction.id;
            button.addEventListener("click", removeFavoriteAttraction);

            attractionList.appendChild(card);
            count++;
        }
    }

    if (count === 0) {
        attractionMessage.style.display = "block";
        attractionMessage.innerText = "찜한 명소가 없습니다.";
    } else {
        attractionMessage.style.display = "none";
    }
}

function removeFavoriteAttraction() {
    let attractionId = this.value;
    let favoriteAttractions = [];
    let saved = localStorage.getItem("mvt_favorite_places");

    if (saved !== null) {
        favoriteAttractions = JSON.parse(saved);
    }

    favoriteAttractions = favoriteAttractions.filter(function (id) {
        return id !== attractionId;
    });

    localStorage.setItem("mvt_favorite_places", JSON.stringify(favoriteAttractions));

    showFavoriteAttractions();
}

let stays = [];
const stayList = document.getElementById("stay-list");
const stayMessage = document.getElementById("stays-message");

fetch("../data/12_웹벤져스_stay.json")
    .then(response => {
        return response.json();
    })
    .then(result => {
        stays = result;
        showFavoriteStays();
    })
    .catch(error => {
        console.log("숙소 데이터를 불러오지 못했습니다.", error);

        stayMessage.innerText = "숙소 정보를 불러오지 못했습니다. 새로고침해주세요.";
    });

function showFavoriteStays() {
    let favoriteStays = [];
    let saved = localStorage.getItem("favoriteStays");

    if (saved !== null) {
        favoriteStays = JSON.parse(saved);
    }

    stayList.innerHTML = "";
    let count = 0;

    for (let i = 0; i < stays.length; i++) {
        let stay = stays[i];
        let isFavorite = false;

        for (let j = 0; j < favoriteStays.length; j++) {
            if (favoriteStays[j] === stay.id) {
                isFavorite = true;
            }
        }

        if (isFavorite) {
            let card = document.createElement("article");
            card.setAttribute("class", "place-card hover-card");

            card.innerHTML =
                '<a class="card-content" href="12_웹벤져스_stay-detail.html">' +
                '<img src="' + stay.image + '" alt="' + stay.name + '">' +
                '<div class="place-info"><h3></h3><span class="country"></span><p></p></div>' +
                '</a>' +
                '<button type="button" class="favorite-button">' +
                '<img src="../res/icons/12_ic_favorite_filled.svg" alt="찜 취소"></button>';

            card.querySelector("h3").innerText = stay.name;
            card.querySelector(".country").innerText = stay.location;
            card.querySelector("p").innerText = stay.price + "원 / 1박";

            card.querySelector("a").addEventListener("click", function () {
                sessionStorage.setItem("selectedStayId", "stay-" + stay.id);
            });

            let button = card.querySelector("button");
            button.value = stay.id;
            button.addEventListener("click", removeFavoriteStay);

            stayList.appendChild(card);
            count++;
        }
    }

    if (count === 0) {
        stayMessage.style.display = "block";
        stayMessage.innerText = "찜한 숙소가 없습니다.";
    } else {
        stayMessage.style.display = "none";
    }
}

function removeFavoriteStay() {
    let stayId = parseInt(this.value);
    let favoriteStays = [];
    let saved = localStorage.getItem("favoriteStays");

    if (saved !== null) {
        favoriteStays = JSON.parse(saved);
    }

    favoriteStays = favoriteStays.filter(function (id) {
        return id !== stayId;
    });

    localStorage.setItem("favoriteStays", JSON.stringify(favoriteStays));

    showFavoriteStays();
}

function getPlans() {
    let plans = [];
    let saved = localStorage.getItem("myPlans");

    if (saved !== null) {
        plans = JSON.parse(saved);
    }

    return plans;
}

function showPlans() {
    let plans = getPlans();

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

        card.querySelector("a").addEventListener("click", function () {
            sessionStorage.setItem("selectedPlanIndex", i);
        });

        list.appendChild(card);
    }
}

let ddayPlanIndex = -1;

function showDday() {
    let plans = getPlans();

    let now = new Date();
    let month = now.getMonth() + 1;
    let date = now.getDate();

    if (month < 10) {
        month = "0" + month;
    }
    if (date < 10) {
        date = "0" + date;
    }

    let today = now.getFullYear() + "-" + month + "-" + date;
    let nextPlan = null;
    ddayPlanIndex = -1;

    for (let i = 0; i < plans.length; i++) {
        let plan = plans[i];

        if (plan.endDate >= today) {
            if (nextPlan === null || plan.startDate < nextPlan.startDate) {
                nextPlan = plan;
                ddayPlanIndex = i;
            }
        }
    }

    let title = document.getElementById("dday-title");
    let count = document.getElementById("dday-count");
    let dateLine = document.getElementById("dday-date");
    let period = document.getElementById("dday-period");

    if (nextPlan === null) {
        count.innerText = "-";
        title.innerText = "새로운 여행을 계획해보세요";
        dateLine.style.display = "none";
        return;
    }

    title.innerText = nextPlan.title;
    period.innerText = nextPlan.startDate + " ~ " + nextPlan.endDate;
    dateLine.style.display = "block";

    if (nextPlan.startDate > today) {
        let start = new Date(nextPlan.startDate).getTime();
        let base = new Date(today).getTime();
        let days = (start - base) / (1000 * 60 * 60 * 24);

        count.innerText = "D-" + days;
    } else if (nextPlan.startDate === today) {
        count.innerText = "D-Day";
    } else {
        count.innerText = "여행 중";
    }
}

document.getElementById("dday").addEventListener("click", function () {
    if (ddayPlanIndex !== -1) {
        sessionStorage.setItem("selectedPlanIndex", ddayPlanIndex);
    }
});

fetch("../data/12_웹벤져스_plan.json")
    .then(response => {
        return response.json();
    })
    .then(result => {
        if (localStorage.getItem("myPlans") === null) {
            localStorage.setItem("myPlans", JSON.stringify(result.samplePlans));
        }

        showPlans();
        showDday();
    })
    .catch(error => {
        console.log("여행 계획 데이터를 불러오지 못했습니다.", error);

        showPlans();
        showDday();
    });

showTab(0);