const diaryPage = "12_웹벤져스_diary.html";
const diaryViewPage = "12_웹벤져스_diary_view.html";
const editingId = parseInt(sessionStorage.getItem(diaryEditIdKey));
let originalRecord = null;
const saveButton = document.getElementById("editor-save");
const form = document.getElementById("diary-editor");
const startInput = document.getElementById("trip-start");
const endInput = document.getElementById("trip-end");
const titleInput = document.getElementById("trip-title");
const locationInput = document.getElementById("trip-location");
const companionsInput = document.getElementById("trip-companions");
const tripRating = document.getElementById("trip-rating");
const noteInput = document.getElementById("day-note");
const message = document.getElementById("editor-message");
const dayTabs = document.getElementById("day-tabs");
const placesList = document.getElementById("trip-places");
const tripPhotos = document.getElementById("trip-photos");
const photoPicker = document.getElementById("photo-picker");
const addPhoto = document.getElementById("add-photo");
const applyPhotos = document.getElementById("apply-photos");
const photoOptions = document.getElementById("photo-options");
const weatherOptions = ["맑음", "흐림", "비", "눈"];
const weatherIcons = ["sunny", "cloud", "rain", "snow"];
const moodIcons = ["best", "good", "okay", "sad", "tired"];
const expenseCategories = ["transport", "food", "stay", "other"];
const moodNames = ["아주 좋음", "좋음", "보통", "아쉬움", "힘들었음"];
const photoFiles = [
    ["12_theme-history.jpg", "교토 거리"],
    ["12_fushimi-inari.jpg", "붉은 도리이"],
    ["12_fushimi-inari-fox.png", "여우 석상"],
    ["12_fushimi-inari-torii.jpg", "도리이와 숲길"],
    ["12_diary_image.webp", "여행 풍경"],
    ["12_theme-food.jpg", "여행 음식"],
    ["12_theme-nature.jpg", "자연 풍경"],
    ["12_theme-resort.jpg", "휴양지"],
    ["12_festival.jpg", "축제"],
    ["12_theme-activity.jpg", "여행 액티비티"],
    ["12_theme-shanghai.jpg", "상하이"]
];

const draft = {title: "", location: "", startDate: "", endDate: "", companions: "", coverImage: "", rating: 0, days: [], photos: []};
let dates = [];
let firstDayDate = "";
let dayIndex = 0;
let currentDay = null;
let choosingCover = false;
let selectedPhotos = [];

function makeElement(tag, cssClass, label) {
    const element = document.createElement(tag);
    element.setAttribute("class", cssClass);
    element.innerText = label;
    return element;
}

function makeButton(label, action) {
    const button = makeElement("button", "", label);
    button.setAttribute("type", "button");
    button.addEventListener("click", action);
    return button;
}

function padDate(value) {
    if (value < 10) {
        return "0" + value;
    }
    return value;
}

function dateKey(date) {
    return date.getFullYear() + "-" + padDate(date.getMonth() + 1) + "-" + padDate(date.getDate());
}

function findDay(key) {
    for (let i = 0; i < draft.days.length; i++) {
        if (draft.days[i].date === key) {
            return draft.days[i];
        }
    }
    return null;
}

function visibleDates() {
    if (dates.length === 0) {
        return [firstDayDate];
    }
    return dates;
}

function showDateTabs() {
    dates = [];
    document.getElementById("trip-duration").innerText = "";
    const start = startInput.value;
    const end = endInput.value;
    if (!start || !end || end < start) {
        dayIndex = 0;
        message.innerText = "";
        if (start && end) {
            message.innerText = "종료일은 시작일보다 앞설 수 없습니다.";
        }
        renderDay();
        return;
    }

    const cursor = new Date(start + "T00:00:00");
    const last = new Date(end + "T00:00:00");
    while (cursor.getTime() <= last.getTime()) {
        dates.push(dateKey(cursor));
        cursor.setDate(cursor.getDate() + 1);
    }
    if (dayIndex >= dates.length) {
        dayIndex = 0;
    }
    const undatedDay = findDay("");
    if (undatedDay !== null) {
        undatedDay.date = dates[0];
    }
    firstDayDate = dates[0];
    document.getElementById("trip-duration").innerText = (dates.length - 1) + "박 " + dates.length + "일";
    message.innerText = "";
    renderDay();
}

