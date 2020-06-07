'use strict';

// モジュール見込み、初期化
const express = require('express');
const app = express();
const router = express.Router();
const expresslayouts = require('express-ejs-layouts'); 
const homeController = require('./controllers/homeController');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/recipe_db',
  { useNewUrlParser: true, useUnifiedTopology: true }
);
// 設定
app.set('port', process.env.PORT || 3000); // port選択、セット
app.set('view engine', 'ejs'); // EJSセット

// ミドルウェア読み込み
app.use(expresslayouts); // express-ejs-laypots適応
app.use(express.static('public')); // 静的ファイルの供給


// 経路
router.get('/', homeController.topPage);
router.get('/index', homeController.index);
router.get('/personalinfo', homeController.personalInfoPage);
router.get('/carerecord', homeController.careRecord);
router.get('/contactus',homeController.contactUs);

app.use("/", router);　// appの変わりにrouterを使えという命令

//
app.listen(app.get('port'), () => {
    console.log(`localhost:${app.get('port')}を監視しています`);
});