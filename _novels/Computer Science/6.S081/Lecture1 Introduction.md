---
title: 操作系统导论：目标、内核与系统调用
date: '2026-05-10 09:50:16.000000000 +08:00'
category: Computer Science / 6.S081
tags:
- 6.S081
description: 操作系统导论：目标、内核与系统调用。整理Lecture 1等要点。
excerpt: 操作系统导论：目标、内核与系统调用。整理Lecture 1等要点。
original_filename: Lecture1 Introduction.md
toc_levels: h2,h3
date_source: file-created-or-modified
legacy_url: "/blog/Lecture1-Introduction-6aee42/"
layout: chapter
book_id: b145608faa58
chapter_index: 0
permalink: "/novels/b145608faa58/read/9a664caef334/"
---

## Lecture 1
1. 操作系统的目标: 
	1. ![笔记配图]({{ '/assets/images/imported/5be54130daa88a5f.png' | relative_url }})
	2. 硬件上: 抽象硬件, 共享硬件
	3. 进程与文件系统: 隔离性, 共享性, 安全性
	4. 调度: 允许程序获取高性能
	5. 其他: 面对不同的场景需求

2. Kernel提供的服务: 文件系统, 进程管理系统, Access Contuol机制, TCP/IP协议栈和一些驱动.
3. 学习Kernel的难点: ![笔记配图]({{ '/assets/images/imported/722ea6dbe651d367.png' | relative_url }})
4. 系统调用**需要看xv6书籍**
	1. read(fd, buf, size)
	2. fork(): fork会拷贝当前进程的内存, 在子进程中,fork会返回0; 在父进程中, fork返回子进程的ID. 两个进程的指令是一样的，数据是一样的，栈是一样的，同时，两个进程又有各自独立的地址空间，它们都认为自己的内存从0开始增长，但这里是不同的内存。
	3. exec: 加载指令到当前的进程中，并替换了当前进程的内存; 但会**保留**当前的文件描述符表单. 
	4. wait(&status): 父进程等待子进程退出. 
		1. &status，是将status对应的地址传递给内核，内核会向这个地址写入子进程向exit传入的参数. 
		2. wait的工作原理是，如果当前进程有任何子进程，并且其中一个已经退出了，那么wait会返回. 如果当前进程没有子进程, 则出错, 立即返回-1.


提问: 
1. 系统调用跳到内核与标准的函数调用跳到另一个函数相比，区别是什么？
	1. 函数的权限不同, Kernel中的代码有权限访问硬件.
