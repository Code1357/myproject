'use strict';

const express = require('express');
const app = express();
app.set('port', process.env.PORT || 3000);

const expresslayouts = require('express-ejs-layouts');
app.set('view engine', 'ejs');
app.use(expresslayouts);

app.use(express.static('public'));

const topController = require('./controllers/topController');

// 経路
app.get('/', (req, res) => {
    res.send('ようこそ');
});

app.get('/top', topController.topPage);

// HTTPリクエスト解析
app.use(express.urlencoded({
    extended: false
})
);
app.use(expres.json);

//
app.listen(app.get('port'), () => {
    console.log(`localhost:${app.get('port')}を監視しています`);
});