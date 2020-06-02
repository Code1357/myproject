'use strict';

// 経路のコントロール
exports.fixedPage = (req, res) => {
    res.render('index');
};

exports.personalInfoPage = (req, res) => {
    res.render('personalinfo');
};