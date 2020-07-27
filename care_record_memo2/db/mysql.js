'use strict';

/** mysqlをモジュール化 */
const mysql = require('mysql2');

/** mysql接続情報 */ // 課題：情報を隠す
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'choko7',
  database: 'care_record'
});

module.exports = connection;
