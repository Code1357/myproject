'use strict';

const con = require('../db/mysql');

module.exports = {

  // sqlを絡めた処理
  moon: (req, res, next) => {
    const selectLoggedId = 'select staff_id, staff_name, employee_id from staff_lists where employee_id = ?'; // 該当row全取得
    con.query(selectLoggedId, req.body.username, (err, result, fields) => {
      if (err) throw err;
      // const selectLoggedId = JSON.stringify(result); // [object Object]から特定の値取得
      const selectLoggedId = result[0];
      // console.log(result);
      console.log(JSON.stringify(selectLoggedId));
      res.locals.selectLoggedId = selectLoggedId;
      // console.log('なんと' + a);
    });
    next();
  }

};
