'use strict';

const con = require('../db/mysql');
const passport = require('passport');

// const json = require('../json/personalInformationProtectionLaw.json');
// console.log(json);


// managerRoutesへ個別モジュールとしてexportするオブジェクト
module.exports = {

  // modelより個別処理を受け取り,経路別処理実行を記述
  login: (req, res) => {
    res.render('managers/login');
  },
  authenticate: passport.authenticate('local',
    {
      successRedirect: '/managers/info',
      successFlash: 'ログインに成功しました。',
      failureRedirect: '/managers/login',
      failureFlash: 'ログイン失敗。社員番号かパスワードを確認してください。'
    }),
  info: (req, res) => {
    const username = req.user.name;
    con.query('select position_lists_position_id from staff_lists where employee_id = ?', username, (err, result, fields) => {
      if (err) throw err;
      const position = result[0].position_lists_position_id;
      console.log(position);
      if (position === 1) {
        res.render('managers/info', { position1: 1 });
      } else {
        res.render('records/info', { position2: 2, position3: 3 });
      }
    });
  },
  logout: (req, res, next) => {
    req.logout(); // passportのメソッド
    req.flash('success', 'ログアウトしました。');
    res.redirect('/');
    next();
  }

};


/* <% if ( ) { %>
  <%- include('partials/m_header'); %>
<% } else { %>
  <%- include('partials/r_header'); %>
  <% } %> */