'use strict';

const con = require('../db/mysql');
const httpStatus = require('http-status-codes');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// staffRoutesへ個別モジュールとしてexportするオブジェクト
module.exports = {

  new: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const newConfirmation = JSON.parse(JSON.stringify(req.body));
      res.locals.newConfirmation = newConfirmation;
      res.render('managers/new');
    }
  },
  validate: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
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
    }
  },
  newConfirmation: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      if (req.body.action2) {
        // console.log(req.body);
        delete req.body.action2;
        // console.log(req.body);
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
        // console.log(newConfirmation);
        next();
      };
    }
  },
  newConfirmation2: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const newConfirmation = JSON.parse(JSON.stringify(req.body));
      res.locals.newConfirmation = newConfirmation;
      // console.log(newConfirmation);
      next();
    }
  },
  create: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
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
    }
  },
  updatePage: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const staffId = req.params.staff_id;
      con.query('select * from staff_lists where staff_id = ?', staffId, (err, result, fields) => {
        if (err) throw err;
        res.locals.staffId = staffId;
        const staffUpdate = result;
        res.locals.staffUpdate = staffUpdate;
        const resultHireData = result[0].hire_data;
        // console.log(resultHireData);
        const hireData = `${resultHireData.getUTCFullYear()}/${resultHireData.getUTCMonth() + 1}/${resultHireData.getUTCDate()}`;
        res.locals.hireData = hireData;
        const birthdayData = result[0].birthday;
        const birthday = `${birthdayData.getUTCFullYear()}/${birthdayData.getUTCMonth() + 1}/${birthdayData.getUTCDate()}`;
        res.locals.birthday = birthday;
        res.render('managers/update');
      });
    }
  },
  update: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const staffId = req.params.staff_id;
      const name = req.body.staff_name;
      const position = req.body.position_lists_position_id;
      con.query('update staff_lists set staff_name = ?, position_lists_position_id = ? where staff_id = ?', [name, position, staffId], function (err, result, fields) {
        if (err) throw err;
      });
      con.query('select * from staff_lists where staff_id = ?', staffId, function (err, result, fields) {
        if (err) throw err;
        const resultHireData = result[0].hire_data;
        const hireData = `${resultHireData.getUTCFullYear()}年${resultHireData.getUTCMonth() + 1}月${resultHireData.getUTCDate()}日`;
        res.locals.hireData = hireData;
        const birthdayData = result[0].birthday;
        const birthday = `${birthdayData.getUTCFullYear()}年${birthdayData.getUTCMonth() + 1}月${birthdayData.getUTCDate()}日`;
        res.locals.birthday = birthday;
        if (req.body.action2) {
          delete req.body.action2;
          res.redirect(`/managers/updatePage/${staffId}`);
        } else {
          res.render('managers/updateComplete', { updateDate: result });
        };
      });
    }
  },
  staffsList: (req, res, next) => {
    /* if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
      next();
    }; */
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
      next();
    } else {
      con.query('select * from staff_lists order by staff_name', (err, result, fields) => {
        if (err) throw err;
        const staffList = result;
        res.locals.staffList = staffList;
        res.render('managers/staffsList');
      }
      );
    }
  },
  staffsGet: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      con.query('select * from staff_lists order by staff_name', (err, result, fields) => {
        if (err) throw err;
        const staffList = result;
        res.locals.staffList = staffList;
        {
          const staffId = req.params.staff_id;
          con.query('select employee_id from staff_lists where staff_id = ?', staffId, (err, result, fields) => {
            if (err) throw err;
            const staffEmployeeId = result;
            // console.log(staffEmployeeId);
            res.locals.staffEmployeeId = staffEmployeeId[0].employee_id;
            res.locals.staffId = staffId;

            con.query('select staff_name from staff_lists where staff_id = ?', staffId, (err, result, fields) => {
              if (err) throw err;
              const staffName = result;
              // console.log(staffName);
              res.locals.staffName = staffName[0].staff_name;
              // console.log(res.locals.staffName);

              con.query('select hire_data from staff_lists where staff_id = ?', staffId, (err, result, fields) => {
                if (err) throw err;
                const resultHireData = result[0].hire_data;
                // console.log(resultHireData);
                const hireData = `${resultHireData.getUTCFullYear()}年${resultHireData.getUTCMonth() + 1}月${resultHireData.getUTCDate()}日`;
                res.locals.hireData = hireData;

                con.query('select birthday from staff_lists where staff_id = ?', staffId, (err, result, fields) => {
                  if (err) throw err;
                  const birthdayData = result[0].birthday;
                  const birthday = `${birthdayData.getUTCFullYear()}年${birthdayData.getUTCMonth() + 1}月${birthdayData.getUTCDate()}日`;
                  res.locals.birthday = birthday;

                  con.query('select s.staff_name, p.position from staff_lists as s join position_lists as p on s.position_lists_position_id = p.position_id where staff_id = ?', staffId, (err, result, fields) => {
                    if (err) throw err;
                    const position = result[0].position;
                    res.locals.position = position;

                    con.query('select s.staff_name, g.gender from staff_lists as s join genders as g on s.genders_gender_id = g.gender_id where staff_id = ?', staffId, (err, result, fields) => {
                      if (err) throw err;
                      // console.log(result);
                      const gender = result[0].gender;
                      res.locals.gender = gender;
                      res.render('managers/staffInfo');
                      // この特定のエラーは、同じ要求に対して複数の応答を送信しようとするたびに発生し、通常は不適切な非同期コードが原因です。
                      // https://stackoverflow.com/questions/52122272/err-http-headers-sent-cannot-set-headers-after-they-are-sent-to-the-client
                    });
                  });
                });
              });
            });
          });
        }
      });
    }
  }
};

/* const str = 'ssshoko1211';
const regex = RegExp(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,15}$/i);
console.log(regex.test(str)); */
// 半角英字と半角数字それぞれ1文字以上含む8文字以上100文字以下の文字列,/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,15}$/i
