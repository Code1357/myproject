'use strict';
const con = require('../db/mysql');
const passport = require('passport');
const manager = require('../models/manager');
const json = require('../json/personalInformationProtectionLaw.json');
console.log(json);


// managerRoutesへ個別モジュールとしてexportするオブジェクト
module.exports = {

  // modelより個別処理を受け取り,経路別処理実行を記述
  login: (req, res) => {
    res.render('managers/login');
  },
  authenticate: passport.authenticate('local',
    {
      successRedirect: '/managers/info',
      successFlash: 'ログインに成功しました',
      failureRedirect: '/managers/login',
      failureFlash: 'ログインに失敗しました,社員番号かパスワードが間違っています。確認してください'
    }),
  info: (req, res) => {
    res.render('managers/info');
  },
  logout: (req, res, next) => {
    req.logout(); // passportのメソッド
    req.flash('success', 'ログアウトしました');
    res.redirect('/');
    next();
  }

};
