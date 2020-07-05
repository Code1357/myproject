/* 'use strict';

validator6.6.0でうまくいかず

const { body, check } = require('express-validator');

module.exports = [
  body('password')
    .trim(), // 左右両側の空白を除去
  check('employee_id', '半角数字,6文字で必ず入力してください')
    .isInt()
    .isLength({
      min: 6,
      max: 6
    })
    .isEmpty(),
  check('hire_data', '必ず入力してください')
    .isEmpty(),
  check('staff_name', '必ず入力してください')
    .isEmpty(),
  check('password', 'パスワードを空にする事はできません')
    .isEmpty(),
  check('birthday', '必ず入力してください')
    .isEmpty(),
  check('genders_gender_id', '1~3の範囲で入力してください')
    .isInt()
    .isLength({
      min: 1,
      max: 1
    })
];

validateError: (validateOption, (req, res, next) => {
  const errors = validationResult(req);
  // チェック項目があった場合
  if (!errors.isEmpty()) {
    console.log('問題あるよ');
  }
  next();
}) */
