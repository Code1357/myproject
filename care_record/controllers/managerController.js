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
    const password = req.body.password;
    const emproyeeId = req.body.username;
    const sql = 'select hash from staff_lists where employee_id = ?';
    con.query(sql, emproyeeId, function (err, result, fields) {
      // console.log(req.body.username);
      // console.log(password);
      if (err) throw err;
      const hashObj = result; // selectしたhash
      const hashArray = hashObj.map(value => value.hash);
      hashArray.forEach(value => { // 照合できるレベルに変換
        const hash = value;
        bcrypt.compareSync(password, hash); // hashと入力passを照合,trueかfalse
      });
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
