const selectedFlightId = sessionStorage.getItem("selectedFlightId");
const selectedTripType = sessionStorage.getItem("selectedTripType");
const selectedPassengers = sessionStorage.getItem("selectedPassengers");

fetch("../data/12_웹벤져스_flight.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        let selectedFlight = null;

        for (let i = 0; i < data.length; i++) {
            if ("flight-" + data[i].id === selectedFlightId) {
                selectedFlight = data[i];
            }
        }

        if (selectedFlight === null) {
            document.querySelector(".flight-detail").innerHTML =
                "<p>항공편 정보를 찾을 수 없습니다.</p>";
            return;
        }

        let unitPrice = selectedFlight.price;
        let tripText = "왕복";
        let stopsText = "직항";

        if (selectedTripType === "one-way") {
            unitPrice = selectedFlight.oneWayPrice;
            tripText = "편도";
        }

        if (selectedFlight.stops > 0) {
            stopsText = selectedFlight.stops + "회 경유";
        }

        const passengers = parseInt(selectedPassengers);
        const totalPrice = unitPrice * passengers;

        let returnFlightHtml = "";

        if (selectedTripType === "round-trip") {
            let returnStopsText = "직항";

            if (selectedFlight.returnStops > 0) {
                returnStopsText = selectedFlight.returnStops + "회 경유";
            }

            returnFlightHtml =
                '<section class="flight-leg">' +
                '<h2>오는 편</h2>' +
                '<div class="leg-route">' +
                '<div class="leg-airport">' +
                '<p>' + selectedFlight.arrival + '</p>' +
                '<strong>' + selectedFlight.returnDepartureTime + '</strong>' +
                '<p>' + selectedFlight.returnDate + '</p>' +
                '</div>' +
                '<div class="leg-duration">' +
                '<p>' + returnStopsText + '</p>' +
                '<p>' + selectedFlight.returnDurationText + '</p>' +
                '</div>' +
                '<div class="leg-airport">' +
                '<p>' + selectedFlight.departure + '</p>' +
                '<strong>' + selectedFlight.returnArrivalTime + '</strong>' +
                '<p>' + selectedFlight.returnArrivalDate + '</p>' +
                '</div>' +
                '</div>' +
                '</section>';
        }

        document.querySelector(".flight-detail").innerHTML =
            '<div class="flight-detail-layout">' +
            '<section class="flight-detail-info">' +
            '<h1>' + selectedFlight.airline + '</h1>' +
            '<p>시간은 각 공항의 현지 시각 기준입니다.</p>' +
            '<section class="flight-leg">' +
            '<h2>가는 편</h2>' +
            '<div class="leg-route">' +
            '<div class="leg-airport">' +
            '<p>' + selectedFlight.departure + '</p>' +
            '<strong>' + selectedFlight.departureTime + '</strong>' +
            '<p>' + selectedFlight.departureDate + '</p>' +
            '</div>' +
            '<div class="leg-duration">' +
            '<p>' + stopsText + '</p>' +
            '<p>' + selectedFlight.durationText + '</p>' +
            '</div>' +
            '<div class="leg-airport">' +
            '<p>' + selectedFlight.arrival + '</p>' +
            '<strong>' + selectedFlight.arrivalTime + '</strong>' +
            '<p>' + selectedFlight.arrivalDate + '</p>' +
            '</div>' +
            '</div>' +
            '</section>' +
            returnFlightHtml +
            '<p>' + selectedFlight.baggage + '</p>' +
            '</section>' +
            '<aside class="flight-detail-price">' +
            '<h2>예상 총액</h2>' +
            '<p>1인 ' + tripText + ' ' +
            unitPrice.toLocaleString("ko-KR") + '원 × ' +
            passengers + '명</p>' +
            '<p><strong>' + totalPrice.toLocaleString("ko-KR") +
            '원</strong></p>' +
            '<p>' + passengers + '인 ' + tripText + ' 기준</p>' +
            '<a class="flight-booking-link" href="' + selectedFlight.bookingUrl + '">' +
            '항공사 공식 사이트에서 예약하기' +
            '</a>' +
            '</aside>' +
            '</div>';
    })
    .catch(function (error) {
        console.log("항공편 정보를 불러오지 못했습니다.", error);

        document.querySelector(".flight-detail").innerHTML =
            "<p>항공편 정보를 불러오지 못했습니다. 새로고침해주세요.</p>";
    });