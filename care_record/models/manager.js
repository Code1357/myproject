'use strict';

// モジュールloadでうまくいかず
const mysql = require('mysql');
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'choko7',
  database: 'care_record'
});

// mysql(DB)での個別処理を記述
module.exports = {

  // sqlを絡めた処理
  selectPass:
  con.query('select employee_id, hash from staff_lists', function (err, users) {
    if (err) throw err;
  })
};
