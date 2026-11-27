const recordId = parseInt(sessionStorage.getItem(diaryViewIdKey));
const editButton = document.getElementById("record-edit");
const deleteButton = document.getElementById("record-delete");
const photoToggle = document.getElementById("photo-view-toggle");
const photoList = document.getElementById("record-photos");
const thumbnails = document.getElementById("photo-view-thumbnails");
const photoFrame = document.getElementById("photo-view-frame");
const previousButton = document.getElementById("photo-view-prev");
const nextButton = document.getElementById("photo-view-next");
let photos = [];
let photoIndex = 0;

function setRecordText(id, value) {
    document.getElementById(id).innerText = value;
}

function makeRecordImage(src, alt) {
    const image = document.createElement("img");
    image.setAttribute("src", src);
    image.setAttribute("alt", alt);
    return image;
}

function showDayIcon(id, filename, label) {
    const field = document.getElementById(id);
    field.innerText = "—";
    if (filename) {
        const icon = makeRecordImage("../res/icons/12_ic_" + filename + ".svg", label);
        icon.setAttribute("class", "ui-icon");
        field.innerHTML = "";
        field.appendChild(icon);
    }
}

function showDay(record, date, index) {
    const tabs = document.querySelectorAll("#record-days button");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].setAttribute("class", i === index ? "record-day-current" : "");
        tabs[i].setAttribute("aria-pressed", i === index);
    }
    const label = "Day " + (index + 1);
    setRecordText("record-visits-title", label + " 방문한 명소 & 맛집");
    setRecordText("record-journal-title", label + " 일기");
    const places = document.getElementById("record-places");
    places.innerHTML = "";
    const days = record.days || [];
    let day = {};
    for (let i = 0; i < days.length; i++) {
        if (days[i].date === date) {
            day = days[i];
        }
    }
    const weatherIcons = {"맑음": "weather_sunny", "흐림": "weather_cloud", "비": "weather_rain", "눈": "weather_snow"};
    const moodIcons = ["", "mood_tired", "mood_sad", "mood_okay", "mood_good", "mood_best"];
    const moods = ["", "힘들었음", "아쉬움", "보통", "좋음", "아주 좋음"];
    showDayIcon("record-weather", weatherIcons[day.weather], day.weather);
    showDayIcon("record-mood", moodIcons[day.mood], moods[day.mood]);
    setRecordText("record-note", day.note || "작성한 일기가 없습니다.");

    const visits = day.places || [];
    for (let i = 0; i < visits.length; i++) {
        const visit = visits[i];
        const item = document.createElement("li");
        const icon = visit.visited ? "12_ic_favorite_filled.svg" : "12_ic_favorite_gray.svg";
        const image = makeRecordImage("../res/icons/" + icon, visit.visited ? "방문" : "미방문");
        image.setAttribute("class", "ui-icon");
        const name = document.createElement("span");
        name.innerText = visit.name;
        item.appendChild(image);
        item.appendChild(name);
        places.appendChild(item);
    }
    if (visits.length === 0) {
        places.innerText = "등록한 장소가 없습니다.";
    }
}

function showDayTabs(record) {
    const tabs = document.getElementById("record-days");
    tabs.innerHTML = "";
    const date = new Date(record.startDate + "T00:00:00");
    const end = new Date(record.endDate + "T00:00:00");
    let count = 0;
    while (date.getTime() <= end.getTime()) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const key = date.getFullYear() + "-" + (month < 10 ? "0" : "") + month + "-" + (day < 10 ? "0" : "") + day;
        const index = count;
        const button = document.createElement("button");
        button.setAttribute("type", "button");
        button.innerText = "Day " + (index + 1);
        button.addEventListener("click", function () {
            showDay(record, key, index);
        });
        tabs.appendChild(button);
        date.setDate(day + 1);
        count++;
    }
    if (count > 0) {
        setRecordText("record-duration", (count - 1) + "박 " + count + "일");
        showDay(record, record.startDate, 0);
    }
}

function showPhoto(index) {
    if (index < 0) {
        index = photos.length - 1;
    } else if (index >= photos.length) {
        index = 0;
    }
    photoIndex = index;
    photoFrame.innerHTML = "";
    photoFrame.appendChild(makeRecordImage(photos[index], "여행 사진 " + (index + 1)));
    setRecordText("photo-view-count", (index + 1) + " / " + photos.length);
    const buttons = thumbnails.querySelectorAll("button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].setAttribute("class", i === index ? "photo-view-selected" : "");
    }
}

