---
title: cs61b-20fall
top: true
cover: false
toc: true
mathjax: true
date: 2020-10-22 18:24:22
password: 
description: Berkeley的数据结构和算法课程
tags: 
- CS61B
- Java 
- Data_Structure
- Algorithm
categories: 计算机基础
---

## **24 Compression, Complexity and N = NP ?**

1. Default Codes:
   - By default, English text is usually represented by sequences of characters, each 8 bits long, e.g. ‘d’ is 01100100. Such as below:
      word | binary | hexadecimal
      -- | -- | --
      dog | 01100100  01101111  01100111 | 64 6f 67
   - Easy way to compress: Use fewer than 8 bits for each letter.
      - Have to decide which bit sequences should go with which letters.
      - More generally, we’d say which **codewords** go with which **symbols**.
   ![Default codes](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61B/Compression/Default%20codes.png)

2. Prefix free codes:

   - A prefix-free code is one in which no codeword is a prefix of any other. Example for English:
   - ![Prefix Codes1](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61B/Compression/Prefix%20Code1.png)
   - ![Prefix Codes2](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61B/Compression/Prefix%20Codes2.png)
   - Observation: Some prefix-free codes are better for some texts than others.
   ![compare two prefix codes](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61B/Compression/compare%20two%20prefix%20codes.png)
   - Observation: It’d be useful to have a procedure that calculates the “best” code for a given text.

3. Shannon Fano Codes:
   - Count **relative frequencies** of all characters in a text.
   - Split into **'left' and 'right halves'** of roughly equal frequency.
      - Left half gets a leading zero. Right half gets a leading one.
Repeat.
      - Left half gets a leading zero. Right half gets a leading one.
Repeat.
   - ![Shannon Fano Codes](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61B/Compression/Shannon%20Fano%20Codes.png)

4. Huffman Coding:
   - Calculate relative frequencies.
      - Assign each symbol to a node with weight = relative frequency.
      - Take **the two smallest nodes and merge them** into a super node with weight equal to sum of weights.
      - Repeat until everything is part of a tree.
   ![Huffman Coding](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61B/Compression/Huffman%20Coding.png) 
   - Two possible philosophies for using Huffman Compression:
      - For each input type (English text, Chinese text, images, Java source code, etc.), assemble huge numbers of sample inputs for that category. Use each corpus to create a standard code for English, Chinese, etc.
      - For every possible input file, create a unique code just for that file. Send the code along with the compressed file.
5. For encoding, what is a natural data structure to use?(bitstream to compressed bitstream)
   - Array of BitSequence[], to retrieve, can use character as index.
   - HashMap<Character, BitSequence>
6. For decoding, what is a natural data structure to use?
   - we need to look up **longest matching prefix**, an operation that Tries excel at.

---

1. Compression general idea: Exploit redundancy and existing order inside the sequence.
   - Sequences with no existing redundancy or order may actually get enlarged.

2. Other compression Theory:
   - Run-length encoding: Replace each character by itself concatenated with the number of occurrences.
      - Rough idea: XXXXXXXXXYYYYXXXXX -> X10Y4X5
   - LZW: Search for common repeated patterns in the input.
   - Demo Example: http://goo.gl/68Dncw
   - LZW decompression example: http://goo.gl/fdYU9C


3. No algorithm can compress any bitstream by 50%.
   - Augument 1: If possible, we are able to compress any bitstream down to a single bit.
   - Argument 2: There are far fewer short bitstreams than long ones(pigeon hole principle). Guaranteeing compression even once by 50% is impossible.
     - There are 21000 1000-bit sequences.
     - There are only 1+2+4+...+2500  = 2501 - 1 bit streams of length ≤ 500.
     - In other words, you have 21000 things and only 2501 - 1 places to put them.
     - Of our 1000-bit inputs, only roughly 1 in 2499 can be compressed by 50%!
4. As a model for the decompression process, let’s treat **the algorithm and the compressed bitstream as a single sequence of bits** to avoid this kind of trick.
![compression trick](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61B/Compression/compression%20trick.png)

5. Summary: Compression: Make common bitstreams more compact.
   1. Huffman coding:
      - Represents common symbols as codeword with fewer bits.
      - Uses something like Map<Character, BitSeq> for compression.
      - Uses something like TrieMap<Character> for decompression.
   2. LZW:
      - Represents multiple symbols with a single codeword.
      - Uses something like TrieMap<Integer> for compression.
      - Uses something like Map<Character, SymbolSeq> for decompression.

---

1. Question 1: What is the **optimal algorithm** to compress a given bitstream? Answer: No "optimal compression" algorithm exists.
2. Question 1S: Space Bounded Compression. Answer: No!
3. Question 1SS: Space/Time Bounded Compression. Have a answer to exist or not exist.
4. Question 2: **Comprehensible** Compression
   1. Can we create a “comprehensible” compression algorithm that takes as input a target bitstream B, and outputs useful, readable Java code? (short ?= simple)
5. Kolmogorov Complexity:
   1. Definition: The Java-Kolmogorov complexity KJ(B) is the length of the shortest Java program (in bytes) that generates B.
   2. Fact 1: Kolmogorov Complexity is effectively **independent** of language.
   3. Fact2 : It is impossible to write a program that even calculates the Kolmogorov Complexity of any bitstream.
6. P = NP ?
   1. P: Efficiently solvable problems.
   2. NP: Problems with solutions that are efficiently verifiable.
   ![NP complete](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61B/Compression/NP%20complete.png)


## **23 Compare Sort**

1. Inversions: an **inversion** is a pair of elements that are out of order with respect to <.
   - Given a sequence of elements with Z elements, reduce inversions to 0;
2. Bubble sort: A algorithm that repeatedly steps through the list, **compares adjacent pairs and swaps** them if they are in the wrong order until the list is sorted.
3. Selection Sort and Heap Sort:
   1. Selection Sort In Place: Find the smallest item in the unsorted portion of the array.
   2. Naive Heap Sort: Maintain a new max-Heap and insert every item into it, then get the max item and put it in the last index of the array.
   3. In-place Heap Sort(no auxiliary data structure):
      1. Bottom-up heapify input array.(从右往左进行堆化操作)
         - Sink nodes in reverse level order.
         - After sinking, guaranteed that tree rooted at position k is a heap.
      2. Delete largest item from the max heap and put it to on the behind of the heap.
4. MergeSort: MergeSort each half.(Recursive!)
      - Merge the two sorted halves to form the final result.  
        - Compare `input[i] <input[j]`;
        - Copy smaller item to `p` index and increment `p` and `i` or `j`.
        - ![Code](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61B/Compare%20Sort/merge.png)
        - ![Code](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61B/Compare%20Sort/MergeSort.png)
        - MergeSort memory: n + n/2 + n/4 + .... = Θ(N). Only this stack memory is reclaimed, then continue to add the next stack memory.
5. Quick Sort and Binary Search Tree: randomly get an item and find it right place.
      1. Randomly select an item, put the other smaller items in it's left position and larger items in right position!(The idea is likely **inserting items randomly to a binary search tree!**)
6. Insertion Sort and Shell Sort:
      1. Insertion Sort: Step through the array, get the **first unsorted item** and find the right position for each item in the sorted array.(The idea is **reduce inversions to zero**!)
      2. Shell Sort: Compare insertion sort, shell sort take every h-th entry to yield a sorted subsequence, so **every swap operation** can reduce `h` inversions, until h to 1.(The idea is **reduce the number of swap operation** compare to Insertion Sort!)
7. Summary:
    - | Memory | Compares | Notes | Stable?
   -- | -- | -- | -- | --
   Heapsort | Θ(1) | Θ(N log N) | Bad caching (61C) | No
   Insertion | Θ(1) | Θ(N2) | Best for almost sorted and N < 15 |Yes
   Mergesort | Θ(N) | Θ(N log N) | Fastest stable sort | Yes
   Quicksort LTHS | Θ(log N) | Θ(N log N) expected | Fastest sort | No