function renderDay() {
    dayTabs.innerHTML = "";
    const displayedDates = visibleDates();
    for (let i = 0; i < displayedDates.length; i++) {
        const tab = makeButton("Day " + (i + 1), function () {
            dayIndex = i;
            renderDay();
        });
        if (i === dayIndex) {
            tab.setAttribute("class", "editor-day-current");
        }
        dayTabs.appendChild(tab);
    }
    const date = displayedDates[dayIndex];
    currentDay = findDay(date);
    if (currentDay === null) {
        currentDay = {date: date, weather: "", mood: 0, note: "", places: []};
        draft.days.push(currentDay);
    }
    const dayLabel = "Day " + (dayIndex + 1);
    document.getElementById("day-title").innerText = dayLabel + " 일기";
    document.getElementById("day-visits-title").innerText = dayLabel + " 방문한 명소 & 맛집";
    noteInput.value = currentDay.note;
    renderDayOptions();
    renderPlaces();
}

function iconButton(file, label, selected, action) {
    const button = makeButton("", action);
    const icon = document.createElement("img");
    icon.setAttribute("class", "ui-icon");
    icon.setAttribute("src", "../res/icons/12_ic_" + file + ".svg");
    icon.setAttribute("alt", label);
    button.setAttribute("title", label);
    if (selected) {
        button.setAttribute("class", "editor-icon-active");
    }
    button.appendChild(icon);
    return button;
}

function renderDayOptions() {
    const weather = document.getElementById("day-weather");
    const mood = document.getElementById("day-mood");
    weather.innerHTML = "";
    mood.innerHTML = "";
    for (let i = 0; i < weatherOptions.length; i++) {
        const name = weatherOptions[i];
        weather.appendChild(iconButton("weather_" + weatherIcons[i], name, currentDay.weather === name, function () {
            currentDay.weather = name;
            renderDayOptions();
        }));
    }
    for (let i = 0; i < moodNames.length; i++) {
        const rating = 5 - i;
        mood.appendChild(iconButton("mood_" + moodIcons[i], moodNames[i], currentDay.mood === rating, function () {
            currentDay.mood = rating;
            renderDayOptions();
        }));
    }
}

function renderPlaces() {
    placesList.innerHTML = "";
    const places = currentDay.places;
    while (places.length < 5) {
        places.push({name: "", visited: false});
    }
    for (let i = 0; i < places.length; i++) {
        const place = places[i];
        const row = makeElement("div", "editor-visit-row", "");
        const icon = makeElement("img", "ui-icon", "");
        const check = makeButton("", function () {
            place.visited = !place.visited;
            showVisitHeart(check, icon, place.visited, i + 1);
        });
        const name = document.createElement("input");
        check.setAttribute("class", "editor-visit-heart");
        check.appendChild(icon);
        showVisitHeart(check, icon, place.visited, i + 1);
        name.setAttribute("type", "text");
        name.setAttribute("title", "장소 이름 " + (i + 1));
        name.value = place.name;
        name.addEventListener("input", function () { place.name = name.value; });
        row.appendChild(check);
        row.appendChild(name);
        placesList.appendChild(row);
    }
}

function showVisitHeart(button, icon, visited, number) {
    if (visited) {
        icon.setAttribute("src", "../res/icons/12_ic_favorite_filled.svg");
        icon.setAttribute("alt", "장소 " + number + " 방문 표시 해제");
    } else {
        icon.setAttribute("src", "../res/icons/12_ic_favorite_gray.svg");
        icon.setAttribute("alt", "장소 " + number + " 방문 표시");
    }
    button.setAttribute("title", icon.getAttribute("alt"));
}

function removeAt(items, index) {
    return items.slice(0, index).concat(items.slice(index + 1));
}

function hasText(value) {
    for (let i = 0; i < value.length; i++) {
        if (value[i] !== " " && value[i] !== "\t" && value[i] !== "\n" && value[i] !== "\r") {
            return true;
        }
    }
    return false;
}