function showPhotos(record) {
    photos = record.photos || [];
    if (photos.length === 0 && record.coverImage) {
        photos = [record.coverImage];
    }
    photoList.innerHTML = "";
    thumbnails.innerHTML = "";
    setRecordText("record-photo-count", photos.length + "장");
    setRecordText("photo-view-title", record.title);
    if (photos.length === 0) {
        photoToggle.setAttribute("disabled", "");
        photoList.innerText = "등록한 사진이 없습니다.";
        return;
    }
    for (let i = 0; i < photos.length; i++) {
        const thumb = document.createElement("button");
        thumb.setAttribute("type", "button");
        thumb.appendChild(makeRecordImage(photos[i], "여행 사진 " + (i + 1)));
        thumb.addEventListener("click", function () {
            showPhoto(i);
        });
        thumbnails.appendChild(thumb);

        const photo = document.createElement("button");
        photo.setAttribute("type", "button");
        photo.setAttribute("class", "record-photo");
        photo.appendChild(makeRecordImage(photos[i], "여행 사진 " + (i + 1) + " 크게 보기"));
        photo.addEventListener("click", function () {
            showPhoto(i);
            photoToggle.checked = true;
        });
        photoList.appendChild(photo);
    }
    if (photos.length > 1) {
        previousButton.removeAttribute("disabled");
        nextButton.removeAttribute("disabled");
    }
    showPhoto(0);
}

previousButton.addEventListener("click", function () {
    showPhoto(photoIndex - 1);
});
nextButton.addEventListener("click", function () {
    showPhoto(photoIndex + 1);
});
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        photoToggle.checked = false;
    }
});

function showRecord(record) {
    setRecordText("record-title", record.title);
    setRecordText("record-location", record.location);
    setRecordText("record-period", record.startDate + " ~ " + record.endDate);
    setRecordText("record-companions", record.companions || "—");
    const total = diaryRecordExpense(record);
    setRecordText("record-expense", diaryExpenseText(total, "원"));
    setRecordText("record-total", diaryExpenseText(total, "원"));
    const expenses = record.expenses || {};
    const categories = ["transport", "food", "stay", "other"];
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const amount = expenses[category];
        const displayedAmount = record.expenseEntered ? amount : amount || null;
        setRecordText("record-cost-" + category, diaryExpenseText(displayedAmount, "원"));
        document.getElementById("record-bar-" + category).style.width = (total > 0 ? (amount || 0) / total * 100 : 0) + "%";
    }
    const rating = document.getElementById("record-rating");
    rating.setAttribute("aria-label", "여행 만족도 " + (record.rating || 0) + "점");
    for (let i = 0; i < 5; i++) {
        const icon = i < record.rating ? "12_ic_star.svg" : "12_ic_star_empty.svg";
        const star = makeRecordImage("../res/icons/" + icon, "");
        star.setAttribute("class", "ui-icon");
        rating.appendChild(star);
    }
    if (record.coverImage) {
        const cover = document.getElementById("record-cover");
        cover.innerHTML = "";
        cover.appendChild(makeRecordImage(record.coverImage, record.title + " 대표 사진"));
    }
    showDayTabs(record);
    showPhotos(record);
    editButton.removeAttribute("disabled");
    deleteButton.removeAttribute("disabled");
}

editButton.addEventListener("click", function () {
    sessionStorage.setItem(diaryEditIdKey, recordId);
    window.open("12_웹벤져스_diary_write.html", "_self");
});

deleteButton.addEventListener("click", function () {
    if (confirm("여행 기록을 삭제하시겠습니까?")) {
        const records = JSON.parse(localStorage.getItem(diaryRecordsKey));
        const index = findDiaryRecord(records, recordId);
        if (index >= 0) {
            saveDiaryRecords(records.slice(0, index).concat(records.slice(index + 1)));
        }
        sessionStorage.removeItem(diaryViewIdKey);
        window.open("12_웹벤져스_diary.html", "_self");
    }
});

loadDiaryRecords(function (records) {
    const index = findDiaryRecord(records, recordId);
    if (index < 0) {
        setRecordText("record-title", "여행 기록을 찾을 수 없습니다.");
        return;
    }
    showRecord(records[index]);
}, function () {
    setRecordText("record-title", "여행 기록을 불러오지 못했습니다.");
});
