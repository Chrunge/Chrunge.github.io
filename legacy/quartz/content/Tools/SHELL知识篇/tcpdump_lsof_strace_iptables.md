## 五、 tcpdump 命令速查表 (网络抓包核武器)

`tcpdump` 是 Linux 系统中最强大的网络流量分析工具，基于 libpcap 库。它需要 **root 权限** (`sudo`) 才能运行。

#### 1. 常用选项速查表

| 选项 | 全称/记忆法 | 详细说明 | 运维场景 |
| :--- | :--- | :--- | :--- |
| **`-i`** | **i**nterface | 指定监听网卡。如 `-i eth0`。`any` 表示所有接口。 | 多网卡服务器，需区分内网/外网流量时。 |
| **`-nn`** | **n**o **n**ame | **必加选项**。不解析域名和端口名，直接显示 IP 和数字端口。 | 避免反向 DNS 解析拖慢抓包速度，输出更直观。 |
| **`-s`** | **s**naplen | 设置抓包长度。`-s 0` 表示抓取完整数据包（默认可能只抓 262144 字节）。 | 抓取 HTTP Body、SQL 语句等应用层数据时**必须设置**。 |
| **`-w`** | **w**rite | 将抓包结果写入 `.pcap` 文件，不打印到屏幕。 | 生产环境高并发下抓包，后续用 Wireshark 分析。 |
| **`-r`** | **r**ead | 读取 `.pcap` 文件进行分析。 | 在服务器端快速回放分析历史包。 |
| **`-A`** | **A**SCII | 以 ASCII 文本打印数据包内容。 | 快速查看 HTTP Header、URL 等纯文本内容。 |
| **`-X`** | He**X** | 同时以 16 进制和 ASCII 打印数据包内容。 | 查看二进制数据或更底层的协议细节。 |
| **`-c`** | **c**ount | 抓取指定数量的数据包后自动退出。 | 调试脚本连通性，如 `tcpdump -c 5`。 |
| **`-v`** | **v**erbose | 显示详细信息（TTL、ID、Total Length）。`-vv`, `-vvv` 更详细。 | 排查 IP 层或协议头部的细节问题。 |
| **`-e`** | **e**thernet | 显示数据链路层头部（MAC 地址）。 | 排查二层网络问题，如 ARP 欺骗、MAC 冲突。 |
| **`-C`** | File **C**ize | 配合 `-w` 使用，限制单个文件大小（单位 MB）。 | **重要**：防止长时间抓包写满磁盘。 |
| **`-G`** | **G**ap (Time) | 配合 `-w` 使用，按时间间隔（秒）轮转保存文件。 | 故障复现周期长，需要按小时轮转抓包时。 |

---

#### 2. 读懂 tcpdump 输出 (知识难点)

抓包不仅要会抓，还要会看。以下是一行典型的 TCP 输出解析：

```text
20:17:45.325605 IP 10.0.0.1.56432 > 10.0.0.2.80: Flags [S], seq 123456789, win 29200, length 0
```

*   **20:17:45.325605**: 精确到微秒的时间戳。
*   **IP**: 协议类型。
*   **10.0.0.1.56432 > 10.0.0.2.80**: 源 IP.端口 `>` 目的 IP.端口。
*   **Flags [S]**: TCP 标志位（关键！）。
    *   `[S]` = SYN (发起连接)
    *   `[.]` = ACK (确认)
    *   `[P]` = PSH (推送数据)
    *   `[F]` = FIN (结束连接)
    *   `[R]` = RST (重置连接/报错)
*   **seq**: 序列号，用于 TCP 重组数据。
*   **win**: 窗口大小，反映接收缓冲区的空闲空间（拥塞控制）。

---

#### 3. 运维日常实战命令 (Cookbook)

##### 场景一：基础连通性与应用层数据 (HTTP/SQL)
**目标**：查看本机与数据库的交互内容，或者 HTTP 报错信息。
```bash
# -A: 以文本显示内容 (方便看 SQL 或 HTTP 报文)
# -s 0: 防止截断，抓取完整包
# port 3306: 只看 MySQL 端口
tcpdump -i eth0 -nn -A -s 0 port 3306

# 组合过滤：抓取源 IP 为 192.168.1.5 发给本机 80 端口的 GET 请求
tcpdump -i eth0 -nn -A -s 0 'src 192.168.1.5 and dst port 80' | grep "GET"
```

