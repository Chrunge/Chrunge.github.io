---
title: Computer Architecture - Pipeline and Superscalar Processors
top: false
cover: false
toc: true
mathjax: true
date: 2021-07-12 13:39:32
password:
description:
tags:
- Pineline
- CS61C
categories:
- 计算机基础
---

## Pipeline 

### Why

1. 程序运行时间 = 程序的指令数量 × 每个指令的周期 × 每个周期所用的时间
   1. 程序的指令数量的决定：任务量，算法，编程语言，编译器，指令集架构(Instruction Set Architecture)
   2. 每个指令的时间周期的决定：ISA，处理器的实现：单周期RISC-V设计，复杂指令集，超标量处理器
   3. 每周期的时间的决定：处理器微架构，工艺，电压
2. Pipeline的作用：提高Cpu频率，增加单位时间内的指令吞库量
<!-- more -->
### What

1. 让不同的指令同时使用不同的资源（确保硬件不闲置），缩短周期Cpu频率，以提高整个工作流的吞吐量，但并不会提高一个指令运行的时间。
2. Potential speedup: Number of pine stages
3. 但是在刚开始和结束时，会有一个"fill" pipeline 和 "drain" pipeline的过程， 这会降低运行速度。

### How

1. 为保存上个stage的数据，以供下个stages使用，在stage中面都添加了一些registers保存数据。
2. Pipeline’s Hazards：
   1. **Structure hazard**： 不同指令同时访问一个资源
      1. Solution 1: 等待以轮流使用资源
      2. Solution 2: 添加更多的硬件（比如在register file中添加更多的独立端口；将Data与Instruction在内存中分开存储）
   2. **Data hazard**：指令集间的数据依赖，下一个指令需要上一个指令的数据结果
      1. exploit high speed of register file: write使用该周期的前100ns，read使用该周期的后100ns
      2. Solution 1: Stall，在指令集之间产生bubbles，以等待结果完成（损失性能）
      3. Solution 2: Compare destination of older instructions in pipeline with sources of new instruction in decode stage; then grab operand from pipeline stage, rather than register file.
      4. lw Data Hazard:
         - Slot after a load is called a **load delay slot**
            - If that instruction uses the result of the load, then the hardware will stall for one cycle.
         - Solution: Put unrelated instruction into load delay slot(complier should do it) 
   3. **Control hazard**：下一个指令的运行依赖与上一个指令的判断结果
      1. Solution 1: 继续执行接下来的指令，若判断错误，则flush incorrect instructions from pipeline by converting to NOPs.
      2. Solution 2: 使用branch prediction to guess.

## Superscalar Processors

1. 增加处理器的性能：
   1. 提高时钟频率，但受技术和功率的限制
   2. pipelining
   3. multi-issue “superscalar” processor

2. Replicate pipeline stages => multiple pipelines.(同时有多条流水线).