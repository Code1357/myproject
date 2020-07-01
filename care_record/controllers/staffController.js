'use strict';

/* 捨てコード
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'choko7',
    database: 'care_record'
  }
});
const bookshelf = require('bookshelf')(knex);
const MyDate = bookshelf.model('MyDate', {
  tableName: 'staff_lists'
}); */
const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'choko7', // mysqlで設定しているrootに対してのPassword
  database: 'care_record' // DB名を記述
});
const Staff = require('../models/staff'); // ../models/userをload

const bcrypt = require('bcrypt');
const saltRounds = 10;

/* const hashde = (req, res) => {
  const sql = 'insert into staff_lists set ?';
  const pass = req.body.hash;
  const userDate = (
    req.body.employee_id,
    req.body.hire_data,
    req.body.staff_name,
    req.body.birthday,
    req.body.genders_gender_id,
    req.body.position_lists_position_id
  );
  const hash = bcrypt.hashSync(pass, saltRounds);
  con.query(sql, userDate, hash, (error, results) => {
    if (error) {
      req.flash('error', '登録できませんでした');
      res.redirect('/staffs/new');
      next();
    } else {
      req.flash('success', '登録できました');
      res.redirect('/staffs/update');
    }
    console.log(req.body.hash);
    next();
  });
}; */

// staffRoutesへ個別モジュールとしてexportするオブジェクト
module.exports = {

  // modelより個別処理を受け取り,経路別処理実行を記述
  new: (req, res) => {
    res.render('staffs/new');
  },
  create: (req, res, next) => {
    const sss = 'insert into staff_lists set ?';
    con.query(sss, req.body, (error, results) => {
      const pass = req.body.hash;
      const hash = bcrypt.hashSync(pass, saltRounds);
      const sql = 'INSERT INTO staff_lists(hash) VALUES(?)';
      con.query(sql, [hash], (err, result) => {
        if (error) {
          req.flash('error', '登録できませんでした');
          res.redirect('/staffs/new');
          next();
        } else {
          req.flash('success', '登録できました');
          res.redirect('/staffs/update');
        }
        next();
      });
    });
  },
  /* con.query(sql, req.body, (error, results) => {
    if (error) {
      req.flash('error', '登録できませんでした');
      res.redirect('/staffs/new');
      next();
    } else {
      req.flash('success', '登録できました');
      res.redirect('/staffs/update');
    }
    console.log(req.body.hash);
    next();
  }); */
  update: (req, res) => {
    res.render('staffs/update');
  }
};

/* 捨てコード
  create: (req, res, next) => {
    console.log(req.body);
    new MyDate(req.body).save().then((model) => {
      res.render('staffs/edit');
      next();
    });
  },
  edit: (req, res) => {
    res.render('staffs/edit');
  } */
