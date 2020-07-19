'use strict';

module.exports = {

  offTop: function (req, res, next) {
    const top = 'top';
    res.locals.top = top;
    next();
  }
};
