'use strict';

module.exports = {

  index: (req, res) => {
    res.render('index', { title: 'おはよう', me: 'ございます' });
  },
  offTop: function (req, res, next) {
    const top = 'top';
    res.locals.top = top;
    next();
  }

};
