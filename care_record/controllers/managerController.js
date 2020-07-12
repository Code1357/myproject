'use strict';

const manager = require('../models/manager'); // ../models/userをload
const con = require('../db/mysql');
const passport = require('passport');

// managerRoutesへ個別モジュールとしてexportするオブジェクト
module.exports = {

  // modelより個別処理を受け取り,経路別処理実行を記述
  login: (req, res) => {
    res.render('managers/login');
  },
  moon: (req, res, next) => {
    const selectLoggedId = 'select staff_id, staff_name, employee_id from staff_lists where employee_id = ?'; // 該当row全取得
    con.query(selectLoggedId, req.body.username, (err, result, fields) => {
      if (err) throw err;
      const selectLoggedId = result; // [object Object]から特定の値取得
      console.log(req.body.username);
      const string = JSON.parse(JSON.stringify(selectLoggedId));
      const obj = string[0];
      console.log(obj);
      const obj2 = obj.staff_name;
      console.log('ary : ' + obj2);
      res.locals.obj2 = obj2;
      next();
    });
  /* const b = '丹次郎';
res.render('managers/info', { b: b, selectLoggedId: selectLoggedId }); */
  },
  authenticate: passport.authenticate('local',
    {
      successRedirect: '/managers/info',
      successFlash: 'ログインに成功しました',
      failureRedirect: '/managers/login',
      failureFlash: 'ログインに失敗しました,社員番号かパスワードが間違っています。確認してください'
    }),
  info: (req, res) => {
    const name = req.user;
    const rename = (name['name']); // なぜか戻ると読み込めない？？？？後一息！！
    console.log(rename);
    res.render('managers/info');
  },
  logout: (req, res, next) => {
    req.logout(); // passportのメソッド
    req.flash('success', 'ログアウトしました');
    res.redirect('/');
    next();
  }

};
