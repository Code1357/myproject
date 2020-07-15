'use strict';

// mysqlをモジュール化
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'choko7', // mysqlで設定しているrootに対してのPassword
  database: 'care_record' // DB名を記述
});

module.exports = connection;
