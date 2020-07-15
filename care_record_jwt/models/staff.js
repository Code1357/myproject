'use strict';

const con = require('../db/mysql');

// mysql(DB)での個別処理を記述

module.exports = {

  // sqlを絡めた処理
staffsModel: (req, res) => {
    const name = req.user;
    const rename = (name['name']);
    console.log(rename);
    const selectLoggedId = 'select staff_id, staff_name, employee_id from staff_lists where employee_id = ?';
    con.query(selectLoggedId, rename, (err, result, fields) => {
      if (err) throw err;
      const selectLoggedId = result;
      const string = JSON.parse(JSON.stringify(selectLoggedId));
      const obj = string[0];
      const obj2 = obj.staff_name;
      res.locals.obj2 = obj2;
      res.render('managers/info');
    });
  }
};
