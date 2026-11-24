let flights = [];
let selectedDeparture = "";
let selectedArrival = "";
let selectedTripType = "round-trip";
let selectedPassengers = 1;
let selectedDepartureDate = "";
let selectedReturnDate = "";

fetch("../data/12_웹벤져스_flight.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        flights = data;
        filterFlights();
    })
    .catch(function (error) {
        console.log("항공편 데이터를 불러오지 못했습니다.", error);
    });

function displayFlights(data) {
    const flightList = document.querySelector(".flight-list");

    flightList.innerHTML = "";

    if (data.length === 0) {
        flightList.innerHTML = "<p>조건에 맞는 항공편이 없습니다.</p>";
        return;
    }

    for (let i = 0; i < data.length; i++) {
        const flight = data[i];
        let stopsText = "직항";
        let unitPrice = flight.price;
        let tripText = "왕복";

        if (selectedTripType === "one-way") {
            unitPrice = flight.oneWayPrice;
            tripText = "편도";
        }

        const totalPrice = unitPrice * selectedPassengers;

        if (flight.stops > 0) {
            stopsText = flight.stops + "회 경유";
        }

        flightList.innerHTML +=
            '<article class="flight-card">' +
            '<div class="flight-airline">' +
            '<h3>' + flight.airline + '</h3>' +
            '</div>' +

            '<div class="flight-info">' +
            '<div class="flight-route">' +
            '<div class="departure-info">' +
            '<p class="flight-time">' +
            flight.departureTime +
            '</p>' +
            '<p class="flight-airport">' +
            flight.departure +
            '</p>' +
            '</div>' +

            '<div class="flight-duration">' +
            '<p>' + stopsText + '</p>' +
            '<p>' + flight.durationText + '</p>' +
            '</div>' +

            '<div class="arrival-info">' +
            '<p class="flight-time">' +
            flight.arrivalTime +
            '</p>' +
            '<p class="flight-airport">' +
            flight.arrival +
            '</p>' +
            '</div>' +
            '</div>' +

            '<p class="flight-baggage">' +
            flight.baggage +
            '</p>' +
            '</div>' +

            '<div class="flight-price">' +
            '<p>' +
            '<strong>' + totalPrice.toLocaleString("ko-KR") + '원</strong>' +
            '<span>/ ' + selectedPassengers + '인 ' + tripText + '</span>' +
            '</p>' +
            '<a class="select-button" id="flight-' + flight.id + '"' +
            ' href="12_웹벤져스_flight-detail.html">' +
            '선택' +
            '</a>' +
            '</div>' +
            '</article>';
    }

    const selectLinks = document.querySelectorAll(".flight-list .select-button");

    for (let i = 0; i < selectLinks.length; i++) {
        selectLinks[i].addEventListener("click", function () {
            sessionStorage.setItem("selectedFlightId", this.id);
            sessionStorage.setItem("selectedTripType", selectedTripType);
            sessionStorage.setItem("selectedPassengers", selectedPassengers);
            sessionStorage.setItem("selectedDepartureDate", selectedDepartureDate);
            sessionStorage.setItem("selectedReturnDate", selectedReturnDate);
        });
    }
}

const stopsCheckboxes = document.querySelectorAll('input[name="stops"]');
const airlineCheckboxes = document.querySelectorAll('input[name="airline"]');
const sortSelect = document.querySelector("#sort");
const departureInput = document.querySelector("#departure");
const arrivalInput = document.querySelector("#arrival");
const searchButton = document.querySelector(".flight-search .search-button");
const tripTypeInputs = document.querySelectorAll('input[name="trip-type"]');
const returnDateInput = document.querySelector("#return-date");
const departureDateInput = document.querySelector("#departure-date");
const passengersSelect = document.querySelector("#passengers");

for (let i = 0; i < tripTypeInputs.length; i++) {
    tripTypeInputs[i].addEventListener("change", updateTripType);
}

function updateTripType() {
    for (let i = 0; i < tripTypeInputs.length; i++) {
        if (tripTypeInputs[i].checked) {
            if (tripTypeInputs[i].value === "one-way") {
                returnDateInput.value = "";
                returnDateInput.disabled = true;
            } else {
                returnDateInput.disabled = false;
            }
        }
    }
}

