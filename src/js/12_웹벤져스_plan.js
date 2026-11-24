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
let selectedIndex = -1;
let editingIndex = -1;

const defaultPlan = {
    title: "크리스마스 상하이 여행",
    region: "중국 상하이",
    startDate: "2026-12-25",
    endDate: "2026-12-29",
    travelers: "2",
    days: [
        {
            date: "2026-12-25",
            schedules: [
                { time: "10:00", place: "인천국제공항", memo: "상하이 출국" },
                { time: "14:00", place: "호텔", memo: "체크인 및 휴식" },
                { time: "18:00", place: "와이탄", memo: "크리스마스 야경 감상" }
            ]
        },
        {
            date: "2026-12-26",
            schedules: [
                { time: "10:00", place: "예원", memo: "정원 관람" },
                { time: "13:00", place: "예원상성", memo: "점심 식사 및 기념품 쇼핑" },
                { time: "17:00", place: "난징동루", memo: "거리 구경 및 쇼핑" }
            ]
        },
        {
            date: "2026-12-27",
            schedules: [
                { time: "09:00", place: "상하이 디즈니랜드", memo: "놀이기구 및 테마파크 관람" },
                { time: "19:00", place: "상하이 디즈니랜드", memo: "야간 공연 관람" }
            ]
        },
        {
            date: "2026-12-28",
            schedules: [
                { time: "10:00", place: "우캉루", memo: "거리 산책 및 사진 촬영" },
                { time: "13:00", place: "신천지", memo: "점심 식사 및 카페 방문" },
                { time: "18:00", place: "동방명주", memo: "상하이 야경 감상" }
            ]
        },
        {
            date: "2026-12-29",
            schedules: [
                { time: "10:00", place: "호텔", memo: "체크아웃" },
                { time: "12:00", place: "푸동국제공항", memo: "귀국 준비" },
                { time: "17:00", place: "인천국제공항", memo: "한국 도착 예정" }
            ]
        }
    ],
    expense: {
        budget: "2000000",
        transport: "700000",
        food: "300000",
        stay: "480000",
        other: "320000"
    },
    checklist: [
        { text: "여권 준비", checked: true },
        { text: "항공권 예약", checked: true },
        { text: "숙소 예약", checked: true },
        { text: "여행자 보험 가입", checked: false },
        { text: "환전", checked: false },
        { text: "디즈니랜드 입장권 예약", checked: false },
        { text: "해외 결제 수단 준비", checked: true }
    ]
};

let savedPlans = JSON.parse(localStorage.getItem("savedPlans"));

if (savedPlans === null) {
    savedPlans = [defaultPlan];
    localStorage.setItem("savedPlans", JSON.stringify(savedPlans));
}

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
    selectedIndex = index;
    editingIndex = -1;
    let plan = savedPlans[index];

    document.getElementById("view-title").innerText = plan.title;
    document.getElementById("view-date").innerText = plan.startDate + " ~ " + plan.endDate;
    document.getElementById("view-region").innerText = plan.region;
    document.getElementById("view-travelers").innerText = "동행 인원: " + (plan.travelers || "미입력");

    displaySchedule(plan);
    displayExpense(plan);
    displayChecklist(plan);

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
    return daySection;
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
    return row;
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

    showBudget("", budget, total);
}

function showBudget(prefix, budget, total) {
    let percent = 0;

    if (budget > 0) {
        percent = total / budget * 100;
    }

    let budgetFill = document.getElementById(prefix + "budget-fill");
    let budgetStatus = document.getElementById(prefix + "budget-status");
    let remainingBudget = document.getElementById(prefix + "remaining-budget");

    document.getElementById(prefix + "total-cost").innerText = total + "원";
    document.getElementById(prefix + "budget-limit").innerText = budget + "원";

    budgetFill.style.width = Math.min(percent, 100) + "%";

    if (budget === 0) {
        budgetFill.style.width = "0%";
        budgetFill.style.backgroundColor = "#69A998";
        budgetStatus.innerText = "목표 예산 미설정";
        remainingBudget.innerText = "-";
        remainingBudget.style.color = "#337768";
    } else if (total > budget) {
        budgetFill.style.backgroundColor = "#D98C8C";
        budgetStatus.innerText = "초과 예산";
        remainingBudget.innerText = (total - budget) + "원";
        remainingBudget.style.color = "#C05050";
    } else {
        budgetFill.style.backgroundColor = "#69A998";
        budgetStatus.innerText = "남은 예산";
        remainingBudget.innerText = (budget - total) + "원";
        remainingBudget.style.color = "#337768";
    }
}

const checklistList = document.getElementById("checklist-list");
const checklistInput = document.getElementById("checklist-input");
const addChecklistButton = document.getElementById("add-checklist-button");
const defaultChecklist = ["여권 준비", "항공권 예약", "숙소 예약", "여행자 보험 가입", "환전"];

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

    li.innerHTML = '<label><input type="checkbox"><span></span></label>' +
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
    });

    deleteButton.addEventListener("click", function () {
        li.remove();
    });

    return li;
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
        savedList.innerHTML = '<li class="saved-empty">저장된 여행 계획이 없습니다.</li>';
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
    editingIndex = -1;
    document.getElementById("write-title").innerText = "여행 계획 작성하기";
    savePlanButton.innerText = "계획 저장";
    planForm.reset();
    scheduleDays.innerHTML = "";
    checklistList.innerHTML = "";
    addDay();
    for (let i = 0; i < defaultChecklist.length; i++) {
        addChecklist(defaultChecklist[i]);
    }
    calculateExpense();
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
    let index;
    if (editingIndex === -1) {
        savedPlans.push(plan);
        index = savedPlans.length - 1;
    } else {
        savedPlans[editingIndex] = plan;
        index = editingIndex;
    }
    localStorage.setItem("savedPlans", JSON.stringify(savedPlans));
    displayPlans();
    resetPlan();
    showView(index);
});

