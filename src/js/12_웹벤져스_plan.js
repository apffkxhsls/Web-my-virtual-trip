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

const newPlanButton = document.getElementById("new-plan-button");
const savedList = document.getElementById("saved-list");
const savePlanButton = document.getElementById("save-plan-button");
const planForm = document.querySelector(".plan-form");
let selectedIndex = -1;
const deletePlanButton = document.getElementById("delete-plan-button");
let samplePlans = [];
let savedPlans = [];
const savedMyPlans = localStorage.getItem("myPlans");

if (savedMyPlans !== null) {
    savedPlans = JSON.parse(savedMyPlans);
}


newPlanButton.addEventListener("click", function () {
    resetPlan();
});

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

    showBudget(budget, total);
}

function showBudget(budget, total) {
    let percent = 0;
    if (budget > 0) {
        percent = total / budget * 100;
    }

    let budgetFill = document.getElementById("budget-fill");
    let budgetStatus = document.getElementById("budget-status");
    let remainingBudget = document.getElementById("remaining-budget");

    document.getElementById("total-cost").innerText = total + "원";
    document.getElementById("budget-limit").innerText = budget + "원";
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
let defaultChecklist = [];

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

function createPlanItem(plan, isSample) {
    let li = document.createElement("li");
    let badge = "";

    if (isSample) {
        badge = '<p class="saved-badge">예시 계획</p>';
    }

    li.innerHTML =
        '<article class="saved-card hover-card">' +
        '<div class="saved-info">' +
        badge +
        '<h3></h3>' +
        '<p><img src="../res/icons/12_ic_calendar.svg" alt="날짜"><span></span></p>' +
        '<p><img src="../res/icons/12_ic_location_filled.svg" alt="장소"><span></span></p>' +
        '</div>' +
        '</article>';
    li.querySelector("h3").innerText = plan.title;
    let details = li.querySelectorAll("span");
    details[0].innerText = plan.startDate + " ~ " + plan.endDate;
    details[1].innerText = plan.region;
    return li;
}

function openSamplePlan(index) {
    selectedIndex = -1;
    loadPlan(samplePlans[index]);
    deletePlanButton.disabled = true;
}

function showSelectedCard(card) {
    let cards = savedList.querySelectorAll(".saved-card");

    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.remove("selected-card");
    }

    card.classList.add("selected-card");
}

function displayPlans() {
    savedList.innerHTML = "";
    if (samplePlans.length === 0 && savedPlans.length === 0) {
        savedList.innerHTML = '<li class="saved-empty">저장된 여행 계획이 없습니다.</li>';
        return;
    }

    for (let i = 0; i < samplePlans.length; i++) {
        let li = createPlanItem(samplePlans[i], true);
        let card = li.querySelector("article");
        card.addEventListener("click", function () {
            openSamplePlan(i);
            showSelectedCard(card);
        });
        savedList.appendChild(li);
    }

    for (let i = 0; i < savedPlans.length; i++) {
        let li = createPlanItem(savedPlans[i], false);
        let card = li.querySelector("article");
        card.addEventListener("click", function () {
            selectedIndex = i;
            loadPlan(savedPlans[i]);
            showSelectedCard(card);
        });
        savedList.appendChild(li);
    }
}

function clearForm() {
    let inputs = planForm.querySelectorAll("input");

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }
}

function resetPlan() {
    selectedIndex = -1;
    deletePlanButton.disabled = true;
    showTab(0);
    clearForm();
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

    let travelers = parseFloat(plan.travelers);
    if (plan.travelers === "" || travelers < 1 || travelers % 1 !== 0) {
        alert("동행 인원은 1명 이상의 정수로 입력해주세요.");
        showTab(0);
        return;
    }

    for (let i = 0; i < plan.days.length; i++) {
        let date = plan.days[i].date;
        if (date !== "" && (date < plan.startDate || date > plan.endDate)) {
            alert("DAY " + (i + 1) + "의 날짜는 여행 기간 안으로 입력해주세요.");
            showTab(0);
            return;
        }
    }

    let costs = [
        plan.expense.budget,
        plan.expense.transport,
        plan.expense.food,
        plan.expense.stay,
        plan.expense.other
    ];
    for (let i = 0; i < costs.length; i++) {
        if (parseFloat(costs[i]) < 0) {
            alert("목표 예산과 지출은 0원 이상으로 입력해주세요.");
            showTab(1);
            return;
        }
    }

    if (selectedIndex === -1) {
        savedPlans.push(plan);
        selectedIndex = savedPlans.length - 1;
    } else {
        savedPlans[selectedIndex] = plan;
    }
    localStorage.setItem("myPlans", JSON.stringify(savedPlans));
    displayPlans();
    deletePlanButton.disabled = false;
    alert("여행 계획을 저장했습니다.");
});

function loadPlan(plan) {
    deletePlanButton.disabled = false;
    showTab(0);
    clearForm();
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

deletePlanButton.addEventListener("click", function () {
    if (selectedIndex === -1) {
        return;
    }
    if (confirm("이 여행 계획을 삭제하시겠습니까?")) {
        let remainingPlans = [];
        for (let i = 0; i < savedPlans.length; i++) {
            if (i !== selectedIndex) {
                remainingPlans.push(savedPlans[i]);
            }
        }
        savedPlans = remainingPlans;
        localStorage.setItem("myPlans", JSON.stringify(savedPlans));
        selectedIndex = -1;
        displayPlans();
        resetPlan();
    }
});

planForm.addEventListener("submit", function (event) {
    event.preventDefault();
});

function openSelectedPlan() {
    let planType = sessionStorage.getItem("selectedPlanType");
    let planIndex = sessionStorage.getItem("selectedPlanIndex");

    if (planType === null || planIndex === null) {
        return;
    }

    planIndex = Number(planIndex);
    sessionStorage.removeItem("selectedPlanType");
    sessionStorage.removeItem("selectedPlanIndex");

    if (planType === "sample" && planIndex >= 0 && planIndex < samplePlans.length) {
        openSamplePlan(planIndex);
        showSelectedCard(savedList.querySelectorAll(".saved-card")[planIndex]);
    } else if (planType === "my" && planIndex >= 0 && planIndex < savedPlans.length) {
        selectedIndex = planIndex;
        loadPlan(savedPlans[planIndex]);
        showSelectedCard(savedList.querySelectorAll(".saved-card")[samplePlans.length + planIndex]);
    }
}

fetch("../data/12_웹벤져스_plan.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        defaultChecklist = data.defaultChecklist;
        samplePlans = data.samplePlans;

        resetPlan();
        displayPlans();
        openSelectedPlan();
    })
    .catch(function (error) {
        console.log("여행 계획 데이터를 불러오지 못했습니다.", error);

        resetPlan();
        displayPlans();

        if (savedPlans.length === 0) {
            savedList.innerHTML =
                '<li class="saved-empty">여행 계획 정보를 불러오지 못했습니다. 새로고침해주세요.</li>';
        }
    });
