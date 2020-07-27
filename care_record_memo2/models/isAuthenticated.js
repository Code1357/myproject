/* 'use strict';

const httpStatus = require('http-status-codes');

class Read {
  read() {
    console.log('これはエクスポート/インポートできる');
  };
};

class Read2 {
  read2() {
    console.log('これでもできる');
  };
};

class checkIsAuthenticated {
  function(req, res) {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    }
  };
};

module.exports = (Read, Read2, checkIsAuthenticated);

(req, res) => {
  const read = new Read();
  read.read2();
 */
