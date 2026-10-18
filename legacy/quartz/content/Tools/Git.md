---
title: Git
top: true
cover: false
toc: trueAttachments
mathjax: true
date: 2020-09-28 18:44:16
password:
description: Git学习笔记
tags:
- Git
categories:
- Tools
---

## Learning Git

## 1. **介绍:**

Git是最先进的分布式版本控制系统，用来记录每次文件的改动.
集中式管理系统:拥有一个中央服务器，每次下载和上传改动都需要联网
分布式管理系统:没有中央服务器，每台电脑上都有一个完整的版本库，但通常也有一台充当"中央服务器"的电脑，以方便大家交换.
<!-- more -->
比喻:每一次add，提交一次局部的风景图，commit则是把全部风景图整合起来形成全景图，最后放入保险箱（仓库）中。
![Git常用命令速查表](zob-source/image/Git常用命令速查表.jpg)

## 2. **创建版本库**

1. 所有的版本控制系统，其实只能追踪文本文件的改动，如txt文件，网页，所有的程序代码.

## 3. **git第一步命令**

1. 初始化一个Git仓库，使用`git init`命令。
2. 添加文件到Git仓库，分两步：
    使用命令`git add <file>`，注意，可反复多次使用，添加多个文件；
    使用命令`git commit -m "annotation"`，可一次提交多个文件。
	![git_add](zob-source/image/git_add.png)

## 4. **工作区和暂存区**

