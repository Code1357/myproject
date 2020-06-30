'use strict';

// モジュールloadでうまくいかず
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
});

const bcrypt = require('bcrypt');

module.exports = {

  // sqlを絡めた処理
/*   bcrypt.hash(password, 10) function (err, hash) {
    new MyDate(req. body).save().then((model) => {

    })
  }) */
};
