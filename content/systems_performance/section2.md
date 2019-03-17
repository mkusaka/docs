---
title: "Section2"
date: 2019-02-16T17:54:22+09:00
draft: false
---

# 目次
<!-- START doctoc -->
<!-- END doctoc -->

キャッシュ率とパフォーマンスのグラフが非線形の証明メモ

```js
T1 // ex) 2s // non cache tier の応答時間
T2 // ex) 1s // cache tier の応答時間

latency = (1-a) * T1 + a * T2 // (0 <= a <= 1)  // aはキャッシュヒット率
        = T1 + (T2 - T1) * a

/* このあたりは関係なかった。。。。
miss
- cacheを見る: 0
- cache元を作る: T1
- cacheをstoreする: T2

hit
- cacheを見る: 0
- cacheをreadする: T2
*/

W // <- システムを通して返されるデータ量

TROUGHPUT   = W / ((1-a) * (T1 + T2) + a(T2)) // (0 <= a <= 1)
            = W / (a * (T2 - T1) + T1)  // これは非線形
d(TROUGHPUT)/da   = - (T2 - T1) * W/ (a * (T2 - T1) + T1)^2 // aに関する微分
            = (T1 - T2)  * W/ (a * (T2 - T1) + T1)^2 // (T1 - T2) > 0
```
