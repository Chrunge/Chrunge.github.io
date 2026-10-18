---
title: 'Lecture 3: Abstractions I: Threads'
top: false
cover: false
toc: true
mathjax: true
date: 2021-09-14 12:25:42
password:
description:
tags:
- CS162
categories:
- Operating System
---

## Thread

1. 线程是由操作系统提供的并发计算的单元，每个线程代表一件事或一个任务
    - Concurrency(并发) is not Parallelism(并行)
      - 并发是一次性做多件事(Multiple Tasks at once), 如单芯片中的Timesharing; 
      - 并行是多件事同时进行, 如有多个CPU同时运行
<!-- more -->
2. Thread Mask I/O Latency
    1. 线程的三种状态: Running, Ready, Blocked
       - 当线程在等待I/O返回时, OS将线程标记为Blocked
       - 当I/O返回后, OS将线程标记为Ready 

3. 多线程程序:
   1. 编译并运行程序时, 将创建带有一个线程的新进程.
   2. 然后进程会进行syscall, 创建新的线程, 并共享同一个地址空间.

4. 系统调用
   1. ![第28页, System Call]()
   2. ![第30页, 线程的系统调用API]()

5. 线程的状态:
   1. 共享的状态:
      - 内存的内容, 如全局变量, heap
      - I/O状态, 如file descriptors, network connection等
   2. 私有的状态:
      - 保存在TCB中(Thread Control Block), 包括CPU registers, Execution Stack(包括参数, 临时变量, 和调用函数后需返回的地址)

6. Race condition: 多个线程竞争
   1. 同步: 协调共享资源的线程
      - Mutual Exclusion(互斥): 一个时间段内只允许一个线程访问特定资源
      - Critical Section(关键部分): 线程中实现互斥的关键代码
      - Lock(锁): 一个对象同时只能由一个线程获得, 实现互斥的概念
        - Lock.acquire() and Lock.release().
   2. 互斥的pthreads API: 
      ![第63页, OS library Locks: pthreads]()
   3. Semaphores(信号量): 非负整数
      1. P() or down(): 等待信号量变成正数, 然后减1.
      2. V() or up(): 将信号量加1, 然后唤醒一个等待中的P.
      3. 当semaphores初始值为1时, 与lock等价