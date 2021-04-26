const request = require("request");
const fs = require("fs");

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36 OPR/58.0.3135.132";

exports.getCityByCoords = function (req, response) {
    const options = {
        url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${req.query.lat}&lon=${req.query.long}&zoom=18&addressdetails=1`,
        headers: {
            'User-Agent': USER_AGENT
        }
    };

    request(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        response.send(JSON.parse(body));
    });

};

// https://developer.here.com/documentation/weather/topics/resource-type-weather-items.html
exports.getWeatherByCoords = function (req, response) {
    if (req.query.fake === '1') {
        console.log('faked weather');
        const body = fs.readFileSync('./server/fake.json');
        response.send(JSON.parse(body));
        return;
    }

    const options = {
        url: `https://weather.cit.api.here.com/weather/1.0/report.json?product=observation&latitude=${req.query.lat}&longitude=${req.query.long}&oneobservation=true&app_id=DemoAppId01082013GAL&app_code=AJKnXv84fjrb0KIHawS0Tg`,
        headers: {
            'User-Agent': USER_AGENT
        }
    };

    request(options, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        const result = JSON.parse(body);
        const weather = result.observations.location[0].observation[0];
        response.send(weather);
    });

};

const sunny = [
    1,
    2,
    3,
    4,
    5,
    6,
    8,
    9,
    10,
    14,
    15,
    28,
    29,
    30,
    34
];

// categories
// rain -3
// sun 1
// nosun 2
exports.getWeatherCategory = function (req, response) {
    const body = req.query;

    const skyInfo = parseInt(body.skyInfo);
    const temperature = parseInt(body.temperature);
    let cat;
    let precipitationDesc = body.precipitationDesc;
    if (precipitationDesc !== undefined && precipitationDesc.length > 0) {
        cat = 3;
    } else if (sunny.includes(skyInfo)) {
        cat = 1;
    } else {
        cat = 2;
    }

    let responseArr;
    if (cat === 1) {
        if (temperature > 18) responseArr = ['i', 'm'];
        else if(temperature >= 10) responseArr = ['d', 'f'];
        else if(temperature >= 0) responseArr = ['o', 'f'];
        else responseArr = ['j', 'r'];
    } else if (cat === 2) {
        if (temperature > 18) responseArr = ['i', 'm'];
        else if(temperature >= 10) responseArr = ['d', 'm'];
        else if(temperature >= 0) responseArr = ['o', 'r'];
        else responseArr = ['j', 'r'];
    } else {
        if (temperature > 18) responseArr = ['g', 'c'];
        else if(temperature >= 10) responseArr = ['n', 'c'];
        else if(temperature >= 0) responseArr = ['p', 'c'];
        else responseArr = ['j', 'c'];
    }
    response.send({images: responseArr});

};


