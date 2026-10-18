---
title: Computer Architecture - Operating System and Virtual Memory
top: false
cover: false
toc: true
mathjax: true
date: 2021-07-12 15:59:45
password:
description:
tags:
- Virtual_Memory
- CS61C
categories:
- 计算机基础
---

## Operating System

### Why

1. Provide *isolation* between running processes.
2. Provide *interaction* with the outside world.
<!-- more -->
### What

1. What does the OS do
   1. OS is the (first) thing that runs when computer starts
   2. Finds and controls all devices in the machine in a general way
   3. Starts services
   4. Loads, runs and manages programs

2. What does OS need from Hardware:
   1. Memory translation(TLB)
   2. Protection and privilege
   3. Traps & Interrupts

3. What happens at Boot:
   1. BOIS：从Flash中载入BIOS程序（Basic input/output system）
   2. Bootloader：Load  the Os kernel from dist into a location in memory and jump to it.
   3. OS boot: Initialize services, drivers, etc.
   4. Init: Launch an application that waits for input in loop.

### How

1. Launching Applications:
   1. Applications are called "processes" in most OSs
      1. Thread: shared memory
      2. Process: separete memory

2. Supervisor Mode:
   1. The OS enforces resource constraints to applications.
   2. To help protect the OS from the application, CPUs have a supervisor mode.
      1. A process can only access a subset of instructions and memory when not in supervisor mode.(e.g., set by a status bit in a special register)
      2. Process can change out of supervisor mode using a interrupt.

3. Interrupts, Exceptions:
   1. Interrupt: something external to the running programs.(external)
   2. Exception: Something done by the running program.
   3. Trap: action of servicing interrupt or exception by hardware jump to "interrupt or trap handler" code.

4. Multiprogramming:
   1. The OS runs multiple applications at the same time.
   2. Switches between processes very quickly, called a **"context switch"**
   3. When jumping into process, set timer(we will call this 'interrupt)
   4. Deciding what process to run is called **scheduling**

5. Protection, Translation, Paging
   1. Supervisor mode alone is not sufficient to fully isolate applications form each other or from the OS
   2. Solution: **Virtual Memory => Gives each process the illusion of a full memory address space that it has completely for itself.**

## Virtual Memory

### Why 

1. Provide program with illusion of a very large dedicated memory
2. Demand paging: Provides the ability to run programs larger than the primary memory.
3. Hides differences between machine configurations.
4. Allow OS to share memory, protect programs from each other.

### What

1. Analogy:
    1. book title = virtual address
    2. 书籍索引编号 = physical address
    3. card catalogue = page table
    4. local library or another branch = main memory or disk: valid bit
    5. available for 2-hour in library use = access right

2. Typical **page** size: 4 KiB+

3. **Memory manager**:
   1. map virtual to physical addresses.
   2. Protection
   3. Swap memory to disk


4. Write-Back(write through is to slow)

5. To minimize page table: 
   1. Hierarchical Page Table: P1, P2...
   2. Split PT in two parts.
   3. Increase page size

6. TLB(Translation Lookaside Buffer): Address translation is very expensive.
   1. **Cache** some translations in TLB

   2. Design:
      1. Typically 32-128 entries, usually fully associative
      2. Random or FIFO replacement policy
      3. "TLB Reach": size of largest virtual address space that can be simultaneously mapped by TLB.