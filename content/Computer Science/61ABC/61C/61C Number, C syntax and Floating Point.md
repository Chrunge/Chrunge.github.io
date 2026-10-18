---
title: Computer Architecture - Number, C syntax and Floating Point
top: Top
cover: false
toc: true
mathjax: true
date: 2021-04-06 20:59:58
password:
description: 
tags: [C, Assembly, Computer_Architecture, CS61C]
categories: 计算机基础 
---

## Lec01: 6 Great Ideas in Computer Architecture

1. Abstraction(Layers of Representation/Intepretation)
2. Moore's Law
3. Principle of Locality or Memory Hierarchy
4. Parallelism
5. Performance Measurement & Improvement
6. Dependability via redundancy
<!-- more -->
## Lec02: Number Representation

1. Real world is analog! To import analog information, we must do **sample and Quantize**.
2. Big idea: bits can represent everything, including color, address, commands and etc...
3. Several base:Binary, Octal, Decimal, Hexadecimal and they will be interconverted.
4. **Numerals**(not number) have infinite number of digits in theory. But in real world, if result of add (or -, *, / ) cannot be represented by these rightmost HW bits, we say **overflow** occurred.

5. Number Representation:
   1. Unsigned Numbers
   2. Sign and Magnitude(原码): define leftmost bit to be sign, 0(-) and 1(+).
      1. Shortcomings:Wrong direction. when go right, sometimes increases values and sometimes decreases values.
      2. two zeros, increase circuit complexity.
   3. One's complement(反码): two zeros.
   4. Two's complement(补码): Based one's complement, shift the
negative mappings left by one.
        - Two ways to compute negative numbers.
          - ![negative compute](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/Number%20Representation/negative%20compute.png)
          - ![negative compute2](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/Number%20Representation/negative%20compute2.png)
   5. Bias Encoding = unsigned + bias(-2<sup>n-1</sup>-1).

## Lecture03: Introduction into the C programming language

1. Why C:
   - Allow us to exploit underlying features of the architecture: **memory management, special instructions, parallelism**
2. Key C concepts: Pointers, Arrays, Implications for Memory management 

### Compile vs Interpret

1. Compilation: C compilers map C programs directly into **architecture-specific** machine code (string of 1s and 0s)
   - Unlike Java, which converts to **architecture-independent bytecode** that may then be compiled by a just-in-time compiler(JIT)
   - Unlike Python environments, which converts to a byte code at runtime
      - These differ mainly in exactly **when** your program is converted to low-level machine instructions (“levels of interpretation”)
2. C Advantages and Disadvantages:
   - Advantages:
      - Reasonable compilation time: only modified files to be recompiled and can compile in parallel: `make -j`
      - Excellent run-time performance
   - Disadvantages:
     - Compiled files, including the executable, are architecture-specific, depending on processor type (e.g., MIPS vs. x86 vs. RISC-V) and the operating system
     - Executable must be rebuilt on each new system
     - "Change → Compile → Run [repeat]" iteration cycle can be slow during development
3. C Pre-Process:
   - ![C pre-process](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/C%20program%20language/C%20Pre-Processor.png)

### C vs Java

- ![C vs Java1](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/C%20program%20language/C%20vs%20Java%201.png)
- ![C vs Java2](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/C%20program%20language/C%20vs%20Java%202.png)
- ![C vs Java3](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/C%20program%20language/C%20vs%20Java%203.png)

### C syntax

1. main: `int main(int argc,char *argv[])`
2. True or False:
   - False: 0, null, Boolean types
   - Everything else is True
3. Typed Variables in C:
   - ![Typed Variables in C](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/C%20program%20language/Typed%20Variables%20in%20C.png)
   - ![Integer VS](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/C%20program%20language/Integer%20Python%20vs%20Java%20vs%20C.png)
4. Consts and Enums in C:
   - ![Consts and Enums in C](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/C%20program%20language/Consts%20and%20Enums%20in%20C.png)
5. Structs in C:
   - ![Structs in C](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/C%20program%20language/Structs%20in%20C.png)  
6. Control Flow:
   - ![Control Flow](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/C%20program%20language/Control%20Flow.png)

