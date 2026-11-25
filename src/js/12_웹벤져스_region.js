const continentCards = document.querySelectorAll('.continent-card');
const chipList = document.querySelector('.chip-list');
const countryDesc = document.querySelector('.country-desc');
const cityTitles = document.querySelectorAll('.city-panel-title');
const festivalTitle = document.querySelector('.festival-title');
const shortcutDescs = document.querySelectorAll('.shortcut-desc');

let countryList = [];
let selectedContinent = '아시아';
let selectedCountry = '일본';

fetch('../data/12_웹벤져스_region.json')
    .then(response => response.json())
    .then(data => {
        countryList = data.countryList;

        for (let i = 0; i < continentCards.length; i++) {
            continentCards[i].addEventListener('click', selectContinent);
        }

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
}