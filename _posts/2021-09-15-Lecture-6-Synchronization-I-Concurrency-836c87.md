---
title: "Lecture 6: Synchronization I - Concurrency"
date: 2021-09-15 09:00:00 +0800
category: 技术笔记
tags:
  - CS162
description: Synchronization - Locks and Semaphores
excerpt: Synchronization - Locks and Semaphores
---


## PCB and Schedular

1. The contents of PCB
   - （配图待补：第33页）
   1. the contents of TCB
      - （配图待补：第40页）
<!-- more -->
2. Scheduling: All about Queues, 决定哪个进程/线程使用CPU
   - （配图待补：第36页）
   - Each queue can have a **different** schedular policy
   - 考虑因素: 公平性, Realtime guarantees, 延迟优化

3. dispatcher如何取回控制权:
   1. Internal events: thread returns control voluntarily
      - Blocking on I/O
      - waiting on a "signal" from other thread
      - Thread executes a yield()  
   2. External events: thread gets preempted
      - Interrupts: signals from hardware or software that stop the running code and jump to kernel
      - timer: like an alarm clock that goes of every some milliseconds
         - Interrupt controller
           （配图待补：第53页）

4. Context Switch(指线程间的切换)
   1. （配图待补：第46页）
   2. 比进程切换快得多
      - 进程间的切换: 3-4us
      - 线程间的切换: 100ns
      - 切换频率: 10-100ms

5. 超线程: duplicates register state
   - （配图待补：第51页）

6. 线程是如何开始运行的:
   （配图待补：第59页）
   （配图待补：第60页, ThreadRoo()是什么）