function renderTripPhotos() {
    tripPhotos.innerHTML = "";
    for (let i = 0; i < draft.photos.length; i++) {
        const thumbnail = makeElement("div", "editor-trip-thumbnail", "");
        const button = makeButton("×", function () {
            draft.photos = removeAt(draft.photos, i);
            renderTripPhotos();
        });
        const photo = document.createElement("img");
        photo.setAttribute("src", draft.photos[i]);
        photo.setAttribute("alt", "여행 사진 " + (i + 1));
        button.setAttribute("class", "photo-remove");
        button.setAttribute("aria-label", "여행 사진 " + (i + 1) + " 삭제");
        thumbnail.appendChild(photo);
        thumbnail.appendChild(button);
        tripPhotos.appendChild(thumbnail);
    }
    tripPhotos.appendChild(addPhoto);
}

function isExpenseValue(value) {
    for (let i = 0; i < value.length; i++) {
        if (value[i] < "0" || value[i] > "9") {
            return false;
        }
    }
    return true;
}

function readExpenses() {
    const expenses = {};
    for (let i = 0; i < expenseCategories.length; i++) {
        const category = expenseCategories[i];
        const value = document.getElementById("expense-" + category).value;
        expenses[category] = null;
        if (value && isExpenseValue(value)) {
            expenses[category] = parseInt(value);
        }
    }
    return expenses;
}

function expenseTotal(expenses) {
    let sum = null;
    for (let i = 0; i < expenseCategories.length; i++) {
        const amount = expenses[expenseCategories[i]];
        if (amount !== null) {
            sum = (sum || 0) + amount;
        }
    }
    return sum;
}

function renderTotals() {
    const expenses = readExpenses();
    const total = expenseTotal(expenses);
    document.getElementById("trip-total").innerText = diaryExpenseText(total, "원");
    for (let i = 0; i < expenseCategories.length; i++) {
        const category = expenseCategories[i];
        let width = 0;
        if (total > 0) {
            width = expenses[category] / total * 100;
        }
        document.getElementById("bar-" + category).style.width = width + "%";
    }
}

function selectedPhotoIndex(src) {
    for (let i = 0; i < selectedPhotos.length; i++) {
        if (selectedPhotos[i] === src) {
            return i;
        }
    }
    return -1;
}

function openPhotoPicker(forCover) {
    choosingCover = forCover;
    selectedPhotos = forCover ? [] : draft.photos.slice();
    showPhotoSelection();
    photoPicker.style.display = "flex";
}

function showPhotoSelection() {
    const buttons = photoOptions.querySelectorAll("button");
    for (let i = 0; i < buttons.length; i++) {
        const src = buttons[i].querySelector("img").getAttribute("src");
        const selected = selectedPhotoIndex(src) >= 0;
        buttons[i].setAttribute("class", selected ? "selected-photo" : "");
        buttons[i].setAttribute("aria-pressed", selected);
    }
}

function closePhotoPicker() {
    photoPicker.style.display = "none";
}

function renderCover() {
    const cover = document.getElementById("cover-image");
    const card = document.querySelector(".editor-cover");
    if (draft.coverImage) {
        cover.setAttribute("src", draft.coverImage);
        card.setAttribute("class", "editor-cover has-cover");
    } else {
        card.setAttribute("class", "editor-cover");
    }
}

function showTripRating() {
    const buttons = tripRating.querySelectorAll("button");
    for (let i = 0; i < buttons.length; i++) {
        const icon = buttons[i].querySelector("img");
        const file = i < draft.rating ? "12_ic_star.svg" : "12_ic_star_empty.svg";
        icon.setAttribute("src", "../res/icons/" + file);
        buttons[i].setAttribute("aria-pressed", i + 1 === draft.rating);
    }
}

for (let score = 1; score <= 5; score++) {
    const button = makeButton("", function () {
        draft.rating = draft.rating === score ? 0 : score;
        showTripRating();
    });
    const icon = document.createElement("img");
    icon.setAttribute("class", "ui-icon");
    icon.setAttribute("alt", score + "점");
    button.appendChild(icon);
    tripRating.appendChild(button);
}
showTripRating();

function readForm() {
    draft.title = titleInput.value;
    draft.location = locationInput.value;
    draft.startDate = startInput.value;
    draft.endDate = endInput.value;
    draft.companions = companionsInput.value;
}


function collectPhotos() {
    const photos = [];
    if (draft.coverImage) {
        photos.push(draft.coverImage);
    }
    for (let i = 0; i < draft.photos.length; i++) {
        if (draft.photos[i] !== draft.coverImage) {
            photos.push(draft.photos[i]);
        }
    }
    return photos;
}

