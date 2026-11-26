const regionList = document.querySelector('.region-card-list');
const themeList = document.querySelector('.theme-card-list');
const stayList = document.querySelector('.stay-card-list');

const regionPrev = document.querySelector('.region-prev');
const regionNext = document.querySelector('.region-next');

let currentRegion = 3;


fetch('../data/12_웹벤져스_main.json')
    .then(response => response.json())
    .then(data => {
        // 지금 떠나기 좋은 여행지
        regionList.innerHTML = data.regionList.map(item => `
            <article class="region-card">
                <button type="button" class="${getHeartClass(item.id, 'favoritePlaces')}" name="favoritePlaces" value="${item.id}">
                    <img class="favorite" src="../res/icons/12_ic_favorite.svg" alt="좋아요 아이콘">
                    <img class="favorite-filled" src="../res/icons/12_ic_favorite_filled.svg" alt="좋아요 누른 아이콘">
                </button>
                <a href="${item.link}">
                    <img class="region-img" src="${item.image}" alt="${item.alt}">
                    <div class="region-info">
                        <span class="region-meta">${item.meta}</span>
                        <p class="region-name">${item.name}</p>
                        <p class="region-rating">${item.rating}</p>
                    </div>
                </a>
            </article>`).join('');
        setRegionSlider();

        // 인기있는 여행 테마 TOP 5
        themeList.innerHTML = data.themeList.map(item => `
            <article class="theme-card">
                <div class="card-img-wrapper">
                    <img class="vis-icon" src="../res/icons/12_ic_visibility.svg" alt="조회 수 아이콘">
                    <p class="card-badge">${item.views}</p>
                </div>
                <img class="card-img" src="${item.image}" alt="${item.alt}">
                <div class="card-info">
                    <span class="card-title" id="${item.id}">${item.title}</span>
                    <p class="card-desc">${item.desc}</p>
                    <a href="12_웹벤져스_theme.html#${item.id}" class="card-btn">테마관 가기</a>
                </div>
            </article>`).join('');

        // 세계의 인기 숙소
        stayList.innerHTML = data.stayList.map(item => `
            <article class="stay-card">
                <button type="button" class="${getHeartClass(item.id, 'favoriteStays')}" name="favoriteStays" value="${item.id}">
                    <img class="favorite" src="../res/icons/12_ic_favorite.svg" alt="좋아요 아이콘">
                    <img class="favorite-filled" src="../res/icons/12_ic_favorite_filled.svg" alt="좋아요 누른 아이콘">
                </button>
                <a href="${item.bookingUrl}">  
                    <img class="stay-img" src="${item.image}" alt="${item.alt}">
                    <div class="stay-info">
                        <p class="stay-name">${item.name}</p>
                        <p class="stay-price">${item.price}/1박</p>
                        <p class="stay-rating">★ ${item.rating}</p>
                    </div>
                </a>
            </article>`).join('');

        setHeartButtons();
    })
    .catch(error => {
        console.error('에러 발생:', error.message);
    });

// 지금 떠나기 좋은 여행지 섹션 캐러셀

function setRegionSlider() {
    const cards = document.querySelectorAll('.region-card');
    const totalRegions = cards.length;
    const half = Math.floor(totalRegions / 2);

    const widths = [380, 260, 220, 180];
    const heights = [480, 420, 380, 340];
    const distances = [0, 240, 360, 450];

    function showRegion() {
        for (let i = 0; i < totalRegions; i++) {
            let offset = i - currentRegion;
            if (offset > half) {
                offset = offset - totalRegions;
            }
            if (offset < -half) {
                offset = offset + totalRegions;
            }

            let step = offset;
            if (step < 0) {
                step = -offset;
            }

            let x = distances[step];
            if (offset < 0) {
                x = -x;
            }

            cards[i].style.width = widths[step] + 'px';
            cards[i].style.height = heights[step] + 'px';
            cards[i].style.left = (600 + x - widths[step] / 2) + 'px';
            cards[i].style.top = (500 - heights[step]) / 2 + 'px';
            cards[i].style.zIndex = 10 - step;
        }
    }

    regionNext.addEventListener('click', () => {
        currentRegion++;
        if (currentRegion > totalRegions - 1) {
            currentRegion = 0;
        }
        showRegion();
    });

    regionPrev.addEventListener('click', () => {
        currentRegion--;
        if (currentRegion < 0) {
            currentRegion = totalRegions - 1;
        }
        showRegion();
    });

    showRegion();
}

// 하트 이모지 버튼 찜 기능

function getSavedList(key) {
    const saved = localStorage.getItem(key);
    if (saved !== null) {
        return JSON.parse(saved);
    }
    return [];
}

function getHeartClass(id, key) {
    const list = getSavedList(key);
    for (let i = 0; i < list.length; i++) {
        if (list[i] === id) {
            return "heart-btn is-favorite";
        }
    }
    return "heart-btn";
}

function toggleFavorite() {
    let placeId = this.value;
    const key = this.getAttribute("name");
    if (key == "favoriteStays") {
        placeId = parseInt(placeId);
    }
    let list = getSavedList(key);

    let isFavorite = false;
    for (let i = 0; i < list.length; i++) {
        if (list[i] === placeId) {
            isFavorite = true;
        }
    }

    if (isFavorite) {
        const newList = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i] !== placeId) {
                newList.push(list[i]);
            }
        }
        list = newList;
    } else {
        list.push(placeId);
    }

    localStorage.setItem(key, JSON.stringify(list));

    const hearts = document.querySelectorAll(".heart-btn");
    for (let i = 0; i < hearts.length; i++) {
        if (hearts[i].value === this.value && hearts[i].getAttribute("name") === key) {
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