---
title: Unit4-Congestion-Control
top: false
cover: false
toc: true
mathjax: true
date: 2022-01-12 13:03:42
password:
description: CS144 notes for unit 4
tags:
- CS144
- Congestion_Control
categories:
- Computer Network  
---

## **Basic Ideas**

1. Basic approach
   - In the network
   - From the end host
2. TCP congestion control
   - TCP Tahoe
   - TCP Reno
   - TCP RTT Estimation
   - Performance in practice
<!-- more -->
3. Observation
   - If packets are dropped, then retransmission can make congestion even worse.
   - If packets are dropped, they waste resource upstream before they were dropped.
   - Need a definition of fairness.

4. Fairness: Max-Min Fairness: An allocation is **max-min fair** if you can not increase the rate of one flow without decreasing the rate of another flow with a lower rate.

5. **Goals** for congestion control:
   1. High throughput: Keep links busy and flows fast
   2. Max-min fairness
   3. Respond quickly to changing network conditions
   4. Distributed control

6. TCP implements congestion control at the **end-host**.
   - **React to events** observable at the end host(e.g. packet loss)
   - Exploits **TCP's sliding window** used for flow control.
   - Tries to figure out how many packets it can safely have outstanding in the network at a time.

7. Window size = min{Advertised window, Congestion window}
   - AIMD: Additive Increase, Multiplicative Decrease

## **AIMD**

1. Single flow
   1. `R = Window Size / RTT = constant = C`, C is the bottle link's maximum rate.
   2. If buffer size B = RTT * C, then the bottle utility is always 100%.  
2. multiple flow
   1. ![one flow vs multiple flow](https://github.com/Chrunge/Pictures/blob/master/CS144/4/one%20flow%20vs%20multiple%20flow.PNG?raw=true)
      1. ![Simple geometric intuition](zob-source/image/Simple_geometric_intuition.jpg)
   2. Bottleneck will contain packets from many flow.
   3. AIMD penalizes flow with long RTTs.

## **TCP congestion control I**

1. The congestion window specifies **how many unacknowledged segments** the connection can have outstanding in the network.
2. TCP Tahoe's three improvements:
   1. Congestion window
      1. ![Congestion window(TCP Tahoe)](https://github.com/Chrunge/Pictures/blob/master/CS144/4/Congestion%20window(TCP%20Tahoe).PNG?raw=true)
      2. ![TCP Tahoe FSM](zob-source/image/TCP_Tahoe_FSM.jpg)
   2. Timeout estimation 
      1. ![TCP Tahoe Timeouts](zob-source/image/TCP_Tahoe_Timeouts.jpg)
   3. Self-clocking
      1. By sending acknowledgements aggressively, it self-clocks data transmissions to **match the speed of the bottleneck link**.
      2. ![Self-Clocking Principle](https://github.com/Chrunge/Pictures/blob/master/CS144/4/Self-Clocking%20Principle.PNG?raw=true)

3. Three Questions:
   1. when TCP send new data: TCP sends new data when its sender window, defined as the **minimum of its congestion window and flow control window**, allow it to do so.
   2. When should you send data retransmissions: When one needs to estimate a retransmission or retry timer in a network protocol, consider not only the observed round trip time, but also its variance. 
   3. When should you send acknowledgments: Send acknowledgments aggressively

4. Three Mechanisms: fast retransmit, fast recovery, 
   1. ![Three Mechanism](zob-source/image/Three_Mechanism.jpg)
   2. ![TCP Tahoe](zob-source/image/TCP_Tahoe.jpg)
   3. ![TCP Reno](zob-source/image/TCP_Reno.jpg)
   4. ![Congestion Window Inflation](zob-source/image/Congestion_Window_Inflation.jpg)
   5. ![TCP Reno FSM](zob-source/image/TCP_Reno_FSM.jpg)