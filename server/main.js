const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

function configureEndpoints(app) {
    const pages = require('./pages');
    const api = require('./api');


    app.get('/api/getCityByCoords/', api.getCityByCoords);
    app.get('/api/getWeatherByCoords/', api.getWeatherByCoords);
    app.get('/api/getWeatherCategory/', api.getWeatherCategory);

    app.get('/', pages.mainPage);


    //Якщо не підійшов жоден urll
    app.use(express.static(path.join(__dirname, '../client')));
}

function startServer(port) {
    //Створюється застосунок
    const app = express();

    //Налаштування директорії з шаблонами
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    //Розбір POST запитів
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    //Налаштовуємо сторінки
    configureEndpoints(app);

    //Запуск додатка за вказаним портом
    app.listen(port, function () {
        console.log('My Application Running on http://localhost:' + port + '/');
    });
}

exports.startServer = startServer;