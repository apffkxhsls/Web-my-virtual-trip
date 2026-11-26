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

        let ratingText = selectedStay.rating;

        if (selectedStay.rating % 1 === 0) {
            ratingText = selectedStay.rating + ".0";
        }

        let viewIcon = "12_ic_beach.svg";
        let viewText = "오션뷰";

        if (selectedStay.features.indexOf("시티뷰") !== -1) {
            viewIcon = "12_ic_city.svg";
            viewText = "시티뷰";
        }

        detail.innerHTML =
            '<img class="detail-image" src="' + selectedStay.image +
            '" alt="' + selectedStay.name + ' 객실">' +
            '<div class="detail-layout">' +
            '<section class="detail-info">' +
            '<p>' + selectedStay.location + '</p>' +
            '<div class="detail-title-row">' +
            '<h1>' + selectedStay.name + '</h1>' +
            '<button type="button" id="detail-favorite-button"></button>' +
            '</div>' +
            '<p class="detail-icon-row">' +
            '<img src="../res/icons/12_ic_star.svg" alt="평점">' +
            '<span>' + ratingText + ' / 5.0</span>' +
            '</p>' +
            '<div class="detail-features">' +
            '<p class="detail-icon-row">' +
            '<img src="../res/icons/' + viewIcon + '" alt="">' +
            '<span>' + viewText + '</span>' +
            '</p>' +
            '<p class="detail-icon-row">' +
            '<img src="../res/icons/12_ic_parking.svg" alt="">' +
            '<span>무료 주차</span>' +
            '</p>' +
            '</div>' +
            '<p class="detail-icon-row">' +
            '<img src="../res/icons/12_ic_group.svg" alt="숙박 인원">' +
            '<span>기준 ' + selectedStay.baseGuests + '인 / 최대 ' +
            selectedStay.maxGuests + '인</span>' +
            '</p>' +
            '<div class="detail-description">' +
            '<h2>숙소 소개</h2>' +
            '<p>' + selectedStay.description + '</p>' +
            '</div>' +
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
        setupDetailFavorite(selectedStay.id);
    })

    .catch(function (error) {
        console.log("숙소 상세 정보를 불러오지 못했습니다.", error);

        document.querySelector(".stay-detail").innerHTML =
            "<p>숙소 상세 정보를 불러오지 못했습니다. 새로고침해주세요.</p>";
    });

function setupDetailFavorite(stayId) {
    const button = document.querySelector("#detail-favorite-button");
    let favoriteStays = [];

    const savedFavorites = localStorage.getItem("favoriteStays");

    if (savedFavorites !== null) {
        favoriteStays = JSON.parse(savedFavorites);
    }

    function isFavorite() {
        for (let i = 0; i < favoriteStays.length; i++) {
            if (favoriteStays[i] === stayId) {
                return true;
            }
        }

        return false;
    }

    function updateButton() {
        if (isFavorite()) {
            button.innerHTML =
                '<img src="../res/icons/12_ic_favorite_filled.svg"' +
                ' alt="숙소 찜 취소">';
        } else {
            button.innerHTML =
                '<img src="../res/icons/12_ic_favorite.svg"' +
                ' alt="숙소 찜하기">';
        }
    }

    button.addEventListener("click", function () {
        if (isFavorite()) {
            favoriteStays = favoriteStays.filter(function (id) {
                return id !== stayId;
            });
        } else {
            favoriteStays.push(stayId);
        }

        localStorage.setItem(
            "favoriteStays",
            JSON.stringify(favoriteStays)
        );

        updateButton();
    });

    updateButton();
}
