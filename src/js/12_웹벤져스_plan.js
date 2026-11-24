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
const savedList = document.getElementById("saved-list");
const savePlanButton = document.getElementById("save-plan-button");
const planForm = document.querySelector(".plan-form");

let savedPlans = JSON.parse(localStorage.getItem("savedPlans")) || [];

newPlanButton.addEventListener("click", function () {
    resetPlan();
    showWrite();
});

function showWrite() {
    writeSection.style.display = "block";
    viewSection.style.display = "none";
    showTab(0);
}

function showView(index) {
    let plan = savedPlans[index];

    document.getElementById("view-title").innerText = plan.title;
    document.getElementById("view-date").innerText = plan.startDate + " ~ " + plan.endDate;
    document.getElementById("view-region").innerText = plan.region;
    document.getElementById("view-travelers").innerText = "동행 인원: " + (plan.travelers || "미입력");

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

const budgetInput = document.getElementById("budget");
const expenseInputs = document.querySelectorAll(".expense-input input");

budgetInput.addEventListener("change", calculateExpense);

for (let i = 0; i < expenseInputs.length; i++) {
    expenseInputs[i].addEventListener("change", calculateExpense);
}

function calculateExpense() {
    let budget = Math.max(0, parseFloat(budgetInput.value) || 0);
    let total = 0;

    for (let i = 0; i < expenseInputs.length; i++) {
        let cost = parseFloat(expenseInputs[i].value) || 0;
        total += Math.max(0, cost);
    }

    let percent = 0;

    if (budget > 0) {
        percent = total / budget * 100;
    }

    let budgetFill = document.getElementById("budget-fill");
    let budgetPercent = document.getElementById("budget-percent");
    let budgetStatus = document.getElementById("budget-status");
    let remainingBudget = document.getElementById("remaining-budget");

    document.getElementById("total-cost").innerText = total + "원";
    document.getElementById("budget-limit").innerText = budget + "원";

    budgetPercent.innerText = Math.round(percent) + "%";
    budgetFill.style.width = Math.min(percent, 100) + "%";

    if (budget === 0) {
        budgetPercent.innerText = "-";
        budgetFill.style.width = "0%";
        budgetFill.style.backgroundColor = "#69A998";
        budgetPercent.style.color = "#337768";
        budgetStatus.innerText = "목표 예산 미설정";
        remainingBudget.innerText = "-";
        remainingBudget.style.color = "#337768";
    } else if (total > budget) {
        budgetFill.style.backgroundColor = "#D98C8C";
        budgetPercent.style.color = "#C05050";
        budgetStatus.innerText = "초과 예산";
        remainingBudget.innerText = (total - budget) + "원";
        remainingBudget.style.color = "#C05050";
    } else {
        budgetFill.style.backgroundColor = "#69A998";
        budgetPercent.style.color = "#337768";
        budgetStatus.innerText = "남은 예산";
        remainingBudget.innerText = (budget - total) + "원";
        remainingBudget.style.color = "#337768";
    }
}

const checklistList = document.getElementById("checklist-list");
const checklistInput = document.getElementById("checklist-input");
const addChecklistButton = document.getElementById("add-checklist-button");

const defaultChecklist = [
    "여권 준비",
    "항공권 예약",
    "숙소 예약",
    "여행자 보험 가입",
    "환전"
];

addChecklistButton.addEventListener("click", function () {
    let item = checklistInput.value;

    if (item === "") {
        return;
    }

    addChecklist(item);
    checklistInput.value = "";
});

function addChecklist(item) {
    let li = document.createElement("li");

    li.innerHTML =
        '<label><input type="checkbox"><span></span></label>' +
        '<button type="button" class="delete-checklist-button">삭제</button>';

    let checkbox = li.querySelector("input");
    let text = li.querySelector("span");
    let deleteButton = li.querySelector("button");

    text.innerText = item;
    checklistList.appendChild(li);

    checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
            text.setAttribute("class", "checklist-done");
        } else {
            text.setAttribute("class", "");
        }

        updateChecklistCount();
    });

    deleteButton.addEventListener("click", function () {
        li.remove();
        updateChecklistCount();
    });

    updateChecklistCount();
}