- Degression:
  - In 1949, first general stored-program computer war invented.
    - This is the revolution: It isn't just programmable, but the program is just the same type of data that the computer computes on
    - Bits are not just the numbers being manipulated, but the instructions on how to manipulate the numbers!
    - ![Abstraction](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61C/C%20program%20language/Abstraction.png)

## Lecture4: C Intro: Pointer, Arrays, Strings

0. Value vs Address:
   1. Each cell has an address associated with it.
   2. Each cell also store some value.
1. **Pointer**: A variable that contains the address of a variable.
2. Pointer Syntax: `int *p`, `p = &y`, `z = *p`. (`*`在=之前和之后的意思不同)
   1. `&` called the "adddress operator" in this context.
   2. `*` declare a pointer or play a role of "dereference operator", latter means getting the value point to.
   3. `void *` is a type that can point to anything(generic pointer)
   4. `fn(int *p)` includes `int *`(represent a pointer) and `p`(name of the pointer), so the argument `p` is a pointer.
3. Why use pointer:
   1. If we want to pass a large `struct` or array, it's faster to pass a pointer than a whole thing. (or it will copy whole `struct` or array)
   2. More compact and cleaner code.
   Note: In C, parameters **pass by value** like Java. but it has no reference type, it only has pointer.

---

4. **Array**: `char *string` and `char string[]` are nearly identical. Excepts:
   1. Array name always point to the first elements.(can't changed)
   2. `pointer + n` = add `n*sizeof(elements)` to the memory address.
   3. An array in C does not know its own length.

---

Notes:

   1. A variable may be initialized in its declaration, **if not, it hold garbage**.
   2. Undefined Behavior will cause bugs,some are "Heisenbugs", and the other is "Bohrbugs".

## Lecture5: Dynamic Memory Allocation

1. `malloc`: to allocate memory to something new to point to, for instance: `ptr = (int *) malloc (n * sizeof(int));`

2. After dynamically allocating space, we **must** dynamically free it: `free(ptr);`

3. `realloc(p, size)`: realloc memory for p, equal to malloc when p is NULL, or equal to free when size = 0.

### C memory Management

1. 4 regions:
   - The Stack: local variable storage, parameters, return address.(top to down)
   - The Heap(dynamic malloc storage): data lives until deallocated by programmer.(down to top)
   - Static data: variables declared outside main, does not grow or shrink.(global)
   - code: loaded when programs starts, does not change.

2. Heap management:
   1. Each block of memory is preceded by a header that has two fields:
      1. **size** of the block and **a pointer** to the next block.
      2. All free blocks are kept in a circular linked list, the pointer field is unused in an allocated block.
      3. Three ways to find free space when given a request:
         - First fit (find first one that’s free)
         - Next fit (same as first, but remembers where left off)
         - Best fit (finds most “snug” free space)

3. Summary:
   ![MiniSummary]() 

## Lecture6: Floating Point

0. **"Binary Point"** like decimal point signifies boundary betw. integer and fractional parts:
1. Fixed point to representation of Fractions:
   - 10.1010<sub>2</sub> = 1x2<sup>1</sup> + 1x2<sup>-1</sup> + 1x2<sup>-3</sup> = 2.625<sub>10</sub> ,If we assume “fixed binary point”, range of 6-bit representations with this format: 0 to 3.9375 (almost 4).
2. **Floating Point**: "float the binary point".
3. **Overflow and Underflow**:
   - Overflow: Exponent larger than represented in 8-bit Exponent field
   - Underflow: Negative exponent larger than represented in 8-bit Exponent field
4. Floating Point:
   ![numberSummary]()
5. **Exponent decides how long is the ruler and Signficand is the actual ruler**.
   1. the minimum ruler is 2<sup>-149</sup>.
   2. In each exponent, it contains 2<sup>23</sup> rulers, and then ruler doubled.

---

- Notes:
  - Floating Point add is not associative: `(x + y) + z != x + (y + z)
  - High **precision** permits high **accuracy** but doesn’t guarantee it.
  - Rounding: to -∞, +∞, truncate, 0 or even.
  - float -> int -> float could change its value.
  - ![doublePrecision]()