1. git目录分为工作区和版本库(.git目录)，版本库中有stage(暂存区)和master分支(仓库).
提交修改:
2. `git add`:工作区>>>暂存区
3. `git commit`：暂存区>>>仓库
4. `git diff` 查看Working Directory和Stage**详细**差异
6. `git diff --cached` 查看Stage和HEAD的差异
7. `git diff HEAD` 查看Working Stage和HEAD的差异
8. 要随时掌握工作区的状态，使用`git status`命令，告知哪些文件被修改过
9. ![Diff](https://raw.githubusercontent.com/Chrunge/Chrunge.github.io/dev/source/_posts/Tools/Attachments/diff.png)

### **撤销修改:**

1. 场景1：`git checkout -- file`(暂存区替换工作区)，相当于 `git add file` 的反向命令，丢弃本地更改。

2. 场景2：当你不但改乱了工作区某个文件的内容，还添加到了暂存区时。想丢弃修改，分两步：
		1. `git reset -- file`(相当于`git commit`的反向命令)
	    2. `git checkout -- file`。

### **回退版本**

1. `git reset -- soft commit_id`: HEAD切换到`commit_id`上，都不改变Working Directory和Stage的内容
2. `git reset commit_id`： HEAD切换到`commit_id`上，只改变Stage的内容，不改变Working Directory的内容
   ![reset](https://raw.githubusercontent.com/Chrunge/Chrunge.github.io/dev/source/_posts/Tools/Attachments/reset.gif)
3. `git reset --hard commit_id`切换到`commit_id`，并改变Working Directory和Stage的内容（相当于`commit_id`之后修改的内容全部丢弃）
   再使用`git push -f origin branch_name` 强行提交
   ![reset_hard](https://raw.githubusercontent.com/Chrunge/Chrunge.github.io/dev/source/_posts/Tools/Attachments/reset_hard.gif)
   ![reset_soft](zob-source/image/reset_soft.gif)
4. 本地或远程：使用`git revert -n commit_id`可以实现反做，并使用`git commit -m commit_id`提交
   ![revert](https://raw.githubusercontent.com/Chrunge/Chrunge.github.io/dev/source/_posts/Tools/Attachments/revert.gif)
6. 穿梭前，用`git log`可以查看提交历史，以便确定要回退到哪个版本。要重返未来，用`git reflog`查看命令历史，以便确定要回到未来的哪个版本。

### **删除文件:**

1. 删除文件:`rm file --> git rm file`(提交到暂存区) -->`git commit -m <annotation>`
2. 不小心删除文件:`rm file --> git checkout -- file` (暂存区替换工作区)
3. 不小心删除文件:`git rm file --> git reset HEAD file -->git checkout -- file`(不推荐此种删除方式)

## 5. **git远程库:**

1. 关联一个远程库，使用命令`git remote add origin git@server-name:path/repo-name.git`；
2. 第一次推送:关联后，使用命令`git push -u origin master`第一次推送master分支的所有内容；
3. 以后推送:每次本地提交后，只要有必要，就可以使用命令`git push origin master`推送最新修。意思是：切到本地仓库中的"master"分支，获取所有的提交，再到远程仓库"origin"中找到"master"分支，将远程仓库中没有的提交记录都添加上去.<br><br>
4. 克隆远程库：git clone git@github:path/repo-name.git
5. 查看远程库:git remote [-v] (-v 代表详细信息)
      - master分支是主分支，因此要时刻与远程同步；
      - dev分支是开发分支，团队所有成员都需要在上面工作，所以也需要与远程同步；
      - bug分支只用于在本地修复bug，就没必要推到远程了，除非老板要看看你每周到底修复了几个bug；
      - feature分支是否推到远程，取决于是否和你的小伙伴合作在上面开发。<br><br>
6. 远程获取所有分支：

   ```
   git branch -r | grep -v '\->' | while read remote; do git branch --track "${remote#origin/}" "$remote"; done
   git fetch --all
   git pull --all
   ```

7.  推送本地所有分支：`git push --all origin`

8.  使用GitHub，首先fork别人的仓库到自己的仓库，然后从自己的仓库中克隆到本地，再进行修改.如果完功能后提交到自己的仓库，再pull request到他人的仓库(将修改提交给他人)

### **多人协作:**

1. 试图用`git push origin <branch-name>`推送自己的修改;
2. 如果远程分支比本地分支更新，则推送失败->使用`git pull`尝试自动合并;
3. `git pull --rebase origin master`：拉取远程仓库，更新到本地仓库，然后master的commits再提交到上面
   - 如果合并有冲突，则解决冲突，并在本地提交，最后成功推送
   - 如果`git pull`提示no tracking information，则说明本地分支比远程分支的链接关系没有创建，用 `git branch --set-upstream-to <branch-name> origin/<branch-name>` 创建链接关系<br>
   - `git checkout -b dev origin/dev`基于远程分支创建本地分支<br><br>

4. `git push`：提交目前分支到关联的远程分支;
   `git push <remote> <source>`;
   `git push origin <source>:<destination>`.

5.	`git fetch`：下载所有的提交记录到本地的各个远程分支;
	![fetch](zob-source/image/fetch.gif)
	`git fetch origin foo`：Git会到远程仓库的`foo`分支上，然后获取所有本地不存在的commits，放到本地的`o/foo`上;
	`git fetch origin <source>:<destination>`：从origin的source分支中取回数据，放入destination本地分支.

6. 无`source`时：`git push origin  :foo`：删除远程`foo`分支
	`git fetch origin  :bar`：在远程仓库中添加`bar`远程分支

7. `git pull origin foo` 相当于：`git fetch origin foo`和`git merge o/foo`
   ![pull](/zob-source/image/pull.gif)

8. `cherry pick commit_id1 commit_id2 ...`：将commit_id依次**复制添加**到当前分支  
	![cherry_pick](zob-source/image/cherry_pick.gif)上
   

9. `git rebase branch_name`：以`branch_name`为base，将分叉后的所有commit剪切上去。
    `git rebase branch1 branch2`：以`branch1`为base，将分叉后的`branch2`的`commit`剪切上去。
    `git rebase -i HEAD~4`：以交互的方式使用rebase
    
   >There are 6 actions we can perform on the commits we're rebasing:
   >`reword`：Change the commit message
   > `edit`：Amend this commit
   >`squash`：Meld commit into the previous commit
   >`fixup`：Meld commit into the previous commit，without keeping the commit's log message
   >`exec`：Run a command on each commit we want to rebase
   >`drop`：Remove the commit
   
   ![rebase](zob-source/image/rebase.gif)
   ![rebase-i](https://raw.githubusercontent.com/Chrunge/Chrunge.github.io/dev/source/_posts/Tools/Attachments/rebase-i.gif)

## 6. **分支管理:**

创建属于自己的分支，在开放一个功能完毕之后，再一次性合并到原来的分支上.

1. HEAD是一个指针，指向的版本是当前正在其基础上工作的版本，**HEAD通常情况下指向分支名，但也可以指向版本号**，使用`git checkout branch/commit_id`可以改变HEAD指向;
<br>`HEAD^，HEAD~3`可代表相对引用，用于切换HEAD的位置.

查看分支:`git branch`
创建分支：`git branch <name>`
切换分支:`git checkout <name> or git switch <name>`
删除分支：`git branch -d <name>`
合并分支到**当前分支**：`git merge <name>`

创建并切换分支：`git checkout -b <name> 或 git switch -c <name>`
强行删除未合并的分支:`git branch -D <name>`
将分支名（指针）指向其他位置：`git checkout -f <branch_name> HEAD~<num>`<br>

### 2. **解决冲突:**

当git无法合并分支时，需要手动编辑合并失败的文件，然后在提交
`git log --graph (--pretty=oneline --abbrev-commit)`可以查看分支的合并图.

### 3. **分支管理策略:**

1. git通常会用fast forward模式，在这种情况下，删除分支之后，会丢掉分叉时的信息(`git merge <name>`)
   ![fast forward](zob-source/image/fast_forward.gif)
2. 使用--no-ff的普通模式进行合并，git会在merge时生成一个新的commit，这就能在分支历史上看出分支信息(`git merge --no-ff -m "..." <name>`)
   ![](/zob-source/image/no_fast_forward.gif)

3. **分支策略:**
master分支非常稳定，用来发布版本;
干活都在dev分支上，每个人都从dev分支上创建自己的分支，然后再提交到dev分支上，

4. **Bug分支:**
   1. 在一个任务期间，须完成一个新任务:

      `git stash`:保留一个现场->然后去完成新任务
      `git stash list`:列出所有现场
      `git stash apply <stash@{id}>` :恢复现场，现场列表中依旧存在该现场，即没有删除栈顶
      `git stash dorp <stash@{id}>`：删除现场
      `git stash pop`：弹出现场，已删除栈顶
      `git cherry-pick <branch id>`：复制一个特定的提交到当前分支

## 7. **标签管理**

1. 发布一个版本时，给该版本打一个标签(tag)，就相当于总有个指针指向那个版本;
   git的标签也相当于版本库的快照(和commit类似)，且标签和commit_id对应.
2. 打标签:`git tag <tag-name> [<commit_id>]`
3. 查看标签:`git tag`;查看标签信息:`git show <tag-name>`
4. 创建带有说明的标签，用-a指定标签名，-m指定说明文字：`git tag -a v0.1 -m "version 0.1 released" 1094adb`
5. 删除标签:`git tag -d <tag-name>`
6. 推送标签至远程:`git push origin <tag-name>`一次性推送全部标签:`git push origin --tags`
7. 删除远程标签:先从本地删除(`git tag -d <tag-nanme>`)，再从远程删除:`git push origin :refs/tags/<tag-name>`
8. `git describe ref(参考点)`返回离ref最近的标签

## 8. **忽略特殊文件:**

1. 添加一个.gitignore文件，写入需要忽略的文件名.
2. `git add -f <filename>` :强制add一个文件(针对于被忽略却想添加的文件)
3. `git check-ignore -v <filename>`:检查.gitignore文件错误(针对于被忽略的却想添加的文件)
4. gitignore文件本身要放到版本库里，并且可以对.gitignore做版本管理！
5. [gitignore规则总结](https://www.cnblogs.com/kevingrace/p/5690241.html)

## 9. **配置别名**

1. 如将status 改为st：`git config --global  alias.st status`
   将`reset HEAD`改为`unstage：git config --global alias.unstage 'reset HEAD'`
   (--global对当前用户起作用，不加则对当前仓库起作用)
2. 查看每个仓库的git配置：`cat .git/config`
3. 查看每个用户的git配置：`cat .gitconfig`(目录为c:/users/计算机名称)

## 10. **添加已有的ssh key私钥**

- 依次执行以下命令：

   exec ssh-agent bash
   eval ssh-agent -s
   ssh-add "C:\Users\Administrator\.ssh\id_rsa"<绝对路径>

## 11. **A brief about command**

   This is the foundation of git. To summarize，using our photo analogy:<br>

git init：Creates a box in which to permanently store panoramic pictures.
git add：Takes a temporary photo of one thing that can be assembled into a panoramic photo later.
git commit -m "commit message"：Assembles all available temporary photos into a panoramic photo. Also destroys all temporary photos.
git log：Lists all the panoramic photos we’ve ever taken.
git show commit_id：Looks at what is in a particular panoramic photo.
git checkout：Rearranges files back to how they looked in a given panoramic photo. Does not affect the panormiac photos in your box in any way.
git status：Determining the exact status of each file in your repository.

git add -A：stages all changes
git add .：stages new files and modifications，without deletion
git add -u：stages modifications and deletions，without new files


修改或者回退：
git add [forgetten-file];
git commit --amend:Amend latest commit (changing commit message or add forgotten files)：
git reset HEAD [file]：Unstage a file that you haven’t yet committed
git checkout -- [file]：Revert a file to its state at the time of the most recent commit
git checkout commit_id：Back to the commit_id 



分支：
git branch [new-branch-name]:The following command will create a branch off of your current branch.
git checkout [destination-branch]：This command lets you switch from one branch to another by changing which branch your HEAD pointer references.
git checkout -b [new-branch-name]：You can combine the previous two commands on creating a new branch and then checking it out with this single command:
git branch -d：[branch-to-delete]:You can delete branches.
git branch -v：You can easily figure out which branch you are on.

合并分支:
you should checkout the master branch and merge `fixing-ai-heuristics` into master.
git checkout master
git merge `fixing-ai-heuristics`

远程:
git clone [remote-repo-URL]：Makes a copy of the specified repository，but on your local computer. Also creates a working directory that has files arranged exactly like the most recent snapshot in the download repository. Also records the URL of the remote repository for subsequent network data transfers，and gives it the special remote-repo-name “origin”.
git remote add [remote-repo-name] [remote-repo-URL]：Records a new location for network data transfers.
git remote -v：Lists all locations for network data transfers.
git pull [remote-repo-name] master：Get the most recent copy of the files as seen in remote-repo-name
git push [remote-repo-name] master：Pushes the most recent copy of your files to the remote-repo-name.

git remote add [short-name] [remote-url]:[for example]:git remote add origin git@github.com:berkeley-cs61b/skeleton.git
git remote rename [old-name] [new-name]:You can rename your remote.
git remote rm [remote-name]:remove a remote.
git remote -v：list remotes.

For a more particular example，let’s say that your partner creates a new branch on the remote called fixing-ai-heuristics. You can view that branch’s commits with the following steps:
$ git fetch origin
$ git branch review-ai-fix origin/fixing-ai-heuristics:The second command creates a new branch called review-ai-fix that tracks the fixing-ai-heuristics branch on the origin remote.
$ git checkout review-ai-fix

git pull --rebase origin master：The changes from the server will be applied onto your working copy and your commit will be stacked on top.(拉取远程仓库，更新到本地的远程仓库，然后你的commits再继续提交到上面)

## **12:其他**

1. [Git动画演示，推荐](https://dev.to/lydiahallie/cs-visualized-useful-git-commands-37p1#rebase)
2. [git动画通关网站，推荐](https://learngitbranching.js.org/?locale=zh_CN)
3. [Git Cheat Sheet](https://www.atlassian.com/git/tutorials/atlassian-git-cheatsheet)
4. [其他参考](https://zhuanlan.zhihu.com/p/143135645)
5. [将子模块重新合并到父模块中](https://x3ro.de/integrating-a-submodule-into-the-parent-repository/)
6. [Git Fork指南](https://segmentfault.com/a/1190000021711920)
7. [Gitignore配置运维总结](https://www.cnblogs.com/kevingrace/p/5690241.html)

