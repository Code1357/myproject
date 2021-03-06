'use strict';

// モジュール
const express = require('express');
const app = express();
const con = require('./db/mysql');
const expressSession = require('express-session');
const connectFlash = require('connect-flash');
const layouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const passport = require('passport');
const router = require('./routes/index'); // ./routes/indexをload

// set
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

// ミドルウェア
app.use(methodOverride('_method', { methods: ['POST', 'GET'] })); // method-overrideの処理
app.use(layouts);
app.use(express.static('public')); // 静的ファイル供給
app.use(express.urlencoded({ extended: false })); // body-parser同じ
app.use(express.json()); // body-parser同じ
app.use(expressSession({
  secret: 'keyboard cat', // cookieの暗号化,必須
  resave: false, // 毎回セッションを作成しない
  saveUninitialized: false, // 未初期化セッションを保存しない
  cookie: {
    maxAge: 4000000 // 4万mm秒(約1時間でcookie有効期限)
  }
}));

// mysql -> databaseに接続
con.connect((err) => {
  if (err) throw err;
  console.log('mysqlに接続できました');
});

// passport(FlashMessageに記述必須)
app.use(passport.initialize());
app.use(passport.session());

app.use(connectFlash()); // FlashMessageの箱

app.use('/', router); // ( load済, -> routes/index)

// サーバー監視
app.listen(app.get('port'), () => {
  console.log(`port${app.get('port')}を監視しています`);
});
