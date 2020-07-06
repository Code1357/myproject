'use strict';

const con = require('../db/mysql');

const Staff = require('../models/staff'); // ../models/userをload
const bcrypt = require('bcrypt');
const saltRounds = 10;
// const validateOption = require('../models/validateOption');

// staffRoutesへ個別モジュールとしてexportするオブジェクト
module.exports = {

  // modelより個別処理を受け取り,経路別処理実行を記述
  new: (req, res) => {
    res.render('staffs/new');
  },
  validate: (req, res, next) => {
    req.check('employee_id', '半角数字,6文字で必ず入力してください')
      .isInt()
      .isLength({
        min: 5,
        max: 6
      })
      .isEmpty();
    req.check('hire_data', '必ず入力してください')
      .isEmpty();
    req.check('staff_name', '必ず入力してください')
      .isEmpty();
    req.check('password', 'パスワードを空にする事はできません')
      .isEmpty();
    req.check('birthday', '必ず入力してください')
      .isEmpty();
    req.check('genders_gender_id', '1~3の範囲で入力してください')
      .isInt()
      .isLength({
        min: 1,
        max: 1
      });
    req.getValidationResult().then(error => {
      if (!error.isEmpty()) {
        // console.log(error.isEmpty()); // true or false
        // console.log(error.array()); // error結果のオブジェクト,オブジェクト,([{location: 'body',param: 'employee_id',msg: '半角数字,6文字で必ず入力してください'value: '537724737537'},......])
        // console.log(error.mapped()); // error結果オブジェクト,オブジェクト,({{location: 'body',param: 'employee_id',msg: '半角数字,6文字で必ず入力してください'value: '537724737537'},......})
        // console.log(error.formatWith()); // error全体の関数オブジェクト{isEmpty: [Function],array: [Function],mapped: [Function],formatWith: [Function],throw: [Function]}
        // console.log(error.throw()); // errorを起こした時のerrorそのものの内容
        // req.flash('error', messages);
        // res.redirect('/');
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
