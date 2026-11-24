const tabs = ["schedule", "expense", "checklist"];

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
            button.setAttribute("class", "plan-tab active");
            section.style.display = "block";
        } else {
            button.setAttribute("class", "plan-tab");
            section.style.display = "none";
        }
    }
}

showTab(0);

const writeSection = document.getElementById("plan-write");
const viewSection = document.getElementById("plan-view");
const newPlanButton = document.getElementById("new-plan-button");
const savedCards = document.querySelectorAll(".saved-card");

newPlanButton.addEventListener("click", function () {
    showWrite();
});

for (let i = 0; i < savedCards.length; i++) {
    savedCards[i].addEventListener("click", function () {
        showView(i);
    });
}

function showWrite() {
    writeSection.style.display = "block";
    viewSection.style.display = "none";
    showTab(0);
}

function showView(index) {
    let info = savedCards[index].querySelector(".saved-info");
    let title = info.querySelector("h3");
    let details = info.querySelectorAll("p");

    document.getElementById("view-title").innerText = title.innerText;
    document.getElementById("view-date").innerText = details[0].innerText;
    document.getElementById("view-region").innerText = details[1].innerText;

    writeSection.style.display = "none";
    viewSection.style.display = "block";
}

const scheduleDays = document.getElementById("schedule-days");
const addDayButton = document.getElementById("add-day-button");

addDayButton.addEventListener("click", function () {
    addDay();
});

function addDay() {
    let daySection = document.createElement("section");
    daySection.setAttribute("class", "day-section");

    daySection.innerHTML =
        '<header class="day-header">' +
        '<h3>DAY</h3>' +
        '<div class="day-date">' +
        '<input type="date">' +
        '<button type="button" class="delete-day-button">날짜 삭제</button>' +
        '</div>' +
        '</header>' +
        '<table class="schedule-table">' +
        '<thead><tr>' +
        '<th>시간</th>' +
        '<th>방문 장소</th>' +
        '<th>일정 내용</th>' +
        '<th>삭제</th>' +
        '</tr></thead>' +
        '<tbody></tbody>' +
        '</table>' +
        '<button type="button" class="add-schedule-button">+ 일정 추가하기</button>';

    scheduleDays.appendChild(daySection);

    let tbody = daySection.querySelector("tbody");
    let addButton = daySection.querySelector(".add-schedule-button");
    let deleteButton = daySection.querySelector(".delete-day-button");

    addSchedule(tbody);

    addButton.addEventListener("click", function () {
        addSchedule(tbody);
    });

    deleteButton.addEventListener("click", function () {
        daySection.remove();
        updateDayNumbers();
    });

    updateDayNumbers();
}

function updateDayNumbers() {
    let daySections = scheduleDays.querySelectorAll(".day-section");

    for (let i = 0; i < daySections.length; i++) {
        let heading = daySections[i].querySelector("h3");
        let deleteButton = daySections[i].querySelector(".delete-day-button");

        heading.innerText = "DAY " + (i + 1);

        if (i === 0) {
            deleteButton.style.display = "none";
        } else {
            deleteButton.style.display = "block";
        }
    }
}

function addSchedule(tbody) {
    let row = document.createElement("tr");

    row.innerHTML =
        '<td><input type="time"></td>' +
        '<td><input type="text" placeholder="방문 장소"></td>' +
        '<td><input type="text" placeholder="일정 내용"></td>' +
        '<td><button type="button" class="delete-schedule-button">삭제</button></td>';

    tbody.appendChild(row);

    let deleteButton = row.querySelector(".delete-schedule-button");

    deleteButton.addEventListener("click", function () {
        row.remove();
    });
}

addDay();