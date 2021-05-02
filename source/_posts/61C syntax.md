---
title: C commands
top: false
cover: false
toc: true
mathjax: true
date: 2021-04-14 08:33:48
password:
description: C的常用命令行
tags:
categories:
---

1. Compiling and Running a C program: `gcc program.c` and `./a.out`
2. Macros definitions: `#define CONSTANTS_NAME literal_value`
3. Debug: ` gcc -g -o hello hello.c` and `gdb hello`
   - Compiling `hello.c` with `-g` flag will store information in the executable program for `gdb` to make sense of it.
   - two kinds of bugs: *bohrbugs* and *heisenbugs*
