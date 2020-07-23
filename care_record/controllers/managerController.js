'use strict';

const con = require('../db/mysql');
const httpStatus = require('http-status-codes');
const passport = require('passport');

module.exports = {

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
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const username = req.user.name;
      con.query('select position_lists_position_id from staff_lists where employee_id = ?', username, (err, result, fields) => {
        if (err) throw err;
        const position = result[0].position_lists_position_id;
        console.log(position);
        if (position === 1) {
          res.render('managers/info', { position1: 1 });
        } else {
          res.render('careRecords/info', { position2: 2, position3: 3 });
        }
      });
    }
  },

  logout: (req, res, next) => {
    req.logout(); // passportのメソッド
    req.flash('success', 'ログアウトしました。');
    res.redirect('/');
    next();
  }

};
