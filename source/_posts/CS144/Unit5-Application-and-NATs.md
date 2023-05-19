---
title: Unit5-Application-and-NATs
top: false
cover: false
toc: true
mathjax: true
date: 2022-01-12 13:03:42
password:
description: CS144 notes for unit 5
tags:
- CS144
- NATs
categories:
- Computer Network  
---

## HTTP,Hypertext Transfer Protocol

1. HyperText is a document format that lets you include formatting and content information in a document.
2. HyperText is all ASCII text, it's human readable. And with hypertext, you can embed documents, or files, inside other files.
<!-- more -->
3. In HTTP, a client opens a TCP connection to a server and sends commands to it.
4. Command: `GET, PUT, POST, DELETE, INFO......`
5. Response: `200 OK, 400 Bad Request, 404 Not Found......`
6. ![HTTP Request Format](https://github.com/Chrunge/Pictures/blob/master/CS144/5/HTTP%20Request%20Format.PNG?raw=true)
7. ![HTTP Response Format](https://github.com/Chrunge/Pictures/blob/master/CS144/5/HTTP%20Response%20Format.PNG?raw=true)
8. [More information about request and response](https://developer.mozilla.org/en-US/docs/Web/HTTP)
9. HTTP1.0
   - Open connection
   - Issue GET
   - Server closes connection after response
10. HTTP1.1,Keep Alive header
   1. ![HTTP/1.1](https://github.com/Chrunge/Pictures/blob/master/CS144/5/HTTP_1.1.PNG?raw=true)
11. SPDY
    1. If would be nice if the server could **respond in a different order**, and say start sending the static resources while the page is being generated. 

## BitTorrent

1. ![Torrent File]()
2. ![Torrent Files](https://github.com/Chrunge/Pictures/blob/master/CS144/5/Torrent%20File.PNG?raw=true)
3. 
   1. Peers periodically exchange metadata on which pieces they have.
   2. Download rarest pieces: **rarest first policy**
   3. When down to the last few pieces, ask for them form multiple peers.
4. ![Whom to talk to](https://github.com/Chrunge/Pictures/blob/master/CS144/5/Whom%20to%20talk%20to.PNG?raw=true)
5. ![BitTyrant](https://github.com/Chrunge/Pictures/blob/master/CS144/5/BitTyrant.PNG?raw=true)

## Network Address translator(NAT)

1. NAT has a public ip address and gives each hosts a private ip address.
2. NAT has internal interface and external interface. When a request from internal host, NAT will substitute the private source ip and port, send it, **create a mapping about internal ip/port pair and external ip/port pair in it**. When packets from external host, NAT will find correct mapping to translate it. If success, translate the destination ip/port to correct private ip/port and port; if not, drop the packet. 
3. Four Types NATs:
   1. Full Cone NAT(least restrictive): translate packet only has the correct destination ip/port.
   2. Restricted Cone NAT: translate packet that has the same source ip puls correct destination ip/port.
   3. Port Restricted NAT: translate packet that has the same source ip/port plus correct destination ip/port.
   4. Symmetric NAT: First, it is Port Restricted NAT. And second, for packets from the same internal ip/port to different destinations, NAT will substitute different port for these packets. 
      - Problem: when server S tell the host A to connect server S', A will use a new port to connect server S', which cause the connection break.

4. Hairpinning: packet from internal address to external address translated properly(internal mapped to external)(two internal hosts communicate with each other, if one use the external ip/port to establish connection, then the other should also through NAT to communicate, like a hairpin)
5. When A host behind NAT, B want to establish a connection to A. Need a rendezvous for connection reversal.
6. When A and B both behind NAT, need a relay to communication.
   1. NAT Hole-Punching: If you need a direct connection from A to B, server tell A about A and B external ip/port and A's NAT set the mapping, so B's NAT does. Then, A and B can establish connection to each other. But Symmetric NAT can not do this.

7. Reference: [NAT RFC1631](https://datatracker.ietf.org/doc/html/rfc1631), [NAT terminoloy/classification in RFC3489](https://datatracker.ietf.org/doc/html/rfc3489), [TCP recommendations in RFC5382](https://datatracker.ietf.org/doc/html/rfc5382), [UDP recommendations in RFC4787](https://datatracker.ietf.org/doc/html/rfc4787)

## Domain Name System(DNS)

1. Map names to addresses(more generally, values)
2. Two properties about design: Read-only or read-mostly database, loose consistency
   1. Resolver can cache it and answer other query.
3. DNS servers: 13 root servers, highly replicated
   1. `root -> edu -> stanford -> cs`
   2. Each zone can be separately administered
   3. Each zone served from several replicated servers
4. A DNS query: Recursive and non-recursive query
   1. use UDP 53 or TCP 53 port
5. ![DNS Name Architecture](https://github.com/Chrunge/Pictures/blob/master/CS144/5/DNS%20Name%20Architecture.PNG?raw=true)

### Resource Records

1. ![Resource Records](https://github.com/Chrunge/Pictures/blob/master/CS144/5/Resource%20Records.PNG?raw=true)
2. RR types:
   1. A: IPv4 address
   2. NS: the hostname of a server
   3. CNAME: the canonical-name of alias-name
      - MX records cause A record processing for mail-server-name
      - ![MX records](https://github.com/Chrunge/Pictures/blob/master/CS144/5/Mx%20Records.PNG?raw=true)

   4. SOA(Start of Authority), TXT, PTR(map address to name), AAAA(IPv6)
3. ![DNS Header Structure](https://github.com/Chrunge/Pictures/blob/master/CS144/5/DNS%20Header%20Structure.PNG?raw=true)
4. ![DNS Name Compression](https://github.com/Chrunge/Pictures/blob/master/CS144/5/DNS%20Name%20Compression.PNG?raw=true)
5. Glue records:
   1. The .edu name servers have NS records for stanford.edu
   2. The .edu name servers also have A records for argus.stanford.edu

## Dynamic Host Configuration Protocol(DHCP)

1. Need four things:
   1. IP address
   2. subnet network
   3. Gateway router
   4. A DNS server IP address is also useful

2. A machine can request configuration from a DHCP server:
   1. Discover(broadcast): UDP packet, client port 68, server port 67, broadcast IP address: 255.255.255.255
   2. offer
   3. request
   4. ack
   5. release or re-request before expire