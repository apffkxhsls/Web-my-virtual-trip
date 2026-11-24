const tabs = ["basic", "schedule", "expense", "checklist"];

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
    writeSection.style.display = "none";
    viewSection.style.display = "block";

    let info = savedCards[index].querySelector(".saved-info");
    let title = info.querySelector("h3");
    let details = info.querySelectorAll("p");

    document.getElementById("view-title").innerText = title.innerText;
    document.getElementById("view-date").innerText = details[0].innerText;
    document.getElementById("view-region").innerText = details[1].innerText;
}

const startDateInput = document.getElementById("start-date");
const endDateInput = document.getElementById("end-date");
const scheduleDays = document.getElementById("schedule-days");
const scheduleMessage = document.getElementById("schedule-message");

startDateInput.addEventListener("change", createDays);
endDateInput.addEventListener("change", createDays);

function createDays() {
    let startDate = startDateInput.value;
    let endDate = endDateInput.value;

    scheduleDays.innerHTML = "";

    if (startDate === "" || endDate === "") {
        scheduleMessage.innerText =
            "기본 정보에서 여행 기간을 먼저 선택해주세요.";
        return;
    }

    if (endDate < startDate) {
        scheduleMessage.innerText =
            "도착일은 출발일보다 빠를 수 없습니다.";
        return;
    }

    let start = new Date(startDate);
    let end = new Date(endDate);

    let days = (end.getTime() - start.getTime())
        / (1000 * 60 * 60 * 24) + 1;

    scheduleMessage.innerText = "총 " + days + "일간의 여행";

    for (let i = 0; i < days; i++) {
        let date = new Date(startDate + "T00:00:00");

        date.setDate(date.getDate() + i);

        let dateText = date.getFullYear() + "." +
            (date.getMonth() + 1) + "." +
            date.getDate();

        let daySection = document.createElement("section");

        daySection.setAttribute("class", "day-section");

        daySection.innerHTML =
            '<header class="day-header">' +
            '<h3>DAY ' + (i + 1) + '</h3>' +
            '<span class="day-date">' + dateText + '</span>' +
            '</header>' +

            '<table class="schedule-table">' +
            '<thead>' +
            '<tr>' +
            '<th>시간</th>' +
            '<th>방문 장소</th>' +
            '<th>일정 내용</th>' +
            '</tr>' +
            '</thead>' +

            '<tbody>' +
            '<tr>' +
            '<td><input type="time"></td>' +
            '<td><input type="text" placeholder="방문 장소"></td>' +
            '<td><input type="text" placeholder="일정 내용"></td>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +

            '<button type="button" class="add-schedule-button">' +
            '+ 일정 추가하기' +
            '</button>';

        scheduleDays.appendChild(daySection);
    }
}