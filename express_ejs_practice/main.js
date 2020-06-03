'use strict';

const express = require('express');
const app = express(); // Express.js適応
app.set('port', process.env.PORT || 3000); // port選択、セット
app.set('view engine', 'ejs'); // EJS適応
const expresslayouts = require('express-ejs-layouts'); 
app.use(expresslayouts); // express-ejs-laypots適応
app.use(express.static('public')); // 静的ファイルの供給
const homeController = require('./controllers/homeController');

// 経路
app.use('/top', homeController.topPage);
app.get('/fixed', homeController.fixedPage);
app.get('/personalinfo', homeController.personalInfoPage)

//
app.listen(app.get('port'), () => {
    console.log(`localhost:${app.get('port')}を監視しています`);
});