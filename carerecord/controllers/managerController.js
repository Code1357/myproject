'use strict';

const con = require('../db/mysql');
const httpStatus = require('http-status-codes');
const passport = require('passport');
const loginSQL = require('../models/login');

module.exports = {

  login: (req, res) => {
    res.render('managers/login');
  },

  authenticate: passport.authenticate('local',
    {
      successRedirect: '/managers/info',
      successFlash: 'ログインに成功しました。',
      failureRedirect: '/managers/login',
      failureFlash: 'ログイン失敗。社員番号,パスワードを確認してください。'
    }),

  info: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const username = req.user.name;
      con.query(loginSQL.login, username, (err, result) => {
        if (err) throw err;
        const position = result[0].position_lists_position_id;
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
