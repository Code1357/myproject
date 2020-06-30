'use strict';

const Manager = require('../models/manager'); // ../models/userをload
const passport = require('passport');
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
  }

};
