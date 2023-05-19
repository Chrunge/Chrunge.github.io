---
title: Algorithm
top: false
cover: false
toc: true
mathjax: true
date: 2022-03-30
password:
description: 算法的一些常见解法
tags: 
- Algorithm
categories:
- Computer Science
---

## Arrays

1. N sum: 
   1. 没有顺序: HashMap
   2. 有顺序: Two pointer
   3. Tree: HashSet(O(N)), Two pointers(O(N)), need two stacks.
   4. Two Trees: Two pointers and two stacks 或者将 convert tree to ordered list.
<!-- more -->
2. Subarray Sum: 
   1. window(Two pointers, 没有负数的情况下)
   2. 构建`前缀和数组`, 配合HashMap来寻找: 子数组和`k, 和子数组和 == k的最大子数组的长度

   Note: 当心有负数的情况

3. Sliding window:
   1. 对于`Math.abs(nums[i] - nums[j]) <= k`的情况, 可以使用TreeSet(TreeMap)或者bucket.
   2. 滑动窗口的最大值: 使用`deque`
   3. 滑动窗口: 一般是找最长和最短的子字符串.
   
4. In place remove/swap:
   1. Two pointer: 一个用于元素迭代，一个用于维护当前位置
   2. swap: 前后交换
   3. 283题：
      1. 将非0元素前移，后面补0
      2. 将0元素与后续第一个非0元素交换

   Note: 当sliding window滑动时, 必须清楚哪些数据是不需要的(没有存在的意义, 不可能是返回值的那些数), `Stack`和`Deque`只保留需要的数据. 
   
5. 岛屿问题:
   1. 用水淹没
   2. 使用boolean[][]