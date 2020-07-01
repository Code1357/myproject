'use strict';

/* const knex = require('knex')({
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

// staffRoutesへ個別モジュールとしてexportするオブジェクト
module.exports = {

  // modelより個別処理を受け取り,経路別処理実行を記述
  new: (req, res) => {
    res.render('staffs/new');
  },
  create: (req, res, next) => {
    console.log(req.body);
    const sql = 'insert into staff_lists set ?';
    con.query(sql, req.body, (error, results, fields) => {
      if (error) throw error;
      res.redirect('./');
      next();
    });
  }/* ,
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
};
