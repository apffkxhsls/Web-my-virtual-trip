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