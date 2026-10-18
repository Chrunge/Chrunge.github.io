---
title: Computer Architecture - Parallelism
top: false
cover: false
toc: true
mathjax: true
date: 2021-07-13 11:52:02
password:
description:
tags:
- Parallelism
- CS61C
categories:
- 计算机基础
---

## Parallelism SIMD

### Why

1. Reference Problem: **Matrix Multiplication**

### What

1. Software vs Hardware
   1. Hardware: serial, Parallel
   2. Software: sequential, concurrent
<!-- more -->
2. Flynn's Taxonomy: SISD, SIMD, MISD, MIMD(Multiple Instruction Multiple Data)

### How 

1. **SIMD Architectures:**
   1. Data-Level Parallelism(DLP): operation on multiple data streams
      - One instruction is fetched & decoded for entire operation
      - Multiplications are known to be independent
      - Pipelining/concurrency in memory access as well

   2. Intel x86 SIMD evolution
      1. XMM Registers in SSE: 16 64-bit data registers
      2. SSE2 + 128-Bit SIMD Data Types
      3. AVX512 has 8x state compared to SSE

   3. SIMD Array Processing
      1. Intel SSE intrinsics: intrinsics are C functions and procedures for putting in assembly language, including SSE instructions.
      - Vector data type: `_m128d`
      - Load and store operations: `_mm_load_pd`, `_mm_store_pd`
      - Arithmetic: `_mm_add_pd`, `_mm_mul_pd`(multiple, packed double) 

   4. Vector vs Scalar:
       1. A single vector instruction specifies a great deal of work.
       2. Hardware does not have to check for data hazards within a vertor instruction.
       3. Main memory is seen only once for the entire vector.
       4. control hazards are nonexistent.
       5. power and energy is less.


## Thread-Level Parallelism

### Parallel Compuer Architectures:

1. Improving Performance
   1. Increase clock rate: pipeline and technology
   2. Lower CPI: SIMD, instruction level parallelism
   3. **Perform multiple tasks simultaneously**

2. Multiprocessor Execution Model
   1. *Separate* resources:
      - Datapath (PC, register, ALU)
      - Highest level caches(L1、L2) 

   2. *Shared* resources:
      - Memory(DRAM): Special hardware keeps caches consistent.
      - L3 Cache

   3. Two ways to use a multiprocessor:
      1. Job-Level parallelism
      2. Partition work of single task between several cores.

3. Thread: Sequential flow of instructions that performs some task.
   1. A program/process can split into separate threads, which can(in theory) execute simultaneously.
   2. With a single core, a single CPU can execute many threads by **Time Sharing**
      - Each Thread has:
        - Dedicated PC
        - Separate registers
        - Accesses the shared memory
   3.**Hardware threads**: Each physical core provides one, which is executing instructions actively.
   4. **Software threads**: Operating system multiplexes multiple.

4. Multithreading: Two copies of PC and Registers inside processor hardware.
   1. 若只有一个hardware thread，则当一个线程中断时，CPU保存当前线程的状态，转化到另一个线程。此过程有些耗时。
   2. So use two PC and registers, when one thread blocks, the other thread continue to run without saving status.

5. OpenMP: Parallel extension to C, treads level programming with parallel for pragma.
   1. Runtime library routines `#include <omp.h>`, Compiler Directives `#pragma` and `#pragma omp parallel for` for C loop
   2. How it works: Breaks for loop into chunks, and allocate each to a separate thread.
   2. ![OpenMP]()

6. **Synchronization**
   1. Problem: When each processor read same intermediate variable, it will cause **a race** and result is non-deterministic.
   2. 解决方案的基本思想: limit access to shared resource to 1 processor at a time.
   3. 工具: `int lock`, 0 for unlocked and 1 for locked.
   4. 具体方案: Atomic read/write which is read & write in single instruction.(only on assembly level to fix, not C.)
   5. ![AMOs]()
   6. ![AMOs1]()
   7. DeadLock: a system state in which no process is possible.

7. Shared Memory and Caches:
   1. Problem: Each core has a local private cache which is not coherency.
   2. 基本解决思想: When any processor has cache **miss or wirtes**, notify other processors via interconnection network. For instance, when **write** transactions from one processor, **snoop** and invalidate any copies of same address modified in other cache.
   3. 具体实施(MOESI protocol): Each cache tracks state of each block in cache:
      1. **Shared**: up-to-date data, other caches may have a copy.
      2. **Modified**: up-to-date data, changed **dirty**, no other cache has a copy, Ok to write, memory out-of-date.
      3. **Exclusive**: up-to-date, no other cache has a copy, Ok to write, memory up-to-date.
      4. **Owner**: up-to-date data, other caches may have a copy(they must be in Shared state)
         - own the exclusive right to make changes to it.
         - own态是共享的modified态，此时memory out-of-data
   4. [false sharing](https://zhuanlan.zhihu.com/p/55917869): when two processor write to two different variables on same block at the same time, it will cause **Coherence Misses, the forth Cache Misses**.