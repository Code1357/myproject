'use strict';

const router = require('express').Router();
const managerController = require('../controllers/managerController');
const careRecordController = require('../controllers/careRecordController');

// リクエストをパスを受付、処理実行を記述
router.get('/new', careRecordController.new);
router.post('/create', careRecordController.validate, careRecordController.newUserConfirmation, careRecordController.create);
router.get('/usersList', careRecordController.usersList);
router.get('/users/:user_id', careRecordController.usersGet);
router.get('/updatePage/:user_id', careRecordController.updatePage);
router.post('/update/:user_id', careRecordController.update);
router.get('/recordPage/:user_id', careRecordController.recordPage);
router.post('/recordCreate/:user_id', careRecordController.newRecordConfirmation, careRecordController.recordCreate);
router.get('/searchPage/:user_id', careRecordController.searchPage);
router.get('/recordSearch/:user_id', careRecordController.search);

module.exports = router; // routes/index.jsにloadさせる
