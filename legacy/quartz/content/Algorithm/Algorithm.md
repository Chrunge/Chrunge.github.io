---
title: Algorithm
top: false
cover: false
toc: true
mathjax: true
date: 2022-03-30
password:
description: 记录算法题中的一些常见思路和模板
tags: 
- Algorithm
categories:
- Computer Science
---

## 排序
原地算法
1. 快排
2. 归并排序
3. 桶排序
4. shell排序
5. Radix排序
6. 冒泡排序和插入排序

## 常用数据结构的继承关系和其API
1. LinkedHashMap

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

## Bitwise: 

#### 题型:

1. 重复K次元素中, 有出现P次的元素, 找出它.(使用counter + mask)
2. 计算一个二进制数中1的个数. (HammingDistance => ^和&; 多个HammingDistance, 只与位相关, 且位与位之间可以独立计算.)
3. 不使用`+`和`-`, 计算两数之和.

#### 题解:

1. xor: `a^b`: 相同位为0, 不同为为1, 且具有交换性质和结合性质
   - `a^0=a`, 则有`a^a = 0`. => 重复且缺失的数字(当然也可以使用数学上的加法)
   - `a=a^b, b=a^b, a=a^b` => 不需要临时变量来交换数字
   - [掩码的使用](https://leetcode.com/problems/single-number-ii/discuss/43295);[中文翻译](https://blog.csdn.net/wlwh90/article/details/89712795)
     - 问题: 给定一个整数数组，一个元素出现p次，其余元素出现k (k > 1)次(p >= 1, p % k != 0)。找到出现p次的元素。
     - 当达到次数K时,`mask = 0`,消除出现K次元素的作用; 其余状况,`mask = 1`: 如此时`K=5`时,此时`mask = ~(x3&-x2&x1)`.
     - 将32个m-bit的counter转变为m个32bit, (只是为了方便使用整数表示和返回结果, 不具有其他含义)
       - 因为`xor`和`&`都是按位与运算, 位于位之间互不影响.
     - 第`i(i = [1, 32])`个`counter = n`, 表示第i位上多出了n个1, 而这些1都来自出现P次的元素.
     - 最后返回`(x1|x2|...|xm)` 或 某个`xj`(如P = 2, 则可返回`x2`; P = 3, 可返回`x2`或`x3`).

2. and: 
   - `a & (a - 1)`: 去掉最后一个1
   - `a & (~(a - 1)) == a & (-a)`: 只保留最后一个1
   - `a & 1`: 判断奇偶性

## Number & Math

1. 数字操作, 重复数字, 缺失数字, 数字范围与下标相关的数组:
   1. Sum, Set, Xor
   2. 排序, 快慢指针(`n+1`个元素的数组,其元素大小均为`[1,n]`之间), 
   3. 结合下标进行考虑, 将`nums[i]`变为负数, 表示i存在于数组中.

###### 题型:
3. 计算质数: 埃氏筛(如果x是质数, 从x^2开始, 将他的合数全部变为false)
4. 数组中某个数的比例: Moore投票[占1/2, 占1/3(先选出候选人, 然后再遍历一次)]
5. 数组,链表表示数字, 然后+1, 或者两个链表相加.
6. 数字的幂, 快乐数, 丑数

## 字符串
###### 技巧:
- 需要熟悉String, Character, Integer, StringBuilder类提供的函数
	- String: replace, split("\\s+") 
- 两级反转, char[]和swap很方便

###### 题型
1. stringToInt or intToString
2. 反转字符串, 反转单词, 
3. 回文字符(中心对称=>中心扩散), 全排列
4. 最长回文字符串(dp), **dp[i][j]表示i - j是否为回文字符串, Manacher算法**

## 链表

#### 题型: 
1. 两数相加: 正序和倒序
	1. 解法一: 第一步,使它们的长度相同
	2. 解法二: 两级反转
2. 合并多个链表, 由大到小排列
	1. PQ, 归并
3. 反转/交换链表, 每k个反转一次; 回文链表
	1. 截断, 反转
4. 判断环, 并返回入还第一个节点
5. 排序 
6. 深度copy(使用Map映射)

## 数组
1. 两数之和, 三数之和, 四数之和: Set, 双指针, 排序 + 双指针
2. 子数组之和等于k: 前缀和
	1. 小于或大于: TreeMap; 最短子数组: 前缀和数组+单调Deque
	2. 最小覆盖子串: HashMap + Count
	3. **滑动窗口**: 单调Deque, 判断哪些数是不需要的
3. 交集: Set, HashMap; 移除重复元素
4. 最大的连续子数组之和: DP 
5. 接水问题, 岛屿问题

## Tree 
1. 前序遍历, 中序遍历, 后序遍历: 递归, 迭代(**while循环中, 一定要清楚每次while的功能**)
	1. 中序遍历的迭代: while循环对**以root节点为根节点的树进行中序遍历**(判断条件: stack.size() > 0 || root != null)
		1. 第一步: 将node节点放入stack中, 一直到最左节点
		2. 弹出最左节点node, 判断是否存在右节(可写成root = node.right)
			1. 若存在, 令root = node.right, 可以理解为root与root.right等价, 表明此时左节点已经遍历完成, 现在以右节点为根节点的树进行中序遍历.
			2. 若不存在, 令root = null, 下一步弹出父节点(stack中的节点均被视为左节点).

	2. Mirror中序遍历: 
		1. 判断是否存在左节点: 
		2. 若不存在, 则root  = root.right
		3. 若存在
			1. 找到前驱结点, 判断第几次遍历
				1. 第一次遍历, 保存回去的路径, 向左节点移动: pre.right = root, root = root.left;
				2. 第二次遍历, 恢复路径, 向右节点移动: pre.right = null, root = root.right;

1. 层序遍历: 前序遍历, 广度优先遍历, 垂序遍历
2. 树的相等, 对称, 镜像
3. 树的深度,树的直径, 公共祖先, 路径和, 路径最大和
	1. 函数可能有副产物, 在递归中更新.
	2.  辅助函数: **子树的贡献值**, 而不是原函数
4. 二叉树剪枝, 恢复和构建树
	1. 前序和中序恢复树，中序和后序恢复树，对树的序列化与发序列化(有点复杂)
5. 验证二叉树（自上而下递归，验证每一个数都位于特定的范围），搜索二叉树的中继后驱
6. 对二叉树的增删查改



## 比较有意义的难题:
1. 立方体接雨水, 岛屿问题, 质数问题, 回文数Manacher方法, 树的遍历, 计数器与Mask.
2. 树的遍历还有很多解法, 特别是如何把递归转化为stack.
3. 