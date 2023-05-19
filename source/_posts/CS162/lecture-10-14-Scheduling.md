---
title: 'lecture 10-14: Scheduling'
top: false
cover: false
toc: true
mathjax: true
date: 2021-10-16 12:27:44
password:
description:
tags:
- CS162
categories:
- Operating System
---

## Scheduling I: Concepts and Classic Policies

1. Recall: Thread State in the kernel
   1. 对于进程中的每一个线程, 系统都维护着：
      - 当前线程的TCB
      - 用于syscalls/interrupts/traps的内核栈
         - 这个内核状态有时候被称为"内核线程"
         - 当该线程正在用户空间中运行时, 该"内核线程"是suspended状态
   2. 除此之外, 内核中也有内核线程
       - 拥有TCB和kernel stack
       - 但并不属于任何进程, 也不在用户空间中运行
   3. ![kernel structure](Lecture10, 第19页)
<!-- more -->
2. Scheduling policy goals
   1. 最小化响应时间: minimize elapsed time to do an operation
   2. 最大化吞吐量: maximize operations per second
   3. 公平性: share CPU among users in some equitable way
      - Better average response time by making system less fair

3. Policy
   1. First-Come, First-Served(FCFS) Scheduling
      - Convoy effect(车队效应): short process stuck behind long process, response time is too high

   2. Round Robin(RR) Scheduling : **Preemption**
      - 每个进程得到一小段CPU时间配额q, 通常10-100ms
      - 在配额消耗完之后, 放弃CPU并进入ready queue
        - 当q很大时, 则为First-Come, First-Served
        - 当q很小时, 则为Interleaved; 但必须比context switch(0.1ms-1ms)大的多, 不然overhead is too high
      - 优缺点:
        - Better for short jobs, fair
        - 对于long jobs来说, context-switch overhead增加, 吞吐量减少
        - when all jobs same length, average response time is much worse than FCFS
        - Cache State must be shared between all jobs with RR but can be devoted to each job with FIFO

   3. 不同重要性的任务: Strict Priority Scheduling
      1. ![Lecture 10, 42页]()
      2. 调度的公平性:
         1. 当给予short jobs更高的优先级的时候, 严格固定的优先级调度策略是不公平的, long running jobs may never get CPU; 必须得给long jobs一些CPU时间
         2. 权衡: 通过损害平均响应时间, 来获取公平性
      3. 如何增加公平性呢:
         1. 分配CPU时间给每个队列
         2. 提高未被服务的jobs的优先级

   4. **Shortest Job First(SJF)** and **Shortest Remaining Time First(SRTF)**
      1. Idea: get short jobs out of the system
      2. Big effect on short jobs, only small effect on long ones
      3. Result is better average response time, but may cause starvation.
      4. **SRTF has Optimal average response time**

   5. Lottery Scheduling:
      1. ![第51页]()

   6. Multi-Level Feedback Scheduling:
      1. ![第55页]()


   7. Real-Time Scheduling: 性能的可预测性
      1. ![Lecture11, 21]()
      2. ![Earliest Deadline First, 24]()
      3. ![25]()

4. Starvation: thread fails to make progress for indefinite period of time
   1. 原因:
      - 调度策略永远也不运行一个线程
      - 线程相互等待, 或以一种永远无法解决的方式旋转着
   2. 是否FCFS会导致Starvation?
      - Yes, 当一个任务导致无限循环, 且没有preemptive schedulers.

   3. Is Round Robin prone to Starvation? No!
   4. Is Priority Scheduling Prone to Starvation?
      - Yes, Low priority thread might never run.
      - But more serious problem is **Priority inversion**: 当高优先级进程尝试获取被低优先级持有的lock时, 会导致wait, 此时继续调度中优先级进程. 
        - 解决方法一:Priority Donation, 高优先级的进程暂时将它的优先级授予低优先级的进程
   5. SRTF and MLFQ 同样会导致Starvation

5. Linux O(I) Scheduler
   1. 基于优先级的调度程序: 140 priorities
      - ![46]()
6. Linux completely Fair Scheduler(CFS)：
   1. 目标一：公平 -> 选取CPU执行时间(virtual running time)最小的线程来执行
      - ![52]()
   2. 目标二: 低延迟和饥饿
      - ![53]()
      - ![54]()
   3. 目标三: throughput
      - Minimum length of any time slice, 即时间片不能太小
   4. 引入priority后的实际应用
      - [55]()

7. Lecture 12
   1. Starvation: thread waits indefinitely
      - 资源全被高优先级的任务使用，低优先级任务得不到资源 
   2. DeadLock: Circular waiting for resources
      - 任务A拥有资源1, 等待资源2; 任务B拥有资源2, 等待资源1 (哲学家的饭桌)
      - DeadLock会导致Starvation, 反之则不成立
      - 发生死锁的四个必要条件: Mutual exclusion, Hold and wait, No preemption, Circular wait.

   3. 避免死锁的几种方法:
      1. ![12-32页]()
      2. 技术上阻止死锁:
        - 无限的资源, 如虚拟内存
        - 不共享资源(不太可能)
        - 不允许等待, let it retry(比如电话正在接通中...)
        - 线程同时要求所有资源, 如同时要求两只筷子
        - 线程以特定顺序要求资源, 如request disk, then memory, then...
        - **线程要求资源时, 系统先检查是否会进入unsafe state**
      3. 技术上恢复死锁:
        - 终止线程, 使其放弃资源
        - 抢占其他线程的资源
        - **roll back actions of deadlocked threads**
      4. 系统的三种状态:
         - safe state: 系统可以推迟资源分配, 以阻止死锁
         - unsafe state: (已有死锁或)未有死锁, 但该线程的资源要求会导致死锁
         - deadlocked state: 已有死锁

      5. [银行家算法](https://zh.wikipedia.org/zh-cn/%E9%93%B6%E8%A1%8C%E5%AE%B6%E7%AE%97%E6%B3%95)
         - Max: 线程提前说明所需的最大资源
         - Allocation: 已分配的资源
         - Need = Max - Allocation: 需要的资源
         - Available: 空闲的资源
         - Finish: 进程的标签, 初始为false

         - 假如有四个线程A, B, C, D; 找出`Need < Availble`的进程, 配置给它然后再回收, 标记改为true; 继续重复以上步骤
         - ![47页]()


8. 总结:
   - ![56]()
   - ![59]()
   - ![60]()
   - ![12-50]()