##### 场景二：生产环境抓包并轮转 (防磁盘打爆)
**目标**：线上故障偶发，需要长时间抓包，但不能把磁盘写满。
**难点**：如何自动轮转文件？
```bash
# -C 100: 每个文件上限 100MB
# -W 10: 最多保留 10 个文件 (循环覆盖)
# -w /tmp/capture.pcap: 文件名会自动变成 capture.pcap0, capture.pcap1 ...
tcpdump -i eth0 -nn -s 0 -C 100 -W 10 -w /tmp/capture.pcap port 80
```

##### 场景三：排查 TCP 连接问题 (三次握手/四次挥手)
**目标**：客户端报 "Connection timed out" 或 "Connection refused"。
```bash
# 只看 TCP 协议，且只看 TCP 标志位（排除数据传输包）
tcpdump -i eth0 -nn tcp port 80

# 进阶技巧：只抓 SYN 包 (新建连接请求)
# 场景：怀疑服务器被 SYN Flood 攻击，或者想看谁在尝试连接
tcpdump -i eth0 -nn 'tcp[13] & 2 != 0' and port 80
```

##### 场景四：排除 SSH 自身流量 (防死循环)
**目标**：远程 SSH 连在服务器上抓包，如果不排除 22 端口，屏幕会疯狂刷新自己的 SSH 数据包。
```bash
# 逻辑非操作：not port 22
tcpdump -i eth0 -nn not port 22
```

---

#### 4. 知识难点解析：TCP 报头位操作

在高级脚本中，你可能会看到 `tcp[13] & 2 != 0` 这种写法。这是 **BPF (Berkeley Packet Filter)** 语法，用于精确提取 TCP 头部标志位。

*   **原理**：TCP 头部的第 13 个字节（从 0 开始计数）包含了控制标志位。
*   **二进制结构**：
    `| CWR | ECE | URG | ACK | PSH | RST | SYN | FIN |`
    对应值：`128 | 64  | 32  | 16  | 8   | 4   | 2   | 1`

**举例说明：**

| 过滤需求 | 对应的 BPF 语法 | 解释 |
| :--- | :--- | :--- |
| **只抓 SYN 包** | `tcp[13] & 2 != 0` | 提取第13字节，按位与 2 (00000010)，结果不为0说明 SYN 位是 1。 |
| **只抓 RST 包** | `tcp[13] & 4 != 0` | RST 对应的十进制值是 4。常用于排查“连接被拒绝”。 |
| **抓 SYN-ACK 包** | `tcp[13] = 18` | SYN(2) + ACK(16) = 18。这是服务端回应客户端握手的包。 |
| **抓 FIN 包** | `tcp[13] & 1 != 0` | 抓取断开连接的包。 |

---

#### ⚠️ 运维避坑指南

1.  **Wireshark 是分析神器**：
    *   不要试图在 Linux 终端用肉眼分析复杂的 TCP 交互。
    *   **正确姿势**：线上用 `tcpdump -w xxx.pcap` 抓包 -> `scp` 下载到本地 -> 用 Wireshark 打开分析（支持右键 "Follow TCP Stream" 还原完整对话，非常清晰）。

2.  **性能影响**：
    *   Tcpdump 会通过内核中断拷贝数据包，高并发（如网卡流量跑满）时开启 tcpdump 可能会导致 **丢包** 或 **CPU 飙升**。
    *   高负载下尽量使用 `-w` 写文件（写文件比打印屏幕快），并配合 `-c` 限制数量。

3.  **抓不到包？**
    *   检查防火墙 `iptables`/`firewalld`。Tcpdump 抓取的是 **网卡上的流量**，通常在 iptables 规则之前（进站）或之后（出站）。
    *   检查是否抓错了网卡（`ifconfig` 确认流量在 eth0 还是 eth1，或者直接用 `-i any`）。

4.  **抓到的全是 0.0.0.0 ?**
    *   旧版本 tcpdump 在 `-i any` 模式下，可能无法正确解析某些特定网卡的 IP 头，导致显示 0.0.0.0。尽量指定具体网卡 `-i eth0`。



---
---






## 六、 lsof 命令速查表 (列出打开的文件)

