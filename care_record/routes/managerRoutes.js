'use strict';

const router = require('express').Router();
const managerController = require('../controllers/managerController');
const manager = require('../models/manager');

// リクエストをパスを受付、処理実行を記述
router.get('/login', managerController.login);
router.post('/login', manager.moon, managerController.authenticate);
router.get('/logout', managerController.logout);
router.get('/info', managerController.info);

module.exports = router; // routes/index.jsにloadさせる
