const continentCards = document.querySelectorAll('.continent-card');
const chipList = document.querySelector('.chip-list');
const countryDesc = document.querySelector('.country-desc');
const cityTitles = document.querySelectorAll('.city-panel-title');
const cityLists = document.querySelectorAll('.city-card-list');
const moreButtons = document.querySelectorAll('.more-btn');
const festivalTitle = document.querySelector('.festival-title');
const shortcutDescs = document.querySelectorAll('.shortcut-desc');
const festivalSection = document.querySelector('.festival-section');
const festivalBox = document.querySelector('.festival-list');

let countryList = [];
let cityList = [];
let selectedContinent = '아시아';
let selectedCountry = '일본';
let popularCount = 3;
let recommendCount = 3;
let festivalList = [];

let favoritePlaces = [];
const savedFavorites = localStorage.getItem("favoritePlaces");
if (savedFavorites !== null) {
    favoritePlaces = JSON.parse(savedFavorites);
}

fetch('../data/12_웹벤져스_region.json')
    .then(response => response.json())
    .then(data => {
        countryList = data.countryList;
        cityList = data.cityList;
        festivalList = data.festivalList;

        for (let i = 0; i < continentCards.length; i++) {
            continentCards[i].addEventListener('click', selectContinent);
        }

        moreButtons[0].addEventListener('click', () => {
            if (popularCount >= getCities('popular').length) {
                popularCount = 3;
            } else {
                popularCount = popularCount + 3;
            }
            showCities();
        });

        moreButtons[1].addEventListener('click', () => {
            if (recommendCount >= getCities('recommend').length) {
                recommendCount = 3;
            } else {
                recommendCount = recommendCount + 3;
            }
            showCities();
        });

        showContinent();
    })
    .catch(error => {
        console.error('에러 발생:', error.message);
    });

function selectContinent() {
    selectedContinent = this.value;
    showContinent();
}

function showContinent() {
    for (let i = 0; i < continentCards.length; i++) {
        if (continentCards[i].value === selectedContinent) {
            continentCards[i].setAttribute('class', 'continent-card is-selected');
        } else {
            continentCards[i].setAttribute('class', 'continent-card');
        }
    }

    const countries = countryList.filter(country => country.continent === selectedContinent);

    chipList.innerHTML = countries.map(country => `
        <button type="button" class="chip" value="${country.name}">${country.name}</button>`).join('');

    const chips = document.querySelectorAll('.chip');
    for (let i = 0; i < chips.length; i++) {
        chips[i].addEventListener('click', selectCountry);
    }

    countryDesc.innerText = `${selectedContinent}의 인기 도시를 알려드릴게요!`;

    if (countries.length > 0) {
        selectedCountry = countries[0].name;
        showCountry();
    }
}

function selectCountry() {
    selectedCountry = this.value;
    showCountry();
}

function showCountry() {
    const chips = document.querySelectorAll('.chip');
    for (let i = 0; i < chips.length; i++) {
        if (chips[i].value === selectedCountry) {
            chips[i].setAttribute('class', 'chip is-selected');
        } else {
            chips[i].setAttribute('class', 'chip');
        }
    }

    cityTitles[0].innerText = `${selectedCountry}의 인기 도시`;
    cityTitles[1].innerText = `${selectedCountry}의 추천 도시`;
    festivalTitle.innerText = `${selectedCountry}의 축제 및 행사`;
    shortcutDescs[0].innerText = `${selectedCountry}의 인기있는 숙소를 만나보세요!`;
    shortcutDescs[1].innerText = `${selectedCountry} 여행을 위한 가장 저렴한 항공권을 찾아보세요!`;

    popularCount = 3;
    recommendCount = 3;
    showCities();
    showFestivals();
}

function showCities() {
    showCityList(cityLists[0], moreButtons[0], getCities('popular'), popularCount);
    showCityList(cityLists[1], moreButtons[1], getCities('recommend'), recommendCount);
    setHeartButtons();
}

