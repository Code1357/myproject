'use strict';

// 経路コントローラ
exports.topPage = (req, res) => {
    res.sendFile('./public/top.html', {root: './'});
};

exports.fixedPage = (req, res) => {
    res.render('index');
};

exports.personalInfoPage = (req, res) => {
    res.render('personalinfo');
};