function saveRecord() {
    if (saveButton.disabled) {
        return;
    }
    readForm();
    if (!hasText(draft.title) || !draft.startDate || !draft.endDate || !hasText(draft.location) || draft.rating === 0) {
        alert("필수 입력 요소인 여행 제목, 여행 기간, 여행지, 여행 만족도를 모두 입력해주세요.");
        return;
    }
    if (dates.length === 0) {
        alert("종료일은 시작일보다 앞설 수 없습니다.");
        return;
    }
    for (let i = 0; i < expenseCategories.length; i++) {
        const value = document.getElementById("expense-" + expenseCategories[i]).value;
        if (!isExpenseValue(value)) {
            message.innerText = "지출은 0원 이상의 정수로 입력해 주세요.";
            return;
        }
    }
    const record = buildDiaryRecord();
    if (!saveDiaryRecord(record, originalRecord)) {
        alert("수정할 여행 기록을 찾을 수 없습니다.");
        return;
    }
    if (editingId) {
        sessionStorage.setItem(diaryViewIdKey, editingId);
        leaveEditor(diaryViewPage);
        return;
    }
    leaveEditor();
}

function buildDiaryRecord() {
    const photos = collectPhotos();
    const days = [];
    let content = "";
    for (let i = 0; i < dates.length; i++) {
        const day = findDay(dates[i]);
        if (day !== null) {
            const places = [];
            for (let j = 0; j < day.places.length; j++) {
                const place = day.places[j];
                if (hasText(place.name)) {
                    places.push({name: place.name, visited: place.visited});
                }
            }
            days.push({date: day.date, weather: day.weather, mood: day.mood, note: day.note, places: places});
            if (hasText(day.note)) {
                content += day.note + "\n";
            }
        }
    }

    const expenses = readExpenses();
    const total = expenseTotal(expenses);
    return {
        id: editingId, title: draft.title, location: draft.location,
        startDate: draft.startDate, endDate: draft.endDate, companions: draft.companions,
        coverImage: photos[0] || "", photos: photos,
        days: days, content: content, rating: draft.rating, expense: total, expenseEntered: total !== null, expenses: expenses
    };
}

showDateTabs();

startInput.addEventListener("change", showDateTabs);
endInput.addEventListener("change", showDateTabs);
noteInput.addEventListener("input", function () { currentDay.note = noteInput.value; });
saveButton.addEventListener("click", saveRecord);
form.addEventListener("submit", function (event) {
    event.preventDefault();
});
form.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.isComposing && event.target.tagName === "INPUT") {
        event.preventDefault();
        event.target.blur();
    }
});

function editorSnapshot() {
    readForm();
    const days = [];
    for (let i = 0; i < draft.days.length; i++) {
        const day = draft.days[i];
        const places = [];
        for (let j = 0; j < day.places.length; j++) {
            if (hasText(day.places[j].name)) {
                places.push(day.places[j]);
            }
        }
        if (day.weather || day.mood || day.note || places.length > 0) {
            days.push({date: day.date, weather: day.weather, mood: day.mood, note: day.note, places: places});
        }
    }
    const expenses = [];
    for (let i = 0; i < expenseCategories.length; i++) {
        expenses.push(document.getElementById("expense-" + expenseCategories[i]).value);
    }
    return JSON.stringify({
        title: draft.title, location: draft.location, companions: draft.companions,
        startDate: draft.startDate, endDate: draft.endDate, rating: draft.rating,
        coverImage: draft.coverImage, photos: draft.photos, days: days, expenses: expenses
    });
}

let initialEditorSnapshot = editorSnapshot();

function confirmLeaving(event, destination) {
    event.preventDefault();
    let leaveMessage = "저장하지 않고 나가시겠습니까?";
    if (editingId) {
        leaveMessage = "변경사항이 사라집니다. 그래도 나가시겠습니까?";
    }
    if (editorSnapshot() === initialEditorSnapshot || confirm(leaveMessage)) {
        leaveEditor(destination);
    }
}

