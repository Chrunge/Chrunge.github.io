---
title: Unit1-Internet-and-IP
top: false
cover: false
toc: true
mathjax: true
date: 2022-01-12 13:03:42
password:
description: CS144 notes for unit 1
tags:
- CS144
- IP
categories:
- Computer Network  
---

## **Unit 1: Internet and IP**

### **1.0 internet and ip book start**

1. Question:
   - what is Internet?
     - Answer: (Making IP run over any link layer made sense because the Internet was created specifically to) interconnect existing networks.
   - What is an Internet Address?
   - How do applications such as the web, Skype, and BitTorrent work?
<!-- more -->
2. **4-layer model of Internet**:
   1. Application
   2. Transport
   3. Network
   4. Link

3. Basic architectural ideas and principles:
   - Packet switching
   - Layering
   - Encapsulation

### **1.1 application**

1. Most applications use a **reliable, bidirectional byte stream** to communicate.

2.Application level controls communication pattern and payloads:

   1. World Wide Web: Client-Server(HTTP)
      1. request: GET, PUT, DELETE, and INFO
      2. response: 200 OK; 400 Bad Request
   2. BitTorrent: Tracker and Client, a tracker is a node that keeps track of what clients are members of the swarms.
      1. torrent file: describes some information about data file and tells BitTorrent about who the tracker is for that torrent.
   3. Skype: client behind NAT can open connections out to the Internet, but can't be opened from the Internet. So, you need a Rendezvous or Relay for communication.
      1. Case 1: Client B has a NAT, but client A hasn't. First, B open a connection to the rendezvous server, if A wants to connect to B, A firstly connect to rendezvous and then Rendezvous tells B to open a connection to A.
      2. Case 2: Client A and B both behind NAT, there is a relay needed to communicate between A and B.

### **1.2 four-layer**

1. **Layer allows each to focus on its job, without worrying about how the other layer works.**
   1. Each layer communicates with its peer layer.
2. Internet = end-hosts + links + routers.
3. Link Layer: to carry the data over **one link** at a time.
   1. including **Ethernet, WIFI, 3G...**
4. Network Layer: to deliver packets **end-to-end** across the Internet.
   1. Packet(datagram): a **self-contained** collection of data, plus a header that describes that the data is, where it is going and where it came from.
   2. IP makes a best-effort attempt, but datagrams can get lost, out of order or corrupted.
      - **Datagram**
      - **Unreliable**
      - **Best effort**
      - **Connectionless**
5. Transport Layer:
   1. TCP is the most common, it guarantees correct in-order delivery of data.
   2. UDP offers no delivery guarantees.
6. Application Layer: reuse Transport Layer by using well-defined API 
   1. http, bittorrent, skype
