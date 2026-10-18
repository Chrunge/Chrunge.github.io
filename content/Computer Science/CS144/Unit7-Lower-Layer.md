---
title: Unit7-Lower-Layer
top: false
cover: false
toc: true
mathjax: true
date: 2022-02-26 16:25:35
password:
description:
tags:
- CS144
- Lower_layer
categories:
- Computer Network
---

## Capacity and Modulation

1. Shannon Limit: Channel Capacity = B*log<sub>2</sub>(1+S/N)
   - B is Bandwidth, S is Signal strength, N is Noise.</br></br>

2. Amplitude Shift Keying(ASK): Represent number by different amplitude
   1. It works well in wired networks because signal strength does not decrease much with distance.
   2. PAM-5: five level pulse amplitude modulation, used in 100BASE-T and 1000BASE-T Ethernet
   3. PAM-16: used 10GBASE-T Ethernet
<!-- more -->
3. Frequency Shift Keying(FSK): Represent number by different frequency
4. Phase Shift keying(PSK): Represent number by different Phase
    1. PSK works well when there can be significant variations in signal strength. 
    2. DSL, cable modems, wireless all use phase shift keying
    3. Binary phase shift keying(BPSK):(0, pi)
    4. Quadrature phase shift keying(QPSK):(0, pi/2, pi, 3/2*pi)</br></br>

5. I/Q modulation: 
   1. I: in-phase component(0°)
   2. Q: quadrature component(-90°)
   3. A symbol is a linear combination of I and Q
   4. QAM: ![QAM]()


## Bit Errors and Coding

1. Bits vs Symbols: 
   - ![Bits vs Symbols]()
2. Adding a little redundancy at the physical layer can greatly improve link layer throughput
3. Coding gain: the ratio of bits at link layer to bits at physical layer
   1. 1/2 code: each link layer bit is 2 physical layer bits
   2. 3/4 code: each 3 link layer bits are 4 physical layer bits

## clocks and clock recovery

1. The receiver needs to know when to sample the arriving data: data is transmitted using a clock
2. Asynchronous communication
   - ![Asynchronous communication]() 
3. Synchronous Communication
   1. Adding clock into data stream, and receiver recover clock from the data.
      1. Approach 1: Manchester encoding
         - ![Manchester encoding]()
      2. Approach 2: 4b/5b encoding
         ![4b/5b encoding]() 
4. Summary: 
   - ![summary]()

## Forwarding Error Correction

1. 

## CSMA/CS Protocol

1. Ethernet shares a common cable between multiple hosts.
   1. To share the medium, we need to decide who gets to send, and when.
   2. There is a general class of "Medium Access Control Protocols", or MAC protocol.

2. Three classes of MAC protocol.
   1. Packet-switched Ratio Network(Random send)
   2. **Carrier Sense Multiple Access/Collision Detection(CSMA/CD)**
   3. Token Passing: using token to decide who has right to transfer.

3. Goal of MAC protocol:
   1. **High utilization** of the shared channel
   2. **Fair** among end host
   3. Simple and low cost to implement
   4. Robust to errors, fault tolerant.

4. Aloha Protocol:
   1. If you have data to send, transmit it.
   2. If your transmission "collides" with another, retry later.

5. **CSMA/CD** Protocol
   1. Carrier Sense: Check the line is quiet before transmit. If a frame from another node is currently being transmitted into the channel, a node then waits **until it detects no transmissions form a short amount of time** and then begins transmission.
   2. Collision Detection: Detect collision as soon as possible. If a collision is detected, stop transmitting; wait a random time, then return to step 1.

6. CSMA/CD packet size requirement:
   1. For an end host detect a collision before it finishes transmitting a packet, we require `P/R >= 2L/c`, where P is the size of packet.
   2. ![CSMA/CD packet size requirement]()

## Physical Links

1. Ethernet Frame Format
   1. ![Ethernet Frame Format]()
2. As R begin faster and faster
   1. To satisfy `P/R >= 2L/c`, we limit L to 100m from 100Mb/s and 1Gb/s.
   2. Introduce switching, we **partition** Ethernet networks to reduce the "collision domain".(以前只允许一条线路传输, 现在允许多条不冲突的线路同时传输)

## Wireless: CSMA/CA

1. Carrier sense multiple access/collision avoidance
   1. Pick random backoff
   2. sense local channel, transmit after backoff
   3. If packet not acknowledged, backoff again, retry.
   4. If packet acknowledged, accept next packet for transmission.

2. Problem I: Hidden Terminals
   - ![Hidden Terminals]()
3. Problem II: Exposed Terminals
   - ![Exposed Terminals]() 
4. Problem III: Collision or Low SNR
   - ![Collision or Low SNR]() 
