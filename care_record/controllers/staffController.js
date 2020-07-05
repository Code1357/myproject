'use strict';

const con = require('../db/mysql');

const Staff = require('../models/staff'); // ../models/userをload
const validator = require('express-validator');

const bcrypt = require('bcrypt');
const { body, check, validationResult } = require('express-validator');
const saltRounds = 10;

// staffRoutesへ個別モジュールとしてexportするオブジェクト
module.exports = {

  // modelより個別処理を受け取り,経路別処理実行を記述
  new: (req, res) => {
    res.render('staffs/new');
  },
  validate: [
    check('hash', '5文字でお願いするのですよ').isLength({
      min: 5,
      max: 5
    })],
    (req, res, next) => {
      const result = validationResult(req);
      // チェック項目があった場合
      if(!result.isEmpty()) {
        console.log('問題あるよ');
      } 
    }
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
