function fillStoryStars(row, score) {
    row.setAttribute("role", "img");
    row.setAttribute("aria-label", "여행 만족도 " + score + "점");
    for (let i = 0; i < score; i++) {
        const star = document.createElement("img");
        star.setAttribute("class", "ui-icon");
        star.setAttribute("src", "../res/icons/12_ic_star.svg");
        star.setAttribute("alt", "");
        row.appendChild(star);
    }
}

function appendSavedStory(list, record) {
    const card = document.createElement("article");
    card.setAttribute("class", "story-card");
    const body = document.createElement("a");
    body.setAttribute("class", "story-link");
    body.setAttribute("href", "12_웹벤져스_diary_view.html");
    body.addEventListener("click", function () {
        sessionStorage.setItem(diaryViewIdKey, record.id);
    });
    const image = document.createElement("img");
    image.setAttribute("class", "story-image");
    image.setAttribute("src", record.coverImage || diaryFallbackImage);
    image.setAttribute("alt", record.coverImage ? record.title + " 대표 사진" : "");
    body.appendChild(image);
    const info = document.createElement("div");
    info.setAttribute("class", "story-info");
    const title = document.createElement("h3");
    title.innerText = record.title;
    title.setAttribute("title", record.title);
    info.appendChild(title);

    const details = [record.location, record.startDate + " ~ " + record.endDate, diaryExpenseText(diaryRecordExpense(record), "")];
    const icons = ["12_ic_location_filled.svg", "12_ic_calendar.svg", "12_ic_currency.svg"];
    for (let i = 0; i < details.length; i++) {
        const row = document.createElement("p");
        const icon = document.createElement("img");
        const value = document.createElement("span");
        row.setAttribute("class", "info-row");
        icon.setAttribute("class", "ui-icon info-icon");
        icon.setAttribute("src", "../res/icons/" + icons[i]);
        icon.setAttribute("alt", "");
        value.setAttribute("class", "info-text");
        value.setAttribute("title", details[i]);
        value.innerText = details[i];
        row.appendChild(icon);
        row.appendChild(value);
        info.appendChild(row);
    }
    if (record.rating >= 1 && record.rating <= 5) {
        const row = document.createElement("div");
        row.setAttribute("class", "story-rating");
        fillStoryStars(row, record.rating);
        info.appendChild(row);
    }
    body.appendChild(info);
    card.appendChild(body);
    list.appendChild(card);
}

