---
title: Computer Architecture - I/O
top: false
cover: false
toc: true
mathjax: true
date: 2021-07-14 15:07:56
password:
description:
tags:
- Input
- Output
- CS61C
categories:
- 计算机基础
---

## Why

1. 程序和设备交互

## How

1. Instruction Set Architecture for I/O
   1. Processor：
      1. Input: Read a sequence of bytes
      2. Output: Write a sequence of bytes
    2. Interface options:
       1. Memory mapped I/O
          1. I/O专用地址，0x00000000 - 0x7FFFFFFF，用于保存I/O寄存器
          2. I/O设备的寄存器
          3. 正常的指令集
<!-- more -->
2. I/O设备与处理器速度不匹配
   1. I/O polling: Processor Checks Status, Then Acts
      1. 设备寄存器通常有两个作用：
         1. Control Register, says it's OK to read/write.
         2. Data Register, contains data.
      2. Processor reads from Control Register in **loop**, then loads from or writes to data register.
      3. 局限：只能用于低数据传输设备，如鼠标键盘

   2. I/O Interrupts
      1. 优缺点：
         1. No I/O activity: Nothing to do
         2. Lots of I/O: **Expensive** - thrashing caches, VM, saving/restoring state
         3. 可用于低数据传输设备，高数据传输设备

3. 可编程I/O：
   1. 缺点：Cpu执行所有的数据交换，速度不匹配，有点浪费通用Cpu的性能，然后有了DMA Hardware来辅助执行

4. DMA(Direct Memory Access):
   1. Allows I/O devices to directly read/write main memory
   2. New hardware:**The DMA Engine**
   3. DMA engine contains registers written by CPU:
      1. 所需的内存地址
      2. 字节数
      3. 所需的I/O设备，传输的方向
      4. 传输数据的单位
   4. ？？？ Problem: 放在哪里，L1 Cache和CPU之间还是Last Cache与Main Memory之间。

5. Network：
