---
title: GDB
top: false
cover: false
toc: true
mathjax: true
date: 2021-11-08 20:36:28
password:
description:
tags:
- GDB
categories:
- Tools
---

## Pintos GDB

1. 三种中断点:
    - b function
    - b file:line
    - b *address(use a 0x prefix to specify an address in hex)
2. `l *address`: 列出地址附近的code
3. `p/a address`: 打印出该地址的函数名或者变量名
4. `debugpintos`: Attach debugger to a waiting Pintos process on the same machine. Shorthand for target remote localhost:1234.
	<!-- more -->
5. `dumplist &list type element`: 打印出list的元素, 可以打印线程list
6. `btthread thread`: 打印出thread的bt
7. `btthreadlist list element`: 打印出list中所有线程的bt, 如`btthreadlist all_list allelem` = `btthreadall`
8. `btpagefault`: 在pagefault exception之后, 打印出bt
9. `hook-stop`: 在仿真停止后, 它解释异常是发生在user code还是kernel code中.
10. `loadusersymbol program`: 当使用GDB来debug Pintos的user programs时, 需要它来加载程序的符号表. 

## GDB小技巧

`start`: 自动在main处临时暂停(类似于`b main`和`r`的组合键)

`Ctrl+X+A`: 窗口上部分展示源代码, very useful
`Ctrl+X+2`: 窗口上部分, 分别显示源码和汇编; 再按一次, 显示寄存器内容(已循环的方式显示)
`Ctrl P/N`: 上/下一条命令
`Ctrl+L`: 刷新窗口
`tui reg + 寄存器名字`: 显示寄存器, Known register groups are: sse, mmx, general, float, all, save, restore, vector, system

    用命令也可以：
    layout：用于分割窗口，可以一边查看代码，一边测试。主要有以下几种用法：
    layout src：显示源代码窗口
    layout asm：显示汇编窗口
    layout regs：显示源代码/汇编和寄存器窗口
    layout split：显示源代码和汇编窗口
    layout next：显示下一个layout
    layout prev：显示上一个layout
    Ctrl + L：刷新窗口
    Ctrl + x，再按1：单窗口模式，显示一个窗口
    Ctrl + x，再按2：双窗口模式，显示两个窗口
    Ctrl + x，再按a：回到传统模式，即退出layout，回到执行layout之前的调试窗口

**GDB内部支持Python**

## 不确定性Bug调试：使用reversible调试

1. 设置两个断点1， 2
2. command 2 record continue end; command 2 rerun end
3. reverse-stepi和reverse continue


## 其他参考资料
