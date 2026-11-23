const selectedStayId = sessionStorage.getItem("selectedStayId");

console.log("선택한 숙소:", selectedStayId);

fetch("../data/12_웹벤져스_stay.json")
    .then(function (response) {
        return response.json();
    })

    .then(function (data) {
        const detail = document.querySelector(".stay-detail");
        let selectedStay = null;

        for (let i = 0; i < data.length; i++) {
            if ("stay-" + data[i].id === selectedStayId) {
                selectedStay = data[i];
            }
        }

        if (selectedStay === null) {
            detail.innerHTML =
                "<p>숙소 정보를 찾을 수 없습니다.</p>";
            return;
        }

        detail.innerHTML =
            '<img class="detail-image" src="' + selectedStay.image +
            '" alt="' + selectedStay.name + ' 객실">' +

            '<div class="detail-layout">' +
            '<section class="detail-info">' +
            '<p>' + selectedStay.location + '</p>' +
            '<h1>' + selectedStay.name + '</h1>' +
            '<p>평점: ' + selectedStay.rating + '</p>' +
            '<p>' + selectedStay.features + '</p>' +
            '<p>' + selectedStay.baseGuests + '인 기준 - 최대 ' +
            selectedStay.maxGuests + '인</p>' +
            '</section>' +

            '<aside class="detail-booking">' +
            '<h2>숙박 요금</h2>' +
            '<p><strong>' +
            selectedStay.price.toLocaleString("ko-KR") +
            '원</strong> / 1박</p>' +
            '<p>예약 사이트에서 날짜별 요금을 확인해주세요.</p>' +
            '<a class="booking-link" href="' + selectedStay.bookingUrl + '">' +
            '공식 사이트에서 예약하기' +
            '</a>' +
            '</aside>' +
            '</div>';
    })

    .catch(function (error) {
        console.log("숙소 상세 정보를 불러오지 못했습니다.", error);
    });