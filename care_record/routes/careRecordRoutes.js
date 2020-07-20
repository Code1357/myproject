'use strict';

const router = require('express').Router();
const managerController = require('../controllers/managerController');
const careRecordController = require('../controllers/careRecordController');

// リクエストをパスを受付、処理実行を記述
router.get('/new', careRecordController.new);
router.post('/create1', careRecordController.validate, careRecordController.newUserConfirmation, careRecordController.create);
/* router.post('/create2', careRecordController.validate, careRecordController.newUserConfirmation2, careRecordController.create); */
// router.get('/userList', staffController.staffsList);


module.exports = router; // routes/index.jsにloadさせる
