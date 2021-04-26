const renderCityByCoords = function (lat, long) {
    $.get('./api/getCityByCoords', {lat: lat, long: long}, function (resp) {
        const $geoCity = $('#geoCity');
        if (resp.error) {
            $geoCity.text("Неможливо визначити");
            return;
        }
        const location = resp.address;
        const res = [];
        if (location.city) res.push(location.city);
        if (location.town) res.push(location.town);
        if (location.village) res.push(location.village);
        if (location.county) res.push(location.county);
        if (location.state) res.push(location.state);
        if (location.country) res.push(location.country);
        $geoCity.html(res.join(', '));
    })
};

const renderWeatherByCoords = function (lat, long) {
    $.get('./api/getWeatherByCoords', {lat: lat, long: long, fake: 0}, function (resp) {
        const weather = resp;
        const arr = [];
        arr.push(`Діапазон температур ${parseInt(weather.lowTemperature)} - ${parseInt(weather.highTemperature)} &deg;C`);
        arr.push(`Вологість ${weather.humidity} %`);
        arr.push(`Опис температури ${weather.temperatureDesc}`);
        arr.push(`Швидкість вітру ${weather.windSpeed} м/c`);
        const str = arr.join('<br>');
        $('#weatherDetail').html(str);
        $('#weatherIcon').attr('src', weather.iconLink);
        $('#temp').html(Math.round(parseFloat(weather.temperature)));

        renderWeatherCategory(weather.skyInfo, weather.precipitationDesc, weather.temperature);

    })
};

const renderWeatherCategory = function (skyInfo, precipitationDesc, temperature) {
    $.get('./api/getWeatherCategory',
        {skyInfo: skyInfo, precipitationDesc: precipitationDesc, temperature: temperature},
        function (resp) {
            const images = resp.images;
            $('#cloth1').attr('src', './clothes/' + images[0] + '.jpg');
            $('#cloth2').attr('src', './clothes/' + images[1] + '.jpg');
        });
};

const renderNowDate = function () {
    $('#nowDate').html((new Date()).toLocaleDateString("en-US", {day: "2-digit", month: "2-digit", year: "numeric"}));
};

const choosePlace = function (span) {
  alert($(span).text());
};

const renderAll = function(lat, long) {
    renderCityByCoords(lat, long);
    renderWeatherByCoords(lat, long);
    renderNowDate();
};

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        renderAll(lat, long)
    })
});