8. Notes:
   - N! > (N/2)**N/2 => log(N!) ∈ Ω(N log N)
   - N! < N**N => log(N!) ∈ O(N*logN)
   - so **log(N!) = Θ(N log N)**
   - How many questions would you need to ask to definitely solve the generalized "puppy, cat, dog" problem for N items?
     - Construct a full decision tree(like BST) to for N items which including N! permutations, and each leaf represents a permutation and for get it, it will take on average the number of the height of tree which is log(N!) comparisons.
     - So TUSC's answer: Ω(log(N!))
     - **So any comparison based sort requires at least order N*logN comparisons in its worst case.**

## **22 Radix Sort**

1. Sleep Sort....
2. Counting Sort: (idea: Create a new array, Copy item with key i into ith entry of new array)
   1. Assuming keys are unique integers.
   2. ![counting sort](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61B/Radix%20Sort/1.png)
3. More complex cases: Non-unique keys, Non-consecutive keys, Non-numerical keys.
   1. Alphabet case: Keys belong to a finite ordered alphabet.
   2. ![alphabet case](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61B/Radix%20Sort/2.png)
   3. Total runtime on N keys with alphabet of size R: **Θ(N+R)**, so if N is ≥ R, then we expect reasonable performance.
4. LSD(Least Significant Digit) Radix Sort:
   1. Not all keys belong to finite alphabets, e.g. Strings. But Strings consist of characters from a **finite** alphabet.
   2. Sort each digit independently from rightmost digit towards left.(such as using multiple counting sorts)
   3. ![LSD Sort](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61B/Radix%20Sort/3.png)
