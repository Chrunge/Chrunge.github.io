---
title: Unit3-UDP and TCP
top: true
cover: false
toc: true
mathjax: true
date: 2022-01-13 12:37:48
password:
description: Unit3-UDP and TCP
tags: 
- CS144
- UDP
- TCP
categories:
- Computer Network
---

## **3.1 history of networks**

1. Beacon fire, carrier pigeons, horse > Heliographs > Semaphore telegraphs > Telephone > Internet
2. Five concepts: Codes, Flow control, Synchronization, Error Correction and Retransmission, Encryption.
3. Internet:
   1. Packet switch theory, queueing theory, TCP/IP, World wide web.
<!-- more -->
## **3.2 what is a packet switch**

1. Circuit Switch:
   1. The wire is **dedicated** to the phone conversation from the start to the end of the phone call, typically 64kb/s.
   2. Originally, a circuit was an end-to-end physical wire. But today, it is like a virtual private wire.
   3. Problem for computer communication: inefficient because of bursty, diverse rates, state management.

2. Packet switch:
   1. A packet switch consists of end-hosts, links, and packet switches.
   2. ![Packet switch](https://github.com/Chrunge/Pictures/blob/master/CS144/3/Packet%20switch.PNG?raw=true)
   3. ![Advantages](https://github.com/Chrunge/Pictures/blob/master/CS144/3/Advantages.PNG?raw=true)

## **3.3 end-to-end delay**

1. Propagation delay(传播延迟): l/c
2. Packetization delay(打包延迟): The time from when the first to the last bit of a packet is transmitted, p/r
   1. **The data-rate of a link** is determined by how close together we can pack the bits.
   2. Internet routers are **"store and forward"** packet switch.
3. Queueing delay: the time to walk through buffers of the routers.
   1. Queueing delay makes end-to-end delay is variable, so we use playback buffer to absorb the variation.
4. Total Delay = Sum~i~(p/r~i~ + l~i~/c +Q~i~(t))

## **3.5 Packet switching**

1. why not send the entire message in one packet?
   1. reduce overall packetization delay, make it pipeline.

2. Statistical Multiplexing: Even there are N link whose rate all are R, the egress link need not run at rate N*R because of the bursty data; the buffer absorbs brief periods then the aggregate rate exceeds egress link rate.

3. how to execute average queue occupancy, average delay?

4. Bursty increase delay, determinism minimizes delay.

5. Little law:
   1. the number in the queue = arrive rate * average waiting time.
   2. Many events' arrive process is a Poisson process, but packet arrivals are not.

## **3.6 Strict priorities and guaranteed flow rates**

1. FIFO
2. Strict priority: High priority traffic always be treated. Only useful at a very limited high priority traffic ,or starve low priority traffic.
3. Weighted Fair Queueing(WFQ): give each flow a guaranteed service rate, by scheduling them in order of their **bit-by-bit** finishing times. 
   1. `r_i = w_i/Sum(w_i) * R`, buffer size = B, so the maximum queueing time = B / r_i.

4. But how do we make sure no packets are dropped.
   1. Any period of length t is bounded by: `B+R*t`, so that packets will not be dropped.
   2. How to achieve it: **The leaky bucket regulator**
      - ![The leaky bucket regulator](https://github.com/Chrunge/Pictures/blob/master/CS144/3/The%20leaky%20bucket%20regulator.PNG?raw=true)
      - how the values for B and R get told: IETF protocol called RSVP(IETF RFC 2205)
   3. But in practice, very few networks actually control end-to-end delay.

## **Packet Switch**

1. Device: Ethernet Switch and Internet router
2. ![Ethernet Switch](https://github.com/Chrunge/Pictures/blob/master/CS144/3/%5BEthernet%20Switch.PNG?raw=true)
3. ![Internet Router](https://github.com/Chrunge/Pictures/blob/master/CS144/3/Internet%20Router.PNG?raw=true)
4. Lookup Address:
   1. Ethernet Switch: store address in hash table(maybe 2-way hash); Look for **exact** in hash table.
   2. Internet Router: Longest Prefix Matching, compare address against every masked entry **at the same time**(using Ternary Content Addressable Memory)

5. Output queueing and shared memory:
   1. throughput is maximized
   2. expected delay is minimized.
   3. **They are work conserving**, memory is dedicated to a particular output alone, easily overflow.
6. Input Queued packet switch:
   1. It has **Head of Line Blocking** problem, inefficient.
7. High performance switches ofter use **input queueing**, with **virtual output queues** to maximize throughput.
