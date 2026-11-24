let flights = [];

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
            '<strong>' + flight.price.toLocaleString("ko-KR") + '원</strong>' +
            '<span>/ 1인 왕복</span>' +
            '</p>' +
            '<button type="button" class="select-button">' +
            '선택' +
            '</button>' +
            '</div>' +
            '</article>';
    }
}

const stopsCheckboxes = document.querySelectorAll('input[name="stops"]');
const airlineCheckboxes = document.querySelectorAll('input[name="airline"]');

for (let i = 0; i < stopsCheckboxes.length; i++) {
    stopsCheckboxes[i].addEventListener("change", filterFlights);
}

for (let i = 0; i < airlineCheckboxes.length; i++) {
    airlineCheckboxes[i].addEventListener("change", filterFlights);
}

function filterFlights() {
    const selectedStops = [];
    const selectedAirlines = [];

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

        return stopsMatch && airlineMatch;
    });

    displayFlights(filteredFlights);
}