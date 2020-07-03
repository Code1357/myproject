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
const bcrypt = require('bcrypt');

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
const ps = 'hoge'; // pass
const has = bcrypt.hashSync(ps, 10);
console.log(has);

const hashos = bcrypt.compareSync(ps, has); // =>ture
console.log(hashos);
const hashas = bcrypt.compareSync('fake_hoge', has); // =>false
console.log(hashas);
//
/*
const hashos = bcrypt.compareSync(password, selectHas); // =>ture
console.log(hashos);
*/

/* const selectHash = 'select employee_id, hash from staff_lists';
con.query(selectHash, (err, result, fields) => {
  if (err) throw err; */
/*  const hash = result;
 const map1 = hash.map(value => value.employee_id.toString());
 const map2 = hash.map(value => value.hash); */
// console.log(map1);
// console.log(map2);
passport.use(new LocalStrategy(
  function (username, password, done) {
    if (username.includes(username) && password.includes(password)) { // username,password紐付きはinputのname
      return done(null, username);
    }
    return done(null, false, {});
  }
));
/* }); */

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