function leaveEditor(destination) {
    sessionStorage.removeItem(diaryEditIdKey);
    sessionStorage.removeItem(diaryEditDayKey);
    titleInput.value = "";
    locationInput.value = "";
    startInput.value = "";
    endInput.value = "";
    companionsInput.value = "";
    noteInput.value = "";
    draft.coverImage = "";
    draft.days = [];
    draft.rating = 0;
    draft.photos = [];
    for (let i = 0; i < expenseCategories.length; i++) {
        document.getElementById("expense-" + expenseCategories[i]).value = "";
    }
    renderTotals();
    renderTripPhotos();
    firstDayDate = "";
    dayIndex = 0;
    renderCover();
    showTripRating();
    showDateTabs();
    window.open(destination || diaryPage, "_self");
}

document.getElementById("editor-close").addEventListener("click", function (event) {
    confirmLeaving(event, editingId ? diaryViewPage : diaryPage);
});

const navigationLinks = document.querySelectorAll(".navigation a");
for (let i = 0; i < navigationLinks.length; i++) {
    const link = navigationLinks[i];
    link.addEventListener("click", function (event) {
        confirmLeaving(event, link.getAttribute("href"));
    });
}

document.getElementById("add-place").addEventListener("click", function () {
    currentDay.places.push({name: "", visited: false});
    renderPlaces();
});
for (let i = 0; i < expenseCategories.length; i++) {
    document.getElementById("expense-" + expenseCategories[i]).addEventListener("input", renderTotals);
}
renderTotals();

addPhoto.addEventListener("click", function () {
    openPhotoPicker(false);
});
document.getElementById("choose-cover").addEventListener("click", function () {
    openPhotoPicker(true);
});
document.getElementById("remove-cover").addEventListener("click", function () {
    draft.coverImage = "";
    renderCover();
});
applyPhotos.addEventListener("click", function () {
    if (choosingCover) {
        draft.coverImage = selectedPhotos[0] || "";
        renderCover();
    } else {
        draft.photos = selectedPhotos;
        renderTripPhotos();
    }
    closePhotoPicker();
});
document.getElementById("close-photo-picker").addEventListener("click", closePhotoPicker);
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closePhotoPicker();
    }
});
for (let i = 0; i < photoFiles.length; i++) {
    const src = "../res/images/" + photoFiles[i][0];
    const button = makeButton("", function () {
        const index = selectedPhotoIndex(src);
        if (index >= 0) {
            selectedPhotos = removeAt(selectedPhotos, index);
        } else if (choosingCover) {
            selectedPhotos = [src];
        } else {
            selectedPhotos.push(src);
        }
        showPhotoSelection();
    });
    const photo = document.createElement("img");
    photo.setAttribute("src", src);
    photo.setAttribute("alt", photoFiles[i][1]);
    button.appendChild(photo);
    photoOptions.appendChild(button);
}

function fillEditor(record) {
    document.querySelector(".editor-header h1").innerText = "Edit My Story";
    titleInput.value = record.title;
    locationInput.value = record.location;
    startInput.value = record.startDate;
    endInput.value = record.endDate;
    companionsInput.value = record.companions || "";
    draft.coverImage = record.coverImage || "";
    draft.rating = record.rating || 0;
    draft.days = JSON.parse(JSON.stringify(record.days || []));
    const photos = record.photos || [];
    for (let i = 0; i < photos.length; i++) {
        if (photos[i] !== draft.coverImage) {
            draft.photos.push(photos[i]);
        }
    }
    const expenses = record.expenses || {};
    for (let i = 0; i < expenseCategories.length; i++) {
        const category = expenseCategories[i];
        const amount = expenses[category];
        document.getElementById("expense-" + category).value =
            amount || (record.expenseEntered && amount === 0 ? "0" : "");
    }
    renderCover();
    showTripRating();
    showDateTabs();
    renderTripPhotos();
    renderTotals();
}

saveButton.setAttribute("disabled", "");
loadDiaryRecords(function (records) {
    if (editingId) {
        const index = findDiaryRecord(records, editingId);
        if (index < 0) {
            message.innerText = "수정할 여행 기록을 찾을 수 없습니다.";
            return;
        }
        dayIndex = parseInt(sessionStorage.getItem(diaryEditDayKey), 10) || 0;
        fillEditor(records[index]);
        readForm();
        originalRecord = buildDiaryRecord();
        initialEditorSnapshot = editorSnapshot();
    }
    saveButton.removeAttribute("disabled");
}, function () {
    message.innerText = "여행 기록을 불러오지 못했습니다.";
});
