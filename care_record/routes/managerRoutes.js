'use strict';

const router = require('express').Router();
const managerController = require('../controllers/managerController');

// リクエストをパスを受付、処理実行を記述
router.get('/login', managerController.login);
router.post('/login', managerController.authenticate);

module.exports = router; // routes/index.jsにloadさせる