function displaySchedule(plan) {
    let container = document.getElementById("view-schedule");
    container.innerHTML = "";
    for (let i = 0; i < plan.days.length; i++) {
        let day = plan.days[i];
        let section = document.createElement("section");
        section.setAttribute("class", "day-section");
        section.innerHTML = '<header class="day-header"><h3></h3><span></span></header>' +
            '<table class="schedule-table"><thead><tr><th>시간</th><th>방문 장소</th><th>일정 내용</th></tr></thead><tbody></tbody></table>';
        section.querySelector("h3").innerText = "DAY " + (i + 1);
        section.querySelector("span").innerText = day.date || "날짜 미입력";
        let tbody = section.querySelector("tbody");
        for (let j = 0; j < day.schedules.length; j++) {
            let schedule = day.schedules[j];
            if (schedule.time === "" && schedule.place === "" && schedule.memo === "") {
                continue;
            }
            let row = document.createElement("tr");
            row.innerHTML = "<td></td><td></td><td></td>";
            let cells = row.querySelectorAll("td");
            cells[0].innerText = schedule.time || "-";
            cells[1].innerText = schedule.place || "-";
            cells[2].innerText = schedule.memo || "-";
            tbody.appendChild(row);
        }
        if (tbody.querySelectorAll("tr").length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">등록된 일정이 없습니다.</td></tr>';
        }
        container.appendChild(section);
    }
}

function displayExpense(plan) {
    let expense = plan.expense;
    let budget = Math.max(0, parseFloat(expense.budget) || 0);
    let keys = ["transport", "food", "stay", "other"];
    let total = 0;
    for (let i = 0; i < keys.length; i++) {
        let cost = Math.max(0, parseFloat(expense[keys[i]]) || 0);
        document.getElementById("view-" + keys[i]).innerText = cost + "원";
        total += cost;
    }
    showBudget("view-", budget, total);
}

function displayChecklist(plan) {
    let list = document.getElementById("view-checklist");
    list.innerHTML = "";

    for (let i = 0; i < plan.checklist.length; i++) {
        let item = plan.checklist[i];
        let li = document.createElement("li");

        li.innerHTML = '<span></span><span></span>';

        let spans = li.querySelectorAll("span");
        spans[0].innerText = item.text;

        if (item.checked) {
            spans[0].setAttribute("class", "checklist-done");
            spans[1].innerText = "완료";
        } else {
            spans[1].innerText = "미완료";
        }

        list.appendChild(li);
    }

    if (plan.checklist.length === 0) {
        list.innerHTML = "<li>등록된 체크리스트가 없습니다.</li>";
    }
}

function loadPlan(plan) {
    planForm.reset();
    document.getElementById("trip-title").value = plan.title;
    document.getElementById("trip-region").value = plan.region;
    document.getElementById("start-date").value = plan.startDate;
    document.getElementById("end-date").value = plan.endDate;
    document.getElementById("travelers").value = plan.travelers;

    scheduleDays.innerHTML = "";
    for (let i = 0; i < plan.days.length; i++) {
        let daySection = addDay();
        daySection.querySelector(".day-date input").value = plan.days[i].date;
        let tbody = daySection.querySelector("tbody");
        tbody.innerHTML = "";
        for (let j = 0; j < plan.days[i].schedules.length; j++) {
            let row = addSchedule(tbody);
            let inputs = row.querySelectorAll("input");
            let schedule = plan.days[i].schedules[j];
            inputs[0].value = schedule.time;
            inputs[1].value = schedule.place;
            inputs[2].value = schedule.memo;
        }
    }
    if (plan.days.length === 0) {
        addDay();
    }

    budgetInput.value = plan.expense.budget;
    document.getElementById("transport").value = plan.expense.transport;
    document.getElementById("food-cost").value = plan.expense.food;
    document.getElementById("stay-cost").value = plan.expense.stay;
    document.getElementById("other-cost").value = plan.expense.other;
    calculateExpense();

    checklistList.innerHTML = "";
    for (let i = 0; i < plan.checklist.length; i++) {
        let li = addChecklist(plan.checklist[i].text);
        li.querySelector("input").checked = plan.checklist[i].checked;
        if (plan.checklist[i].checked) {
            li.querySelector("span").setAttribute("class", "checklist-done");
        }
    }
}

const editPlanButton = document.getElementById("edit-plan-button");
const deletePlanButton = document.getElementById("delete-plan-button");

editPlanButton.addEventListener("click", function () {
    editingIndex = selectedIndex;
    loadPlan(savedPlans[editingIndex]);
    document.getElementById("write-title").innerText = "여행 계획 수정하기";
    savePlanButton.innerText = "수정 저장";
    showWrite();
});

deletePlanButton.addEventListener("click", function () {
    if (confirm("이 여행 계획을 삭제하시겠습니까?")) {
        let remainingPlans = [];
        for (let i = 0; i < savedPlans.length; i++) {
            if (i !== selectedIndex) {
                remainingPlans.push(savedPlans[i]);
            }
        }
        savedPlans = remainingPlans;
        localStorage.setItem("savedPlans", JSON.stringify(savedPlans));
        selectedIndex = -1;
        displayPlans();
        resetPlan();
        showWrite();
    }
});

planForm.addEventListener("submit", function (event) {
    event.preventDefault();
});

resetPlan();
displayPlans();