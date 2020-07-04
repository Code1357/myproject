'use strict';

const Manager = require('../models/manager'); // ../models/userをload
const con = require('../db/mysql');
const passport = require('passport');
const bcrypt = require('bcrypt');

// managerRoutesへ個別モジュールとしてexportするオブジェクト
module.exports = {

  // modelより個別処理を受け取り,経路別処理実行を記述
  login: (req, res) => {
    res.render('managers/login');
  },
  /* selectH: (req, res, next) => {
    const selectHash = 'select employee_id, hash from staff_lists where employee_id = ?';
    con.query(selectHash, req.body.username, (err, result, fields) => {
      if (err) throw err;
      const hash = result;
      const map1 = hash.map(value => value.employee_id.toString());
      const map2 = hash.map(value => value.hash);
      console.log(map1);
      console.log(map2);
    });
  }, */
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
