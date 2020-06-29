'use strict';

const router = require('express').Router(); // ExpressとRouterをload

// const apiRoutes = require('./apiRoutes');
const managerRoutes = require('./managerRoutes');
const staffRoutes = require('./staffRoutes');
const careRecordRoutes = require('./careRecordRoutes');
const errorRoutes = require('./errorRoutes');
const homeRoutes = require('./homeRoutes');

// 名前空間
// router.use('/api',apiRoutes); // home,errorより上に記述必要
router.use('/managers', managerRoutes);
router.use('/staffs', staffRoutes);
router.use('/careRecords', careRecordRoutes);
router.use('/', homeRoutes);
router.use('/', errorRoutes);

module.exports = router; // app.jsにloadさせる(全ての経路の入り口)
