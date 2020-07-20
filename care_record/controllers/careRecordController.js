'use strict';

const con = require('../db/mysql');
const careRecord = require('../models/careRecord'); // ../models/userをload

// managerRoutesへ個別モジュールとしてexportするオブジェクト
module.exports = {

  // modelより個別処理を受け取り,経路別処理実行を記述
  new: (req, res) => {
    const newUserConfirmation = JSON.parse(JSON.stringify(req.body));
    res.locals.newUserConfirmation = newUserConfirmation;
    res.render('careRecords/new');
  },
  validate: (req, res, next) => {
    req.check('entrance_data')
      .not().isEmpty().withMessage('入所日は、必ず入力してください');
    req.check('user_name')
      .not().isEmpty().withMessage('利用者名は、必ず入力してください');
    req.check('genders_gender_id', '性別は1か2の半角数字で入力してください')
      .isInt()
      .isLength({
        min: 1,
        max: 1
      });
    req.check('adls_adl_id', 'ADLは1〜3の半角数字で入力してください')
      .isInt()
      .isLength({
        min: 1,
        max: 1
      });
    req.getValidationResult().then(error => {
      if (!error.isEmpty()) {
        // console.log(error.isEmpty()); // true or false
        // console.log(error.array());
        const messages = error.array().map(e => e.msg); // error配列オブジェクトを配列に吐き出す
        req.flash('error', messages);
        res.redirect('/careRecords/new');
        // next('route');
      } else {
        next();
      }
    });
  },
  newUserConfirmation: (req, res, next) => {
    if (req.body.action2) {
      delete req.body.action2;
      const newUserConfirmation = JSON.parse(JSON.stringify(req.body));
      res.locals.newUserConfirmation = newUserConfirmation;
      res.render('reRecords/new');
    } else {  // 登録戻るどるできなーい！！！
      delete req.body.action;
      // console.log(req.body);
      const newUserConfirmation = JSON.parse(JSON.stringify(req.body));
      res.locals.newUserConfirmation = newUserConfirmation;
      // console.log(newConfirmation);
      next();
    };
  },
  create: (req, res) => {
    const sql = 'insert into user_list set ?';
    con.query(sql, req.body, (error, results) => {
      if (error) {
        req.flash('error', '登録できませんでした,もう一度登録しなおしてください');
        res.redirect('/careRecords/new');
      } else {
        res.render('careRecords/newUserConfirmation');
      }
    });
  }

};
