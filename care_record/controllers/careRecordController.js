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
      res.render('careRecords/new');
    } else {
      delete req.body.action;
      // console.log(req.body);
      const newUserConfirmation = JSON.parse(JSON.stringify(req.body));
      res.locals.newUserConfirmation = newUserConfirmation;
      // console.log(newConfirmation);
      next();
    };
  },
  create: (req, res) => {
    const sql = 'insert into user_lists set ?';
    con.query(sql, req.body, (error, results) => {
      if (error) {
        req.flash('error', '登録できませんでした,もう一度登録しなおしてください');
        res.redirect('/careRecords/new');
      } else {
        res.render('careRecords/newUserConfirmation');
      }
    });
  },
  updatePage: (req, res, next) => {
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
  },
  usersList: (req, res) => {
    con.query('select * from user_lists order by user_name', (err, result, fields) => {
      if (err) throw err;
      const userList = result;
      res.locals.userList = userList;
      res.render('careRecords/usersList');
    });
  },
  update: (req, res) => {
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
  },
  usersGet: (req, res) => {
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
  },
  recordPage: (req, res) => {
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
  },
  newRecordConfirmation: (req, res, next) => {
    if (req.body.action2) {
      delete req.body.action2;
    } else {
      delete req.body.action;
      next();
    };
  },
  recordCreate: (req, res) => {
    const recordDate = req.body.record_date; // 記録日時
    const record = req.body.record_data; // 記録内容
    const staffId = req.user.name; // スタッフID
    const userId = req.params.user_id; // 利用者のID
    const sql = 'insert into care_records set recording_date = ?, care_record = ?, user_lists_user_id = ?, care_records_staff_id = ?';
    con.query(sql, [recordDate, record, userId, staffId], (error, results) => {
      if (error) {
        req.flash('error', '登録できませんでした,もう一度登録しなおしてください');
        console.log(results);
        res.redirect(`/careRecords/recordPage/${userId}`);
      } else {
        req.flash('success', '記録の登録完了');
        res.redirect(`/careRecords/users/${userId}`);
      }
    });
  },
  searchPage: (req, res) => {
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
  },
  search: (req, res) => {
    const userId = req.params.user_id;
    const searchDate = req.query.search_date;
    console.log(req.query.search_date);
    con.query('select user_lists_user_id, recording_date, care_record, care_records_staff_id from care_records where cast(recording_date as date ) = ? and user_lists_user_id = ?', [searchDate, userId], (err, result, fields) => {
      if (err) throw err;
      res.locals.pastRecord = result;
      console.log(result);
      res.render('careRecords/pathRecord');
      result.forEach(result => {
        const a = result.recording_date;
        const b = result.care_records_staff_id.toString();
        const c = [a, b];
        console.log(c);

        // or
        console.log([result.care_records_staff_id.toString(), result.recording_date]);　//　でやってみる

      });
      
    

     /*  const recordingDate = `${resultEntranceData.getUTCFullYear()}年${resultEntranceData.getUTCMonth() + 1}月${resultEntranceData.getUTCDate()}日`;
            res.locals.entranceData = entranceData; */


// joinする
      /* con.query('select u.user_name, g.gender from user_lists as u join genders as g on u.genders_gender_id = g.gender_id where user_id = ?', userId, (err, result, fields) => {
        if (err) throw err; */

    });
  }
};


/*
[
  TextRow {
    user_lists_user_id: 1,                     // 利用者氏名は、user_id活用にて別sqlでレンダリング
    recording_date: 2020-07-20T21:21:00.000Z,  // 
    care_record: 'おはようございます。',          // 
    care_records_staff_id: 777777              // 連想配列から抽出し、joinで記録者名を取得
  },
  TextRow {
    user_lists_user_id: 1,
    recording_date: 2020-07-21T02:26:00.000Z,
    care_record: 'こんにちわ。',
    care_records_staff_id: 777777
  },
  TextRow {
    user_lists_user_id: 1,
    recording_date: 2020-07-21T10:21:00.000Z,
    care_record: 'こんばんわ。',
    care_records_staff_id: 777777
  }
]
*/