'use strict';

// userRoutesへ個別モジュールとしてexportするオブジェクト

module.exports = {

  // 基本的なホーム画面を表示させる為の,経路別処理実行を記述
  index: (req, res) => {
    res.render('index', { title: 'おはよう', me: 'ございます' });
  }
};
