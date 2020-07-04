'use strict';

// モジュール
const express = require('express');
const app = express();
const con = require('./db/mysql');
const session = require('express-session');
const connectFlash = require('connect-flash');
const layouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const router = require('./routes/index'); // ./routes/indexをload

// mysql -> databaseに接続
con.connect((err) => {
  if (err) throw err;
  console.log('mysqlに接続できました');
});

// set
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

// ミドルウェア
app.use(methodOverride('_method', { methods: ['POST', 'GET'] })); // method-overrideの処理
app.use(layouts);
app.use(express.static('public')); // 静的ファイル供給
app.use(express.urlencoded({ extended: false })); // body-parser同じ
app.use(express.json()); // body-parser同じ
app.use(session({
  secret: 'keyboard cat', // cookieの暗号化,必須
  resave: false, // 毎回セッションを作成しない
  saveUninitialized: false, // 未初期化セッションを保存しない
  cookie: {
    maxAge: 4000000 // 4万mm秒(約1時間でcookie有効期限)
  }
}));
// 認証
passport.serializeUser(function (username, done) {
  done(null, username);
});
passport.deserializeUser(function (username, done) {
  done(null, { name: username });
});
//

passport.use(new LocalStrategy(
  (username, password, done) => {
    const nameHash = 'select employee_id, hash from staff_lists where employee_id = ?';
    con.query(nameHash, username, (err, result, fields) => {
      if (err) throw err;
      const nameHash = result;
      const employeeid = nameHash.map(value => value.employee_id).toString();
      const password = nameHash.map(value => value.hash);
      // const eId = employeeid[0];
      const pass = password[0];
      console.log(employeeid);
      console.log(pass);

      if (username === employeeid && password == pass) {
        return done(null, username);
      } else {
        console.log('Login Error');
        return done(null, false, { message: 'パスワードが正しくありません' });
      }
    });
  }));

// passport(FlashMessageに記述必須)
app.use(passport.initialize());
app.use(passport.session());

app.use(connectFlash()); // FlashMessageの箱
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

app.use('/', router); // ( load済, -> routes/index)

// サーバー監視
app.listen(app.get('port'), () => {
  console.log(`port${app.get('port')}を監視しています`);
});
