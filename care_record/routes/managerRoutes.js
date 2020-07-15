'use strict';

const router = require('express').Router();
const managerController = require('../controllers/managerController');
const ejsValue = require('../models/ejsController');

// リクエストをパスを受付、処理実行を記述
router.get('/login', ejsValue.offLogin, managerController.login);
router.post('/login', managerController.authenticate);
router.get('/logout', managerController.logout);
router.get('/info', managerController.info);

module.exports = router; // routes/index.jsにloadさせる