function updateChecklistCount() {
    let items = checklistList.querySelectorAll("input");
    let completed = 0;

    for (let i = 0; i < items.length; i++) {
        if (items[i].checked) {
            completed++;
        }
    }

    document.getElementById("checklist-count").innerText =
        completed + " / " + items.length + " 완료";
}

function getPlanData() {
    let plan = {
        title: document.getElementById("trip-title").value,
        region: document.getElementById("trip-region").value,
        startDate: document.getElementById("start-date").value,
        endDate: document.getElementById("end-date").value,
        travelers: document.getElementById("travelers").value,
        days: [],
        expense: {
            budget: budgetInput.value,
            transport: document.getElementById("transport").value,
            food: document.getElementById("food-cost").value,
            stay: document.getElementById("stay-cost").value,
            other: document.getElementById("other-cost").value
        },
        checklist: []
    };

    let daySections = scheduleDays.querySelectorAll(".day-section");

    for (let i = 0; i < daySections.length; i++) {
        let day = {
            date: daySections[i].querySelector(".day-date input").value,
            schedules: []
        };

        let rows = daySections[i].querySelectorAll("tbody tr");

        for (let j = 0; j < rows.length; j++) {
            let inputs = rows[j].querySelectorAll("input");

            day.schedules.push({
                time: inputs[0].value,
                place: inputs[1].value,
                memo: inputs[2].value
            });
        }

        plan.days.push(day);
    }

    let items = checklistList.querySelectorAll("li");

    for (let i = 0; i < items.length; i++) {
        plan.checklist.push({
            text: items[i].querySelector("span").innerText,
            checked: items[i].querySelector("input").checked
        });
    }

    return plan;
}

function displayPlans() {
    savedList.innerHTML = "";

    if (savedPlans.length === 0) {
        savedList.innerHTML =
            '<li class="saved-empty">저장된 여행 계획이 없습니다.</li>';
        return;
    }

    for (let i = 0; i < savedPlans.length; i++) {
        let plan = savedPlans[i];
        let li = document.createElement("li");

        li.innerHTML =
            '<article class="saved-card hover-card">' +
            '<div class="card-content saved-info">' +
            '<h3></h3>' +
            '<p><img src="../res/icons/12_ic_calendar.svg" alt="날짜"><span></span></p>' +
            '<p><img src="../res/icons/12_ic_location_filled.svg" alt="장소"><span></span></p>' +
            '</div>' +
            '</article>';

        li.querySelector("h3").innerText = plan.title;

        let details = li.querySelectorAll("span");

        details[0].innerText = plan.startDate + " ~ " + plan.endDate;
        details[1].innerText = plan.region;

        li.querySelector("article").addEventListener("click", function () {
            showView(i);
        });

        savedList.appendChild(li);
    }
}

function resetPlan() {
    planForm.reset();
    scheduleDays.innerHTML = "";
    checklistList.innerHTML = "";

    addDay();

    for (let i = 0; i < defaultChecklist.length; i++) {
        addChecklist(defaultChecklist[i]);
    }

    calculateExpense();
    updateChecklistCount();
}

savePlanButton.addEventListener("click", function () {
    let plan = getPlanData();

    if (plan.title === "" || plan.region === "" || plan.startDate === "" || plan.endDate === "") {
        alert("여행 제목, 지역, 출발일, 도착일을 입력해주세요.");
        showTab(0);
        return;
    }

    if (plan.endDate < plan.startDate) {
        alert("도착일은 출발일보다 빠를 수 없습니다.");
        showTab(0);
        return;
    }

    savedPlans.push(plan);

    localStorage.setItem("savedPlans", JSON.stringify(savedPlans));

    displayPlans();
    resetPlan();
    showView(savedPlans.length - 1);
});

planForm.addEventListener("submit", function (event) {
    event.preventDefault();
});

resetPlan();
displayPlans();