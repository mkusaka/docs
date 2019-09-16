# 目次
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [これなに](#%E3%81%93%E3%82%8C%E3%81%AA%E3%81%AB)
- [背景・前提](#%E8%83%8C%E6%99%AF%E3%83%BB%E5%89%8D%E6%8F%90)
- [課題](#%E8%AA%B2%E9%A1%8C)
- [方法](#%E6%96%B9%E6%B3%95)
  - [必要そうなスキルを取得する](#%E5%BF%85%E8%A6%81%E3%81%9D%E3%81%86%E3%81%AA%E3%82%B9%E3%82%AD%E3%83%AB%E3%82%92%E5%8F%96%E5%BE%97%E3%81%99%E3%82%8B)
  - [取得したスキルをアウトプットする](#%E5%8F%96%E5%BE%97%E3%81%97%E3%81%9F%E3%82%B9%E3%82%AD%E3%83%AB%E3%82%92%E3%82%A2%E3%82%A6%E3%83%88%E3%83%97%E3%83%83%E3%83%88%E3%81%99%E3%82%8B)
- [結論](#%E7%B5%90%E8%AB%96)
- [参考](#%E5%8F%82%E8%80%83)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# これなに

機械学習系の勉強を進める際の指針を作り、今後の学習をスムーズに遂行させるためのドキュメント

- 現状のちょっと前が見えない状態を脱する
  - 現状の整理、次にやることの指標及びそれに至るマイルストーンをはっきり敷くことで、進む先を見失わない状態を作る

# 背景・前提

- 現状機械学習系の情報は、ざっくり勉強を完了しており、そのうえで実装を実施するという段階にある。
  - ざっくり勉強したものは [O'Reilly Japan - ゼロから作る Deep Learning](https://www.oreilly.co.jp/books/9784873117584/) 。
  - まあ大体わかるようになった状態
- 次にスクラッチではなく、フレームワークを使用した学習を行う計画を立てている
- ゴールとして、目的の分野の論文読んで実装できる、機械学習ユーザとしての自立のようなものをふわっと考えている
  - [機械学習システム開発や統計分析を仕事にしたい人にオススメの書籍初級 5 冊＆中級 10 冊＋テーマ別 9 冊（2019 年 1 月版） - 六本木で働くデータサイエンティストのブログ](https://tjo.hatenablog.com/entry/2019/01/10/190000) でいう機械学習エンジニアあたりかな

# 課題

- 現状ざっくりとは目標があるが、どこをどう目指すべきかが不明
  - 故に何をするかが手探り状態
- フレームワークを使用した学習を行っているが、それぞれがバラバラに実行しており、暗中模索感がすごい

# 方法

_巨人の肩に乗る_

メンターがいればよいが、メンターがいないのでモデルケース等々を参考にする

基本的には input→output の流れを細かく作らないと死にそう

## 必要そうなスキルを取得する

必須そうなもののみに絞って学習だけはしておく感じが良さそう

- 統計
  - どちらかというとデータサイエンティスト向けだが、そもそも機械学習系の本でも統計は必須そう
  - PRML とかベイズの本らしいけど、そもそもそれ知らんと。。みたいな部分ある
  - [japan-medical-ai/medical-ai-course-materials](https://github.com/japan-medical-ai/medical-ai-course-materials) あたりも最初統計なんだよなぁ、、、
- 線形代数
  - 機械学習(というかディープラーニングで)最低限必要になる数学の知識は線形代数と思われる(ゼロから始めるでも多用してたし)
  - とはいえ線形空間周りの諸々を理解する必要はなさそう
- 機械学習に関する基礎(?)知識
  - ある程度統計も含めた方法論などを知っていれば良さそう
  - ディープラーニング系の基礎の基礎はなんとなくわかっている状態なので、それを広げる基礎的な本を読めば良さそう(PRML 読みたい)

ざっくり次の手順が良さそう

1. [SB クリエイティブ:機械学習のエッセンス](https://www.sbcr.jp/products/4797393965.html) (ディープラーニング系以外の機械学習の基礎お勉強)
   - 基本的な機械学習系(ディープラーニング関係なく)のアルゴリズム、必要な数学が揃っている
   - ゼロから始めるの周辺知識が付きそう
2. [生態学データ解析 - 本/データ解析のための統計モデリング入門](http://hosho.ees.hokudai.ac.jp/~kubo/ce/IwanamiBook.html) (統計)
   - 統計周りのモデリングの感覚はほしい
   - コレを終えて[Stan と R でベイズ統計モデリング (Wonderful R)](https://www.amazon.co.jp/exec/obidos/ASIN/4320112423/statmodeling-22/) も見ておきたい
   - これがつらそうなら東大出版の統計本に戻る
3. 線形代数(これは正直僕は勉強しているのでほぼいらないと思っている)
   - やるとしたら機械学習のエッセンス、足りなそうなら[川久保](https://www.mercari.com/jp/search/?sort_order=&keyword=%E7%B7%9A%E5%BD%A2%E4%BB%A3%E6%95%B0+%E5%B7%9D%E4%B9%85%E4%BF%9D&category_root=&brand_name=&brand_id=&size_group=&price_min=&price_max=&status_on_sale=1)本が機械学習界隈には受けてた(実用を目指したから？ )
4. PRML
   - 機械学習の基礎本として、数学力とかつけたいなと思っているので推しておきたい
   - [tsg-ut/awesome-prml-ja: インターネット各地に散逸する「パターン認識と機械学習」の解説資料を集約するリポジトリ](https://github.com/tsg-ut/awesome-prml-ja)
   - [Pattern Recognition and Machine Learning - Microsoft Research](https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/)

## 取得したスキルをアウトプットする

基礎的なものが終わればだいたい読めるきはするので、アウトプットのための勉強ベースで物事を増やしていく

おそらく一番アウトプットしやすいのが kaggle

それ以外も、都度自分のやりたいことを挑戦し直すとテンション保てそう。

# 結論

次の手順で勉強すればそこまで迷うことはなさそう

ざっくり次の手順が良さそう

1. [SB クリエイティブ:機械学習のエッセンス](https://www.sbcr.jp/products/4797393965.html) (ディープラーニング系以外の機械学習の基礎お勉強)
   - 基本的な機械学習系(ディープラーニング関係なく)のアルゴリズム、必要な数学が揃っている
   - ゼロから始めるの周辺知識が付きそう
2. [生態学データ解析 - 本/データ解析のための統計モデリング入門](http://hosho.ees.hokudai.ac.jp/~kubo/ce/IwanamiBook.html) (統計)
   - 統計周りのモデリングの感覚はほしい
   - コレを終えて[Stan と R でベイズ統計モデリング (Wonderful R)](https://www.amazon.co.jp/exec/obidos/ASIN/4320112423/statmodeling-22/) も見ておきたい
   - これがつらそうなら東大出版の統計本に戻る
3. 線形代数(これは正直僕は勉強しているのでほぼいらないと思っている)
   - やるとしたら機械学習のエッセンス、足りなそうなら[川久保](https://www.mercari.com/jp/search/?sort_order=&keyword=%E7%B7%9A%E5%BD%A2%E4%BB%A3%E6%95%B0+%E5%B7%9D%E4%B9%85%E4%BF%9D&category_root=&brand_name=&brand_id=&size_group=&price_min=&price_max=&status_on_sale=1)本が機械学習界隈には受けてた(実用を目指したから？ )
4. PRML

   - 機械学習の基礎本として、数学力とかつけたいなと思っているので推しておきたい
   - [tsg-ut/awesome-prml-ja: インターネット各地に散逸する「パターン認識と機械学習」の解説資料を集約するリポジトリ](https://github.com/tsg-ut/awesome-prml-ja)
   - [Pattern Recognition and Machine Learning - Microsoft Research](https://www.microsoft.com/en-us/research/publication/pattern-recognition-machine-learning/)
   - [『パターン認識と機械学習の学習 普及版』（PDF）](https://herumi.github.io/prml/)

5. [推薦システム: 統計的機械学習の理論と実践](https://www.amazon.co.jp/exec/obidos/ASIN/4320124308/hatena-blog-22/) あたりは自分のやりたいことに近いので、逐次読む予定

# 参考

- [データサイエンティストというかデータ分析職に就くための最低限のスキル要件とは - 六本木で働くデータサイエンティストのブログ](https://tjo.hatenablog.com/entry/2015/03/13/190000)
- [無料で拾える機械学習系の本の PDF まとめ - とある京大生の作業ログと日々の雑記](http://komi1230.hatenablog.com/entry/2019/03/14/154236)
- [機械学習システム開発や統計分析を仕事にしたい人にオススメの書籍初級 5 冊＆中級 10 冊＋テーマ別 9 冊（2019 年 1 月版） - 六本木で働くデータサイエンティストのブログ](https://tjo.hatenablog.com/entry/2019/01/10/190000)
- [成果を生み出すテクニカルライティング ―トップエンジニア・研究者が実践する思考整理法 | Gihyo Digital Publishing … 技術評論社の電子書籍](https://gihyo.jp/dp/ebook/2019/978-4-297-10407-8)
  - まとめる指針、方針の参考にした
