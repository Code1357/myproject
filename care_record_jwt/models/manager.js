'use strict';

const con = require('../db/mysql');

module.exports = {

  moon: function sel (options) {
    return function (req, res, next) {
      con.query('select * from staff_lists where employee_id = 777777', req.body.username, (err, result, fields) => {
        if (err) throw err;
        const g = result;
        console.log(g);
        next();
      });
    };
  }
};