5. MSD(Most Significant Sort) Radix Sort:(key idea: sort each subproblem separately.)
   1. Just like LSD, but sort from leftmost digit towards the right.
   2. Best Case: The left alphabet is total different, Θ(N + R).
   3. Worse Case: we have to look at every character, degenerating to LSD sort, Θ(WN + WR).
   4. ![MSD Srot](https://raw.githubusercontent.com/Chrunge/Pictures/master/CS61B/Radix%20Sort/4.png)
6. Summary:
   - | Memory | Compares | Notes | Stable?
   -- | -- | -- | -- | --
   Heapsort | Θ(1) | Θ(N log N) | Bad caching (61C) | No
   Insertion | Θ(1) | Θ(N2) | Best for almost sorted and N < 15 |Yes
   Mergesort | Θ(N) | Θ(N log N) | Fastest stable sort | Yes
   Quicksort LTHS | Θ(log N) | Θ(N log N) expected | Fastest sort | No
   Counting Sort | Θ(N+R) | Θ(N+R) | Alphabet keys only | Yes
   LSD Sort | Θ(N+R) | Θ(WN+WR) | Strings of alphabetical keys only | Yes
   MSD Sort | Θ(N+WR) | Θ(N+R) (best) <br> Θ(WN+WR) (worst) | Bad caching (61C) | Yes

## **20 Special course: software engineer I**

1. Complexity Defined:
   - "Complexity is anything related to the structure of a software system that makes it hard to **understand and modify** the system."
      - **Understanding** how the code works.
      - The amount of **time** it takes to make small improvements.
      - **Finding** what needs to be modified to make an improvement.
      - Difficult to **fix** one bug without introducing another.

2. Dealing with complexity:
   - Making code **simpler** and more **obvious**.
      - Eliminating special cases, e.g. sentinel nodes.
      - In an obvious system, to make a change a developer can :
        - Quickly understand how existing code works.
        - Come up with a proposed change without doing too much thinking.
        - Have a high confidence that the change should actually work, despite not reading much code.

   - Encapsulation into modules.
      - In a modular design, creators of one "module" can use other modules without knowing how they work.

   - advice: Ousterhout recommends a zero tolerance philosophy, redesign it when you dissatisfied it.

3. Complexity and Important:
   - Complexity also depends on how often a piece of a system is modified.
      - A system may have a few pieces that are highly complex, but if nobody ever looks at that code, then the overall impact is minimal.

   - Ousterhout's book gives a crude mathematical formulation:
      - C = sum(c_p * t_p) for each part p.
        - c_p is the complexity of part p.
        - t_p is the time spent working on part p.

4. **Symptoms and Causes** of Complexity:
   - Ousterhout describes three symptoms of complexity:
     - Change amplification: A simple change requires modification in many places.
     - How much you need to know in order to make a change.
     - Unknown unknowns: The worst type of complexity. This occurs when it's not even clear what you need to know in order to make modifications!
   - Two primary source of complexity:
     - **Dependencies**: When a piece of code cannot be read, understood, and modified independently.
     - **Obscurity**: When important information is not obvious.

5. Strategic vs. Tactical Programming:
   - Tactical Programming: only focus on getting something work.
   - Strategic Programming: For new each class/task,
      - Rather than implementing the first idea, try coming up with (and possibly even partially implementing) a few different ideas.
      - When you feel like you have found something that feels clean, then fully implement that idea.
      - In real systems: Try to imagine how things might need to be changed in the future, and make sure your design can handle such changes.

## **Special Course:software engineer II**

1. For project 3 advices:
   1. Avoid repetitive codes.
      - Information leakage: Occurs when design decision is reflected in multiple modules, which makes any change to one requires a change to all.
        - One of the biggest causes of information leakage, especially on BYOW, is "temporal decomposition."
        - In temporal decomposition, the structure of your system reflects the order in which events occur.
   2. Write some comments.
   3. Write code on high level:
      - Writing everything at a low level makes it very hard to spot errors and debug it. One approach is assigning intermediate calculations to named variables.(Hiding complexity: write more helper functions, break one assignment to series of small tasks.)
      - Not very extensible.
   4. Modular design: Break down system into modules, where every module would be totally independent.
      - Here, "module" is an informal term referring to a class, a package, or other unit of code.
      - Not possible for modules to be entirely independent, because code from each module has to call other modules.(our goal is to minimize dependencies between modules.)
         - e.g. need to know signature of methods to call them.
      - Ousterhout: "The best modules are those that provide **powerful functionality** yet have **simple interfaces**. I use the term *deep* to describe such modules."

   5. **Teamwork**
      - Collective intelligence is not significantly correlated with average or max intelligence of each group.
      - Instead, collective intelligence was correlated with three things:
         - Average social sensitivity of group members as measured using the "Reading the Mind in the Eyes Test" (this is really interesting).
         - How equally distributed the group was in conversational turn-taking, e.g. groups where one person dominated did poorly.
         - Percentage of females in the group (paper suggests this is due to correlation with greater social sensitivity).

## ** Software Engineer III**

   1. Candy Crush and Friends
      1. Positive impacts:
         - Free dopamine.
         - Help reduce isolation.
      2. Negative impacts:
         - Huge time sink, bad use of our precious finite time.
         - Encourages addictive behavior.
         - Less rich experience than real life. Discourages higher quality reaction.
         - Potential damage to your dang eyes by looking at your phone (?).
         - False sense of accomplishment.
         - Locks people into specific platforms.
   2. Khan Academy:
      1. Positive impacts:
         - Vastly increases accessibility to education.
         - Allows for mastery learning: Can iterate until you understand something.
         - Allows you to explore topics beyond your formal schooling.
         - Draw on expertise of the entire world of teachers in theory.
         - Massive FREE bank of resources for teachers.
      2. Negative impacts:
         - Gamifies learning. Motivation becomes extrinsic. You may just learn how to do things without understanding the underlying thinking.
         - **Undermines value of beating your head against a problem -- you never get truly stuck, which is important for learning.**
         - In physics: Watch Khan Academy videos, but if you don’t understand the videos, you can’t ask questions. You rely on the source video being perfect / aligned with your way of thinking.
         - Discourages group discussion problem solving. 

   3. [The ledger of Harms](https://ledger.humanetech.com/) and [996.icu](https://github.com/996icu/996.ICU) 
      - Making Sense of the World: Misinformation, conspiracies, fake news.
      - Attention: Loss of ability to focus without distraction.
      - Physical and Mental Health: Stress, loneliness, addiction, risky behavior.
      - Relationships: Less empathy, more confusion and misinterpretation.
      - Politics and Elections: Propaganda, distorted dialogue, disrupted democratic processes.
      - Systemic Oppression: Amplification of discrimination.
      - Children: Developmental delays, suicide, physical/mental/social changes.,
      - Do Unto Others: Tech employees limit tech usage in their own homes.

   4. Your Life
      1. The power of software: Unlike other disciplines,Programming is an act of almost pure creativity! The greatest limitation we face in building systems is being able to understand what we’re building!
      2. Time:Each week is 168 hours.
         - ~40 hours of work.
         - ~56 hours of sleep.
         - ~72 hours for everything else.

      **Spend your time wisely, in both your career and personal life.**

## **19 Reduction and decomposition**

1. Topological sort: reverse DFS **post-order** list. (DFS pre-order, BFS??)
   - Another better topological sort algorithm:
      - Run DFS post-order from an arbitrary vertex.
      - If not all marked, pick an unmarked vertex and do it again.
      - Repeat until done.

2. Shortest paths on DAGs with **negative** numbers.
   - One simple idea: Visit vertices **in topological order.**
      - On each visit, relax all outgoing edges.
      - Each vertex is visited only when all possible info about it has been used!

3. Longest Paths Problem:
   - No answer for undirected graphs.
   - The Longest Paths Problem on DAGs:
     1. Flip the weight of all paths.
     2. Therefore the longest path problem is converted to the shortest paths in DAGs with negative weights.

4. Conclusion:
   Problem | Problem description | Solution | Efficiency 
   -- | -- | -- | -- |
   topological sort | Find an ordering of vertices that respects edges of our DAG. |[Demo](https://docs.google.com/presentation/d/1Bvf4PooGooUCr-K9cA1kbhsNc0hXW5Jwn-QD0in-1pc/edit#slide=id.g99668982c_1_693) <br> Code: Topological.java | O(V+E) time <br> Θ(V) space
   DAG shortest paths | Find a shortest paths tree on a DAG. | [Demo](https://docs.google.com/presentation/d/1CfnLS3FSXV8X2sXPTravZGXeBUUkcFQv7Uf2iGWGUfs/edit#slide=id.g76e0dad85_2_380) <br> Code:[AcyclicSP.java](https://algs4.cs.princeton.edu/44sp/AcyclicSP.java) | O(V+E) time <br> Θ(V) space
   longest paths | Find a longest paths tree on a graph. | No known efficient solution. | O(???) time <br> O(???) space
   DAG longest paths | Find a longest paths tree on a DAG. | Flip signs, run DAG SPT, flip signs again. | O(V+E) time s<br> Θ(V) space

5. Reduction: "If any subroutine for task Q can be used to solve P, we say P reduces to Q."

## **18 Minimum Spanning Trees**

1. Properties of Minimum Spanning Trees
   - Tree: isConnected and Acyclic
   - Include all vertices
2. Application: Old school handwriting recognition and Medical image.
3. Cut property:
   1. A **cut** is an assignment of a graph's nodes to two non-empty sets.
   2. A **crossing edge** is an edge which connects a node from one set to a node from the other set.
   3. **Cut property**: Given any cut, minimum weight crossing edge is in the MST.
4. Prim Algorithm: Start from any vertex
   1. repeatedly add shortest edge that has one node inside the MST under construction.
   2. Repeat until V-1 edges.
   3. Implementation:
      - Insert all vertices into fringe PQ, storing vertices in order of **distance from tree**.(very similar as Dijkstras algorithm)
      - Repeat: Remove (closest) vertex v from PQ, and relax all edges pointing from v.

   ```Java
   public class PrimMST {
   public PrimMST(EdgeWeightedGraph G) {
    edgeTo = new Edge[G.V()];
    distTo = new double[G.V()];
    marked = new boolean[G.V()];
    fringe = new SpecialPQ<Double>(G.V());
 
    distTo[s] = 0.0;
    setDistancesToInfinityExceptS(s);
    insertAllVertices(fringe);
 
    /* Get vertices in order of distance from tree. */
    while (!fringe.isEmpty()) {
      int v = fringe.delMin();
      scan(G, v);
      } 
    }

   private void scan(EdgeWeightedGraph G, int v) {
   marked[v] = true;
   for (Edge e : G.adj(v)) {
    int w = e.other(v);
    if (marked[w]) { continue; } 
    if (e.weight() < distTo[w]) {
      distTo[w] = e.weight();
      edgeTo[w] = e;
      pq.decreasePriority(w, distTo[w]);
      }
     }
   }
   ```

5. Kruskal's Algorithm
   - Implementation:
     - Consider edges in increasing order of weight.
     - Add edge to MST (mark black) unless doing so creates a cycle.
     - Repeat until V-1 edges.
   - Pseudocode:

   ```Java
   public class KruskalMST {
      private List<Edge> mst = new ArrayList<Edge>();
 
      public KruskalMST(EdgeWeightedGraph G) {
         MinPQ<Edge> pq = new MinPQ<Edge>();
         for (Edge e : G.edges()) {
            pq.insert(e);
      }
      WeightedQuickUnionPC uf = 
             new WeightedQuickUnionPC(G.V());
      while (!pq.isEmpty() && mst.size() < G.V() - 1) {
         Edge e = pq.delMin();
         int v = e.from();
         int w = e.to();
         if (!uf.connected(v, w)) {
            uf.union(v, w);
            mst.add(e);  
   } } } }
   ```

6. Summary:
   Problem | Algorithm | Runtime(if E > V) | Notes
   -- | -- | -- | --
   Shortest Paths | Dijkstra's | O(ElogV) |Fails for negative weight edges.
   MST | Prim's | O(ElogV) | Analogous to Dijkstra's.
   MST | Kruskal's | O(ElogE) | Uses WQUPC.
   MST | Kruskal's with pre-sorted edges | O(Elog*V) | Uses WQUPC.

7. Note: Prim's and Kruskal's algorithms are not available in directed graph.

## **17 Short Paths**

1. For BSF only find the shortest path without edge weight, so turn it to Dijkstra's Algorithm.
   1. Create a priority queue.
   2. Add s to the priority queue with priority 0. Add all other vertices to the priority queue with priority **∞**.
   3. While the priority queue is not empty: pop a vertex out of the priority queue, and relax all of the edges going out from the vertex.

   ```Java
   def dijkstras(source):
    PQ.add(source, 0)
    For all other vertices, v, PQ.add(v, infinity)
    while PQ is not empty:
    //always remove the closest vertex.
        p = PQ.removeSmallest()
        relax(all edges from p)

   def relax(edge p,q):
   //never relax edges that point to already visited vertices.
   if q is visited (i.e., q is not in PQ):
       return

   if distTo[p] + weight(edge) < distTo[q]:
       distTo[q] = distTo[p] + w
       edgeTo[q] = p
       PQ.changePriority(q, distTo[q])
   ```

   Note1: Shortest Path Tree has V-1 edges, because every vertex has only one parent except source.
   Note2: Not guaranteed to be correct for **negative** edges.
   Note3: Once a vertex is popped from the priority queue, we know the true shortest distance to that vertex from the source.

   \ | Operation times | Cost per operation | Total cost
   -- | -- | -- | --
   PQ add | V | O(logV) | O(VlogV)
   PQ removeSmallest | V | O(logV) | O(VlogV)
   PQ changePriority | E(E > V) | O(logV) | O(ElogV)

2. A*
   - using a **heuristic distance** h(v, goal) + distance(s, v) to Dijkstra's algorithm.
   - A* heuristic must be:
     - **Admissible**: h(v, goal) ≤ true distance from v to goal.
     - **Consistent**: For each neighbor of w:
         - h(v, goal) ≤ dist(v, w) + h(w, goal).
         - Where dist(v, w) is the weight of the edge from v to w. (Consistent has included Admissible)

3. Summary:
   1. Single Source, **Multiple** Targets:
      - Can represent shortest path from start to every vertex as a shortest paths tree with V-1 edges.
      - Can find the SPT using **Dijkstra's algorithm**.
   2. Single Source, **Single** Target:
      - Dijkstra's is inefficient (searches useless parts of the graph).
      - Can represent shortest path as path (with up to V-1 vertices, but probably far fewer).
      - **A*** is potentially much faster than Dijkstra's.
         - Consistent heuristic guarantees correct solution.


   Problem | Problem Description | Solution | Efficiency
      --| -- | -- | -- |
      s-t paths | Find a path from s to every reachable vertex. |DepthFirstPaths.java| O(V+E) time <br> Θ(V) space
      s-t shortest path | Find a shortest path from s to every reachable vertex. | BreadthFirstPaths.java | O(V+E) time<br>Θ(V) space
      shortest weighted paths | Find the shortest path, considering weights, from s to every reachable vertex. | DijkstrasSP.java | O(ElogV) time <br> Θ(V) space
      shortest weighted path | Find the shortest path, consider weights, from s to some target vertex | A*: Same as Dijkstra's but with h(v, goal) added to priority of each vertex. | Time depends on heuristic. <br> Θ(V) space

## **16  Tree traversals and Graphs**

1. Tree definition:
   - a set of nodes
   - a set of edges that connect those nodes. **Constraint**: There is exactly one path between any two nodes.
2. A rooted tree:
   - A parent. Every node except the root has exactly one parent.
   - A child. A node can have 0 or more children. No child node is called leaf.
3. What trees useful for:
   - BST for searching , disjoint set for connectedness, trie for prefix, heap for getSmallest.

4. Tree traversals:
   4.1 Level order traversal.
   4.2 Depth-First traversals, including pre-order, in-order and post-order.
      4.2.1 pre-order: "Visit" a node, then traverse its children.
      4.2.2 in-order: Traverse left child, visit, then traverse right child.
      4.2.3 post-order: Traverse left, traverse right, then visit the node.

   ```Java
   preOrder(BSTNode x) {
      if (x == null) return;
      print(x.key)
      preOrder(x.left)
      preOrder(x.right)
   }

   inOrder(BSTNode x) {
      if (x == null) return;    
      inOrder(x.left)
      print(x.key)
      inOrder(x.right)
   }

   postOrder(BSTNode x) {
      if (x == null) return;    
      postOrder(x.left)
      postOrder(x.right)
      print(x.key)   
   }
   ```

5. Graph definition:
   - A set of nodes (or vertices)
   - A set of zero of more edges, each of which connects two nodes.
   - only talk about **simple graph**, which has no self-loop nodes and no parallel edges.
   - some terminology:
     - undirected/directed
     - acyclic/cyclic
     - Set of **vertices**, a.k.a. nodes.
     - Set of **edges**: Pairs of vertices.
     - Vertices with an edge between are **adjacent**.
     - Optional: Vertices or edges may have **labels** (or **weights**).
     - A **path** is a sequence of vertices connected by edges.
       - A **simple path** is a path without repeated vertices.
     - A **cycle** is a path whose first and last vertices are the same.
       - A graph with a cycle is "cyclic".
     - Two vertices are connected if there is a path between them.
       - If all vertices are connected, we say the graph is connected.

6. There are many questions we can ask about a graph.
    - **s-t Path**: Is there a path between vertices s and t?
    - **Connectivity**: Is the graph connected, i.e. is there a path between all vertices?
    - **Biconnectivity**: Is there a vertex whose removal disconnects the graph?
    - **Shortest s-t Path**: What is the shortest path between vertices s and t?
    - **Cycle Detection**: Does the graph contain any cycles?
    - **Euler Tour**: Is there a cycle that uses **every edge** exactly once? Solving in O(E) runtime.
    - **Hamilton Tour**: Is there a cycle that uses **every vertex** exactly once?
    - **Planarity**: Can you draw the graph on paper with no crossing edges?
    - **Isomorphism**: Are two graphs isomorphic (the same graph in disguise)?

7. BFS and DFS in Graph:
   - Depth First Search: also can use such as `edgeTo[1] = 0.dfs[1]` to record the previous vertex for recording the path to fringe vertex.

   ```Java
      mark s  // i.e., remember that you visited s already
      if (s == t):
         return true;

      for child in unmarked_neighbors(s): // if a neighbor is marked, ignore!
         if isconnected(child, t):
            return true;

      return false;

   ```

   - Breath First Search:
     The pseudocode for BFS is as follows:

   ```Java
   Initialize the fringe (a queue with the starting vertex) and mark that vertex.
   Repeat until fringe is empty:
      Remove vertex v from the fringe.
      For each unmarked neighbor n of v:
         Mark n.
         Add n to fringe.
         Set edgeTo[n] = v.
         Set distTo[n] = distTo[v] + 1.
   ```

   - Recursive **DFS** implements this naturally via the recursive stack frames; iterative DFS implements it manually:

   ```Java
   //DFS preorder equal to dfs calls, code is following.
   //DFS postorder equal to dfs return.
   Initialize the fringe, an empty stack
    push the starting vertex on the fringe
    while fringe is not empty:
        pop a vertex off the fringe
        if vertex is not marked:
            mark the vertex
            visit vertex
            for each neighbor of vertex:
                if neighbor not marked:
                    push neighbor to fringe
   ```

8. Graph API and its representations:

   ```Java
   //API
   public class Graph {
   public Graph(int V):               // Create empty graph with v vertices
   public void addEdge(int v, int w): // add an edge v-w
   Iterable<Integer> adj(int v):      // vertices adjacent to v
   int V():                           // number of vertices
   int E():                           // number of edges
   ...
   ```

   - Representations:
     - **Adjacency Matrix**: a two-dimensional boolean array to represent the edge. Runtime in *O(V^2)*.
     - **Edge Set**: Use set to save edge.
     - **Adjacency List**: Maintain a array of list, which looks like External Chaining HT. Runtime is *O(V+E)*.

## **15 QuadTree and K-D tree**

1. Two questions in 2-D Range:
   - How many objects are in a region.
   - What is the closest object to another object.
2. First attempt: Hash Table and BST will iterate over N items to check.
3. Second attempt: uniformly partition the space by throw n×n grid. By this way, we can abandon some gird cell, and runtime also Θ(N).
4. QuadTree: Generalized 2D BST where each node "owns" 4 subspaces. QuadTree is a form of spatial partition in disguise and some subspaces will be discard during computation.(Oct-tree for 8 dimensions, so each node have 8 children)
5. K-D tree: Unlike BST only store one dimension, K-D tree store all dimensions but every one node only store one dimension. Unlike QuadTree, every point in K-D tree has two subspaces(so it has two children). It works by rotating through all the dimensions level by level.
Such as the 2-D case, it partitions like an X-based Tree on the first level, then like a Y-based Tree on the next, then as an X-based Tree on third level, a Y-based Tree on the fourth, etc.
Most important, we will first choose the good side to compute, and compute the bad side(if necessary).

## **14 Tries**

1. We have already know there are two ways to achieve Set and Map: BST and Hash Table. But we can do better if we know the special characteristic of the keys.
2. character: If we know the keys are ASCII characters, then simply use an array where each character is a different index in our array.
3. trie: When all keys are strings, we can construct a tree with each node containing a character and nodes sharing by multiple keys. And we mark the last character of each node to blue.
   - implement trie:
     - DataIndexCharMap: Space: 128 links per node; Runtime Θ(1).
     - BST:
       - Space: C links per node, where C is the number of children;
       - Runtime: O(logR), where R is the size of the alphabet.
     - Hash Table:
       - Space: C links per node, where C is the number of children;
       - Runtime: O(R), where R is the size of the alphabet.
     - Note: R is a fixed number. So BST and HT runtime are still constant.
4. Trie's main functionality: Prefix Matching
5. Radix trie:
   - Only select top 10 results: store the best value of a substring in each node. (use PQ to get these best results.)
   - Another optimization: merge nodes without forks.

## **13 Heap and PQ**

1. Binary min-heap: Binary tree that is **complete** and obeys **min-heap property**.
   - Min-heap: Every node is less than or equal to both of its children.
   - Complete: Missing items only at the bottom level (if any), all nodes are as far left as possible. 

2. PQ operations:
   - getSmallest(): return the item in the root node.
   - add(E item): add the item to the last position, and swim as high as possible.
   - removeSmallest(): replace the item of the root with the last position item, and sink as low as possible.

3. Heap implementation:
Approach 1a, 1b, 1c: Just like linked list, create mapping from node to children.

```Java
//fixed-width nodes.
public class Tree1A<Key> {
   Key k; // e.g. 0
   Tree1A left;
   Tree1A middle;
   Tree1A right;
   ...

//variable-Width nodes.
public class Tree1B<Key> {
   Key k; // e.g. 0
   Tree1B[] children;
   ...

public class Tree1C<Key> {
   Key k; // e.g. 0
   Tree1C favoredChild;
   Tree1C sibling;
   ...
```

Approach 2: Store keys in an array. Store parentIDs in an array.

```Java
public class Tree2<Key> {
   Key[] keys;
   int[] parents;
   ...
```

Approach 3a, 3b: Store keys in an array. Don't store structure anywhere, without `int[] parents`;

```Java
//Approach 3a
public class Tree3<Key> {
   Key[] keys;
   ...
public int parent(int k) {
    return (k - 1) / 2;
}

/**
Approach 3b: Same as 3a, but leave spot 0 empty.
Makes computation of children/parents "nicer".
leftChild(k) = k*2
rightChild(k) = k*2 + 1
parent(k) = k/2
*/
```

## **12 HashTable**

1. HashTable: data is converted into a **hash code**(a number), and the hash code is then reduced to a **valid index**. Data is then stored in a bucket according to the index.
2. HashTable only contains two operations: **add** and **contains**.
3. Some problems needed to be solve: **collision, overflow, space usage, runtime.**
   - Uniform hashing assumption: For our analyses below, we assume that our hash function distribute all input data evenly across bins.
   - avoid collision: if we store the items in the array , collision could not be avoided because of Pigeonhole Principle, but we can store LinkedList in the array to avoid collision.
   - overflow: use a small prime to compute hash code.
   - space usage: set a load factor threshold(such as 1.5, and when reach it, M = M*2), and when resize it, it will compute the new hash code for each item.
   - runtime: Θ(Q), Q is the longest LinkedList in the array. And when M dynamically growing with hashTable, runtime will be **constant[Θ(1)]**.

Notes: Never override `equals` without also overriding `hashCode`.

## **11 BST => B-tree => red black tree**

1. Some terminology for BST performance:
   - depth: the number of links between a node and the root.
   - height: the lowest depth of a tree.
   - average depth: average of the total depths in a tree.(各自节点 × 各自深度 / 总节点数)
2. when we insert **randomly** into a BST, the average depth and the height are expected to be Θ(logN).
3. B-trees or 2-3-4/2-3 Trees: A BST tree which its nodes can have more one items, and when a node with items over the limited number, the node will split. 2-3-4 tree can have 2、3、4 children, and its nodes have no more 3 items.
4. B-tree invariants:
   - All leaves must be the same distance from the root.
   - A non-leaf node with k items must have exactly k+1 children.
5. runtime: O(logN) or O(L*logN), L is a constant which represent the number of items in each nodes.
6. However, B-trees are really difficult to implement.

7. Tree rotate: For N items, there are [Catalan(N)](https://en.wikipedia.org/wiki/Catalan_number) different BSTs. And in general, we can convert one BST shape to any other in 2*n-6 rotations.
8. So with rotating, we can actually completely balance a tree.

9. Red Black Trees: Because of the well balanced shape of 2-3 trees, we make some changes on it to achieve Red Black Trees.
   1. Creating "glue" links(red links) with the smaller item off the left.
   2. do some rotatations.

   3. Result: there is a 1-1 correspondence between an LLRB(Left Leaning Red Black BST) and an equivalent 2-3 tree.
   4. Suppose we have a 2-3 tree of height H. Total height is H (black) + H + 1 (red) = 2H + 1.
   5. LLRB insert operation:
      1. When inserting: Use a red link.
      2. If there is a right leaning "3-node", we have a Left Leaning Violation. Rotate left the appropriate node to fix.
      3. If there are two consecutive left links, we have an Incorrect 4 Node Violation. Rotate right the appropriate node to fix.
      4. If there are any nodes with two red children, we have a Temporary 4 Node. Color flip the node to emulate the split operation.
10.Runtime analysis:
   - LLRB tree has height O(log N).
   - Contains is trivially O(log N).
   - Insert is O(log N).
     - O(log N) to add the new node.
     - O(log N) rotation and color flip operations per insert.

## **10 ADTs**

1. suppose we have a ordered set and how can we get a specific number efficiently.
2. Binary Search Trees(**Θ(logN)**): nodes, edges; root, leaves, parent, children.
3. Binary Search Trees operation:
   - Search:

   ```Java
      static BST find(BST T, Key sk) {
      if (T == null)
         return null;
      if (sk.equals(T.key))
         return T;
      else if (sk ≺ T.key)
         return find(T.left, sk);
      else
         return find(T.right, sk);
   }
   ```

   - Insert:

   ```Java
   static BST insert(BST T, Key ik) {
   if (T == null)
      return new BST(ik);
   if (ik ≺ T.key)
      T.left = insert(T.left, ik);
   else if (ik ≻ T.key)
      T.right = insert(T.right, ik);
   return T;
   }
   ```

- Deleted:
  - the node has no children: delete directly
  - one children: the node's parent point the node's children
  - two children: 使用左边的最右节点(no right children), 或右边的最左节点(no left children)替代deleted node.

## **9 Disjoint Sets**

1. 定义: Two sets are named disjoint sets if they have no elements in common.
2. The data structure have two operations:
   - connect(x, y): connect two items x and y
   - isConnected(x, y): return true if two items are connected.
3. Naive approach: Record every single connecting line somehow.
4. Better approach: Record items connectedness in terms of sets.
5. **List of Set**: `List<Set<Integer>>`, runtime O(N) and is difficult to implement.(**The lesson to take away is that initial  design determine our code complexity and runtime**)
6. **QuickFindDS**: int[]
   - the indices of the array represent the element of set.
   - the value of an index is the set number it belongs to.
7. **QuickUnionDS**: Suppose we prioritize making the connect operation fast.Instead of an id, we assign **each item the index of its parent**.
8. **Weighted Quick Union**: whenever we call connect, we always connect the root of the smaller tree to the larger tree, which make the **logN** height of the tree .(Why not use the height rather than weight? )
9. **WeightedQuickUnionDSWithPathCompression**: both call connect() and isConnected() always call find(). Thus, after calling connect or isConnected enough, essentially all elements will point directly to their root.(some better performance for M operations on N items. )
10. M operations on N items.

Implementation | constructor | connect | isConnected
-- | -- | -- | -- |
ListOfSets | Θ(N) | O(N) | O(N)
QuickFindDS | Θ(N) | Θ(N) | Θ(1)
QuickUnionDS | Θ(N) | O(N) | O(N)
Weighted Quick Union |Θ(N) | O(logN) | O(logN)
WeightedQuickUnionDSWithPathCompression | Θ(N) | O(N + M α(N))| O(N + M α(N))

## **8 Efficient Programming**

### **8.4 Omega and Amortized analysis**

\   |Informal Meaning |Example Family |Example Family Members
--|--|--|--
Big Theta Θ(f(N))|Order of growth is f(N)|Θ(N​^2^​​)|N​^2^​​/2,2N^​2^​​,N^​2^​​+38N+1/N
Big O O(f(N)) |Order of growth is less than or equal to f(N)|O(N​^2^​​)|N​^2​​^/2,2N​^2^​​,logN
Big Omega Ω(f(N)) |Order of growth is greater than or equal to f(N)|Ω(N​^2​​^)|N​^2​​^/2,2N​^2​​^,5​N​​

Amortized analysis: 将个别时间复杂度高的操作分摊到其他操作上,使每一个操作的时间复杂度都为constant,即θ(1).

### **8.3 Asysmptotics II: 时间复杂度**

1. 对于双for循环,时间复杂度为θ(N^2^),θ(N*logN),θ(N)的情况都有可能出现.案例如下:

   ```Java
   int N = A.length;
   for (int i = 0; i < N; i += 1)
      for (int j = i + 1; j < N; j += 1)
         if (A[i] == A[j])
            return true;
   return false;

   public static void Party(int N) {
      for (int i = 1; i <= N; i += 1) {
         for (int j = 0; j < N; j *= 2) {
            System.out.println("hello");
         }
      }
   }

   public static void printParty(int N) {
      for (int i = 1; i <= N; i = i * 2) {
         for (int j = 0; j < i; j += 1) {
            System.out.println("hello");   
            int ZUG = 1 + 1;
         }
      }
   }
   ```

2. 下例的Recursion: θ(2^N^)

   ```Java
   public static int f3(int n) {
      if (n <= 1) 
         return 1;
      return f3(n-1) + f3(n-1);
   }
   ```

3. Binary Search: θ(logN)
4. Selection sort: θ(N^2^) => Merge Sort: θ(N*logN)

5. Notes:
   - 复杂度分析无捷径, 只有多练习.
   - 1 + 2 + 3 + ... + N = θ(N^2) and 1 + 2 + 4 + ... + N = θ(N)

### **8.2 Asymptotic I**

1. Characterization:
   1. simple and mathematics rigorous
   2. demonstrate superiority.
2. CheckPoint: Order of Growth Identification
   - Consider only the worst case
   - Restrict attention to one operation
   - Eliminate low order terms
   - Eliminate multiplicative constants.
3. Big-Theta定义: R(N)∈Θ(f(N)) means k​1​​⋅f(N)≤R(N)≤k​2​​⋅f(N).
4. Big O定义: R(N)∈O(f(N)) means R(N)≤k​2​​⋅f(N)

### **8.1 Encapsulation, Lists, Delegation vs. Extension**

1. 效率来源于两方面：
   1. 编程成本：
      - how long does it take to develop your programs?
      - how easy to read, modify and maintain your code?
   2. 执行成本：
      - how much time does your program take to execute?
      - how much memory does your program require?

2. **四种设计模式**

   1. Extension: 使用Extension时，表示你清楚父类中的方法是如何实现的，而且子类与父类的方法大致相似。(使用父类的方法实现其功能)
   2. Delegation: 使用Delegation时，you do not want to consider your current class to be a version of the class that you are pulling the method from.(委派给其他类实现)

   3. Adaptation: Adaptation takes another ADT and morphs it into the ADT that we want.(将其他类进行转化为该类而实现其功能)
   4. Views:(只映射Object的一部分,进行操作;比如通过sublist()，只获取list的一个片段)

   ```Java
   名词解释：
   Module: A set of methods that work together as a whole to perform some task or set of related tasks.
   Encapsulated: A module is said to be encapsulated if its implementation is completely hidden, and it can be accessed only through a documented interface.
   API: An API(Application Programming Interface) of an ADT is the list of constructors and methods and a short description of each.
   ADT:ADT's (Abstract Data Structures) are high-level types that are defined by their behaviors, not their implementations.
   Views: Views are an alternative representation of an existed object. Views essentially limit the access that the user has to the underlying object. However, changes done through the views will affect the actual object.
   ```

## **7 Packages and Access Control**

1. Package: a **namespace** that organize classes and interfaces; package name start with website address, backwards.
   - 思想: Ensure that we never have two classes with the same name.
   - 创建: 在src下创建package, and every class should have package name declaration in the top of file.
   - 使用: using canonical name or `import` statement to use simple name.
   - 无package declaration的java class被视为default package的一部分, 不推荐使用.
2. Jar: 分享的zip文件, 以导入library使用
   - 实施: 创建artifacts, 并且build artifacts
   - 大型项目使用: Ant, Maven, Gradle

3. **Access control**:
   ⬜️️|class|package|subclass|world
   --|--|--|--|--|
   public|✔️️|✔️|✔️|✔️
   protect|✔️|✔️|✔️|❎️
   default|✔️|✔️|❎️|❎️
   private|✔️|❎️|❎️|❎️

   - 为什么package member比subclass member更加私密:
     - Extending classes you didn't write is common
     - Packages are typically modified only by a specific team of humans.
   - also possible control access at the top level(such as interface and class) -> two level: `public` and `package-private`
4. Access level
      - **Private** declarations are parts of the implementation of a class that only that class needs.
      - **Package-private** declarations are parts of the implementation of a package that other members of the package will need to complete the implementation.
      - **Protected** declarations are things that subtypes might need, but subtype clients will not.
      - **Public** declarations are declarations of the specification for the package, i.e. what clients of the package can rely on. Once deployed, these should not change.
5. Interface's methods 默认是public, not package-private.

## **6 Exceptions,Iterators,Iterables**

1. Exception:
   - `throw new RuntimeException(For no reason)`
   - `try{...}  catch (Exception e){...}`
   - 哲理:使用try...catch可将整体功能的代码块集中在一起, 而不是每次都使用if...else去判断部分功能是否可以执行.
   - Checked vs Unchecked exception: Any subclass of RuntimeException or Error is unchecked, all other Throwables are checked.
     - 程序中出现Checked exception将导致编译失败.
     - Compiler requires that all checked exceptions be **try...catch** or **specified**.
     - **Specify** method as dangerous with **throws** keyword.

      ```Java
      public static void gulgate() throws IOException {
      ... throw new IOException("hi"); ...
      }

      public static void main(String[] args) 
      throws IOException {
      gulgate();
      }
      ```

      >"He who fights with monsters should look to it that he himself does not become a monster. And when you gaze long into an abyss the abyss also gazes into you." - Beyond Good and Evil (Nietzsche)

2. Iterator and Iterable: for-each loop.

   ```Java
      public interface Iterable<T> {
         Iterator<T> Iterator();
      }
      public interface Iterator<T> {
         boolean hasNext();
         T next();
      }


      public class Map61B implements Iterable<T> {

      public class keyIterator implements Iterator<T> {
         int wizardPosition;
         public keyIterator() {
            wizardPosition = 0;
         }
         public boolean hasNext();
         public T next();
      }
      }
   ```

   - To support enhanced for loop, 必须implements Iterable接口, 复写iterator()方法 to return a iterator object; iterator其实也是一个接口, 不能直接实例化, 所以必须得有一个子类继承该接口, 复写next()和hasNext().

3. Object methods: toString() and equals()
   1. `toString()`: return a string representation of objects.(override时, String为不可变类型, 时间复杂度为O(n2),可使用StringBuilder)
   2. `==` and `.equals()`: `==` means referencing the same object; `.equals()` is a method that can be overridden by a class to define custom ways to determine equality.  
4. A better way: toString() and of()

   ```Java
   public String toString() {
        List<String> listOfItems = new ArrayList<>();
        for (T x : this) {
            listOfItems.add(x.toString());
        }
        return "{" + String.join(", ", listOfItems) + "}";
    } 

    public static <Glerp> ArraySet<Glerp> of(Glerp... stuff) {
        ArraySet<Glerp> returnSet = new ArraySet<Glerp>();
        for (Glerp x : stuff) {
            returnSet.add(x);
        }
        return returnSet;
    }
    ```

## **5 Autoboxing and Generic**

1. autoboxing is the Java's automatic conversion of between wrappers(Integer) to primitives(int).(**unbox**)
   1. Java有8中primitives:`byte, short, int, long, float, double, boolean, char`, 对应的wrapper分别是:`Byte, Short, Integer, Long, Float, Double, Boolean, Character`
   2. 缺点：转换耗时;wrapper类型更耗空间;数组间并不能相互转换，如int[] 不能自动转化为 Integer[]
2. Primitive Widening: automatic move from a primitive type with a narrower range to a wider range.
3. Immutability：不可变类型，如Integer, String, Date; 使变量不可变, 使用final keyword(private也可实现相同的作用); `final int[] arr = new int[1];`表示arr's address 不可改变.
   1. 缺点: 不能再原始对象上进行更改,必须创造出新的对象.
4. Generic:
   1. generic classes:`public class ArrayMap(K, V){...}`
   2. generic method:`public static <K, V> K get (ArrayMap<K, V> am, K key){...}`: 但是method中的K与class中的K毫无关系.
5. Comparing Objects with generic methods:使K extends OurComparable,即K is the subclass of OurComparable.(using extends keyword as **type upper bound**, using super keyword as **type lower bound**)

   ```Java
   public static <K extends OurComparable, V> K
   maxKey(ArrayMap<K, V> am) {
   ...
   if (k.compareTo(largest) > 0) {
   ...
   }
   ```

## **4.4 Java libraries and package**

1. Built-in ADT(Abstract Data Types): Iterable->Collection->
   1. List: ArrayList, LinkedList:
      - add(element), add(index, element), get(index), size()
   2. Set: HashSet, Treeset:
      - add(element), contains(element), size(), remove(element)
   3. Map: HashMap, TreeMap:
      - put(key, value), get(key), containsKey(key), keySet()
   4. stack: First in, last out(FILO);
      queue: First in, First out(FIFO)
      - add(e), peek(), poll()
   5. deque(Double Ended Queue): contain both.(FILO, FIFO)
      - addFirst(e), removeFirst(), getFirst(), addLast(e), removeLast(), getLast() 
   6. priority queue: each element has a priority to determine their order of removal.
      - add(element), peek(), poll()
2. 相比于Python, Java的一些优势:
   1. Arguably, takes **less time** to write programs, due to features like:
      1. Static types (provides type checking and helps guide programmer).
      2. Bias towards interface inheritance leading to cleaner subtype polymorphism.
      3. Access control modifiers make abstraction barriers more solid(such as `private`).
   2. **More efficient code**, due to features like:
      1. Ability to have **more control** over engineering tradeoffs(using `arrayList` and `linkedList` to do different things).
      2. **Single valued arrays** lead to better performance.
   3. Basic data structures more closely resemble underlying hardware:
      1. Would be weird to do ArrayDeque in Python, since there is no need for array resizing. However, in hardware (see 61C), variable length arrays don't exist.
3. **Interface vs Abstract class**
   1. Interface(`implements`):
      - All methods are `public` unless you specify access control modifier.
      - All variables are `public static final`.
      - Cannot be instantiated
      - All methods are by default abstract unless specified to be `default`
      - Can implement **more than one** interface per class
   2. Abstract class(`extends`):
      - Methods can be `public` or `private`
      - Can have any kinds of variables
      - Cannot be instantiated
      - Methods are by default concrete unless specified to be `abstract`
      - Can only extends **one** for per class
4. Package:
   1. Package names give **a canonical name for everything**.
   2. using `import` keyword.

## **4.3 Subtype polymorphism vs HOFs**

0. polymorphism:
   - 作用1: 引用类型可以是实际对象类型的父类[Animal a = new Dog()];
   - 作用2:参数和返回值可以是子类类型（如Dog可以作为Animal传入或返回）
1. Polymorphism: "providing a single interface to entities of different types". 比如想要`max`方法求出`cat[], dog[]`中size最大的狗, (排除:不能每一个类中都写一个max方法吧,需要将max通用化), 则采用interface `OurComparable<T>`, 其内含抽象方法`comparableTo`; 因此cat和dog类实现`comparableTo`方法. 此时对象可以进行比较, 再使用`max`来选取最大的dog或cat对象.(关键点:使用interface inheritance实现比较对象的方法)
2. Java内置的两个比较接口: `Comparable<T>`, `Comparator<T>`
   - Comparable接口是自身与其他对象比较
   - Comparator接口是两个对象间的比较, 并可以实现不同的比较方式, 类似于callback function去指定比较方式.
3. 总结: 将object变为comparable object.

## **4.2 Extends, Casting, Higher Order Function**

1. The `extends` keyword lets us **keep the original functionality of Superclass**, while enabling us to make modifications and add additional functionality.
2. subclasses inherit all members of the parent class. "Members" includes:
   1. All instances variables and static variables
   2. All methods
   3. All nested class
   4. not constructor.But Java requires that **all constructors must start with a call to one of its superclass's constructors,and `super()` is default.** (HOWEVER: If you create a one or more argument constructor, your free no-argument constructor is not given.)

   5. Not the private members
3. Every class `extends` Object implictly, Object should able to do `.equals(Object obj)`, `.hashCode()`, `toString()`.
4. **Encapsulation against complexity**:Some tools for managing complexity:
   - Hierarchical abstraction.
     - Create layers of abstraction, with clear abstraction barriers!
   - "Design for change" (D. Parnas)
     - Organize program around objects.
     - **Let objects decide how things are done.**
     - **Hide information** others don't need, using `private` keyword.
   - **Module**: A set of methods that work together as a whole to perform some task or set of related tasks. A module is said to be encapsulated if its implementation is completely hidden, and it can be accessed only through a documented interface.
5. Type checking and Casting:
   - Compiler plays it safe and only allows us to do things according to the static type.
   - For overridden methods (not overloaded methods), the actual method invoked is based on the dynamic type of the invoking expression
   - Can use casting to overrule compiler type checking.
6. Higher order function: memory boxes (variables) could not contain pointers to functions in old Java, so we take advantage of interface inheritance.

- [extends vs implements](https://www.geeksforgeeks.org/extends-vs-implements-in-java/)

## **4.1 Interface**

1. Hypernyms(superclass), Hyponyms(subclass), and Interface inheritance
   1. Such as `A dog is a canine`.(**is-a** relationship)
   2. **Interface Inheritance:**
      1. Interface: The list of all method signatures.
      2. Inheritance: The subclass "inherits" the interface from a superclass.
      3. Specifies what the subclass **can do, but not how.**
      4. Subclasses must override all of these methods!
         - Will fail to compile otherwise.
   3. Copying the bits: If X is a superclass of Y, then memory boxes for X may contain Y.
   4. Implementation Inheritance: Subclasses can inherit signatures AND **implementation**
      1. using **default** keyword to specify a method. It can be override by subclass.

2. **Static type and dynamic type**
   1. Override:
      1. static type(compile-type time type) is specified by **declaration**, never change.
      2. dynamic type(run-time type) is specified by **instantiation**(e.g. when using new). Equal to the type of the object being pointed at.
      3. **Dynamic Method Selection** for `@Override` Methods.
   2. Overload: just focus on the static type.

3. **Override vs overload:**
   1. Override:
      1. If a "subclass" has a method with the exact same signature as in the "superclass", we say the subclass overrides the method.
      2. Why using **@Override** annotation: to protects against typos.
   2. Overload: Methods with the same name but different signatures are overloaded.

4. **Interface inheritance(What) vs Implementation inheritance(How)**
   1. both are `is-a` relationship.
   2. **Interface inheritance**: Allow you to generalize code in a powerful, simple way; 多个子类实现一个接口, 由下至上的抽象; 可实现多态.
   3. **Implementation inheritance**:Allow code-reuse
      - Interface inheritance by `default` keyword
      - subclasses `extends` superclass, 由上之下的抽象.

5. New Terms from this lecture

   ```java
   Overload
   Hypernym(上义词)
   Hyponym(下义词)
   Override
   Interface Inheritance
   Implementation Inheritance
   Static Type, a.k.a. Compile-time Type
   Dynamic Type, a.k.a. Run-time Type
   Dynamic Method Selection
   ```

## **3.1 A New Way: Testing**

1. Write own test:
   1. 以Selection Sort为例, 实现Class Sort()之前, 草稿纸上实现Sort()的解法, 并将解法的每个步骤作为一个Unit来实现:
      1. 查找数组中的最小元素的index
      2. 将最小元素与第一个元素对调
      3. 使用递归:对数组进行如python中的slicing,这里使用start来指定开始位置
   2. **Unit Tests** test each piece of your program, and accomplish each unit.
   3. **Integration testing** verifies that components interact properly together.

2. 测试模块:

   ```Java
   import org.junit.Assert.*
   import org.junit.Test(non-static method)
   Annotation Test Unit:@Test
   junit测试中有许多功能,如:
   assertArrayEquals(expect, actual)
   assertEquals(expect, actual)
   ```

3. 优点:
   1. **Well-tested parts:** 对自己的代码更有信心, make these bedrocks stability.
   2. **Rapid feedback:** 减少Debug的时间, 每次只专注于一个unit, 便于
   3. **Context:** 在Context中来回切换而不迷失.
   4. **Decoupled design:** 每个unit的实现功能更明确.
   5. Make refactor code more simple and efficiency.
   6. *In my experience, unit tests are most valuable when you use them for algorithmic logic. They are not particularly useful for code that is more coordinating in its nature.*

4. **TDD: Test-Driven Development**:
   - Identify a new feature.
   - Write a unit test for that feature.
   - Run the test. It should fail.
   - Write code that passes the test. Yay!
   - Optional: refactor code to make it faster, cleaner, etc. Except now we have a reference to tests that should pass

- Notes:
  - **Don't rely on Autograder much**
  - `==` in java compare their address.

## **Lecture5:DLList**

   1. In order to implement the ```addLast(int x), getLast() and removeLast()``` method running fast, a Double Linked List is selected.
   2. DLList has some special cases, so taking **two sentinels each point to first or last** or **circular sentinel**.
   3. **Generic DLLists**: To achieve the List to store **arbitrary types**, Generic DLLists which can parameterize types is adopted. Finally a desired type should put into when instantiate a object.
      - If you need to instantiate a generic over a primitive type, use `Integer, Double, Character, Boolean, Long, Short, Byte, or Float` instead of their primitive equivalents.

      ```java
      public class DLList<BleepBlorp> {}
      DLList<String> d2 = new DLList<>("hello");
      d2.addLast("world");
      ```

### **Array**

   1. 缺点：Array has a fixed length and its all memory boxes are the same type.

   ```java
   x = new int[3];
   y = new int[]{1, 2, 3, 4, 5};
   int[] z = {9, 10, 11, 12, 13};
   ```

   1. `System.arraycopy(A, 0, B, 0, n)` equal to `B[0:n] = A[0:n]`
   2. 二维数组:such as, Int[][] arr = new int[4][] or Int[][] arr = new[4][4].

      Array|Class
      --|:--:
      fixed length and same type|members can be changed|
      []|.(don't be treat either side of dot as an expression)
      **can compute at runtime**|**can't compute at runtime**

   3. ArrayList:
      - 优点：Access the `i`th element of an array takes constant time.
      - 注意点：
        - resize(including extend and downsize) array using  `size * refactor` rather than add a number.
        - Generic Alists: 由于泛型实现方式的一个模糊问题，Java**不允许**我们创建一个泛型对象数组。So we must use `Glorp[] items = (Glorp[]) new Object[100];` rather `Glorp[] items = new Glorp[100];

## **Lecture4:SLList**

   1. Lecture3 implement a **naked class** Linked List, but it is complicated to use for user. So to create a **middleman class** to simplify its operate and convert the **naked class** to **clothed class**.
   2. In **middleman class**, we implement some method like **addFirst(int x), size()** to get some information about the Linked List.
   3. **private** methods and variables can only access by the code in the same `.java` file(同一个类中). But **public** can be access by outer class.(目的：用户不用理解private修饰的类)
   4. **Nested class**:when a class is only useful to one other class, the former class can be nested in the later class.
   5. **Static nested**: In class, if a nested class needn't access other codes except itself, it can be decorated using keyword **static**.
   6. Two methods with the same name but different signatures, which is called **overloaded**.
   7. **Caching**: To retrieve some information fast.
   8. **Sentinel node**:The first node created to reduce some special cases, such as empty list.
   9. **Invariants**:An invariant is a fact about a data structure that is guaranteed to be true.

      ```java
      For instance: A SLList with a sentinel node has at least the following invariants:
      1. The sentinel reference always points to a sentinel node.
      2. The front item (if it exists), is always at sentinel.next item.
      3. The size variable is always the total number of items that have been added.
      ```

- Note: SLList reverse() 算法实现(dics03):
  1. Recursive: front.next的地址不变
  2. Iterative: 暂留尾巴, 完成掉头, 两次换头

## **Lecture3**

- Arrays have a **fixed size**. So we implement a Linked List which its size is changeable.
- **GRoE: Golden Rule of Equals: When you write y = x, you are telling the Java interpreter to copy the bits from x into y. (函数参数传递也适用)**
- Java has 8 primitive types:`byte, short, int, long, float, double, boolean and char`. Different primitive types have a different bits length to store. In addition to setting aside memory(a box), Java interpreter map the variable name to the location of the first bit.
- Except these 8 primitive types, everything else is a **reference type**.
- A variable of **reference types** is allocated a box of **64** bits to only store the address of no matter what types of objects.(Address in Java are 64 bits, and **new** keyword  will return the address of the newly created object; before Instantiating object, References may be Null)
- `int[] x = new int[]{0, 1, 2, 95, 4};` include declaration, instantiation and assignment.

## **Lecture2**

1. **上课笔记**
   - Class contain method and/or variables, which are the members of the Class. And members can be separated to Instance members(without static keyword) and Static members(with static keyword)
   - Instance method can be taken by an instance of the class; **whereas** a Static method can only be taken by the class itself.
   - Static variables should be invoked by the class name(D.country) as opposed a instance name(d.country).
   - Array Instantiation.
   - To print Java Array, using `import java.util.Arrays; System.out.print(Arrays.toString(arr));`
   - The Enhanced For Loop: `for(String s : arr){}`

### **Huffman Encoder conclusion**

1. 对于完全没有思路的问题, 可以参考别人的程序; 对于自己可以实现的问题, 先正确的写出自己的答案, 然后参考别人的答案进行修改优化. 比如, 在Huffman Encoder问题上, 要实现Tire的构建, 首先想到的是Selection Sort, runtime是O(n^2); 但对于每次选择最小值的问题来说, PriorityQueue是更好的选择, runtime is O(n*logn).
2. To construct HashMap Table by tire, we should iterate every node until arriving leaf.(By constructing node to store information, including frequency, Character, left node and right node)
3. **Writing Pseudocode is very important!!!** It will help you to clear thinking.
4. Before you begin to write functions, figure out **its functionality, return value and its class, and needed intermediate signatures**to store information.

### **proj2A**

KDTree代码流程记录:

1. 先构建一个NaivePointSet, 实现nearest()代码, 时间复杂度为Θ(N)
2. 创建KDTree constructor, 写一个simple test以查验正确性.
3. 写KDTree的nearest()方法之前, 至少先写个simple test, 最好再写个random test.
4. 完成KDTree的nearest()方法.
5. 进行time测试, 比较NaivePointSet和KDTree的nearest()方法的time consume.

KDTree nearest() 中的一个bug记录：

   ```Java
   if (goodSide == node.right) {
   badSide = node.left;
   }
   badSide = node.right; // 应为 else { badSide = node.right; }
   ```

上述代码有个大问题,即使goodSide is node.right, bad = node.right这段代码也会执行.
花了我至少两个小时来查找该bug, 请if...else连用.

### **Lab2**

1. Searching debug

- **setting breakpoint**
  - **step into**: step one by one
  - **step over**: complete a function call each time.
  - **step out**: to jump out a function if you step into it.
  - **resume**: continue run program until meet next breakpoint.(complete one circular)
  - right click to set a **conditional** breakpoint.
     1. Find a bug: If a function has a bug, to completely rewrite it rather than fix it.

     2. Other Notes:
         - Nondestructive methods vs destructive methods.
         - style checker: to check your style error
         - Java Visualizer: to draw the stack of your program.

## **Java与Python的一些区别:**

   1. semicolon 代替了 indention
   2. else if 代替了 elif;System.out.println 代替了print
   3. Public ClassName 代替了__init__();this 代替了 self
   4. public static void/int  代替了 def
   5. Arrays[] 代替了[]; .length 代替了 len
   6. Java中有`for(int i = 0 ;i < n; i += 1)`, python与java皆有`for(e: s)`
   7. Java's array has no slicing(using pointer to implement recursive); contain same type.

## **Java的一些特性:**

   1. style checker: () 后应有空格; class中,非API应该private.
   2. 当使用自动装箱创建Integer对象时, 编译器会用Integer.valueOf(int i)方法重写该语句, 创建新的Integer对象. 但对于经常使用的值(-128~127), java在内部维护了一个Integer对象数组, 因此这些值并不会创建新的对象, 只返回已缓存的对象. [stackoverflow answer](https://stackoverflow.com/questions/1700081/why-is-128-128-false-but-127-127-is-true-when-comparing-integer-wrappers-in-ja)
   3. `==`: compare address; `equals()`: compare value.

   ```java
      Integer i1 = 128;
      Integer i2 = 128;
      System.out.println(i1 == i2); # false
   ```