**核心心法**：在 Linux 中，**一切皆文件**。
*   普通文件、目录是文件。
*   **网络连接 (TCP/UDP)** 是文件。
*   **库文件 (.so)** 是文件。
所以，`lsof` (List Open Files) 是查看进程占用资源的“透视眼”。

#### 1. 常用参数 (运维必背)

| 选项 | 全称/记忆法 | 详细说明 | 运维场景 |
| :--- | :--- | :--- | :--- |
| **`-p`** | **p**id | 指定进程 ID。`lsof -p 1234` | 查看某进程到底加载了哪些配置文件或库。 |
| **`-i`** | **i**nternet | 查看网络连接。可接 `:端口` 或 `@IP`。 | `lsof -i :80` 查端口占用；`lsof -i tcp` 查所有 TCP。 |
| **`+D`** | **D**irectory | 递归搜索目录下被打开的文件。 | `lsof +D /var/log` 查谁在写日志。 |
| **`-u`** | **u**ser | 指定用户。`lsof -u nginx` | 查看某用户启动的所有进程及文件。 |
| **`-n`** | **n**o host | **不将 IP 解析为主机名**。**必加**，否则 DNS 慢时会卡死。 | 任何时候都推荐加，提速明显。 |
| **`-P`** | no **P**ort name | **不将端口号解析为服务名**（如 80 不显示为 http）。 | 习惯看数字端口的运维必加。 |
| **`grep deleted`**| (配合管道) | 查找**“已删除但未释放”**的文件句柄。 | **磁盘空间满了，但找不到大文件**时的终极排查手段。 |

#### 2. 读懂 lsof 输出 (知识难点)

执行 `lsof -p 1234` 后，输出的列不仅多而且难懂，尤其是 `FD` 和 `TYPE`：

```text
COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF     NODE NAME
nginx   1345 root  cwd    DIR  253,1     4096        2 /
nginx   1345 root  txt    REG  253,1  1234567   888888 /usr/sbin/nginx
nginx   1345 root    2w   REG  253,1     4096   999999 /var/log/nginx/error.log
nginx   1345 root    4u  IPv4  23456      0t0      TCP *:80 (LISTEN)
```

*   **`FD` (File Descriptor 文件描述符)**：
    *   **`cwd`**: Current Working Directory (当前工作目录)。
    *   **`txt`**: Text (程序代码段，即二进制程序本身)。
    *   **`mem`**: Memory-mapped file (加载到内存的库文件 .so)。
    *   **`1u`, `2w`, `3r`**: 数字表示文件描述符编号。
        *   `u`: Read and Write (读写)。
        *   `r`: Read (只读)。
        *   `w`: Write (只写)。
        *   *例如 `2w` 通常代表标准错误输出 (stderr) 被重定向到了日志文件。*

#### 3. 运维实战场景

*   **场景 1：端口冲突 (Address already in use)**
    > 启动 Nginx 报错 "Port 80 is used"，必须找出谁占了坑。
    ```bash
    # -n: 不解析主机名 (快)
    # -P: 直接显示端口号
    lsof -n -P -i :80
    # 结果：COMMAND PID ... -> 杀掉对应的 PID 即可
    ```

*   **场景 2：磁盘满了，找不到大文件 (幽灵文件)**
    > `df -h` 报警 100%，但 `du -sh /` 只有 50%。通常是日志文件被 `rm` 了，但进程（如 Java/Nginx）还抓着句柄没释放。
    ```bash
    # 查找标记为 (deleted) 的文件
    lsof | grep deleted
    
    # 输出示例：
    # java 1234 root 1w REG ... /var/log/app.log (deleted)
    
    # 解决：重启该进程 (kill -HUP 1234 或 systemctl restart xxx)
    ```

*   **场景 3：卸载磁盘失败 (Target is busy)**
    > 执行 `umount /mnt/data` 失败，因为有进程正在使用该目录下的文件。
    ```bash
    # 找出在这个目录下打开文件的所有进程
    lsof +D /mnt/data
    # 确认无误后 kill 掉相关进程再卸载
    ```

---
---






## 七、 strace 命令速查表 (系统调用追踪)

