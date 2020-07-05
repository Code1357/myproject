'use strict';

const con = require('../db/mysql');

const Staff = require('../models/staff'); // ../models/userをload
const bcrypt = require('bcrypt');
const saltRounds = 10;

// staffRoutesへ個別モジュールとしてexportするオブジェクト
module.exports = {

  // modelより個別処理を受け取り,経路別処理実行を記述
  new: (req, res) => {
    res.render('staffs/new');
  },
  validate: (req, res, next) => {
    req.check('password')
      .trim() // 左右両側の空白を除去
    req.check('employee_id', '半角数字,6文字で必ず入力してください')
      .isInt()
      .isLength({
        min: 5,
        max: 6
      })
      .isEmpty(),
      req.check('hire_data', '必ず入力してください')
        .isEmpty(),
      req.check('staff_name', '必ず入力してください')
        .isEmpty(),
      req.check('password', 'パスワードを空にする事はできません')
        .isEmpty(),
      req.check('birthday', '必ず入力してください')
        .isEmpty(),
      req.check('genders_gender_id', '1~3の範囲で入力してください')
        .isInt()
        .isLength({
          min: 1,
          max: 1
        });
    req.getValidationResult().then(error => {
      if (!error.isEmpty()) {
        let messages = error.array().map(e => e.msg);
        req.skip = true;
        console.log(error);
        req.flash('error', messages.join('and'));
        res.locals.redirect = '/';
        next();
      } else {
        next();
      }
    });
  },
  create: (req, res, next) => {
    const pass = req.body.hash;
    const hash = bcrypt.hashSync(pass, saltRounds);
    req.body.hash = hash;
    const sql = 'insert into staff_lists set ?';
    con.query(sql, req.body, (error, results) => {
      if (error) {
        req.flash('error', '登録できませんでした');
        res.redirect('/staffs/new');
        next();
      } else {
        req.flash('success', '登録できました');
        res.redirect('/staffs/update');
      }
      // console.log(req.body);
      next();
    });
  },
  update: (req, res) => {
    res.render('staffs/update');
  }
};
