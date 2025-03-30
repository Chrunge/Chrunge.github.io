---
title: Unit8-Security
top: false
cover: false
toc: true
mathjax: true
date: 2022-02-26 16:25:35
password:
description:
tags:
- Security
- CS144
categories:
- Computer Network
---

1. Network Security Classes:
   1. Eavesdrop
   2. Modify, delete, insert: 
   3. Prevent communication: DDos

<!-- more -->
2. Types of attack:
   1. Eavesdropping in WiFi, optical cable and router
   2. Redirecting Ethernet, IP and DNS traffic
      1. When Rogue DNS server is faster to response to your DNS request.
         - ![DHCP and DNS masquerade](https://github.com/Chrunge/Pictures/blob/master/CS144/7/DHCP%20and%20DNS%20masquerade.png?raw=true)
   3. Hijacking a running TCP connection
      1. Middle in the attack, Routing redirection
   4. Denial of service

3. Goals: 
   1. Confidentially: no one can listen-in our communication => encryption.
   2. Integrity: Our messages are not altered in transmit => message authentication codes.
   3. Authentication: Confirm the identity of the other party.
   4. Uninterrupted communication 

## Common types of attack at Layer 3

1. Use ICMP to tell source end-host to redirect traffic
   1. An ICMP redirect message is an out-of-band message that is designed to inform a host of a more optimal route through a network, but possibly used maliciously for attacks that redirect traffic to a specific system.
   2. In this type of an attack, the hacker, posing as a router, sends an Internet Control Message Protocol (ICMP) redirect message to a host, which indicates that all future traffic must be directed to a specific system as the more optimal route for the destination. 
   - ![ICMP Redirect Attack]() 
2. BGP hijacking
   1. An AS can advertise IP addresses it doesn't own.
   2. An AS cannot verify that an ASpath is correct.
   3. ISPs exchange BGP messages over a regular TCP session. May introduce more specific but wrong prefix.

3. Distributed Denial of Service(DDos)
   1. Amplification: ENDS attack, SMURF attack
4. The SYN-bomb attack: OS can't handle arbitrary # partial connections
      1. Send SYN packets from bogus address
5. IP Fragment flooding: Kernel must keep IP fragments around for partial packets, Flood it with bogus fragments, as with TCP SYN bomb.
6. UDP echo port 7 replies to all packets

## Security Principles

1. Cryptography can helps a lot:
   1. Confidentially, Integrity, Authenticity.

2. Symmetric Encryption
   1. ![Symmetric Encryption](https://github.com/Chrunge/Pictures/blob/master/CS144/8/Symmetric%20Encryption.png?raw=true)

3. Integrity:
   1. Cryptographic Hash
   2. HMAC
      - ![HMAC](https://github.com/Chrunge/Pictures/blob/master/CS144/8/HMAC.png?raw=true) 
   3. MACing encrypted data is always secure

4. Cipher Block Chaining(CBC) Mode
   - ![Cipher Block Chaining(CBC) Mode](https://github.com/Chrunge/Pictures/blob/master/CS144/8/Cipher%20Block%20Chaining(CBC)%20Mode.png?raw=true)
   1. ECB(electronic code book)
      ![ECB(electronic code book)](https://github.com/Chrunge/Pictures/blob/master/CS144/8/electronic%20code%20book.png?raw=true) 

5. Public Key Cryptography
   - ![Confidentiality](https://github.com/Chrunge/Pictures/blob/master/CS144/8/Confidentiality.png?raw=true)
   - ![Integrity: Signature](https://github.com/Chrunge/Pictures/blob/master/CS144/8/Integrity:%20Signature.png?raw=true)
   - ![Popular Public Key Algorithms](https://github.com/Chrunge/Pictures/blob/master/CS144/8/Popular%20Public%20Key%20Algorithms.png?raw=true) 

6. Hybrid Schemes: Because non-symmetric cryptographic algorithm consumes time, so generally using public key to encrypt symmetric key.

## Certificates

1. Define: document signed by a private key K<sub>1</sub>-1 that binds a public key K<sub>2</sub> to an identity/name N.
   1. If we trust the signing party and know their public key, we can use K<sub>2</sub> when communicating with N.

2. "Everyone" trusts a few signing authorities knows their public key.
   1. Root authorities sign certificates for e.g. Stanford
   2. "Chain of trust": Stanford can use those certificates to sign further certificates.

## Transport Layer Security(TLS)

1. ![TLS Cipher Negotiation](https://github.com/Chrunge/Pictures/blob/master/CS144/8/TLS%20Cipher%20Negotiation.png?raw=true)
2. ![TLS Message Format](https://github.com/Chrunge/Pictures/blob/master/CS144/8/TLS%20Message%20Format.png?raw=true)
3. ![Establishing Session Keys](https://github.com/Chrunge/Pictures/blob/master/CS144/8/Establishing%20Session%20Keys.png?raw=true)