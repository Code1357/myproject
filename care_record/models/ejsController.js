'use strict';

module.exports = {

  offTop: function (req, res, next) {
    const top = 'top';
    res.locals.top = top;
    next();
  },
  offLogin: function (req, res, next) {
    const topLogin = 'topLogin';
    res.locals.topLogin = topLogin;
    next();
  }
};
