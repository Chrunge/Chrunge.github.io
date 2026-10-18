---
title: Unit2-Transport
top: true
cover: false
toc: true
mathjax: true
date: 2022-01-13 12:37:48
password:
description: Unit2-Transport
tags: 
- CS144
- Transport
categories:
- Computer Network
---

## **2.0 transport-intro**

1. Question:
   - How exactly does TCP set up a connection?
   - What do TCP segments look like?
   - How can two computers **reliably** transfer data with high performance?
     - reliable implement: checksum, cyclic redundancy checks(CRC), message authentication codes(MAC)
<!-- more -->
2. transport layer protocol: TCP, UDP, ICMP(internet control message protocol)
    UDP: simple, unreliable datagrams
    TCP: reliable, bidirectional byte stream

3. end-to-end principle

## **2.1 tcp-service-model**

1. TCP data encapsulation: 
   - ![TCP](https://github.com/Chrunge/Pictures/blob/master/CS144/2/TCP.png?raw=true)

2. Connection setup 3-way handshake:
   1. A sends a SYN(synchronize) to B, indicating that the TCP layer at A wants to establish a connection with the TCP layer at B.
   2. B responses with SYN+ACK. ACK represent B is acknowledging A's request and agreeing to establish the communication from A to B. SYN indicating B wants to establish a connection with A. (A->B的单向通道已建立)
   3. A responses with an ACK to accept the request. (B->A的单向通道已建立)

3. connection teardown:
   1. A send FIN to B to close A->B connection, B responses ACK and stops looking for new data from A. (拆除了A->B的单向通道, B可以继续向A发送数据)
   2. sometime later, B send FIN to A to close B->A connetion, A response ACK and stops looking for new data from B.
   3. when connection fully closed, the state can be safely removed.

4. TCP service model and Segment Format
   1. **The Sequence number** indicates the position in the byte stream of the first byte in the TCP Data field.
   2. **The Acknowledgment sequence number** tells the other end which byte we are expecting next.
   3. **checksum** is calculated over entire pseudo header(includes some IP header) and data for detecting corrupt data.
   4. **Header Length** tells how long the header is.
   5. **Window** for flow-control.
   6. **Urgent pointer** for the urgent bit.
   7. Flags:
      1. URG is urgent bit, TCP must inform the receiving-side upper-layer entity when urgent data exists and pass it a pointer to the end of the urgent data. 
      2. ACK flag tells that the Acknowledgment sequence number is valid and we are acknowledging all of the data up until this point.(第一次connect set to 0, 以后都set to 1, 前面的已确认收到)
      3. SYN flag tells us that we are signalling a synchronize.
      4. FIN flag signals the closing of one direction of the connection.
	  5. PSH flag tells the TCP layer deliver data immediately upon arrival.
      6. RST is reset bit, reset the connection because of something wrong.
	   6. offset is to tell where the data begin, because we may have options.????哪一段?
   - ![The TCP service mode](https://github.com/Chrunge/Pictures/blob/master/CS144/2/The%20TCP%20service%20mod.png?raw=true)
   - ![The TCP segment Format](https://github.com/Chrunge/Pictures/blob/master/CS144/2/The%20TCP%20segment%20Format.png?raw=true)

5. When host A suddenly creates a lot of new connections to Host B, it might still wrap around and try to create connections with the same global ID.
   1. [Wraparound concept](https://www.geeksforgeeks.org/wrap-around-concept-and-tcp-sequence-number/)
	   1. Case 1: Assume a packet is transferred very slow, the old connection has been deleted, and new connection is the same as the old connection. So how do we know the packet isn't the new connection's packet, one possible solution is **using a initial random sequence number**, though is not totally fool proof.
	   2. Case 2: It can happen at a high rate of traffic, all the sequence numbers got used up. The sequence number for every packet has to be unique but since it is finite (4 Giga) at some point in time the Sequence number is completely consumed up. 

6. Other features:
   - ![TCP Sliding Window](https://github.com/Chrunge/Pictures/blob/master/CS144/2/TCP%20Sliding%20Window.png?raw=true)

## **2.2 udp-service-model**

1. UDP(User Datagram Protocol)
   - 16-bit length tells header + data length.
   - checksum is optional.
     - if unused, all set 0;
     - if used, calculated over UDP header + data + a portion of the IPv4 header. The rationale for violating the layering principle and using information from the layer below(IPv4) is that it allows the UDP layer to detect datagrams that were delivered to the wrong destination.
   - ![UDP Datagram Format](https://github.com/Chrunge/Pictures/blob/master/CS144/2/UDP%20Datagram%20Format.png?raw=true)

2. UDP is merely a **Demultiplexing mechanism** to divide up the stream of UDP datagrams and send them to the correct process, called User Demultiplexing Protocol.
   - ![UDP](https://github.com/Chrunge/Pictures/blob/master/CS144/2/UDP.png?raw=true)

3. Apply: DNS(Domain Name System), DHCP(Dynamic Host Configuration Protocol)
4. UPD provides a simpler, datagram delivery service between application processes.

## **2.3 ICMP**

1. Making the Network Layer work
   - ![Making the Network Layer Work](https://github.com/Chrunge/Pictures/blob/master/CS144/2/Making%20the%20Network%20Layer%20Work.png?raw=true)
2. The ICMP Service Model
   - ![The ICMP Service Model](https://github.com/Chrunge/Pictures/blob/master/CS144/2/The%20ICMP%20Service%20Model.png?raw=true)
3. ICMP Message Types
   - ![ICMP Message Types](https://github.com/Chrunge/Pictures/blob/master/CS144/2/CMP%20Message%20Types.png?raw=true) 

4. How "ping" uses ICMP
   ![How "ping" uses ICMP](https://github.com/Chrunge/Pictures/blob/master/CS144/2/How%20ping%20uses%20ICMP.png?raw=true) 
5. How "traceroute" uses ICMP
   - ![How "traceroute" uses ICMP](https://github.com/Chrunge/Pictures/blob/master/CS144/2/How%20traceroute%20uses%20ICMP.png?raw=true)
   - ![Summary](https://github.com/Chrunge/Pictures/blob/master/CS144/2/Summary.png?raw=true)

## **2.4 end-to-end principle**

1. During the communication, Why Doesn't the Network Help?
   - Compress data?
   - Reformat/translate/improve requests?
   - Serve cached data?
   - Add security?
   - Migrate connections across the network?
   - Or one of any of a huge number of other things?

>**The end-to-end Principle**: The function in question can completely and correctly be implemented only with the knowledge and help of the application standing at the end points of the communication system. **Therefore, providing that questioned function as a feature of the communication system itself is not possible. (Sometimes an incomplete version of the function provided by the communication system may be useful as a performance enhancement.) We call this line of reasoning. . ."the end-to-end argument." - Saltzer, Reed, and Clark, End-to-end Arguments in System Design, 1984

>**Strong End to End**: The network's job is to transmit datagrams as efficiently and flexibly as possible. Everything else should be done at the fringes. . .– [RFC 1958]
   > Reason: The reasoning for the strong principle is flexibility and simplicity. If the network implements a piece of functionality to try to help the endpoints, then it is assuming what the endpoints do. For example, when a wireless link layer uses retransmissions to improve reliability so TCP can work better, it's assuming that the increased latency of the retransmissions is worth the reliability. This isn't always true. he link layer has incorporated improved reliabilityThere are protocols other than TCP, where reliability isn't important, which might rather send a new, different, packet than retry sending an old one. But because t, these other protocols are stuck with it. This can and does act as an impediment to innovation and progress. As layers start to add optimizations assuming what the layers above and below them do, it becomes harder and harder to redesign the layers. In the case of WiFi, it's a link layer that assumes certain behavior at the network and transport layers. If you invent a new transport or network layer, it's likely going to assume how WiFi behaves so it can perform well. In this way the network design becomes calcified and really hard to change.

## **2.5 Error Detection**

1. Three Error Detection Schemes:
   - ![Three Error Detection Scheme](https://github.com/Chrunge/Pictures/blob/master/CS144/2/Three%20Error%20Detection%20Scheme.png?raw=true)

2. The IPv4 header checksum is a checksum used in version 4 of the Internet Protocol (IPv4) to detect corruption in the **header** of IPv4 packets.
   1. Calculating:
      1. sum all 16-bit words
      2. add the carry bits back
      3. Flip bits, get the checksum(if result is 0xffff, don't flip)
         1. In IP, UDP and TCP, a checksum field of 0 means there's no checksum.
   2. Checking:
      1. add all 16-bit words, including checksum
      2. add the carry bits back, should be 0xffff
   3. [IPv4 Checksum theory](https://en.wikipedia.org/wiki/IPv4_header_checksum)
   ![IP Checksum](https://github.com/Chrunge/Pictures/blob/master/CS144/2/IP%20Checksum.png?raw=true)
 
3. CRC(Cyclic Redundancy Check):
   1. [Theory](https://web.archive.org/web/20220113075327/https://blog.csdn.net/qq_26652069/article/details/100578942)
      1. Calculating:  
         1. 选择一个多项式G，将它转化为二进制
         2. 多项式G的二进制有多少位bit, 就在M后添加多少个0bits，记为M_
         3. M_ XOR G(模二除法), 得CRC
         4. 将CRC添加至M末尾, 记为M', 再进行数据传输
      2. Checking:
         1. M' XOR G == 0
   ![CRC](https://github.com/Chrunge/Pictures/blob/master/CS144/2/CRC.png?raw=true)
   ![Diversion: CRC Mathematical Basis](https://github.com/Chrunge/Pictures/blob/master/CS144/2/Deversion%20CRC%20Mathematical%20Basis.png?raw=true)

4. MAC(Message Authentication Code)
   1. has both error detection and **security**, 保证数据在传输中不被篡改.
   ![MAC](https://github.com/Chrunge/Pictures/blob/master/CS144/2/MAC.png?raw=true)

## **2.6 Finite State Machine**

1. TCP有限状态机, 黑线的上方代表event,包括主动发起(粗体表示)的和被动接受的event, 下方表示action.
2. 对于C/S模式, Server listen, Client connect; 对于peer to peer模式, host可能同时发起连接, 服务器也可能变成客户端, 客户端也可能变成服务器.
3. 对于Close, 区分active和passive close; 可能双方同时关闭;一方先关闭, 另一方立马关闭; 一方先关闭, 然后等一段时间另一方再关闭.
   - ![TCP connection](https://upload.wikimedia.org/wikipedia/commons/a/a2/Tcp_state_diagram_fixed.svg)

## **2.7 Flow Control**

1. Stop and Wait:
   ![Stop and wait](https://github.com/Chrunge/Pictures/blob/master/CS144/2/Stop%20and%20wait.PNG?raw=true)

2. sliding windows:
   ![Sliding window sender](https://github.com/Chrunge/Pictures/blob/master/CS144/2/Sliding%20window%20sender.PNG?raw=true)
   ![sliding window receiver](https://github.com/Chrunge/Pictures/blob/master/CS144/2/sliding%20window%20receiver.PNG?raw=true)
   ![RWS,SWS, and Sequence Space](https://github.com/Chrunge/Pictures/blob/master/CS144/2/RWS,SWS,%20and%20Sequence%20Space.PNG?raw=true)

3. 一般情况下, RWS = SWS, 因为SWS是由RWS进行控制的, 同时, window是可变的.
   1. buffer > window, 如RWS = receiver buffer - buffered data, 且window是可变的(但sender window不推荐向前收缩).
   2. [TCP flow control详解](https://notfalse.net/24/tcp-flow-control)

4. Go-back-N protocol: 如果sender发生timeout, 则重传所有的未被ACK的packets. 对于receiver, 可以丢弃所有out-of-order packet, 因为sender会重传所有packet(丢弃out-of-order packet的缺点很明显,个人认为还是进行缓存).
   1. If RWS = 1, 就是 "go back N" protocol, 即如果某个packet dropped, 需要重新传N个packets, 因为receiver没有buffer cache.(N == SWS)

## **2.8 reliable connections**

1. Connection establishment
   1. 3-way handshake
   2. "simultaneous open": 4-way handshake.

2. Connection Teardown
   1. ![Connection teardown]()
   2. cleaning up safely
      1. send FIN, 如果中间的FIN和ACK lost, 则keep socket around for 2 MSL(Maximum segment lifetime)
      2. 也可以发送`RST`单方面结束socket.

