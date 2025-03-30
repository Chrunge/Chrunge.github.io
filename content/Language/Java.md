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

#### Java vs C++
- Java的基本类型和引用都分配在stack上，而对象都分配在堆上。
	- 因此，Java的垃圾回收器，只回收没有引用指向的对象。
	- Java可以返回局部引用
	- Java是pass by value.
- C++的引用与Java不同，是对象的别名。
	- C++的基本类型不需要destructor。
	- C++中，new的对象分配在堆上，需要手动释放。其余对象声明，空间分配在stack上，自动调用destructor.
	- C++中的char p[10] = "hello world"被视为动态数组，空间分配在stack上。
	- C++中的char p* = "hello world"，数据在heap上，可返回p。

