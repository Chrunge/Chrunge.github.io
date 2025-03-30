---
title: 'Lecture 1: What is an Operating System'
top: false
cover: false
toc: true
mathjax: true
date: 2021-09-13 09:10:30
password:
description: Lecture 1 - What is an Operating System
tags:
- CS162
categories:
- Operating System
---

## What is an OS

1. 幻术师：提供一个干净，方便使用的物理层的抽象
   - 一台独占和无限内存的机器
   - 更高级的对象：文件，用户，消息
   - 掩盖局限性，进行虚拟化
   - [第12页，Virtualizing the Machine]()
<!-- more -->
2. 裁判：
   - 通过分配资源，以提供保护，隔离和共享资源
     - OS使进程之间相互隔离
     - OS将自身与进程之间相互隔离
3. 胶水：
   - 提供公共服务
     - 存储，文件系统，网络
     - 共享和授权
     - Look and feel???

## 虚拟机：通过软件模拟出一个抽象的机器

   1. 两种类型
      - 进程虚拟机：支持单一程序的运行，此功能一般由OS提供 
      - 系统虚拟机：支持运行整个OS和它的应用程序（如VMWare Fusion, virtual box)
   2. Process VMs：
      1. 编程简单化：
         - 每个进程都认为它拥有整个设备，包括所有内存和CPU Time
         - 不同的设备提供相同的高级接口，且接口比原始硬件更强大
      2. 隔离错误
         - 使发生错误的进程不影响其他进程，不崩溃整个系统  
      3. 保护和兼容性
         - 如Java接口的安全性和多平台的兼容性
   3. System Virtual Machines: 多层操作系统(guest OS and host OS)
      1. 当guest OS崩溃时，仅限于此虚拟机
      2. Can aid testing programs on other OSs

## 大纲

1. OS Concepts
   - Process, I/O, Networks and Virtual Machines
2. Concurrency
   - Thread, scheduling, locks, deadlock, scalability, fairness
3. Address Space
   - Virtual memory, address translation, protection, sharing
4. Files System
   - I/O devices, file objects, storage, naming, caching, performance, paging, transactions, databases
5. Distributed Systems
   - Protocols, N-Tiers, RPC, NFs, DHTs, Consistency, Scalability, multicast
6. Reliability & Security
   - Fault tolerance, protection, security
7. Cloud Infrastructure 

## Complementary

1. ![第50页，And range of Timescales]()
2. ![第74页，Infrastructure, Textbook & Readings]()
3. ![In conclusion]()