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
  input: (req, res, next) => {
    const password = req.body.password.toString();
    const sql = 'select hash from staff_lists where employee_id = ?';
    con.query(sql, req.body.username, function (err, result, fields) {
      console.log(req.body.username);
      console.log(password);
      if (err) throw err;
      const selectHash = result; // selectしたhash
      console.log(selectHash);
      const hashos = bcrypt.compareSync(password, selectHash); // =>ture
      console.log(hashos);
      next();
    });
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
