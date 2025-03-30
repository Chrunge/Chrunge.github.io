---
title: Unit6-Routing
top: false
cover: false
toc: true
mathjax: true
date: 2022-01-12 13:03:42
password:
description: CS144 notes for unit 6, Routing
tags: 
- Routing
- CS144
categories:
- Computer Network  
---

## Bellman Ford algorithm(Distance Vector Protocol)

1. Problem: how to find a minimum cost spanning tree?
   1. ![The Distributed Bellman-Ford Algorithm](https://github.com/Chrunge/Pictures/blob/master/CS144/6/Bellman-Ford%20example.jpg?raw=true)
   2. ![An example](https://github.com/Chrunge/Pictures/blob/master/CS144/6/Bellman-Ford%20example.jpg?raw=true)
   3. Bellman-Ford has a problem.
<!-- more -->
## Dijkstra's shortest path first algorithm(Link State Protocol)

1. ![Dijkstra's shortest path first algorithm](https://github.com/Chrunge/Pictures/blob/master/CS144/6/Dijkstra's%20shortest%20path%20first%20algorithm.jpg?raw=true)
2. ![The algorithm](https://github.com/Chrunge/Pictures/blob/master/CS144/6/The%20Dijskstra's%20example.jpg?raw=true)

## Routing in the internet

1. Hierarchy and Autonomous Systems
   1. Autonomous System(AS) as the basic unit of internet, includes: single exit and multi exit
      1. within an AS, the owner decides how routing is down
      2. Between AS's, use BGP-4(Border Gateway Protocol, v4)
      3. use `nc whois.cymru.com 43` and enter ip address to find AS number.
   2. Routing in multiple exit points:
      1. Approach 1: Hot-potato routing- send to closet exit
      2. Approach 2: Pick exit closet to destination
   3. Hierarchical structure: ISP -> regional ISP -> access ISP
2. Interior Routing Protocols
3. The structure of the internet

## BGP-4

1. ![BGP-4](https://github.com/Chrunge/Pictures/blob/master/CS144/6/BGP-4.jpg?raw=true)
2. ![BGP message](https://github.com/Chrunge/Pictures/blob/master/CS144/6/BGP%20messages.jpg?raw=true)

## Multicast routing

1. Reverse Path Broadcast(RPB, loop free) and pruning
   1. Routers **with no interested hosts** end prune messages towards source.
   2. Packets delivered **loop-free** to every end host.
   3. Resulting tree is **the minimum cost spanning tree** from source to the set of interesting hosts.
   - ![Reverse Path Broadcast](https://github.com/Chrunge/Pictures/blob/master/CS144/6/Reverse%20Path%20Broadcast.jpg?raw=true)

2. ![Addresses and joining a group](https://github.com/Chrunge/Pictures/blob/master/CS144/6/Addresses%20and%20joining%20a%20group.jpg?raw=true)
3. ![Multicast routing in the internet](https://github.com/Chrunge/Pictures/blob/master/CS144/6/Multicast%20routing%20in%20the%20internet.jpg?raw=true)

## How ethernet switches achieve free-loop?

1. Spanning tree protocol
2. ![Example spanning tree](https://github.com/Chrunge/Pictures/blob/master/CS144/6/Spanning%20Tree%20example.jpg?raw=true)
3. ![how it works](https://github.com/Chrunge/Pictures/blob/master/CS144/6/How%20it%20works.jpg?raw=true)