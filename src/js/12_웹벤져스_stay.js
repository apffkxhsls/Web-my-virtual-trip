fetch("../data/12_웹벤져스_stay.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        const stayList = document.querySelector(".stay-list");

        stayList.innerHTML = "";

        for (let i = 0; i < data.length; i++) {
            const stay = data[i];

            stayList.innerHTML +=
                '<article class="stay-card">' +
                    '<div class="stay-image">' +
                        '<img class="stay" src="' + stay.image + '" alt="숙소 객실">' +

                        '<button type="button" class="favorite-button">' +
                            '<img class="favorite"' +
                                ' src="../res/icons/12_ic_favorite.svg"' +
                                ' alt="' + stay.name + ' 찜하기">' +
                            '<img class="favorite-filled"' +
                                ' src="../res/icons/12_ic_favorite_filled.svg"' +
                                ' alt="' + stay.name + ' 찜하기">' +
                        '</button>' +
                    '</div>' +

                    '<div class="stay-info">' +
                        '<p class="stay-location">' + stay.location + '</p>' +
                        '<h3>' + stay.name + '</h3>' +
                        '<p class="stay-features">' + stay.features + '</p>' +
                        '<p class="stay-capacity">' +
                            stay.baseGuests + '인 기준 - 최대 ' +
                            stay.maxGuests + '인' +
                        '</p>' +
                        '<p class="stay-price">' +
                            '<strong>' + stay.price.toLocaleString("ko-KR") + '원</strong>' +
                            '<span>/ 1박</span>' +
                        '</p>' +
                    '</div>' +
                '</article>';
        }
    })
    .catch(function (error) {
        console.log("숙소 데이터를 불러오지 못했습니다.", error);
    });