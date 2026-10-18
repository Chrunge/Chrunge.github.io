---
title: 'Lecture 4: Abstraction 2 - Processes and Files and I/O'
top: false
cover: false
toc: true
mathjax: true
date: 2021-09-14 14:28:54
password:
description:
tags:
- CS162
categories:
- Operating System
---

## 进程

1. 定义: 有限权限的执行环境, 包括一到多个线程, file descriptors, network connection.

2. 创建进程:
   1. pid_t fork(): 复制当前进程, 返回不同的pid
      - child有不同的pid
      - 新进程包括一个线程
      - Address Space, File descriptor都相同
   2. exec(): 执行新的程序
<!-- more -->
3. 进程API:
   1. ![第39页, Process Management API]()
   2. ![第43页, Common POSIX Signals]()

## The File Abstraction

1. File:
   1. High-Level File I/O: Streams
   2. Low-Level File I/O: File descriptors

2. Unix/POSIX Idea: Everything is a file.
   1. 同一接口:
      - Files on disk
      - Devices(terminal, printers)
      - Regular files on disk
      - Networking(socket)
      - Local interprocess communication(pipes, sockets)
   2. 基于系统调用: open(), read(), write(), close().
      - ioctl(): 可进行自定义配置 

3. ![第52页, The File System Abstraction]()
    - Every process has a **current working directory**

4. ![第54页, C High-Level File API - Streams]()
   ![第55页, C API Standard Streams - stdio.h]()
   ![第56页, C High-Level File API]()
   ![第61页, C High-Level File API: Positioning the Pointer]()

5. Unix I/O设计的关键思想
   1. 统一性: everything is a file
   2. Open before use: 提供访问权限设置并检查
   3. Byte-oriented: 即使传输的是block, 也是基于byte处理
   4. Kernel buffered read, Kernel buffered write
   5. Explicit close

6. Low-level File I/O: 原始的系统调用接口
   1. ![第4页]()
   2. ![第5页, Standard Descriptors]()
   3. ![第6页, Low-Level File API]()
   4. ![第10页, Other Operations]()

7. FILE:
   1. FILE里有什么:
      1. File descriptor(int from call to open), 需要这个与内核进行交互
      2. Buffer(array): 用户空间内的缓存数组
      3. Lock(以免有多个线程同时使用它)
   2. fwirte:
      1. 首先写入FILE buffer,
      2. 当buffer满了后, 再flush; 或C标准库自动flush
      3. 所以, 需要自己调用fflush()进行刷新, 或调用fclose()
   3. Low-Level API就没有此问题



