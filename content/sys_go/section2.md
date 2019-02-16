---
title: "$2 低レベルアクセスへの入り口1: io.Writer"
date: 2019-02-17T00:05:13+09:00
draft: false
---

# 概要
io.Writerから見る低レイヤー

# 詳細
## 2.1 io.Writer は OS が持つファイルのシステムコールの相似形
**def: ファイル記述子**
```
ファイルディスクリプタとは、プログラムからファイルを操作する際、操作対象のファイルを識別・同定するために割り当てられる番号。OSにアクセスを依頼する際にファイルを指定するのに用いられる整数値である。主にUNIX系OSで用いられる仕組みで、Windowsではファイルハンドル（file handle）がほぼこれに相当する仕組みを提供する。
```
via: [ファイルディスクリプタ（ファイル記述子）とは - IT用語辞典](http://e-words.jp/w/%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%83%87%E3%82%A3%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%82%BF.html)

- OSはsyscallをファイル記述子に対して呼ぶ
- 記述子はただの数値だが、実際はモノ(ファイル、CPU、ソケットetc..)への識別子として提供されている
  - 記述子を指定することで、プログラマはその実態が何かを意識する必要がない
  - これはOSがうまく抽象化してくれているということ

```go
// fd_unix.go
func (fd *FD) Write(p []byte) (int, error) { // fdがファイルディスクリプタ?
	if err := fd.writeLock(); err != nil {
		return 0, err
	}
	defer fd.writeUnlock()
	if err := fd.pd.prepareWrite(fd.isFile); err != nil {
		return 0, err
	}
	var nn int
	for {
		max := len(p)
		if fd.IsStream && max-nn > maxRW {
			max = nn + maxRW
		}
		n, err := syscall.Write(fd.Sysfd, p[nn:max])
```

## 2.2 Go 言語のインタフェース
いわゆるインタフェース。
構造体などが持つべき仕様を定義したもの。

```go
package main

import (
  "fmt"
)

// インターフェース定義
type Animal interface {
  Say()
}

// 構造体の宣言
// implementsとかはいらない
type Human struct {
  height int
}

// これでSayメソッドを定義できるのかな。面白い。
// 他にもありそう→複数メソッドを定義は毎回func書かないとなのかな
// 副作用があるバイは h *Humanとかにする必要があるそう(なんでだろう。。？)
func (h Human) Say() {
  fmt.Printf("Hello, my hight is %s\n", h.height)
}

func main() {
  var animal Animal

  animal = &Human{200} // なんでポインタ渡してるんだろう・・？ 初期化したポインタをanimalに渡している。。。？であれば (*animal).Say()が正しい気がするけどいらないのかな。→いらないぽい。goはかしこい。
  animal.Say()
}
```

- [Goのメソッドは構造体以外にでも定義できるしそれが便利なこともよくある - Qiita](https://qiita.com/ruiu/items/85b72bc94e08d192d90b)
  - 面白いので併読すると良いかも。


## 2.3 io.Writer は「インタフェース」
- `f *File` はcppで言うところの `File* f` つまりFileのポインタ型を持つ変数
- `func (f *File) Write(b []byte) (n int, err error)` で `File` 構造体へ引数 `[]bye` 返りが `int, error` の `Write` メソッドを定義していることになる。

```go
type Writer interface {
  Write(p []byte) (n int, err error)
}
```

## 2.4 io.Writer を使う構造体の例