**核心心法**：`strace` 是**进程的听诊器**。它位于进程和 Linux 内核之间，记录进程发出的每一个系统调用 (System Call)。
*   进程说：“我要读文件” -> `open()`, `read()`
*   进程说：“我要连网” -> `socket()`, `connect()`
*   进程说：“我要内存” -> `brk()`, `mmap()`

**警告**：`strace` 会严重拖慢进程执行速度（可能慢 10 倍以上），**生产环境慎用**，查完问题立刻断开。

#### 1. 基础语法与常用选项

```bash
strace [选项] [命令 或 -p PID]
```

| 选项 | 全称/记忆法 | 详细说明 | 运维场景 |
| :--- | :--- | :--- | :--- |
| **`-p`** | **p**id | 追踪正在运行的进程。 | 服务卡死、死循环时挂上去看。 |
| **`-f`** | **f**ork | **追踪子进程/线程**。**必加**！ | 现在的服务（Nginx/MySQL/Java）都是多线程，不加 `-f` 只能看到主进程发呆。 |
| **`-tt`** | **t**ime | 显示微秒级时间戳。 | 只有这样才能看出哪一步耗时最久。 |
| **`-T`** | **T**ime spent | 显示每个系统调用的耗时。 | 精确排查“慢在哪里”。 |
| **`-o`** | **o**utput | 将结果输出到文件。 | `strace` 输出量极大，建议 `-o strace.log` 存下来分析。 |
| **`-s`** | **s**tring size | 指定字符串显示长度（默认 32）。**建议设为 1024**。 | 默认长度太短，看不到 SQL 语句或 HTTP 请求的完整内容。 |
| **`-e`** | **e**xpression | 过滤特定类型的系统调用。 | `strace -e trace=open,read` 只看文件操作，减少噪音。 |
| **`-c`** | **c**ount | **统计模式**。不打印细节，只在结束时显示统计报表。 | 快速分析 CPU 100% 是被哪个系统调用占用的。 |

#### 2. 怎么看 Strace 的输出？(关键字字典)

你不需要懂 C 语言，只需关注以下关键字：

| 关键字 | 含义 | 常见报错/现象 |
| :--- | :--- | :--- |
| **`open`** | 打开文件 | `open("xxx") = -1 ENOENT` (文件不存在) -> 配置路径错了？ |
| **`connect`** | 建立网络连接 | `connect` 卡住不动 -> 网络不通/被防火墙拦截。 |
| **`read` / `write`** | 读写数据 | 如果一直在 read 且没返回 -> 在等对方发数据 (IO 阻塞)。 |
| **`futex`** | 线程锁 | 频繁刷屏 `futex` -> **死锁**或线程竞争激烈 (导致 CPU 高)。 |
| **`stat`** | 获取文件状态 | 程序疯狂 `stat` 某个文件 -> 可能在轮询检测文件变化。 |

#### 3. 运维实战场景

*   **场景 1：进程起不来，日志也没报错**
    > 启动 Nginx 瞬间退出，没有任何 logs。
    ```bash
    # 直接用 strace 启动程序
    strace -tt -f ./nginx
    
    # 观察最后几行：
    # open("/etc/nginx/nginx.conf", O_RDONLY) = -1 EACCES (Permission denied)
    # 破案：权限不足，读不到配置文件。
    ```

*   **场景 2：进程 CPU 100%，想知道它在瞎忙什么**
    > `top` 发现 PID 8888 满载，日志正常。
    ```bash
    # -c 统计模式，运行 5 秒后 Ctrl+C
    strace -p 8888 -c
    
    # 输出结果按 % time 排序：
    # % time     seconds  usecs/call     calls    errors syscall
    # ------ ----------- ----------- --------- --------- ----------------
    #  99.00    0.005000           5     10000           futex
    # 破案：99% 时间花在 futex 锁上，这是代码逻辑死锁，甩锅给开发。
    ```

*   **场景 3：应用连接数据库卡住 (Hang)**
    > Python 脚本一直不动，不知道卡在哪一步。
    ```bash
    # -T 显示耗时，-e 只看网络相关
    strace -p 1234 -tt -T -e trace=network
    
    # 输出：
    # 10:00:01 connect(3, {sa_family=AF_INET, sin_port=htons(3306), sin_addr=inet_addr("192.168.1.5")}, 16) ...
    # (一直没返回，或者 60秒后返回 ETIMEDOUT)
    # 破案：连接 192.168.1.5:3306 网络不通。
    ```

