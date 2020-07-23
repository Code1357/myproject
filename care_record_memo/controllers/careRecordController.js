'use strict';


const con = require('../db/mysql');
const httpStatus = require('http-status-codes');
const careRecord = require('../models/careRecord'); // ../models/userをload

// managerRoutesへ個別モジュールとしてexportするオブジェクト
module.exports = {

  // modelより個別処理を受け取り,経路別処理実行を記述
  new: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const newUserConfirmation = JSON.parse(JSON.stringify(req.body));
      res.locals.newUserConfirmation = newUserConfirmation;
      res.render('careRecords/new');
    }
  },
  validate: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
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
    }
  },
  newUserConfirmation: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      if (req.body.action2) {
        delete req.body.action2;
        const newUserConfirmation = JSON.parse(JSON.stringify(req.body));
        res.locals.newUserConfirmation = newUserConfirmation;
        res.render('careRecords/new');
      } else {
        delete req.body.action;
        // console.log(req.body);
        const newUserConfirmation = JSON.parse(JSON.stringify(req.body));
        res.locals.newUserConfirmation = newUserConfirmation;
        // console.log(newConfirmation);
        next();
      };
    }
  },
  create: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const sql = 'insert into user_lists set ?';
      con.query(sql, req.body, (error, results) => {
        if (error) {
          req.flash('error', '登録できませんでした,もう一度登録しなおしてください');
          res.redirect('/careRecords/new');
        } else {
          res.render('careRecords/newUserConfirmation');
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
      const userId = req.params.user_id;
      con.query('select * from user_lists where user_id = ?', userId, (err, result, fields) => {
        if (err) throw err;
        res.locals.userId = userId;
        const userUpdate = result;
        res.locals.userUpdate = userUpdate;
        const resultEntranceData = result[0].entrance_data;
        // console.log(resultHireData);
        const entranceData = `${resultEntranceData.getUTCFullYear()}/${resultEntranceData.getUTCMonth() + 1}/${resultEntranceData.getUTCDate()}`;
        res.locals.entranceData = entranceData;
        res.render('careRecords/update');
      });
    }
  },
  usersList: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      con.query('select * from user_lists order by user_name', (err, result, fields) => {
        if (err) throw err;
        const userList = result;
        res.locals.userList = userList;
        res.render('careRecords/usersList');
      });
    }
  },
  update: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const userId = req.params.user_id;
      const name = req.body.user_name;
      const adl = req.body.adls_adl_id;
      con.query('update user_lists set user_name = ?, adls_adl_id = ? where user_id = ?', [name, adl, userId], function (err, result, fields) {
        if (err) throw err;
      });
      con.query('select * from user_lists where user_id = ?', userId, function (err, result, fields) {
        if (err) throw err;
        const resultEntranceData = result[0].entrance_data;
        const entranceData = `${resultEntranceData.getUTCFullYear()}年${resultEntranceData.getUTCMonth() + 1}月${resultEntranceData.getUTCDate()}日`;
        res.locals.entranceData = entranceData;
        if (req.body.action2) {
          delete req.body.action2;
          res.redirect(`/careRecords/updatePage/${userId}`);
        } else {
          res.render('careRecords/updateComplete', { updateDate: result });
        };
      });
    }
  },
  usersGet: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      con.query('select * from user_lists order by user_name', (err, result, fields) => {
        if (err) throw err;
        res.locals.userList = result;
        {
          const userId = req.params.user_id;
          res.locals.userId = userId;
          con.query('select user_name from user_lists where user_id = ?', userId, (err, result, fields) => {
            if (err) throw err;
            // console.log(staffName);
            res.locals.userName = result[0].user_name;
            // console.log(res.locals.staffName);

            con.query('select entrance_data from user_lists where user_id = ?', userId, (err, result, fields) => {
              if (err) throw err;
              const resultEntranceData = result[0].entrance_data;
              // console.log(resultHireData);
              const entranceData = `${resultEntranceData.getUTCFullYear()}年${resultEntranceData.getUTCMonth() + 1}月${resultEntranceData.getUTCDate()}日`;
              res.locals.entranceData = entranceData;

              con.query('select u.user_name, a.adl from user_lists as u join adls as a on u.adls_adl_id = a.adl_id where user_id = ?', userId, (err, result, fields) => {
                if (err) throw err;
                const adl = result[0].adl;
                res.locals.adl = adl;

                con.query('select u.user_name, g.gender from user_lists as u join genders as g on u.genders_gender_id = g.gender_id where user_id = ?', userId, (err, result, fields) => {
                  if (err) throw err;
                  // console.log(result);
                  const gender = result[0].gender;
                  res.locals.gender = gender;
                  res.render('careRecords/userInfo');
                });
              });
            });
          });
        }
      });
    }
  },
  recordPage: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const newRecUserConfirmation = JSON.parse(JSON.stringify(req.body));
      res.locals.newRecUserConfirmation = newRecUserConfirmation;
      con.query('select * from user_lists order by user_name', (err, result, fields) => {
        if (err) throw err;
        res.locals.userList = result;
        {
          const userId = req.params.user_id;
          res.locals.userId = userId;
          con.query('select user_name from user_lists where user_id = ?', userId, (err, result, fields) => {
            if (err) throw err;
            // console.log(staffName);
            res.locals.userName = result[0].user_name;
            // console.log(res.locals.staffName);

            con.query('select u.user_name, a.adl from user_lists as u join adls as a on u.adls_adl_id = a.adl_id where user_id = ?', userId, (err, result, fields) => {
              if (err) throw err;
              const adl = result[0].adl;
              res.locals.adl = adl;

              con.query('select u.user_name, g.gender from user_lists as u join genders as g on u.genders_gender_id = g.gender_id where user_id = ?', userId, (err, result, fields) => {
                if (err) throw err;
                // console.log(result);
                const gender = result[0].gender;
                res.locals.gender = gender;
                res.render('careRecords/userRecord');
              });
            });
          });
        }
      });
    }
  },
  newRecordConfirmation: (req, res, next) => {
    if (req.body.action2) {
      delete req.body.action2;
    } else {
      delete req.body.action;
      next();
    };
  },
  recordValidate: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const userId = req.params.user_id;
      console.log(userId);
      req.check('record_date')
        .isBefore().withMessage('未来の日時は入力できません')
        .not().isEmpty().withMessage('記録虹時は必ず入力してください');
      req.check('record_data')
        .not().isEmpty().withMessage('記録は必ず記入してから登録してください');
      req.getValidationResult().then(error => {
        if (!error.isEmpty()) {
          // console.log(error.isEmpty()); // true or false
          // console.log(error.array());
          const messages = error.array().map(e => e.msg); // error配列オブジェクトを配列に吐き出す
          req.flash('error', messages);
          res.redirect(`/careRecords/recordPage/${userId}`);
          // next('route');
        } else {
          next();
        }
      });
    }
  },
  recordCreate: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const recordDate = req.body.record_date; // 記録日時
      const record = req.body.record_data; // 記録内容
      const staffId = req.user.name; // スタッフID
      const userId = req.params.user_id; // 利用者のID
      // スタッフ名を検索
      console.log(staffId);
      con.query('select staff_name from staff_lists where employee_id = ? ', staffId, (err, result, fields) => {
        if (err) throw err;
        const staffName = result[0].staff_name;
        console.log(staffName);

        const sql = 'insert into care_records set recording_date = ?, care_record = ?, user_lists_user_id = ?, care_records_staff_id = ?, care_records_staff_name = ?';
        con.query(sql, [recordDate, record, userId, staffId, staffName], (error, results) => {
          if (error) {
            req.flash('error', '登録できませんでした,もう一度登録しなおしてください');
            console.log(results);
            res.redirect(`/careRecords/recordPage/${userId}`);
          } else {
            req.flash('success', '記録の登録完了');
            res.redirect(`/careRecords/users/${userId}`);
          }
        });
      });
    }
  },
  searchPage: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      con.query('select * from user_lists order by user_name', (err, result, fields) => {
        if (err) throw err;
        res.locals.userList = result;
        {
          const userId = req.params.user_id;
          res.locals.userId = userId;
          con.query('select user_name from user_lists where user_id = ?', userId, (err, result, fields) => {
            if (err) throw err;
            // console.log(staffName);
            res.locals.userName = result[0].user_name;
            // console.log(res.locals.staffName);

            con.query('select u.user_name, a.adl from user_lists as u join adls as a on u.adls_adl_id = a.adl_id where user_id = ?', userId, (err, result, fields) => {
              if (err) throw err;
              const adl = result[0].adl;
              res.locals.adl = adl;

              con.query('select u.user_name, g.gender from user_lists as u join genders as g on u.genders_gender_id = g.gender_id where user_id = ?', userId, (err, result, fields) => {
                if (err) throw err;
                // console.log(result);
                const gender = result[0].gender;
                res.locals.gender = gender;
                res.render('careRecords/recordSearch');
              });
            });
          });
        }
      });
    }
  },
  search: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      con.query('select * from user_lists order by user_name', (err, result, fields) => {
        if (err) throw err;
        const userList = result;
        res.locals.userList = userList;

        const userId = req.params.user_id;
        res.locals.userId = userId;
        con.query('select user_name from user_lists where user_id = ?', userId, (err, result, fields) => {
          if (err) throw err;
          // console.log(staffName);
          res.locals.userName = result[0].user_name;
          // console.log(res.locals.staffName);

          con.query('select u.user_name, a.adl from user_lists as u join adls as a on u.adls_adl_id = a.adl_id where user_id = ?', userId, (err, result, fields) => {
            if (err) throw err;
            const adl = result[0].adl;
            res.locals.adl = adl;

            con.query('select u.user_name, g.gender from user_lists as u join genders as g on u.genders_gender_id = g.gender_id where user_id = ?', userId, (err, result, fields) => {
              if (err) throw err;
              // console.log(result);
              const gender = result[0].gender;
              res.locals.gender = gender;

              // レコーディングテーブルから検索
              const searchDate = req.query.search_date;
              con.query('select user_lists_user_id, recording_date, care_record, care_records_staff_id, care_records_staff_name from care_records where cast(recording_date as date ) = ? and user_lists_user_id = ?', [searchDate, userId], (err, result, fields) => {
                if (err) throw err;
                console.log(result);
                const pastRecord = result;
                res.locals.pastRecord = pastRecord;

                // ??? 名前の取得ができなくなってる,でも、これ出来たら解決しそう
                /*   const staffId = result.care_records_staff_id;
                  con.query('select s.staff_name, c.care_records_staff_id from staff_lists as s join care_records as c on s.employee_id = c.care_records_staff_id where care_records_staff_id = ? and user_lists_user_id = ? and recording_date = ?', [staffId, userId, searchDate], (err, result, fields) => {
                    if (err) throw err;
                    const oo = result;
                    console.log(oo); */

                /*     const staffId = result.care_records_staff_id;
                               const recDate = result.recording_date;
                               console.log(staffId, userId, recDate);
                               con.query('select s.staff_name, c.care_records_staff_id from staff_lists as s join care_records as c on s.employee_id = c.care_records_staff_id where care_records_staff_id = ? and user_lists_user_id = ? and recording_date = ?', [staffId, userId, recDate], (err, result, fields) => {
                                 if (err) throw err;
                                 const oo = result;
                                 console.log(oo);
                                 res.locals.staff = result[0].staff_name;
                */
                var array = [];
                var count = 0;

                result.forEach(result => {
                  const recDate = result.recording_date;
                  const recordDate = `${recDate.getUTCFullYear()}-${recDate.getUTCMonth() + 1}-${recDate.getUTCDate()}`;
                  const careRecord = result.care_record;
                  const staffId = result.care_records_staff_id;
                  con.query('select s.staff_name, c.care_records_staff_id from staff_lists as s join care_records as c on s.employee_id = c.care_records_staff_id where care_records_staff_id = ? and user_lists_user_id = ? and recording_date = ?', [staffId, userId, recDate], (err, result, fields) => {
                    if (err) throw err;
                    console.log(result);
                    const staff = result[0].staff_name;
                    console.log(staff);
                    console.log(userId);
                    console.log(recDate);

                    array[count] = { staff, recordDate, careRecord };
                    count++;
                    console.log(array);

                    /*  res.render('careRecords/pastRecord'); */
                  });
                });
              });
            });
          });
        });
      });
      /*  }); */
      /* const userId = req.params.user_id;
      const searchDate = req.query.search_date;
      con.query('select user_lists_user_id, recording_date, care_record, care_records_staff_id from care_records where cast(recording_date as date ) = ? and user_lists_user_id = ?', [searchDate, userId], (err, result, fields) => {
        if (err) throw err;
        console.log(result);
        const pastRecord = result; */

      /* result.forEach(result => {
        const recDate = result.recording_date;
        const recordDate = `${recDate.getUTCFullYear()}-${recDate.getUTCMonth()}-${recDate.getUTCDate()}`;
        const careRecord = result.care_record;
        const staffId = result.care_records_staff_id;
        con.query('select s.staff_name, c.care_records_staff_id from staff_lists as s join care_records as c on s.employee_id = c.care_records_staff_id where care_records_staff_id = ? and user_lists_user_id = ? and recording_date = ?', [staffId, userId, recDate], (err, result, fields) => {
          if (err) throw err;
          console.log(result); */
      /* const staff = result[0].staff_name;
      console.log(staff);
      console.log(userId);
      console.log(recDate); */

      // res.locals.a = { staff, careRecord, recordDate };

      // next();
      /* }); */

      /*  }); */
    }/* ,
  pastRecordShow: (req, res, next) => {
    res.render('careRecords/pastRecord');
  } */
  }
};
