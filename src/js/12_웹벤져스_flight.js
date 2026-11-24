fetch("../data/12_웹벤져스_flight.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        displayFlights(data);
    })
    .catch(function (error) {
        console.log("항공편 데이터를 불러오지 못했습니다.", error);
    });

function displayFlights(data) {
    const flightList = document.querySelector(".flight-list");

    flightList.innerHTML = "";

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
            '<strong>' + flight.price + '원</strong>' +
            '<span>/ 1인 왕복</span>' +
            '</p>' +
            '<button type="button" class="select-button">' +
            '선택' +
            '</button>' +
            '</div>' +
            '</article>';
    }
}