updateTripType();

searchButton.addEventListener("click", function () {
    const departureDate = departureDateInput.value;
    const returnDate = returnDateInput.value;

    if (returnDateInput.disabled) {
        if (departureDate === "") {
            alert("출발일을 선택해주세요.");
            return;
        }
    } else {
        if (departureDate === "" || returnDate === "") {
            alert("출발일과 귀국일을 모두 선택해주세요.");
            return;
        }

        if (returnDate < departureDate) {
            alert("귀국일은 출발일과 같거나 이후로 선택해주세요.");
            return;
        }
    }

    selectedDeparture = departureInput.value;
    selectedArrival = arrivalInput.value;

    for (let i = 0; i < tripTypeInputs.length; i++) {
        if (tripTypeInputs[i].checked) {
            selectedTripType = tripTypeInputs[i].value;
        }
    }

    selectedPassengers = parseInt(passengersSelect.value);
    selectedDepartureDate = departureDate;
    selectedReturnDate = returnDate;

    filterFlights();
});

sortSelect.addEventListener("change", filterFlights);

for (let i = 0; i < stopsCheckboxes.length; i++) {
    stopsCheckboxes[i].addEventListener("change", filterFlights);
}

for (let i = 0; i < airlineCheckboxes.length; i++) {
    airlineCheckboxes[i].addEventListener("change", filterFlights);
}

function filterFlights() {
    const selectedStops = [];
    const selectedAirlines = [];
    const resultsTitle = document.querySelector("#flight-results-title");

    if (selectedDeparture === "" && selectedArrival === "") {
        resultsTitle.innerText = "전체 항공편";
    } else {
        let departureText = "전체 출발지";
        let arrivalText = "전체 도착지";

        if (selectedDeparture !== "") {
            departureText = selectedDeparture;
        }

        if (selectedArrival !== "") {
            arrivalText = selectedArrival;
        }

        resultsTitle.innerText = departureText + " → " + arrivalText;
    }

    for (let i = 0; i < stopsCheckboxes.length; i++) {
        if (stopsCheckboxes[i].checked) {
            selectedStops.push(stopsCheckboxes[i].value);
        }
    }

    for (let i = 0; i < airlineCheckboxes.length; i++) {
        if (airlineCheckboxes[i].checked) {
            selectedAirlines.push(airlineCheckboxes[i].value);
        }
    }

    const filteredFlights = flights.filter(function (flight) {
        let stopsMatch = selectedStops.length === 0;
        let airlineMatch = selectedAirlines.length === 0;

        for (let i = 0; i < selectedStops.length; i++) {
            if (selectedStops[i] === "direct" && flight.stops === 0) {
                stopsMatch = true;
            }

            if (selectedStops[i] === "connecting" && flight.stops > 0) {
                stopsMatch = true;
            }
        }

        for (let i = 0; i < selectedAirlines.length; i++) {
            if (flight.airline === selectedAirlines[i]) {
                airlineMatch = true;
            }
        }

        const departureMatch =
            selectedDeparture === "" ||
            flight.departure === selectedDeparture;

        const arrivalMatch =
            selectedArrival === "" ||
            flight.arrival === selectedArrival;

        const departureDateMatch =
            selectedDepartureDate === "" ||
            flight.departureDate === selectedDepartureDate;

        let returnDateMatch = true;

        if (selectedTripType === "round-trip" && selectedReturnDate !== "") {
            returnDateMatch = flight.returnDate === selectedReturnDate;
        }

        return stopsMatch &&
            airlineMatch &&
            departureMatch &&
            arrivalMatch &&
            departureDateMatch &&
            returnDateMatch;
    });

    if (sortSelect.value === "price-low") {
        filteredFlights.sort(function (a, b) {
            if (selectedTripType === "one-way") {
                return a.oneWayPrice - b.oneWayPrice;
            }

            return a.price - b.price;
        });
    } else if (sortSelect.value === "duration-short") {
        filteredFlights.sort(function (a, b) {
            return a.durationMinutes - b.durationMinutes;
        });
    }

    displayFlights(filteredFlights);
}