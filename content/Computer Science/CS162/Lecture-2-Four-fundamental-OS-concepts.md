---
title: 'Lecture 2: Four fundamental OS concepts'
top: false
cover: false
toc: true
mathjax: true
date: 2021-09-13 10:18:43
password:
description:
tags:
- CS162
categories:
- Operating System
---

## Four Fundamental OS Concepts

1. 线程:
   - 拥有唯一的执行环境.
   - 包括Program Counter, Registers, Execution Flags, Stack.(没有独有的heap吗)

2. 地址空间:
   - 程序在地址空间中执行, 此地址空间与物理内存完全不同
     - = the set of accessible addresses + state associated with them
     - 对于32-bit processor, 最大有2^32^约4GB的地址空间
<!-- more -->
3. 进程: execution environment with restricted rights
   - 一个程序执行的实例, 拥有一个地址空间和一到多个线程
   - 拥有文件标示符, 文件系统环境...

4. 双模式操作: kernel mode and user model
   - 只有kernel mode才能执行的特定操作
   - 硬件支持:
     - a bit of state(user/system mode bit)
     - User -> kernel: set system kernel mode and saves the user PC
     - Kernel -> user: clear system mode and restores appropriate user PC

## 

   1. 并发: 硬件资源上是唯一的, 而进程们却认为它是独占整个机器 => 操作系统虚拟化出多个虚拟机, 使每个进程拥有一个虚拟机
      - CPU是分时共享的
      - Non-CPU resources是共享的
   2. 保护:
      1. 保护操作系统免收用户程序的干涉
         - 可靠性: 防止进程崩溃掉操作系统
         - 安全性: 限制进程的执行范围
         - 隐私性: 进程只能访问它可获取的数据
         - 公平性: 进程只能被分配一定比例的系统资源
      2. 进程之间的保护: 主要机制是**地址翻译**
      3. 额外的保护机制:
         - 特权指令, in/out instructions, 特殊寄存器
         - syscall processing, subsystem implementation. 

   3. 三种进入Kernel Mode的方法:(By Interrupt Vector)
      1. Syscall
         - Process requests a system service
         - Like a Remote Procedure Call(RPC)
         - Marshall the syscall is and args in register and exec syscall
      2. Interrupt
         - **External asynchronous event** triggers context switch
         - 如: Timer, I/O device
         - Independent of user process
      3. Trap or Exception
         - **Internal synchronous event** in process triggers context switch
         - 如: Protection violation(segmentation fault), Divide by 0
   
   4. ![第45页, In conclusion]()