---

#### ⚠️ 运维避坑与经验 (LSOF & STRACE 篇)

1.  **关于 `lsof` 卡顿**：
    *   现象：输入 `lsof` 后光标闪烁半天不出结果。
    *   原因：它在尝试把内网 IP 反向解析成域名（DNS 慢）。
    *   **解法**：养成好习惯，永远加 **`-n`** (no dns) 和 **`-P`** (no port name)。

2.  **关于 `strace` 的权限**：
    *   `strace` 实际上是利用内核的 `ptrace` 机制。普通用户无法追踪不属于自己的进程。
    *   **解法**：使用 `sudo` 或切换到 `root`。

3.  **终极调试逻辑链**：
    *   程序**报错** -> 查应用日志 (`tail`, `grep`)。
    *   程序**卡死/慢** -> 查网络 (`tcpdump`)。
    *   查不到原因 -> 查资源占用 (`lsof` - 文件/网络)。
    *   还是不知道 -> **祭出核武器** (`strace` - 看内核调用)。


---
---







### 八、 iptables 命令速查表 (防火墙与包过滤)

**请怀着敬畏之心阅读本章。**
`iptables` 直接操作 Linux 内核的网络栈，一条错误的规则可能导致服务器失联（把自己关在门外），或者业务全断。

**核心心法 (四表五链)：**
*   **最常用表**：**`filter`** (默认表，用于防火墙)、**`nat`** (用于端口转发/共享上网)。
*   **最常用链**：
    *   **`INPUT`**：**入站**（别人访问我）。防火墙主要配这里。
    *   **`OUTPUT`**：**出站**（我访问别人）。通常默认允许 `ACCEPT`。
    *   **`PREROUTING`**：**路由前**（数据包刚到网卡）。用于 **DNAT** (目标地址转换/端口转发)。
    *   **`POSTROUTING`**：**路由后**（数据包要离网卡）。用于 **SNAT** (源地址转换/共享上网)。

#### 1. 常用选项速查表

| 选项 | 全称/含义 | 详细说明 | 运维场景 |
| :--- | :--- | :--- | :--- |
| **`-t`** | **t**able | 指定表名。默认是 `filter`。如 `-t nat`。 | 配置端口转发时必须指定 `-t nat`。 |
| **`-L`** | **L**ist | 列出规则。通常配合 `-n` (不解析域名) 使用。 | 查看当前防火墙状态 `iptables -L -n`。 |
| **`--line`**| **line**-numbers | 显示行号。**删除规则时必用**。 | `iptables -L -n --line` 查出行号再删。 |
| **`-F`** | **F**lush | **清空**指定链的所有规则。 | **⚠ 高危**：若默认策略是 DROP，执行即失联。 |
| **`-A`** | **A**ppend | **追加**规则到链的**末尾**。 | 优先级最低。用于添加常规允许规则。 |
| **`-I`** | **I**nsert | **插入**规则到链的**指定位置** (默认第一行)。 | **优先级最高**。用于插队封禁 IP。 |
| **`-D`** | **D**elete | 删除规则。推荐按行号删：`iptables -D INPUT 3`。 | 移除错误的规则。 |
| **`-s`** | **s**ource | 指定**源 IP**。支持网段 `192.168.1.0/24`。 | 限制谁能访问我 (白名单/黑名单)。 |
| **`-d`** | **d**estination | 指定**目标 IP**。 | NAT 转发时指定流量发往哪里。 |
| **`-p`** | **p**rotocol | 指定协议 (`tcp`/`udp`/`icmp`/`all`)。 | `ping` 走的是 icmp；Web 走的是 tcp。 |
| **`--dport`**| **d**est **port** | 指定**目标端口**。需配合 `-p tcp` 或 `-p udp`。 | 开放 80 端口：`-p tcp --dport 80`。 |
| **`-j`** | **j**ump | 指定动作：`ACCEPT` (放行), `DROP` (丢弃), `REJECT` (拒绝)。 | 决定匹配后的数据包命运。 |

---

#### 2. 运维日常实战 (Cookbook)

