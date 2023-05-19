---
title: Java
top: false
cover: false
toc: true
mathjax: true
date: 2021-11-07 12:48:53
password:
description: Java Notes
tags: 
- Java
categories:
- Language
---

## 一些规范

1. Java程序会被编译成字节码, 然后不同平台上的JVM负责加载字节码并执行.
2. 多行自动创建文档的注释: 
   ```
   /**
   *
   *
   */
   ``` 
3. 基本数据类型: byte, short, int, long, float, double, char, boolean
   1. `var`: 编译器自动推断变量类型
   2. `final`修饰的为常量
   3. `>>>`会移动符号, 将负数变成正数
   4. `b ? x : y`
   5. Java中采用Unicode编码, 一个英文字符和一个中文字符都占两个字节.
   6. 可以用`+`连接字符串, 多行字符串使用`"""***"""`; 字符串的内容不可变.
