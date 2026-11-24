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

        document.querySelector(".flight-detail").innerHTML =
            '<h1>' + selectedFlight.airline + '</h1>' +
            '<h2>' + selectedFlight.departure + ' → ' +
            selectedFlight.arrival + '</h2>' +

            '<p>출발 시간: ' + selectedFlight.departureTime + '</p>' +
            '<p>도착 시간: ' + selectedFlight.arrivalTime + '</p>' +
            '<p>' + stopsText + ' · ' + selectedFlight.durationText + '</p>' +
            '<p>' + selectedFlight.baggage + '</p>' +

            '<div class="flight-detail-price">' +
            '<h2>예상 총액</h2>' +
            '<p><strong>' + totalPrice.toLocaleString("ko-KR") +
            '원</strong></p>' +
            '<p>' + passengers + '인 ' + tripText + ' 기준</p>' +
            '</div>';
    })
    .catch(function (error) {
        console.log("항공편 정보를 불러오지 못했습니다.", error);

        document.querySelector(".flight-detail").innerHTML =
            "<p>항공편 정보를 불러오지 못했습니다. 새로고침해주세요.</p>";
    });