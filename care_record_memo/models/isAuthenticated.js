'use strict';

const httpStatus = require('http-status-codes');

module.exports = {

  checkAuthenticated: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    }
  }
};
