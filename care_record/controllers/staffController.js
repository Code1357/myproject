'use strict';

const con = require('../db/mysql');

/* 捨てコード // const mysql = require('mysql');
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'choko7', // mysqlで設定しているrootに対してのPassword
  database: 'care_record' // DB名を記述
}); */

const Staff = require('../models/staff'); // ../models/userをload

const bcrypt = require('bcrypt');
const saltRounds = 10;

// staffRoutesへ個別モジュールとしてexportするオブジェクト
module.exports = {

  // modelより個別処理を受け取り,経路別処理実行を記述
  new: (req, res) => {
    res.render('staffs/new');
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
