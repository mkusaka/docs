---
title: "$1 Go言語で覗くシステムプログラミングの世界"
date: 2019-02-16T15:45:59+09:00
draft: false
---

# 目次
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [概要](#%E6%A6%82%E8%A6%81)
- [詳細](#%E8%A9%B3%E7%B4%B0)
  - [1.1 システムプログラミングとは](#11-%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0%E3%81%A8%E3%81%AF)
    - [1.1.1 OSの機能について](#111-os%E3%81%AE%E6%A9%9F%E8%83%BD%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6)
  - [1.2 Go言語](#12-go%E8%A8%80%E8%AA%9E)
  - [1.3 Go環境構築](#13-go%E7%92%B0%E5%A2%83%E6%A7%8B%E7%AF%89)
  - [1.4](#14)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 概要
本の導入
- システムプログラミングとは
- 環境構築

# 詳細
## 1.1 システムプログラミングとは
**def: システムプログラミング**
```
OSの提供する機能を使ったプログラミング
※現代のWeb関連の技術とは対象的なもの
※他にもいろいろな定義がある
```

### 1.1.1 OSの機能について
- GUIなどの機能はほぼ「アプリケーション」と呼ばれるもの

**def: OSの機能**
```
OSが提供している(ここでは最大公約数の)機能
- メモリ管理
- プロセス管理
- ファイルシステム
- ネットワーク
etc..
```
## 1.2 Go言語
- Cの性能とPythonの書きやすさ
- Google謹製
- OSの機能を直接扱えて書きやすいので使用

## 1.3 Go環境構築
スルー

## 1.4
https://github.com/mkusaka/go_system_programming

- fmt.Println("hello world") を題材に、vscodeのデバッガ(F5)のステップインを使用しつつsyscallまで見た