function showCityList(listBox, moreButton, cities, count) {
    if (cities.length === 0) {
        listBox.innerHTML = '<p class="empty-msg">아직 준비 중인 지역이에요.</p>';
        moreButton.style.display = 'none';
        return;
    }

    const showList = [];
    for (let i = 0; i < count && i < cities.length; i++) {
        showList.push(cities[i]);
    }

    listBox.innerHTML = showList.map(city => `
        <article class="city-card">
            <button type="button" class="${getHeartClass(city.id)}" value="${city.id}">
                <img class="favorite" src="../res/icons/12_ic_favorite.svg" alt="좋아요 아이콘">
                <img class="favorite-filled" src="../res/icons/12_ic_favorite_filled.svg" alt="좋아요 누른 아이콘">
            </button>
            <a href="${city.link || '#'}">
                <img class="city-img" src="../res/images/12_theme-history.jpg" alt="${city.name} 사진">
                <div class="city-info">
                    <p class="city-name">${city.name}</p>
                    <p class="city-location">${city.country}</p>
                    <div>
                        ${city.tags.map(tag => `<span class="city-tags">#${tag}</span>`).join('')}
                    </div>
                </div>
            </a>
        </article>`).join('');

    if (cities.length <= 3) {
        moreButton.style.display = 'none';
    } else if (count >= cities.length) {
        moreButton.style.display = 'block';
        moreButton.innerHTML = `접기 <img class="more-icon" src="../res/icons/12_ic_chevron_up.svg">`;
    } else {
        moreButton.style.display = 'block';
        moreButton.innerHTML = `더보기 <img class="more-icon" src="../res/icons/12_ic_chevron_down.svg">`;
    }
}

function getCities(type) {
    return cityList.filter(city => city.country === selectedCountry && city.type === type);
}

function getHeartClass(id) {
    for (let i = 0; i < favoritePlaces.length; i++) {
        if (favoritePlaces[i] === id) {
            return "heart-btn is-favorite";
        }
    }
    return "heart-btn";
}

function toggleFavorite() {
    const placeId = this.value;
    const saved = localStorage.getItem("favoritePlaces");
    favoritePlaces = [];
    if (saved !== null) {
        favoritePlaces = JSON.parse(saved);
    }

    let isFavorite = false;
    for (let i = 0; i < favoritePlaces.length; i++) {
        if (favoritePlaces[i] === placeId) {
            isFavorite = true;
        }
    }

    if (isFavorite) {
        const newList = [];
        for (let i = 0; i < favoritePlaces.length; i++) {
            if (favoritePlaces[i] !== placeId) {
                newList.push(favoritePlaces[i]);
            }
        }
        favoritePlaces = newList;
    } else {
        favoritePlaces.push(placeId);
    }

    localStorage.setItem("favoritePlaces", JSON.stringify(favoritePlaces));

    const hearts = document.querySelectorAll(".heart-btn");
    for (let i = 0; i < hearts.length; i++) {
        if (hearts[i].value === placeId) {
            if (isFavorite) {
                hearts[i].setAttribute("class", "heart-btn");
            } else {
                hearts[i].setAttribute("class", "heart-btn is-favorite");
            }
        }
    }
}

function setHeartButtons() {
    const hearts = document.querySelectorAll(".heart-btn");
    for (let i = 0; i < hearts.length; i++) {
        hearts[i].addEventListener("click", toggleFavorite);
    }
}

function showFestivals() {
    const festivals = festivalList.filter(festival => festival.country === selectedCountry);

    if (festivals.length === 0) {
        festivalBox.innerHTML = '<p class="empty-msg">아직 준비 중인 지역이에요.</p>';
        return;
    }

    festivalSection.style.display = 'block';
    festivalBox.innerHTML = festivals.map(festival => `
        <article class="festival-card">
            <div class="festival-poster">
                <img src="${festival.image || '../res/images/12_festival.jpg'}" alt="${festival.name} 포스터">
            </div>
            <div class="ticket-divider"></div>
            <div class="festival-info">
                <div class="festival-top">
                    <p class="festival-name">${festival.name}</p>
                    <p class="festival-city">${festival.city}</p>
                </div>
                <div class="festival-detail">
                    <div class="detail-item">
                        <span class="detail-label">날짜</span>
                        <span class="detail-value">${festival.date}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">장소</span>
                        <span class="detail-value">${festival.place}</span>
                    </div>
                </div>
            </div>
        </article>`).join('');
}