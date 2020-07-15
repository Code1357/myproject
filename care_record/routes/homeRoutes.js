'user strict';

const router = require('express').Router();
const homeController = require('../controllers/homeController');
const ejsValue = require('../models/ejsController');

// リクエストをパスを受付、処理実行を記述
router.get('/', ejsValue.offTop, homeController.index);

module.exports = router; // routes/index.jsにloadさせる
