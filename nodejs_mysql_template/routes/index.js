'use strict';

const router = require('express').Router(); // ExpressとRouterをload

// const apiRoutes = require('./apiRoutes');
const userRoutes = require('./userRoutes');
const errorRoutes = require('./errorRoutes');
const homeRoutes = require('./homeRoutes');

// 名前空間
// router.use('/api',apiRoutes); // home,errorより上に記述必要
router.use('/users', userRoutes);
router.use('/', homeRoutes);
router.use('/', errorRoutes);

module.exports = router; // app.jsにloadさせる(全ての経路の入り口)
