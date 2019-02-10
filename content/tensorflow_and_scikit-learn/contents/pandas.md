---
title: "Pandas"
date: 2019-02-10T01:09:39+09:00
draft: false
---

# 概要
pandasに関して調べたものはこちらに集約していく。

# 詳細
## メソッド
使用した箇所のみ記載する。
全部記載はできないので、他の使い方など詳細は情報元のlinkを参照。
### pandas.DataFrame.plot
dataframeを図示するメソッド

#### 引数
- kind: 図示する形式(散布図なのか折れ線図7日)などを指定する
  - "scatter" の場合は散布図
  - etc..
- x: x軸のラベルを指定。デフォルトはNone
- y: y軸のラベルを指定。デフォルトはNone
- alpha: 密度が高いところを見やすくする。
  - (ここだけmatplotlibの引数なのかな？)
- c: ドキュメントに見当たらない、、
- label: ドキュメントに見当たらない、、
- cmap: ドキュメントに見当たらない、、
- figsize: ドキュメントに見当たらない、、
- colorbar: カラーバーの表示

#### 情報元
- [pandas.DataFrame.plot — pandas 0.24.1 documentation](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.plot.html)
- [axes — Matplotlib 3.0.2 documentation](https://matplotlib.org/api/axes_api.html#matplotlib.axes.Axes)

### pandas.DataFrame.corr
列同士の相関を計算する。計算をする際にNAやnullは考慮されない

#### 情報元
- [pandas.DataFrame.corr — pandas 0.24.1 documentation](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.corr.html#pandas.DataFrame.corr)

### pandas.plotting.scatter_matrix
各データ同士の散布図を作成する

#### 引数
- 第1引数: データフレーム
- figsize: tupleで図の大きさを指定する

#### 情報元
- [pandas.plotting.scatter_matrix — pandas 0.24.1 documentation](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.plotting.scatter_matrix.html)
