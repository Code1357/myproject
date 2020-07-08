'use strict';

const router = require('express').Router();
const staffController = require('../controllers/staffController');

// リクエストをパスを受付、処理実行を記述
router.get('/new', staffController.new);
router.post('/create1', staffController.validate, staffController.newConfirmation);
router.post('/create2', staffController.validate, staffController.newConfirmation2, staffController.create);
router.get('/update', staffController.update);

module.exports = router; // routes/index.jsにloadさせる
