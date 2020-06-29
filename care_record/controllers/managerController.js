'use strict';

const Manager = require('../models/manager'); // ../models/userをload
const passport = require('passport');
// managerRoutesへ個別モジュールとしてexportするオブジェクト
module.exports = {

  // modelより個別処理を受け取り,経路別処理実行を記述
  login: (req, res) => {
    res.render('managers/login');
  },
  authenticate: passport.authenticate('local',
    {
      successRedirect: '/',
      failureRedirect: '/login'
    })
};
