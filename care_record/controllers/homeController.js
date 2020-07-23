'use strict';

module.exports = {

  index: (req, res) => {
    res.render('index', { title: '今日もおつかれさまです', sub: '肩の力を抜いていきましょう' });
  },
  offTop: function (req, res, next) {
    const top = 'top';
    res.locals.top = top;
    next();
  }

};
