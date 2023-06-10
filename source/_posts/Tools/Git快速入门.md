---
title: Git
top: true
cover: false
toc: trueAttachments
mathjax: true
date: 2020-09-28 18:44:16
password:
description: Git快速入门指南
tags:
- Git
categories:
- Tools
---

## Git文件对象

1. Git与某些版本控制系统不同, 它不保存版本之间的差异, 也将所有内容整合为一个大文件后再整体保存, 而是分别保存每个文件. 同时, 每一次进行快照时,对于没有改动的文件,它不会保存两份, 而是通过指针指向未改动的文件.
2. Git保存的对象有三种类型: 
	1. 普通文件保存为`blob = array<byte>`
	2. 目录为`Tree = Map<String, tree | blob>`
	3. 快照为
	```C
	Commit = struct { 
	parent: array<commit> 
	author: string
	message: string
	snapshot: tree
	}
	```
1. 快照在仓库中的保存形式为Map(HashOfCommit, Commit), 然而Hash值不易读, 因此可以通过分支名指向Hash值. 同时,还存在一个HEAD指针, 它指向分支名.

<!--more-->

## 三个状态区: 

工作区(working directory), 暂存区(staged)和仓库(commit)

#### 状态区之间的文件流动: 
![三个区域的文件覆盖](https://github.com/Chrunge/Pictures/blob/master/Git/ThreeState.jpg?raw=true)

#### 状态区之间的文件比较与查看: ![GitDiffandShow](https://github.com/Chrunge/Pictures/blob/master/Git/DiffandShow.jpg?raw=true)

## 分支操作

跳转该网址: [Git分支操作](https://dev.to/lydiahallie/cs-visualized-useful-git-commands-37p1#rebase)

## 其他值得一提的内容

1. 查看当前状态: `git status`
2. 查看历史提交: `git log`
3. 查看历史命令: `git reflog`, 可补救`git reset --hard commit_id`
4. 忽略文件: `.gitignore`
5. 删除文件:
	1. 删除文件:`rm file --> git rm file`(提交到暂存区) -->`git commit -m <annotation>`
	2. 恢复不小心删除文件:`rm file --> git checkout -- file` (暂存区替换工作区)
6. 暂时离开: `git stash`
7. 标签管理: `git tag`
8. git子库的管理
9. 重构git历史, 比如git历史中包含了密钥,或者特别大的文件

## 补充

#### 文件添加补充: git add
- ![git_add](https://raw.githubusercontent.com/Chrunge/Chrunge.github.io/dev/source/_posts/Tools/Attachments/git_add.png)

#### 立即离开现场: git stash
   1. 应用场景: 在一个任务期间，须立即离开去完成一个新任务,如紧急Bug修复
   2. `git stash`:保留一个现场->然后去完成新任务
   3. `git stash list`:列出所有现场
   4. `git stash apply <stash@{id}>` :恢复现场，现场列表中依旧存在该现场，即没有删除栈顶
   5. `git stash dorp <stash@{id}>`：删除现场
   6. `git stash pop`：弹出现场，已删除栈顶
   7. `git cherry-pick <branch id>`：复制一个特定的提交到当前分支

#### 标签管理: git tag

1. 当达到一个里程碑时，给该版本打一个标签(tag)，相当于总有个指针指向那个版本;
   git的标签也相当于版本库的快照(和commit类似)，且标签和commit_id对应.(标签有两种: lightweight和annotation)
2. 打标签:`git tag <tag-name> [<commit_id>]`
3. 查看标签:`git tag`; 查看标签信息:`git show <tag-name>`
4. 创建带有说明的标签，用-a指定标签名，-m指定说明文字：`git tag -a v0.1 -m "version 0.1 released" 1094adb`
5. 删除标签:`git tag -d <tag-name>`
6. 推送标签至远程:`git push origin <tag-name>`一次性推送全部标签:`git push origin --tags`
7. 删除远程标签:先从本地删除(`git tag -d <tag-nanme>`)，再从远程删除:`git push origin :refs/tags/<tag-name>`
8. `git describe ref(参考点)`返回离ref最近的标签

#### 添加已有ssh key私钥
- 依次执行以下命令：
	```Bash
   exec ssh-agent bash
   eval ssh-agent -s
   ssh-add "C:\Users\Administrator\.ssh\id_rsa"<绝对路径>
	```

## **参考引用**

1. [Git动画演示](https://dev.to/lydiahallie/cs-visualized-useful-git-commands-37p1#rebase)
2. [git动画通关网站](https://learngitbranching.js.org/?locale=zh_CN)
3. [Git Cheatsheet](https://github.com/Chrunge/Awesome-cheatsheets/blob/master/tools/git.txt)
4. [Git Cheatsheet2](https://github.com/Chrunge/CheatSheet/blob/main/docs/git.md)
5. [将子模块重新合并到父模块中](https://x3ro.de/integrating-a-submodule-into-the-parent-repository/)
6. [Git Fork指南](https://segmentfault.com/a/1190000021711920)
7. [Gitignore配置运维总结](https://www.cnblogs.com/kevingrace/p/5690241.html)