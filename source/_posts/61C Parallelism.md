---
title: Parallelism
top: false
cover: false
toc: true
mathjax: true
date: 2021-07-13 11:52:02
password:
description:
tags:
categories:
---

## Parallelism

### Why

1. Reference Problem: **Matrix Multiplication**

### What

1. Software vs Hardware
   1. Hardware: serial, Parallel
   2. Software: sequential, concurrent

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