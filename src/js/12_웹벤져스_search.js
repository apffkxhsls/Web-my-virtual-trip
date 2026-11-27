const placeSelect = document.getElementById('research-place');
const dateInput = document.getElementById('research-date');
const themeSelect = document.getElementById('research-theme');
const researchForm = document.querySelector('.research');
const resultList = document.querySelector('.result-cardlist');

const searchPlace = sessionStorage.getItem('searchPlace') || '';
const searchDate = sessionStorage.getItem('searchDate') || '';
const searchTheme = sessionStorage.getItem('searchTheme') || '';

let searchMonth = 0;
if (searchDate !== '') {
    searchMonth = new Date(searchDate).getMonth() + 1;
}

fetch('../data/12_웹벤져스_region.json')
    .then(response => response.json())
    .then(data => {
        showOptions(data);
        fillForm();
        showResults(data);
    })
    .catch(error => {
        console.error('에러 발생:', error.message);
    });

researchForm.addEventListener('submit', () => {
    sessionStorage.setItem('searchPlace', placeSelect.value);
    sessionStorage.setItem('searchDate', dateInput.value);
    sessionStorage.setItem('searchTheme', themeSelect.value);
});

function showOptions(data) {
    const continents = [];
    for (let i = 0; i < data.countryList.length; i++) {
        const continent = data.countryList[i].continent;
        if (hasValue(continents, continent) === false) {
            continents.push(continent);
        }
    }

    const themes = [];
    for (let i = 0; i < data.cityList.length; i++) {
        const tags = data.cityList[i].tags;
        for (let j = 0; j < tags.length; j++) {
            if (hasValue(themes, tags[j]) === false) {
                themes.push(tags[j]);
            }
        }
    }

    placeSelect.innerHTML = '<option value="">지역을 선택해주세요</option>'
        + continents.map(continent => `<option value="${continent}">${continent}</option>`).join('');

    themeSelect.innerHTML = '<option value="">테마 전체</option>'
        + themes.map(theme => `<option value="${theme}">${theme}</option>`).join('');
}

function fillForm() {
    placeSelect.value = searchPlace;
    dateInput.value = searchDate;
    themeSelect.value = searchTheme;
}

function showResults(data) {

    const monthFestivals = data.festivalList.filter(festival => hasValue(festival.months, searchMonth));

    const festivalCountries = [];
    for (let i = 0; i < monthFestivals.length; i++) {
        if (hasValue(festivalCountries, monthFestivals[i].country) === false) {
            festivalCountries.push(monthFestivals[i].country);
        }
    }

    const results = data.cityList.filter(city => {
        if (city.continent !== searchPlace) {
            return false;
        }
        if (searchTheme !== '' && hasValue(city.tags, searchTheme) === false) {
            return false;
        }
        if (searchMonth !== 0 && hasValue(festivalCountries, city.country) === false) {
            return false;
        }
        return true;
    });


    if (results.length === 0) {
        resultList.innerHTML = '<p class="empty-msg">선택하신 조건에 맞는 여행지가 없어요. 다른 조건으로 검색해 보세요.</p>';
        return;
    }

    resultList.innerHTML = results.map(city => `
        <article class="city-card">
            <button type="button" class="${getHeartClass(city.id)}" value="${city.id}">
                <img class="favorite" src="../res/icons/12_ic_favorite.svg" alt="좋아요 아이콘">
                <img class="favorite-filled" src="../res/icons/12_ic_favorite_filled.svg" alt="좋아요 누른 아이콘">
            </button>
            <a href="${city.link || '#'}">
                <img class="city-img" src="${city.image || '../res/images/12_theme-history.jpg'}" alt="${city.name} 사진">
                <div class="city-info">
                    <p class="city-name">${city.name}</p>
                    <p class="city-location">${city.country}</p>
                    <div class="city-tag-list">
                        ${city.tags.map(tag => `<span class="city-tags">#${tag}</span>`).join('')}
                    </div>
                </div>
            </a>
        </article>`).join('');

    setHeartButtons();
}

function getConditionText() {
    let text = searchPlace;
    if (searchMonth !== 0) {
        text = text + ` · ${searchMonth}월`;
    }
    if (searchTheme !== '') {
        text = text + ` · #${searchTheme}`;
    }
    return text;
}

function hasValue(list, value) {
    for (let i = 0; i < list.length; i++) {
        if (list[i] === value) {
            return true;
        }
    }
    return false;
}

/* ===== 찜 기능 (favoritePlaces) ===== */
function getSavedList() {
    const saved = localStorage.getItem('favoritePlaces');
    if (saved !== null) {
        return JSON.parse(saved);
    }
    return [];
}

function getHeartClass(id) {
    if (hasValue(getSavedList(), id)) {
        return 'heart-btn is-favorite';
    }
    return 'heart-btn';
}

function toggleFavorite() {
    const list = getSavedList();
    const newList = [];
    let isSaved = false;

    for (let i = 0; i < list.length; i++) {
        if (list[i] === this.value) {
            isSaved = true;
        } else {
            newList.push(list[i]);
        }
    }

    if (isSaved) {
        this.setAttribute('class', 'heart-btn');
    } else {
        newList.push(this.value);
        this.setAttribute('class', 'heart-btn is-favorite');
    }

    localStorage.setItem('favoritePlaces', JSON.stringify(newList));
}

function setHeartButtons() {
    const hearts = document.querySelectorAll('.heart-btn');
    for (let i = 0; i < hearts.length; i++) {
        hearts[i].addEventListener('click', toggleFavorite);
    }
}