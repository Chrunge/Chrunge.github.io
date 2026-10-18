---
title: 进程间通信：管道与套接字
date: '2021-09-14 15:40:53.000000000 +08:00'
category: Computer Science / CS162
tags:
- CS162
description: 进程间通信：管道与套接字。整理Process State for File Descriptors、Some pitfalls with
  OS abstraction、IPC(Interprocess communication) and Sockets等要点
excerpt: 进程间通信：管道与套接字。整理Process State for File Descriptors、Some pitfalls with OS abstraction、IPC(Interprocess
  communication) and Sockets等要点
original_filename: Lecture-5-IPC-Pipes-and-sockets.md
toc_levels: h2,h3
date_source: original
legacy_url: "/blog/Lecture-5-IPC-Pipes-and-sockets-a1228e/"
layout: chapter
book_id: bda2fee7908f
chapter_index: 4
permalink: "/novels/bda2fee7908f/read/29290b7c1a10/"
---

## Process State for File Descriptors

1. For each process, kernel maintains mapping from **file descriptors** to **open file description**
2. （配图待补：第28页）
3. fork(): 包括会复制文件标示符, 共享同一批Files; 还共享network connection, 共享pipes 
4. dup() and dup2(): 复制文件标示符
<!-- more -->
## Some pitfalls with OS abstraction

1. **Don't fork() in a process that already has multiple threads**
   1. But it's safe if you call exec() in the child, replacing the entire address space.

2. **Don't carelessly mix low-level and high-level FILE I/O**

## IPC(Interprocess communication) and Sockets

1. 关键思想: 在进程之间/全世界进行通讯

2. int Pipe(int fileds[2])
    - （配图待补：第59页）
    - （配图待补：第63页）
    - （配图待补：第64页）
    - （配图待补：第65页）

3. 有了通讯, 则必有协议
   1. A protocol is an agreement on how to communicate.
      - Syntax: Format, order messages are sent and received.
      - Semantics: Actions taken when transmitting, receiving, or when a timer expires
4. 网络连接:
   1. 定义:不同机器上的两个进程之间的**双边字节流(two queues)**, 如TCP connections.
   2. Socket: An abstraction for **one endpoint** of a network connection, transiently hold result
      - listen(): start allowing clients to connect
      - accept(): create a new socket for a particular client 

5. （配图待补：第14页, Namesspaces for communication over IP）
   - Port: 80(web), 443(secure web), 25(sendmail) 
   - 5-Tuple identifies each connection:
      1. Source IP address
      2. destination IP address
      3. Source Port Number
      4. Destination Port Number
      5. Protocol

6. （配图待补：第24页, Socket with Protection and Concurrency）
   （配图待补：第18页, Client Protocol）
   （配图待补：第19页, Server Protocol）
   （配图待补：第25页, Server Protocol(v3)）
   （配图待补：第29页, Sockets with Concurrency, without Protection）



## 总结

   （配图待补：第79页）
