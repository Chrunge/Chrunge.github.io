

## 九、 Git 命令速查表 (版本控制与时光机)

**核心定位**：对于开发，Git 是代码保存工具；对于运维，Git 是**版本控制、配置管理与回滚救命**的核武器。

**核心心法**：Git 维护了三个区域：**工作区 (Working Dir)** -> `add` -> **暂存区 (Index/Stage)** -> `commit` -> **本地仓库 (Repository)** -> `push` -> **远程仓库 (Remote)**。

#### 1. 常用命令速查

| 命令 | 全称/含义 | 详细说明 | 运维场景 |
| :--- | :--- | :--- | :--- |
| **`clone`** | **clone** | 下载远程仓库到本地。 | `git clone <url>` 拉取代码或配置库。 |
| **`status`** | **status** | **必用**。查看当前文件状态（哪些改了、哪些没存）。 | 操作前先看状态，防止误提交。 |
| **`add`** | **add** | 将文件从工作区添加到**暂存区**。 | `git add .` (全加) 或 `git add conf/nginx.conf`。 |
| **`commit`** | **commit** | 将暂存区内容保存到**本地仓库**。 | `git commit -m "fix: update nginx port"`。 |
| **`push`** | **push** | 将本地仓库推送到**远程仓库**。 | `git push origin master` 发布代码/配置。 |
| **`pull`** | **pull** | 拉取远程代码并自动**合并** (Fetch + Merge)。 | 服务器上更新代码：`git pull`。 |
| **`branch`** | **branch** | 查看、创建、删除分支。 | `git branch -a` 查看所有分支（含远程）。 |
| **`checkout`** | **checkout** | 切换分支或恢复文件（旧版命令，功能混杂）。 | `git checkout -b dev` 切新分支；`git checkout file` 丢弃修改。 |
| **`switch`** | **switch** | **切换分支** (新版，推荐)。 | `git switch dev`。比 checkout 语义更清晰。 |
| **`restore`** | **restore** | **恢复文件** (新版，推荐)。 | `git restore file.txt` 丢弃工作区的修改（撤销）。 |
| **`log`** | **log** | 查看提交历史。 | `git log --oneline -n 10` 查看最近10条精简记录。 |
| **`diff`** | **diff** | 查看文件改动内容。 | `git diff` (看工作区与暂存区差异)。 |
| **`stash`** | **stash** | **暂存**（把当前未提交的修改藏起来）。 | 线上紧急修复，需先暂存当前未完成的工作，切分支修 Bug。 |
| **`reset`** | **reset** | **重置/回退**。时光倒流。 | **⚠ 危险**：`git reset --hard` 丢弃所有修改。 |
| **`revert`** | **revert** | **反做**。产生一个新的提交来抵消之前的修改。 | **推荐**：安全的线上回滚方式，保留历史痕迹。 |

---

#### 2. 运维日常实战 (Cookbook)

##### 场景一：标准的代码更新流程 (Deploy)
**目标**：在生产服务器上更新代码。
```bash
cd /data/www/project
# 1. 丢弃本地意外的修改 (防止合并冲突)
git checkout .  # 或者 git restore .
# 2. 拉取最新代码
git pull origin master
# 3. 查看更新了什么
git log -p -1
```

##### 场景二：紧急回滚 (Rollback) —— **救命题**
**目标**：刚发的版本炸了，需要立刻回退到上一个版本。
*   **方法 A (Reset)**：强行回退指针 (不仅代码变了，历史记录也没了)。
    ```bash
    # 回退到上一个版本
    git reset --hard HEAD^
    # 或者回退到指定哈希值
    git reset --hard a1b2c3d
    # ⚠ 注意：如果是多人协作分支，push 时需要 git push -f (极度危险)
    ```
*   **方法 B (Revert)**：**推荐做法**。生成一个新的 Commit 来撤销之前的改动。
    ```bash
    # 撤销最近一次提交
    git revert HEAD
    # 然后正常推送
    git push origin master
    # 优点：历史清晰，不破坏其他人协作。
    ```

##### 场景三：处理冲突 (Merge Conflict)
**目标**：`git pull` 报错，提示文件冲突。
```bash
# 1. 暂存当前未提交的修改
git stash
# 2. 拉取代码
git pull
# 3. 弹回暂存的修改 (此时会触发合并)
git stash pop

# ... 如果提示 Conflict ...
# 4. 手动打开冲突文件，搜索 "<<<<"，修改代码保留想要的。
# 5. 重新提交
git add .
git commit -m "fix: resolve conflict"
```

