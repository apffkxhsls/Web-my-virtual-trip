fetch("../data/12_웹벤져스_stay.json")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    })
    .catch(function (error) {
        console.log("숙소 데이터를 불러오지 못했습니다.", error);
    });