---
title: Computer Architecture - Cache
top: false
cover: false
toc: true
mathjax: true
date: 2021-07-12 13:38:13
password:
description:
tags:
- Cache 
- CS61C
categories:
- 计算机基础
---

Binary Prefix: kissing me gives ten percent extra zeal&youth.

## Why

1. Mismatch between processor and memory speeds leads us to add a new level.
2. Caches provide an **illusion** to the processor that the memory is infinitely large and infinitely fast.
3. Big Idea: If something is expensive but we want to do it repeatedly, do it once and cache the result.
<!--more-->
## What

1. Cache is a copy of a subset of main memory
2. Unit: Block(usually 32-64B)
3. L1, L2, L3 cache

## How

1. Caches work on the principles of **temporal and spatial locality**
   1. **Temporal locality**: If a memory location is referenced then it will tend to be referenced again soon.
   2. **Spatial locality**: If a memory location is referenced, the locations with nearby addresses will tend to be referenced soon.

### Direct Mapped Caches

1. In a direct mapped cache, each memory address is associated with one possible block within the cache.(多对一)
2. A 32 bit address:
   1. **Tag**: to check if have correct block
   2. **index**: to select block
   3. **offset**: byte offset within block.
3. Caching terminology:
   1. cache hit, cache miss
   2. cold, warming, warm, hot
   3. Hit rate, Miss rate, Miss penalty, Hit time
4. The steps of reading data：
   1. find index => 验证valid bit和tag => 若匹配，根据offset读取数据；若不匹配，则从内存中载入所需的block。
5. [What to do on a write hit](https://cs61c.org/su21/labs/lab07/#exercise-3-cache-blocking-and-matrix-transposition):
   1. **write through**: update both cache and memory
   2. **write back**: 
      1. update word in cache block
      2. allow memory word to be "stale"
      3. change 'dirty' bit to 1
         1. memory & Cache inconsistent
         2. needs to be updated when the block is replaced.
      4. OS flushed cache before I/O
   3. **Write-around**: data is written to main memory only, change the valid bit to invalid. So there is no write hit.

6. What to do on a write miss:
   - **Write-allocate** means that on a write miss, you pull the block you missed on into the cache. For write-back, write-allocate caches, this means that memory is never written to directly; instead, writes are always to the cache and memory is updated upon eviction.
   **No write-allocate** means that on a write miss, you do not pull the block you missed on into the cache. Only memory is updated.

7. There are two common combinations of cache hit/miss policies:
   1. Write-through/no-write allocate:on hits, it writes back to cache and main memory;on write misses, the block gets updated in main memory, The block is not brought back into the cache as subsequent writes always write to main memory regardless of cache status. 
   2. Write-back/write allocate: on hits, it writes back to the cache, setting the dirty bit without updating main memory; on misses, the corresponding block is updated in main memory(先将更新的数据写入内存) and the block is brought into the cache.
8. Block Size Tradeoff
   1. 优点：增加spatial locality
   2. 缺点：larger miss penalty; miss rate goes up.
9.  Types of Cache Misses:
   3. **Compulsory Misses**: 第一次载入Block时，总是会发生。
   4. **Conflict Misses**: two distinct memory addresses map to the same cache location.(若在fully associative cache时不会发生Miss，则为Conflict Misses)
      1. Solution: make the cache size bigger
      2. Fully Associative Cache

### Fully Associative Cache(全相联缓存)

1. index: non-existant, compare all tags.
2. The third Cache Misses: **Capacity Misses**: miss that occurs because the cache has a limited size.(假设Cache有n个block，则在发生n次Compulsory Misses之后的Miss都是Capacity Misses；在n次之前，都是Conflict Misses)

### N-Way Set Associative Cache

1. The steps of finding data:
   1. Find correct set using Index value
   2. Compare Tag with all Tag values in that sset
   3. If a match occurs, hit!, otherwise a miss.
   4. Finally, use the offset field as usual to find the desired data within the block.

2. Block Replacement:
   1. LRU(Least Recently Used): 2-way is easy to keep track.
   2. FIFO
   3. Random
   4. MRU - Most recently used

3. Average Memory Access Time = Hit time + Miss Penalty × Miss Rate