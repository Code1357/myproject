'use strict';

// 基本情報の登録するためのスキーマ
const mongoose = require('mongoose');
const personalinfo = new mongoose.Schema({
  name: {
    first: {
      type: String,
      trim: true
    },
    last: {
      trim: true
    }
  },
  
})