function setupDiaryBanner(records) {
    const banner = document.querySelector(".memory-banner");
    if (records.length === 0) {
        banner.style.display = "none";
        return;
    }

    const bannerRecords = records.slice(-6);
    let currentIndex = bannerRecords.length - 1;
    const kyotoIndex = findDiaryRecord(bannerRecords, 1);
    if (kyotoIndex >= 0) {
        currentIndex = kyotoIndex;
    }
    const background = banner.querySelector(".banner-background");
    const track = banner.querySelector(".banner-track");
    const centerImage = banner.querySelector(".feature-image");
    const sideImages = [banner.querySelector(".banner-side-prev img"), banner.querySelector(".banner-side-next img")];
    const bufferImages = [banner.querySelector(".banner-buffer-prev img"), banner.querySelector(".banner-buffer-next img")];
    const title = banner.querySelector(".feature-copy h1");
    const period = banner.querySelector(".feature-copy p");
    const previousButton = document.getElementById("diary-banner-prev");
    const nextButton = document.getElementById("diary-banner-next");
    const dots = document.getElementById("diary-banner-dots");
    const playButton = document.getElementById("diary-banner-play");
    let photoIndex = 0;
    let playbackVersion = 0;
    let playing = false;
    let paused = false;
    let movingBanner = false;

    function bannerIndex(index) {
        if (index < 0) {
            return bannerRecords.length - 1;
        }
        if (index >= bannerRecords.length) {
            return 0;
        }
        return index;
    }

    function showBannerImage(image, record) {
        image.setAttribute("src", record.coverImage || diaryFallbackImage);
        image.setAttribute("alt", record.coverImage ? record.title + " 대표 사진" : "");
    }

    function showBanner(index) {
        currentIndex = bannerIndex(index);
        const record = bannerRecords[currentIndex];
        paused = false;
        updatePlayback(false);
        playButton.disabled = !record.photos || record.photos.length === 0;
        showBannerImage(background, record);
        showBannerImage(centerImage, record);
        showBannerImage(sideImages[0], bannerRecords[bannerIndex(currentIndex - 1)]);
        showBannerImage(sideImages[1], bannerRecords[bannerIndex(currentIndex + 1)]);
        title.innerText = record.title;
        period.innerText = record.startDate + " ~ " + record.endDate;

        const items = dots.querySelectorAll("a");
        for (let i = 0; i < items.length; i++) {
            if (i === currentIndex) {
                items[i].setAttribute("class", "banner-dot selected");
                items[i].setAttribute("aria-current", "true");
            } else {
                items[i].setAttribute("class", "banner-dot");
                items[i].removeAttribute("aria-current");
            }
        }
    }

    function updatePlayback(isPlaying) {
        playbackVersion++;
        playing = isPlaying;
        playButton.setAttribute("class", playing ? "play-button is-playing" : "play-button");
        let label = "여행 추억 재생";
        if (playing) {
            label = "여행 추억 일시정지";
        } else if (paused) {
            label = "여행 추억 계속 재생";
        }
        playButton.setAttribute("aria-label", label);
        playButton.setAttribute("title", label);
    }

    function moveBanner(index, direction) {
        const target = bannerIndex(index);
        if (movingBanner || target === currentIndex) {
            return;
        }
        movingBanner = true;
        paused = false;
        updatePlayback(false);
        playButton.disabled = true;
        const side = direction < 0 ? 0 : 1;
        showBannerImage(sideImages[side], bannerRecords[target]);
        showBannerImage(bufferImages[side], bannerRecords[bannerIndex(target + direction)]);
        track.setAttribute("class", direction < 0 ? "banner-track moving-prev" : "banner-track moving-next");
        setTimeout(function () {
            track.setAttribute("class", "banner-track");
            showBanner(target);
            movingBanner = false;
        }, 600);
    }

    function showSlide(record) {
        centerImage.setAttribute("src", record.photos[photoIndex]);
        centerImage.setAttribute("alt", record.title + " 사진 " + (photoIndex + 1));
    }

    function scheduleSlide(record, version) {
        setTimeout(function () {
            if (version !== playbackVersion) {
                return;
            }
            photoIndex++;
            if (photoIndex === record.photos.length) {
                photoIndex = 0;
                showSlide(record);
                updatePlayback(false);
                return;
            }
            showSlide(record);
            scheduleSlide(record, version);
        }, 3000);
    }

    playButton.addEventListener("click", function () {
        if (playing) {
            paused = true;
            updatePlayback(false);
            return;
        }
        if (!paused) {
            photoIndex = 0;
        }
        paused = false;
        const record = bannerRecords[currentIndex];
        updatePlayback(true);
        showSlide(record);
        scheduleSlide(record, playbackVersion);
    });

    previousButton.addEventListener("click", function (event) {
        event.preventDefault();
        moveBanner(currentIndex - 1, -1);
    });
    nextButton.addEventListener("click", function (event) {
        event.preventDefault();
        moveBanner(currentIndex + 1, 1);
    });
    for (let i = 0; i < bannerRecords.length; i++) {
        const dot = document.createElement("a");
        dot.setAttribute("href", "#");
        dot.setAttribute("title", bannerRecords[i].title);
        dot.setAttribute("aria-label", bannerRecords[i].title);
        dot.addEventListener("click", function (event) {
            event.preventDefault();
            moveBanner(i, i < currentIndex ? -1 : 1);
        });
        dots.appendChild(dot);
    }
    if (bannerRecords.length === 1) {
        previousButton.style.display = "none";
        nextButton.style.display = "none";
        sideImages[0].parentElement.style.visibility = "hidden";
        sideImages[1].parentElement.style.visibility = "hidden";
    }
    showBanner(currentIndex);
}

