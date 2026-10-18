---
title: Computer Architecture - Summary
top: false
cover: false
toc: true
mathjax: true
date: 2021-07-24 20:47:02
password:
description:
tags:
- CS61C
categories:
- 计算机基础
---

## Part I: 6 Great Ideas

   1. Abstraction to Simplify Design
   2. More's Law
   3. Principle of Locality/Memory Hierarchy: Temporal and Spatial Locality
   4. Parallelism
   5. Performance measurement(Amdahl's law) and Improvement
   6. Dependability via Redundancy

   Note: Time/Program = Instruction/Program * Cycles/Instruction * Time/Cycle
<!-- more -->
## Part II: Number Representation and C language

### Number Representation

### Integer

   1. Sign and Magnitude: Define leftmost bit to be sign! Two zeros!!!
   2. One's complement: Two zeros!!!
   3. Two's complement: **One zero!!!**

### Floating Point

   1. Floating Point: 1 bit sign + 8/11 bits Exponent + 23/52 bits Significand, and Exponent = unsigned - bias(127/1023)
   2. Value = (-1)^s^ × (1 + Significand)^Exponent^. And when Exponent < 0, radix = Significand without adding 1.
   3. It ranges from (+-） 2^-149^ to 2^129^
   4. Underflow and Overflow

### C language

   1. **Pointer and Array**, **Pass by Value**, refer to K&R
   2. Stack and Heap: malloc, free, realloc, sizeof
   3. Compiling language and Interpreting language
   4. CALL: Compiling, Assembly, Linking and Loading
      - .text .data .globl .string .word

## Part II: ISA: Assembly Instructions

   1. Assembly Instruction:
      - Arithmetic/logic:
        - add, sub, and, or, xor, sll, srl, sra
      - Immediate
        - addi, subi, andi, ori, xori, slli, srli, srai
      - Load/Store:
        - lw, lb, lbu, sw, sb
      - Branching/jumps
        - beq, bne, bge, blt, bgeu, bltu, jal jalr

   2. ![Assembly Type](https://github.com/Chrunge/Pictures/blob/master/CS61C/Summary/%E6%B1%87%E7%BC%96%E6%A0%BC%E5%BC%8F.png?raw=true)
   3. ![Pseudo-assembly](https://github.com/Chrunge/Pictures/blob/master/CS61C/Summary/pesudo-assembly.png?raw=true)
   4. ![Pseudo-assembly2](https://github.com/Chrunge/Pictures/blob/master/CS61C/Summary/pesudo-assembly2.png?raw=true)
   5. ![Machine code of Assembly](https://github.com/Chrunge/Pictures/blob/master/CS61C/Summary/%E6%89%80%E6%9C%89%E6%B1%87%E7%BC%96%E7%A0%81.png?raw=true)

## Part III: Components design of CPU

   1. Synchronous Digital Systems State: setup time, hold time and clk-to-q time
   2. **Laws of Boolean Algebra**
   3. Finite State Machines: **Truth Table, Boolean Expression and Gate Diagram**
   4. Mux: Data Multiplexors Design
   5. ALU: design **Adder/Subtractor** by hardware and address **overflow**


## Part IV: CPU and Pipeline

   1. DataPath:
      - IF: Instruction Fetch
      - ID: Instruction Decode
      - EX: Execute - ALU(Arithmetic-Logic Unit)
      - MEM: Memory Access
      - WB: Write Back to Register
   2. 由简单到复杂：逐步添加add，sub，imm指令.....到datapath中，形成一个完成的datapath。
   3. ![Datapath](https://github.com/Chrunge/Pictures/blob/master/CS61C/Summary/Datapath.jpg?raw=true)
   4. Pipeline: Split data to several stages, and add registers between stages to save datapath status to run for next cycle.
   5. Pipeline Hazards: 
      - Strutural hazard: more hardware
      - Data hazard: directly fetch data from registers, out-of-order instructions in compiling stage or add nop for `lw` instruction.
      - Control hazard: predict and flush datapath
   6. SupersScalar Processors: multiple pipelines
 
## Part V: Cache and Virtual Memory

### Cache

   1. Kissing me gives ten percent extra zeal & youth!
   2. **Spatial and Temporal Locality**
   3. **Tag/Index/Offset** for cache block: first find index; then check valid bit and tag; finally hit and offset, or miss.
   4. Direct-Mapped Cache, Full Associative Cache and N-way Associative Cache
   5. Cache Miss: Compulsory Miss, Capacity Miss, Conflict Miss and Coherency Miss
   6. Write-back and write-through, LRU/FIFO/Random replacement policy
   7. Average Memory Access Time(AMAT)

### Virtual Memory, OS and I/O

#### OS

   1. OS: What does the OS do and What is the functionality of OS???
      - Provide **isolation** between running processes
      - Provide **interaction** with the outside world. 
   2. Waht does OS need from hardware：
      - Memory translation, Protection and privilege, Traps & Interrupts

#### Virtual Memory

   1. The functionality of virtual memory: Isolation and Protection , More Memory, Illusion for all Memory(Abstraction)
   2. Virtual Address => Page Table and TLB(Translation Lookaside Buffer) => Physical Address Space.
      - Virtual address = page number + offset
      - Page faults: Not valid or valid but on disk.
      - only Write-back.
   3. Page Table is big? => Hierarchical Page Tables
   4. Where is TLBs in Datapath??? 

### I/O devices

   1. Memory mapped I/O: Portion of address space dedicated to I/O.
   2. I/O polling: Processor checks status, then act.
   3. I/O Interrupts: Interrupt current program, then transfer control to the trap handler in the operating system.
   4. **DMA**(Direct Memory Access): By DMA engine, allows I/O devices to directly read/write main memory.

## Parallelism in Data-Level and Thread-Level

### Data-Level Parallelism

   1. Flynn's Taxonomy: 
      - software: sequential, concurrent
      - hardware: serial, parallel
   2. SIMD: Single Instruction Multiple Data, for array computation by **Intel SSE Intrinsics** and large specified register(MMX, SSE, AVX)

### Thread-Level Parallelism

   1. Thread: A thread stands for "thread of execution", is a single stream of instructions. 
   2. Process and Thread, Core and HardWare Thread and Software.
   3. Multithreading: to copy with saving current thread state and load new thread state.
   
   4. MIMD: Multiple Instruction Multiple Data; Go, OpenMP in C and hazards caused by non-deterministic result => Synchronization with **Locks**.
   5. Hardware Synchronization: Read & write in single instruction(Atomic)

   6. Shared Memory and Caches: Cache Coherency
      - Idea: When any processor has cache miss or writes, notify other processors via interconnection network.
      - Each cache tracks state of each block in Cache: Shared, Modified, Exclusive, Owner.[MOESI](https://en.wikipedia.org/wiki/Cache_coherency_protocols_(examples)#MOESI_protocol)
      - Coherency Misses(false sharing): Several processors reading/writing X and writing Y, where X and Y are in the same block cache. Causing **block ping-pongs**.

   7. The five kinds of parallelism
      - Request Level Parallelism: warehouse scale computers
      - Instruction Level Parallelism: Pipelining, Superscalar, out-of-order execution, branch prediction
      - Data Level Parallelism: SIMD Instructions, graphics cards
      - Data/Task Level Parallelism: Map/Reduce: Hadoop and Spark
      - Thread Level Parallelism: Multicore systems, OpenMP, Go

### MapReduce and Spark

   1. Amdahl's Law
   2. Request-Level and Data-Level Parallelism
   3. MapReduce => Simple data-parallel programming model designed for scalability and fault-tolerance.
   4. Spark => fast and general engine for large-scale data processing.
      - textFile(), faltMap(), Map(), reduceByKey() 

## Dependability via Redundancy: Time vs Space

   1. PUE(Power Usage Effectiveness)
   2. Dependability Metrics: Mean Time to Failure(MTTF), Mean Time to Repair(MTTR), Mean time between failures(MTBF), Annualized Failure Rate(AFR)
   3. Parity and Hamming Code:
      Parity: Simple Error-Detection Coding(just odd numbers of errors are detected) 
   4. Hamming ECC: Single Error Correction => p1 covers all positions with LSB = 1; p2 LSB = 2....
   5. RAID(Redundant Arrays of Disks ): RAID 0-5