7. ![The 4 Layer Internet Model](https://github.com/Chrunge/Pictures/blob/master/CS144/1/The%204%20Layer%20Internet%20Model.png?raw=true)

8. Complementary material:
   - Ip is "the thin waist".
   - Layer 3 = Network, 2 = Link
9. ![The 7-layer OSI Model](https://github.com/Chrunge/Pictures/blob/master/CS144/1/The%207-layer%20OSI%20Model.png?raw=true)
10. ![IP is the thin waist](https://github.com/Chrunge/Pictures/blob/master/CS144/1/IP%20is%20the%20thin%20waist.png?raw=true)

### **1.3 IP service model**

1. Specified Packet unit name for each layer: Message => Transport Segment => IP Datagram =>Link Frame
2. IP's job is to deliver the datagram to the other end.
   1. IP datagrams consist of a header and some data.
   2. IP datagram => Linker Layer(Link frame) => router (decides next router by forwarding table) => IP destination address.
   3. ![The IP service Model](https://github.com/Chrunge/Pictures/blob/master/CS144/1/The%20IP%20service%20Model.png?raw=true)
3. Why IP is so simple?
   - faster, more streamlined and lower cost to build and maintain.
   - **end-to-end principle**: Where possible, implement features in the end hosts.
   - allows a variety of reliable and unreliable services to be built on top.
   - works over any link layer: IP makes very few assumptions about the link layer below.
4. Details
   1. Prevent packets looping forever: time to live = 128, which is the maximum number of hop.
   2. Fragment packets if they are too long.
      - Ethernet carry packets shorter than 1500bytes long.
      - Total packet length can be up 64KBytes.
   3. Uses a **header checksum** to reduce chances of delivering datagram to wrong destination.
   4. IP allows new fields to be added to the datagram header.
   5. IPv4 to IPv6.
   6. Protocol ID: tells us what is inside the data field, such as "6" tells us the data contains a TCB segment.
   7. Header Length: how long the header is
   8. Type of Service: gives a hint to routers about how important this packet is.
5. ![IPv4 Datagram](https://github.com/Chrunge/Pictures/blob/master/CS144/1/IPv4%20Datagram.png?raw=true)

### **1.4 Life of a packet**

1. TCP: three way handshake = "**SYN + SYN-ACK + ACK**"
   - TCP server port: 80
2. Router: router has **IP address** ,and **a forwarding table** consisting of a set of IP address patterns and the link to send across for each pattern. 
   ![Inside Each Hop]()
3. Routers use Longest Prefix Match.

### **1.5 Packet switching**

1. **Packet**: Break data into discrete, self-contained unit of data that carries information necessary for it to reach its destination.
2. Packet switching: Independently for each arriving packet, pick its outgoing link. If the link is free, send it. Else hold the packet for later.
3. **Flow**: A collection of datagrams belonging to the **same** end-to-end communication, e.g. a TCP connection.
4. Two nice properties: **Simple and Efficient**
   - A switch can make individual, local decisions for each packet.
   - Let a switch efficiently share a link between many parties.
     - Data traffic is bursty
       - Packet switching allows flows to use all available link capacity.
       - Packet switching allows flows to share link capacity.
       - This is called **Statistical Multiplexing**.
5. ![Packet Formats](https://github.com/Chrunge/Pictures/blob/master/CS144/1/Packet%20Formats.png?raw=true)

### **1.6 Principle layer**

1. Layer: Each layer provides a well-defined service to the layer above, using the services provided by layers below and its private processing.
   - Layers are functional components.
   - Layers communicate sequentially with the layers above and below.
2. Reason for layering:
   1. modularity
   2. well defined service
   3. reuse
   4. separation of concerns
   5. continuous improvement
   6. peer-to-peer communications(相同层级之间交流)
3. ![Layering in a computer system](https://github.com/Chrunge/Pictures/blob/master/CS144/1/Layering%20in%20a%20computer%20system.png?raw=true)

### **1.7 Principle encapsulation**

1. Encapsulation: the principle that unifies layering and packet switching.
2. **Layer N data is payload of layer N-1**: HTTP GET request is the payload of a TCP segment. TCP segment is the payload of an IP packet which is also the payload of a WiFi frame.(层层封装)
3. Encapsulation Flexibility: Encapsulation allows you to layer recursively.
   1. Example: ![VPN encapsulation]()
4. ![Encapsulation](https://github.com/Chrunge/Pictures/blob/master/CS144/1/Encapsulation.png?raw=true)

### **1.8 byte order**

1. Big endian: most significant byte is at lowest address(same as human readable number)
2. Little endian: least significant byte is at lowest address.
3. x86 processors from Intel and AMD are little endian; while ARM processors are big endian. Network Port is also big endian.
4. C Helper function: `htons()`, `ntohs()`, `htonl` and `ntohl()`
   - htons: host to network short
   - ntohl: network to host long
5. **Be careful!!!**

### **1.9 IPv4**

1. 32 bits long, written as 4 octets.
2. Netmask: apply this mask, if it matches, in the same local network. if not, go through an IP router.
   - two computers are in the same network if they take a bitwise AND with netmask and get the same resulting address.
3. Originally 3 classes of address: 
   - ![Address Structure](https://github.com/Chrunge/Pictures/blob/master/CS144/1/Address%20Structure.png?raw=true)
4. Address Structure Today: CIDR
   - ![Address Structure Today](https://github.com/Chrunge/Pictures/blob/master/CS144/1/Address%20Structure%20Today.png?raw=true)

### **1.10 Address Resolution Protocol**

1. ARP: It is a mechanism by which the network layer can discover the link address associated with a network address it's directly connected to.
2. IP address: describes a host, a unique destination at the network layer.
3. Link address: describes a particular network card. Ethernet has 48 bit addresses.
4. If a node's mapping doesn't contain a IP and link address mapping, then it will broadcasts a request:"who has the IP address, tell me your Link address". Other nodes can learn the requestor's IP and link address mapping, and only the node who owned the right IP responses its link address. Today, it is common to broadcast response.
5. Mapping can last 20 minutes for Mac OSX, or 4 hours for some Cisco devices.
6. ![Address Resolution Protocol](https://github.com/Chrunge/Pictures/blob/master/CS144/1/Address%20Resolution%20Protocol.png?raw=true)
7. ![APR Packet Format]()

### **1.11 internet and ip book end**

## **术语表**

1. APR: Address Resolution Protocol
2. CIDR: Classless Inter-Domain Routing
3. HTTP: HyperText Transfer Protocol
4. IANA: The Internet Assigned Numbers Authority
5. ICANN: the Internet Corporation for Assignment of Names and Numbers
6. NAT: Network Address Translation
7. RIRs: Regional Internet Registeries
8. TCP: Transmission Control Protocol
9. UDP: User Datagram Protocol
10. VPN: Virtual Private Network

## **网络工具**

1. Wireshark to show all of the packet, for example "tcp.port == 80 && ip.addr == xxx.xxx.x.x".
2. traceroute to observe the **path** that packets take through the Internet.

