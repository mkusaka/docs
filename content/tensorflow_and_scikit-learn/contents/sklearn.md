---
title: "Sklearn"
date: 2019-02-10T14:14:38+09:00
draft: false
---

# 目次
<!-- START doctoc -->
<!-- END doctoc -->

# 概要
sklearnに関して調べたものはこちらに集約していく。

# 詳細
## クラス
### sklearn.preprocessing.Imputer
欠損値の補完を行う。

#### 引数
- strategy: str
  - median: axisに依存した欠損値の中央値で代替する
  - 実際に計算する際はテキスト属性などを削除したdataframeを渡すぽい

#### インスタンスメソッド
- fit:
  - 引数に訓練データを渡してインスタンスを適合させられる

※このクラス自体はSimpleImputerに変わるらしいとdeprecation warningが出ていた。

```
/usr/local/lib/python3.6/dist-packages/sklearn/utils/deprecation.py:58: DeprecationWarning: Class Imputer is deprecated; Imputer was deprecated in version 0.20 and will be removed in 0.22. Import impute.SimpleImputer from sklearn instead.
```

### 情報元
[sklearn.preprocessing.Imputer — scikit-learn 0.17 文档](http://lijiancheng0614.github.io/scikit-learn/modules/generated/sklearn.preprocessing.Imputer.html)