##### 场景四：查看某行代码是谁写的 (背锅侠查询)
**目标**：配置文件里有个错误的配置，想知道是谁、什么时候改的。
```bash
# 查看 nginx.conf 每一行的作者和 commit ID
git blame nginx.conf
```

##### 场景五：忽略特殊文件 (.gitignore)
**目标**：不想提交日志文件 (`*.log`) 或 密钥文件。
```bash
# 创建 .gitignore 文件
echo "*.log" > .gitignore
echo "config/secret.key" >> .gitignore

# 如果文件已经被追踪了，需要先从缓存清除
git rm --cached config/secret.key
```

---

#### 3. 知识难点与进阶：Reset vs Revert & Rebase

很多运维分不清这几个概念，导致线上事故。

##### 难点一：`git reset` 的三个参数
`git reset [模式] [Commit ID]`

| 模式 | 影响范围 | 解释 | 场景 |
| :--- | :--- | :--- | :--- |
| **`--soft`** | 仅重置仓库区 | 代码还在，状态变为 **"已 add，未 commit"**。 | 想修改上一次的 commit 注释，或者合并多个 commit。 |
| **`--mixed`** | 重置仓库区 + 暂存区 | **默认模式**。代码还在，状态变为 **"未 add"**。 | 提交错了文件，想撤回来重新 add。 |
| **`--hard`** | **全部重置** | **彻底销毁**。代码、暂存区全部恢复到指定版本。 | **彻底放弃**当前的修改，或者强制回滚。 |

##### 难点二：Merge (合并) vs Rebase (变基)

*   **Merge**:
    *   **行为**：将两个分支的叉合并，生成一个新的 "Merge Commit"。
    *   **优点**：真实记录历史，非破坏性。
    *   **缺点**：提交记录会有很多分叉和 "Merge branch..." 的废话，不美观。
    *   **运维建议**：**公共分支（如 master/release）必须用 Merge**。

*   **Rebase**:
    *   **行为**：把你当前分支的修改，“剪切”下来，贴到目标分支的最后面。
    *   **优点**：提交记录是一条直线，非常干净。
    *   **缺点**：**修改了历史**！如果你的分支已经 push 过了，千万别 rebase。
    *   **运维建议**：**只在自己本地私有分支开发时使用**，保持提交整洁。

##### 难点三：救命神器 `git reflog`
**场景**：你执行了 `git reset --hard`，把代码删没了，然后发现回退错版本了！完了，`git log` 里也看不到那个版本了。

**解法**：`git reflog` 记录了你**每一次的 HEAD 移动**（包括 reset、commit、checkout）。

```bash
git reflog
# 输出：
# ea3d5f2 HEAD@{0}: reset: moving to HEAD^
# 5f2a1b3 HEAD@{1}: commit: add new feature  <-- 这是你刚才丢掉的版本

# 救回来：
git reset --hard 5f2a1b3
```

---

#### ⚠️ 运维避坑与经验 (GIT 篇)

1.  **绝对禁止提交 Secrets**：
    *   **严禁**将 AWS Access Key、数据库密码、私钥提交到 Git 仓库。
    *   一旦提交，即使删除了文件，历史记录里**依然能翻到**。
    *   **补救**：需要使用 `git filter-branch` 或 BFG Repo-Cleaner 清洗历史，并**立即轮换密钥**。

2.  **慎用 `git push -f` (Force Push)**：
    *   强制推送会覆盖远程仓库的历史。
    *   如果多人在同一个分支协作，你 `push -f` 会导致同事的代码被你覆盖。
    *   **保护机制**：在 GitLab/GitHub 设置 **Protected Branch**，禁止对 master 分支 Force Push。

3.  **大文件噩梦**：
    *   Git 不适合存二进制大文件（如 SQL dump, jar 包, 图片）。仓库会变得巨大无比，clone 极慢。
    *   **解法**：使用 **Git LFS** (Large File Storage) 或将构建产物放到 Nexus/Artifactory，Git 只存代码。

4.  **换行符问题 (CRLF vs LF)**：
    *   Windows 用 CRLF (`\r\n`)，Linux 用 LF (`\n`)。
    *   如果不配置好，Shell 脚本在 Windows 下编辑后提交到 Linux 运行会报错 `command not found`。
    *   **最佳实践**：
    ```bash
    # 提交时转换为 LF，检出时转换为系统默认 (推荐)
    git config --global core.autocrlf input
    ```