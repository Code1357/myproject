'use strict';

const con = require('../db/mysql');

// const Staff = require('../models/staff'); // ../models/userをload
const bcrypt = require('bcrypt');
const saltRounds = 10;
// const validateOption = require('../models/validateOption');

// staffRoutesへ個別モジュールとしてexportするオブジェクト
module.exports = {

  // modelより個別処理を受け取り,経路別処理実行を記述
  new: (req, res) => {
    const newConfirmation = JSON.parse(JSON.stringify(req.body));
    res.locals.newConfirmation = newConfirmation;
    res.render('managers/new');
  },
  validate: (req, res, next) => {
    req.check('employee_id')
      .isLength(
        {
          min: 6,
          max: 6
        }).withMessage('社員番号は6文字で入力してください')
      .not().isEmpty().withMessage('社員番号は、必ず入力してください');
    req.check('hire_data')
      .not().isEmpty().withMessage('入社日は、必ず入力してください');
    req.check('staff_name')
      .not().isEmpty().withMessage('社員名は、必ず入力してください');
    req.check('hash')
      .matches(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,15}$/i).withMessage('半角英字を1文字以上、数字を1つ以上含む、8~15文字の間で作成してください')
      .not().isEmpty().withMessage('パスワードは必ず入力してください');
    req.check('birthday')
      .isBefore().withMessage('未来の誕生日は入力できません')
      .not().isEmpty().withMessage('誕生日は、必ず入力してください');
    req.check('genders_gender_id', '性別は1か2の半角数字で入力してください') // プルダウンにする
      .isInt()
      .isLength({
        min: 1,
        max: 1
      });
    req.check('position_lists_position_id', '役職は1〜3の半角数字で入力してください') // プルダウンにする
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
        res.redirect('/managers/new');
        // next('route');
      } else {
        next();
      }
    });
  },
  newConfirmation: (req, res, next) => {
    if (req.body.action2) {
      console.log(req.body);
      delete req.body.action2;
      console.log(req.body);
      const newConfirmation = JSON.parse(JSON.stringify(req.body));
      res.locals.newConfirmation = newConfirmation;
      res.render('managers/new');
    } else if (!req.body.action) {
      delete req.body.action;
      // console.log(req.body);
      const newConfirmation = JSON.parse(JSON.stringify(req.body));
      res.render('managers/new2', { newConfirmation: newConfirmation });
    } else {
      delete req.body.action;
      // console.log(req.body);
      const newConfirmation = JSON.parse(JSON.stringify(req.body));
      res.locals.newConfirmation = newConfirmation;
      console.log(newConfirmation);
      next();
    };
  },
  newConfirmation2: (req, res, next) => {
    const newConfirmation = JSON.parse(JSON.stringify(req.body));
    res.locals.newConfirmation = newConfirmation;
    // console.log(newConfirmation);
    next();
  },
  create: (req, res) => {
    const pass = req.body.hash;
    const hash = bcrypt.hashSync(pass, saltRounds);
    req.body.hash = hash;
    const sql = 'insert into staff_lists set ?';
    con.query(sql, req.body, (error, results) => {
      if (error) {
        req.flash('error', '登録できませんでした,既に登録されている社員IDです');
        res.redirect('/managers/new');
      } else {
        res.render('managers/newConfirmation');
      }
    });
  },
  update: (req, res) => {
    res.render('managers/update');
  },
  staffsList: (req, res) => {
    con.query('select * from staff_lists order by staff_name', (err, result, fields) => {
      if (err) throw err;
      const staffList = result;
      res.locals.staffList = staffList;
      res.render('managers/staffsList');
    });
  },
  staffsGet: (req, res) => {
    con.query('select * from staff_lists order by staff_name', (err, result, fields) => {
      if (err) throw err;
      const staffList = result;
      res.locals.staffList = staffList;
      {
        const staffId = req.params.staff_id;
        con.query('select employee_id from staff_lists where staff_id = ?', staffId, (err, result, fields) => {
          if (err) throw err;
          const staffEmployeeId = result;
          console.log(staffEmployeeId);
          res.locals.staffEmployeeId = staffEmployeeId[0].employee_id;
          console.log(res.locals.staffEmployeeId);

          con.query('select staff_name from staff_lists where staff_id = ?', staffId, (err, result, fields) => {
            if (err) throw err;
            const staffName = result;
            console.log(staffName);
            res.locals.staffName = staffName[0].staff_name;
            console.log(res.locals.staffName);

            con.query('select birthday from staff_lists where staff_id = ?', staffId, (err, result, fields) => {
              if (err) throw err;
              const birthday = result;
              console.log(birthday);
              const str = birthday[0].birthday;
              console.log(str);
              res.locals.birthday = birthday;

              con.query('select genders_gender_id from staff_lists where staff_id = ?', staffId, (err, result, fields) => {
                if (err) throw err;
                const gender = result;
                console.log(gender);
                res.locals.gender = gender;
                // 誕生日(日付変換)のselect文を記述
                // 外部キーでの性別取得のselect文作成
                res.render('managers/staffInfo');
              });
            });
          });
        });
      }
    });
  }
};
/* const str = 'ssshoko1211';
const regex = RegExp(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,15}$/i);
console.log(regex.test(str)); */
// 半角英字と半角数字それぞれ1文字以上含む8文字以上100文字以下の文字列,/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,15}$/i
