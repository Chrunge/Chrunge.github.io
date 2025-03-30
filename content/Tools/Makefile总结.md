---
title: 编程工具记录
top: false
cover: false
toc: true
mathjax: true
date: 2021-08-23 22:51:43
password:
description:
tags: 
- Makefile
categories:
- Tools
---

## Makefile



1. 命令格式
    - 执行` make target`.

    ```
        <target> : <prerequisites> 
        [tab]  <commands>
    ```

2. `.PHONY` : 可以构建伪目标，[详见](https://www.gnu.org/software/make/manual/html_node/Special-Targets.html#Special-Targets)
<!-- more -->
3. 每行命令在一个单独的shell中执行， 若命令之间需要关联，可以使用`;`来间隔命令，使它们在一行中执行

4. 语法：
   - 正常情况下，会先打印出命令，然后再执行；在命令的前面加上@，就可以关闭echoing。
   - 通配符（wildcard）：`*, ?, ...`
   - 模式匹配：
     - 匹配符%，可以将大量同类型的文件，只用一条规则就完成构建。`%.c: %.o`
     - 自定义变量`var = value`，变量需要放入`$(var)`中
     - 调用Shell变量是，需要转义，故有`$$`
     - $(CC) 指向当前使用的编译器

5. 自动变量
    - `$@` 指代target
    - `$<` 指代第一个前置条件
    - `$^` 指代所有前置条件

文章内容来源，本文只做了简要的总结，为方便查阅和理解：

[参考1](https://www.ruanyifeng.com/blog/2015/02/make.html)
[参考2](http://wiki.wlug.org.nz/MakefileHowto)