function setupCapturedMoments(records) {
    const gallery = document.getElementById("moment-photos");
    const more = document.querySelector(".moments-more");
    const photos = [];
    const shownPaths = {};
    for (let i = records.length - 1; i >= 0; i--) {
        const record = records[i];
        let paths = record.photos || [];
        if (paths.length === 0 && record.coverImage) {
            paths = [record.coverImage];
        }
        for (let j = 0; j < paths.length; j++) {
            const src = paths[j];
            if (src && !shownPaths[src]) {
                photos.push({src: src, alt: record.title + " 여행 사진"});
                shownPaths[src] = true;
            }
        }
    }

    if (photos.length === 0) {
        gallery.innerText = "저장된 여행 사진이 없습니다.";
        return;
    }

    const addPhotosToLightbox = setupPhotoLightbox([], document.getElementById("moments-lightbox"));
    let nextPhoto = 0;
    const topSizes = ["tall", "short", "short", "tall", "tall", "short"];

    function addPhoto(container, size) {
        const tile = document.createElement("div");
        tile.setAttribute("class", "moment-photo moment-" + size);
        const image = document.createElement("img");
        image.setAttribute("src", photos[nextPhoto].src);
        image.setAttribute("alt", photos[nextPhoto].alt);
        tile.appendChild(image);
        container.appendChild(tile);
        nextPhoto++;
    }

    function showNextPhotos() {
        const batch = document.createElement("div");
        batch.setAttribute("class", "moment-batch");
        const top = document.createElement("div");
        top.setAttribute("class", "moments-top");
        for (let i = 0; i < topSizes.length && nextPhoto < photos.length; i += 2) {
            const column = document.createElement("div");
            column.setAttribute("class", "moment-column");
            addPhoto(column, topSizes[i]);
            if (nextPhoto < photos.length) {
                addPhoto(column, topSizes[i + 1]);
            }
            top.appendChild(column);
        }
        batch.appendChild(top);

        if (nextPhoto < photos.length) {
            const bottom = document.createElement("div");
            bottom.setAttribute("class", "moments-bottom");
            for (let i = 0; i < 3 && nextPhoto < photos.length; i++) {
                addPhoto(bottom, i === 0 ? "wide" : "square");
            }
            batch.appendChild(bottom);
        }
        gallery.appendChild(batch);
        addPhotosToLightbox(batch.querySelectorAll("img"));
        more.style.display = nextPhoto < photos.length ? "flex" : "none";
        return batch;
    }

    more.querySelector("a").addEventListener("click", function (event) {
        event.preventDefault();
        if (nextPhoto < photos.length) {
            showNextPhotos().querySelector("img").focus();
        }
    });
    showNextPhotos();
}

const storyList = document.querySelector(".story-list");
const addCard = document.querySelector(".add-story").parentElement;
const newStoryLinks = document.querySelectorAll(".add-story, .write-button");
for (let i = 0; i < newStoryLinks.length; i++) {
    newStoryLinks[i].addEventListener("click", function () {
        sessionStorage.removeItem(diaryEditIdKey);
    });
}

loadDiaryRecords(function (records) {
    setupDiaryBanner(records);
    setupCapturedMoments(records);
    for (let i = records.length - 1; i >= 0; i--) {
        appendSavedStory(storyList, records[i]);
    }
    storyList.appendChild(addCard);
}, function () {
    setupDiaryBanner([]);
    const message = document.createElement("p");
    message.innerText = "여행 기록을 불러오지 못했습니다.";
    storyList.appendChild(message);
});