##### 场景一：安全初始化 (防锁死必做)
在配置 DROP 策略前，必须先允许**SSH**和**已建立的连接**。
```bash
# 1. 允许本机回环 (Localhost)，否则本地服务报错
iptables -A INPUT -i lo -j ACCEPT

# 2. 允许已建立的连接 (这一步是防锁死的核心！)
# 解释：只要连接建立成功了，后续的数据包直接放行，不用再走规则匹配。
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 3. 开放 SSH 端口
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
```

##### 场景二：封禁恶意 IP (黑名单)
发现 `192.168.1.100` 在攻击，需要立即切断。
*   **注意**：必须用 `-I` (Insert) 插到第一行。如果用 `-A` 放在最后，而前面有一条 `ACCEPT all`，那封禁就无效了。
```bash
# -I INPUT 1: 插入到 INPUT 链的第 1 行
iptables -I INPUT 1 -s 192.168.1.100 -j DROP
```

##### 场景三：开放业务端口
开放 Web (80) 和 HTTPS (443)。
```bash
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

##### 场景四：最后兜底 (默认策略设为 DROP)
**⚠ 警告**：只有在场景一配置无误后，才能执行这一步！
```bash
iptables -P INPUT DROP
# 此时，除了上面允许的包，其他所有流量都会被丢弃。
```

---

#### 3. 知识难点解析：NAT 端口转发

如果你需要把 Linux 当路由器用，或者理解 Docker 的网络原理，必须掌握 NAT。

**原理**：
1.  **DNAT (Destination NAT)**: 修改**目标地址**。数据包进来前 (`PREROUTING`) 修改，用于**把外网请求转发给内网服务器**。
2.  **SNAT (Source NAT)**: 修改**源地址**。数据包出去后 (`POSTROUTING`) 修改，用于**内网机器共享一个公网 IP 上网** (即路由器功能)。

**案例：将本机 8080 端口转发到 10.0.0.5:80**

```bash
# 0. 开启内核转发功能 (必须！)
echo 1 > /proc/sys/net/ipv4/ip_forward

# 1. 配置 DNAT (进来的流量：访问 本机:8080 -> 转给 10.0.0.5:80)
# -t nat: 操作 nat 表
# PREROUTING: 路由前处理
iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination 10.0.0.5:80

# 2. 配置 SNAT (回包或伪装：确保 10.0.0.5 知道是本机转发给它的)
# MASQUERADE: 动态伪装 (如果本机 IP 是动态的用这个，静态 IP 用 -j SNAT --to-source 本机IP)
iptables -t nat -A POSTROUTING -j MASQUERADE
```

---

#### ⚠️ 运维避坑与经验 (IPTABLES 篇)

1.  **“定时炸弹”防锁死法**：
    *   在远程调试防火墙（特别是改默认策略）时，**一定不要直接执行**。
    *   **技巧**：先设一个 5 分钟后的重启计划。如果你配错了连不上了，5 分钟后服务器重启，规则恢复（前提是你没保存规则到开机启动）。
    *   命令：`shutdown -r +5 "Iptables testing, reboot in 5 mins if not cancelled"`
    *   如果你配置成功，依然能连上，就执行 `shutdown -c` 取消重启，然后保存规则。

2.  **规则保存问题**：
    *   `iptables` 命令敲完是**即时生效**的，但**重启失效**。
    *   **CentOS 7+**: `iptables-save > /etc/sysconfig/iptables` (需安装 `iptables-services`)。
    *   **Docker 环境**: Docker 启动时会接管 iptables。**千万不要**在 Docker 宿主机上随意执行 `iptables -F`，这会清空 Docker 的 NAT 规则，导致容器断网。

3.  **DROP vs REJECT**：
    *   **DROP** (丢弃)：对方发包过来，像掉进黑洞，没有回音。对方客户端会一直等到超时。**（推荐，更隐蔽，消耗对方资源）**
    *   **REJECT** (拒绝)：对方发包过来，你会回一个 "Connection refused"。对方立即知道端口没开。**（调试时用）**

4.  **Firewalld 与 Iptables 的关系**：
    *   `firewalld` (CentOS 7/8 默认) 只是 iptables 的一个前端管理工具。
    *   **二选一**：建议在生产环境如果不熟悉 firewalld 的复杂 zone 概念，直接 `systemctl stop firewalld` 并 `yum install iptables-services`，回归经典的 iptables 纯手写模式。
