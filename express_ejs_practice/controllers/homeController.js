'use strict';

// 経路コントローラ
exports.topPage = (req, res) => {
    res.sendFile('./views/top.html', { root: './' });
};

exports.index = (req, res) => {
    res.render('index');
};

exports.personalInfoPage = (req, res) => {
    res.render('personalinfo');
};

exports.careRecord = (req, res) => {
    res.render('carerecord'); // 未
}

exports.contactUs = (req, res) => {
    res.render('contactus'); // 未
}