---
title: 'Synchronization I and II: Concurrency, Lock Implementation'
top: false
cover: false
toc: true
mathjax: true
date: 2021-09-18 12:54:45
password:
description:
tags:
- CS162
categories:
- Operating System
---

## Locks

1. ![第29页, Definitions: Synchronization, Mutual Exclusion, Critical Section]()

2. Atomic Operation: 一种不能在半路暂停的操作, 要么不干, 要干就得干到底
   - 不可分割性: 不能在中间停下, 也不能在中途被其他人修改
   - 基本的构件块: 如果没有atomic operation, 也就没有线程之间的相互合作
3. Locks: 阻止某人做某事
   1. 在进入关键区和获取共享数据之前, 需要`acquire(&lock)`
   2. 在离开之后, 需要`release(&lock)`
   3. `Wait` if locked
      - Important idea: all synchronization involves waiting. 
<!-- more -->
   4. 使用之前, 需要分配和初始化:
      - `structure Lock mylock` or `pthread_mutex_t lock` 
      - 初始化: `lock_init(&mylock)` or `mylock = PTHREAD_MUTEX_INITIALIZER`;

4. race condition: 两个线程试图同时获取相同的数据, 并且其中至少一个线程执行写操作(不能都是读操作), 就会造成`竞争条件`, 看是你写的快, 还是我写或读的快.

## Producer-Consumer with a Bounded Buffer

1. 问题定义:
   - Producer put things into a shared buffer
   - Consumer take them out
   - Need synchronization to coordinate producer/consumer
2. 因为有了buffer, 所以不需要双方速度一致
   - need to synchronize access to this buffer
   - 如果buffer满了, producer需要等待
   - 如果buffer空了, consumer需要等待
3. General rule of thumb: **Use a separate semaphore for each constraint**
   - Semaphore fullBuffers; // consumer's constraint
   - Semaphore emptyBuffers; // producer's constraint
   - Semaphore mutex; // mutual exclusion

## Semaphores

   1. 定义: a Semaphore has a non-negative integer value and supports the following two operation
       - `Down() or P()`: an atomic operation that waits for semaphore to become positive, then decrements it by 1
         - 类似`wait()`
       - `Up() or V()`: an atomic operation that increments the semaphore by 1, waking up a waiting P, if any.
         - 类似`signal()`
       - ![第40页, 红绿灯信号]()

   2. 两种应用:
      1. Mutual Exclusion(initial value = 1)
      2. Scheduling Constraints(initial value = 0)
         1. 比如用于实现pthread_join(),
            ```N
            Initial value of semaphore = 0
            # 主线程
            ThreadJoin{
                semaP(&mysem)
            } 
            # 子线程
            ThreadFinish {
                semaV(&mysem)
            }
            ```
    3. ![第43页, Full Solution to Bounded Buffer]()

## How to implement lock by interrupt/atomic operations

   1. How can we build multi-instruction atomic operations?
      1. ![第66页]()
         1. **Key Idea: maintain a lock variable and impose mutual exclusion only during operations on that variable.**
            - ![第67页]()
            - 在检查和设置lock value时, 必须要避免中断, 否则两个线程都认为它们可以持有锁.
         2. How to re-enable after sleep()?
            ![第75页]()  
            - 被唤醒之后, re-enable interrupt.

      2. Atomic Read-Modify-Write Instructions
         1. 由硬件负责实现，单核处理器上方便，多核处理器上需要coherence protocol
         2. ![Examples of Read-Modify-Write Lecture-8-47]()  
         3. Implementing lock with test&set
            - ![Busy waiting, 49]()
            - ![Better Implement, 51]()
      3. 比较`Interrupt` and `test&set`
         - ![52]() 

## Monitors

   1. Cleaner Idea: using **locks** for mutual exclusion and **condition variables** for scheduling constraints
      - [56]() 
      - [57]()
   2. Mesa vs Hoare Monitors
      - [61]()
      - [Mesa need while, 62]()

   3. Construct Monitors from Semaphores: 构建失败

## Conclusion
    ![第82页]()
    ![第83页]() 
    ![8-64]()
    ![8-65]()