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