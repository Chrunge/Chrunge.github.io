# 1. 数据结构

## 1. 字符串 (String)
**场景**：日志清洗、Shell 命令拼接、配置文件路径处理。

| 方法 | 描述 | 示例代码 | 运维场景 |
| :--- | :--- | :--- | :--- |
| **`strip()`** | 去除首尾空白符(\n, \t, 空格) | `line.strip()` | 处理读取文件时的换行符 |
| **`split(sep)`** | 按分隔符切割，**返回列表** | `ip_str.split(".")` | 解析 IP 地址、CSV 数据 |
| **`join(iter)`** | 将列表拼接成字符串 | `",".join(ip_list)` | 拼接命令参数、生成 CSV 行 |
| **`replace(old, new)`** | 替换字符串内容 | `path.replace("\\", "/")` | 统一 Windows/Linux 路径格式 |
| **`startswith(prefix)`** | 判断是否以某字符开头 | `line.startswith("Error")` | 快速筛选报错日志行 |
| **`endswith(suffix)`** | 判断是否以某字符结尾 | `file.endswith(".log")` | 筛选特定类型的文件 |
| **`find(sub)`** | 查找子串位置(找不到返回-1) | `idx = log.find("404")` | 简单判断是否存在关键字 |
| **`upper()` / `lower()`** | 转大写 / 转小写 | `cmd.upper()` | 忽略大小写比较配置项 |
| **`format()` / `f"{}"`** | 字符串格式化 | `f"IP:{ip}, Port:{port}"` | 生成报警信息、构造 SQL 语句 |
| **`encode()`** | 字符串转字节 (str -> bytes) | `"ls -l".encode('utf-8')` | 网络传输、`subprocess` 输入流需字节格式。 |
| **`decode()`** | 字节转字符串 (bytes -> str) | `stdout_bytes.decode('utf-8')` | **必用**。将 SSH/Shell 命令返回的二进制结果转为可读文本。 |
| **`zfill(width)`**| 左侧填充 0 | `"5".zfill(3)` -> `"005"` | 生成对齐的序列号、日期目录名 (`01`, `02`...)。 |
| **`isdigit()`** | 判断是否全为数字 | `port.isdigit()` | 校验用户输入的端口号是否合法。 |


---

## 2. 列表 (List)
**场景**：存储服务器列表、批量处理任务队列、Ansible 主机组。

| 方法 | 描述 | 示例代码 | 运维场景 |
| :--- | :--- | :--- | :--- |
| **`append(x)`** | 在末尾添加一个元素 | `ips.append("1.1.1.1")` | 动态生成待检测主机列表 |
| **`extend(iterable)`** | 将另一个列表拼接到末尾 | `list_a.extend(list_b)` | 合并两个集群的服务器列表 |
| **`insert(i, x)`** | 在指定位置插入元素 | `lines.insert(0, "Title")` | 给日志文件内容加表头 |
| **`pop(i)`** | 删除并**返回**指定位置元素 | `last_job = jobs.pop()` | 模拟堆栈或任务队列消费 |
| **`remove(x)`** | 删除第一个值为 x 的元素 | `ips.remove("127.0.0.1")` | 剔除无效或错误的 IP |
| **`index(x)`** | 返回第一个值为 x 的索引 | `idx = ips.index("10.0.0.1")` | 查找某台服务器的位置 |
| **`count(x)`** | 统计元素出现的次数 | `err_cnt = logs.count("ERROR")`| 统计列表中报错发生的频率 |
| **`sort()`** | 原地排序 (默认升序) | `versions.sort()` | 对发布版本号进行排序 |
| **`reverse()`** | 原地反转列表 | `lines.reverse()` | 倒序读取日志 (看最新的) |

---

## 3. 字典 (Dictionary)
**场景**：解析 JSON、API 响应数据、K8s/Ansible 配置对象。

| 方法 | 描述 | 示例代码 | 运维场景 |
| :--- | :--- | :--- | :--- |
| **`get(key, default)`** | **安全获取值**，不存在返默认值 | `conf.get("port", 80)` | 读取配置，防止 Key 不存在报错 |
| **`keys()`** | 获取所有键 (Key) | `list(info.keys())` | 遍历检查配置项是否齐全 |
| **`values()`** | 获取所有值 (Value) | `list(info.values())` | 统计所有主机的状态 |
| **`items()`** | 获取所有键值对 | `for k,v in info.items():` | 遍历并打印服务器详情 |
| **`update(dict2)`** | 将 dict2 合并入当前字典 | `conf.update(new_conf)` | 用新配置覆盖旧配置 |
| **`pop(key)`** | 删除 Key 并返回 Value | `pwd = conf.pop("password")` | 从日志对象中移除敏感信息 |
| **`setdefault(key, val)`**| Key 不存在则设为 val | `d.setdefault("role", "node")`| 初始化默认配置 |

---

## 4. 集合 (Set)
**场景**：**去重**、对比两组服务器差异 (Diff)、权限计算。

| 方法 | 描述 | 示例代码 | 运维场景 |
| :--- | :--- | :--- | :--- |
| **`add(x)`** | 添加元素 (自动去重) | `visited_ips.add(ip)` | 记录已扫描过的 IP，防止复扫 |
| **`remove(x)`** | 删除元素 (不存在会报错) | `s.remove("1.1.1.1")` | 明确移除某项 |
| **`discard(x)`** | **安全删除** (不存在不报错) | `s.discard("1.1.1.1")` | 尝试移除，无论是否存在 |
| **`update(set2)`** | 并集更新 (批量添加) | `s.update(new_ips)` | 批量导入 IP 列表并去重 |
| **`difference(-)`** | **差集** (A 有 B 没有) | `s1 - s2` | 找出**未监控**的主机 (CMDB - 监控) |
| **`intersection(&)`** | **交集** (A 和 B 都有) | `s1 & s2` | 找出两个集群共用的节点 |
| **`union(|)`** | **并集** (A 和 B 的总和) | `s1 | s2` | 统计所有涉及到的服务器总和 |

---

## 5. 类型转换与通用操作
**场景**：数据清洗过程中不同类型之间的切换。

| 函数/方法 | 描述 | 示例 | 运维场景 |
| :--- | :--- | :--- | :--- |
| **`len(obj)`** | 获取长度/个数 | `len(ip_list)` | 统计服务器总数 |
| **`in`** | 成员运算符 | `"Error" in line` | 检查日志是否包含关键字 |
| **`list(obj)`** | 转换为列表 | `list(set_ips)` | 集合去重后转回列表以便排序 |
| **`set(obj)`** | 转换为集合 | `set(ip_list)` | 列表快速去重 |
| **`str(obj)`** | 转换为字符串 | `str(port_num)` | 将数字端口转为字符以便拼接 |
| **`int(obj)`** | 转换为整数 | `int("8080")` | 解析环境变量中的端口号 |



# 2. 文件读写操作 (File I/O)
**核心原则**：**永远使用 `with open(...)`**，它会自动关闭文件，防止文件句柄泄露导致系统崩溃。

**常用模式 (Mode)**：
*   `'r'`：只读 (Read，默认)
*   `'w'`：只写 (Write，会清空原有内容！)
*   `'a'`：追加 (Append，写在文件末尾，不覆盖)

| 方法 | 描述 | 示例代码 | 运维实战场景 |
| :--- | :--- | :--- | :--- |
| **`open()`** | 打开文件 (配合 `with`) | `with open("app.log", "r") as f:` | 安全打开日志或配置文件。 |
| **`read()`** | 读取全部内容 (慎用) | `content = f.read()` | 读取小配置文件 (如 `/etc/hostname`)。 |
| **`readlines()`**| 读取所有行转为列表 | `lines = f.readlines()` | 将配置文件按行读入内存进行解析。 |
| **`readline()`** | 每次只读一行 | `line = f.readline()` | **大文件处理**。配合 while 循环逐行分析 GB 级日志，不撑爆内存。 |
| **`write(str)`** | 写入字符串 | `f.write(f"{time} Error\n")` | 记录脚本运行日志、生成配置文件。 |
| **`seek(0)`** | 指针回到文件开头 | `f.seek(0)` | 读完文件后想再重读一遍时使用。 |

**实战示例 (逐行处理大日志)**：
```python
# 这种写法最省内存，适合读取几个 G 的日志
with open("/var/log/nginx/access.log", "r", encoding="utf-8") as f:
    for line in f:
        if "502 Bad Gateway" in line:
            print("Found Error:", line.strip())
```

---

# 3. 异常处理 (Exception Handling)
**场景**：脚本不仅要能跑，还要“挂得明白”。防止因网络抖动、文件不存在导致脚本直接崩溃退出。

| 关键字/异常类型 | 描述 | 示例代码 | 运维实战场景 |
| :--- | :--- | :--- | :--- |
| **`try` ... `except`** | 捕获异常 | `try: requests.get(url) except: pass` | 尝试连接 API，失败则捕获错误而不是崩溃。 |
| **`Exception`** | 捕获所有常规错误 | `except Exception as e: print(e)` | 当你不确定会发生什么错误时，兜底捕获并打印报错信息。 |
| **`FileNotFoundError`**| 文件找不到错误 | `except FileNotFoundError:` | 打开配置文件前，处理文件缺失的情况 (如创建默认配置)。 |
| **`KeyboardInterrupt`**| 用户按 Ctrl+C | `except KeyboardInterrupt:` | 捕获用户强制终止信号，做清理工作 (如关闭数据库连接)。 |
| **`else`** | 无异常时执行 | `try: ... else: print("Success")` | 只有当命令执行成功时，才发送“部署成功”通知。 |
| **`finally`** | **无论是否报错必执行** | `finally: f.close()` | 清理资源。如关闭 SSH 连接、删除临时文件。 |

**实战示例 (健壮的文件读取)**：
```python
import sys

filename = "config.ini"
try:
    with open(filename, "r") as f:
        conf = f.read()
except FileNotFoundError:
    print(f"报错: 找不到文件 {filename}，请检查路径。")
    sys.exit(1) # 错误退出
except PermissionError:
    print(f"报错: 没有权限读取 {filename}，请使用 sudo。")
    sys.exit(1)
except Exception as e:
    print(f"发生未知错误: {e}")
```

---

# 4. 循环与推导式 (效率神器)
**场景**：让你的代码比 Shell 更简洁、更易读。

| 方法/技巧 | 描述 | 示例代码 | 运维实战场景 |
| :--- | :--- | :--- | :--- |
| **`enumerate(list)`**| 同时获取**索引**和**值** | `for idx, ip in enumerate(ips):` | 打印带行号的日志；显示进度 (处理第 N/Total 台机器)。 |
| **`zip(list1, list2)`**| 并行遍历两个列表 | `for ip, host in zip(ips, hosts):` | 同时遍历 IP 列表和主机名列表，生成 `/etc/hosts` 内容。 |
| **列表推导式** | **一行代码**生成列表 | `[ip for ip in ips if "192" in ip]` | **筛选**。从一堆 IP 中快速过滤出内网 IP。 |
| **字典推导式** | 一行代码生成字典 | `{ip: 80 for ip in ips}` | 快速生成默认配置字典。 |

**实战示例 (列表推导式 vs 普通循环)**：

*任务：将所有 IP 的最后一位改为 0 (转为网段)*

```python
ips = ["192.168.1.5", "10.0.0.3", "172.16.0.1"]

# 普通写法 (像 Shell)
new_ips = []
for ip in ips:
    segment = ip.rsplit(".", 1)[0] + ".0"
    new_ips.append(segment)

# Pythonic 写法 (列表推导式)
# [处理逻辑 for 变量 in 列表]
new_ips = [ ip.rsplit(".", 1)[0] + ".0" for ip in ips ]
```

---
---



# 5. 必学核心库（入门 6 大金刚）

这几个库是你写脚本每天都要用的，请**死记硬背**它们的这些基础用法。

| 库名 | 类型 | 简单说明 | 最常用的功能（只记这些） |
| :--- | :--- | :--- | :--- |
| **`subprocess`** | **最核心** | **执行命令** | **替代 Shell**。在 Python 里执行 `ls`, `grep`, `docker` 等命令。 |
| **`os`** | 基础 | 系统交互 | **路径处理** (`os.path.join`) 和 **获取环境变量** (`os.getenv`)。 |
| **`sys`** | 基础 | 脚本参数 | **获取参数** (`sys.argv`，类似 Shell 的 `$1`, `$2`) 和 **退出脚本** (`sys.exit`)。 |
| **`time`** | 基础 | 时间控制 | **暂停** (`time.sleep`)。写死循环监控脚本时防止 CPU 飙升。 |
| **`json`** | 数据 | 数据解析 | **处理 API 结果**。把 API 返回的文本变成 Python 字典 (`json.loads`)。 |
| **`requests`** | **第三方** | 网络请求 | **调接口**。访问网页、调阿里云 API、发钉钉/企业微信通知。 |

---

### 简单实战代码（复制运行一下）

**1. `subprocess` (执行命令)**
```python
import subprocess

# 运行命令，等待它结束
# shell=True 表示可以使用管道符 | 和通配符 *
subprocess.run("ls -l /var/log", shell=True) 
```

**2. `sys` (获取参数)**
```python
import sys

# 运行脚本：python deploy.py v1.0
print(sys.argv)      # 输出 ['deploy.py', 'v1.0']
version = sys.argv[1] # 获取 'v1.0' (对应 Shell 的 $1)
```

**3. `os` (路径拼接)**
```python
import os

# 自动处理 Windows(\) 和 Linux(/) 的路径分隔符差异
path = os.path.join("/var/log", "nginx", "access.log")
print(path) # 输出 /var/log/nginx/access.log
```

**4. `requests` (发请求 - 需先 `pip install requests`)**
```python
import requests

# 检查一个网站是不是活的
resp = requests.get("http://www.baidu.com")
print(resp.status_code) # 输出 200 表示正常
```

---

### 第二阶段：备查库名清单

这些库**现在不需要深入研究**，只需要知道“它们是干嘛的”。

| 场景 | 库名 | 用途简述 |
| :--- | :--- | :--- |
| **SSH 远程** | `paramiko` | 相当于 Python 版的 SSH 客户端，远程登录服务器。 |
| **监控系统** | `psutil` | 获取 CPU、内存、磁盘使用率（不用自己写命令去 grep 了）。 |
| **正则匹配** | `re` | 复杂的字符串查找（比如提取身份证号、邮箱）。 |
| **文件复制** | `shutil` | 复制文件夹、移动文件、打包压缩。 |
| **Excel/表格**| `pandas` | 处理复杂的 Excel 数据（数据分析神器）。 |
| **K8s/配置** | `PyYAML` | 读写 YAML 配置文件。 |
| **高级参数** | `argparse` | 让你的脚本支持 `--help`, `--port 80` 这种高级参数。 |



---
---


# 6. 六种语言比较

六种语言想象成**不同类型的“交通工具”**。虽然它们都能把你从 A 点（需求）送到 B 点（产品），但驾驶体验和适用路况完全不同。

### 一、 共同点（底层基石）
无论名称如何变化，它们在 CS61B 层面是相通的：
1.  **图灵完备**：任何一门语言能实现的逻辑，其他语言理论上都能实现。
2.  **核心数据结构**：都有数组（Array）、链表（Linked List）、映射（Map/Dict）、栈和队列。
3.  **基本控制流**：都有 `if/else`、`for/while` 循环、函数调用和作用域。
4.  **抽象能力**：都支持某种形式的代码复用（函数、模块、类或接口）。

---

### 二、 六种交通工具的特点（记忆口诀）

#### 1. C 语言：底层的“裸奔者”
*   **口诀：** **手操内存，极致简单。**
*   **核心：** 指针、`malloc/free`、没有类。
*   **地位：** 所有语言的爸爸，操作系统内核的首选。
*   **一句话：** 给程序员最高权力，但也让你承担爆内存的所有责任。

#### 2. C++：全能的“瑞士军刀”
*   **口诀：** **零成本抽象，复杂到极致。**
*   **核心：** 模板（泛型）、面向对象、手动/半手动内存管理。
*   **地位：** 游戏引擎、高性能计算、工业级软件的霸主。
*   **一句话：** 只要你足够强，它能跑出硬件的极限性能。

#### 3. Java：沉稳的“大巴车”
*   **口诀：** **万物皆对象，安全第一条。**
*   **核心：** 虚拟机（JVM）、垃圾回收（GC）、严格的类继承、接口。
*   **地位：** 银行、大型企业后端、Android 开发。
*   **一句话：** 牺牲一点性能和内存，换取极高的工程稳定性和协作效率。

#### 4. Python：灵活的“胶水”
*   **口诀：** **代码如人话，生态无敌强。**
*   **核心：** 动态类型、解释执行、缩进强制。
*   **地位：** AI 深度学习、数据分析、快速原型开发。
*   **一句话：** 程序员的时间比机器的时间更宝贵。

#### 5. Go：现代的“快递摩托”
*   **口诀：** **天生并发，大道至简。**
*   **核心：** 协程（Goroutine）、组合优于继承、隐式接口。
*   **地位：** 云计算（Docker/K8s）、高性能微服务、后端开发。
*   **一句话：** 抛弃复杂的继承体系，用最简单的代码处理最高的并发。

#### 6. Rust：高科技的“宇航服”
*   **口诀：** **不崩不漏，安全且极速。**
*   **核心：** 所有权（Ownership）、借用检查、没有 GC 却自动管内存。
*   **地位：** 系统级编程、浏览器内核、区块链、高性能安全组件。
*   **一句话：** 把所有错误挡在编译阶段，让性能和安全不再是鱼和熊掌。

---

### 三、 快速对比表（记忆卡片）

| 语言 | 内存管理 | 运行效率 | 开发效率 | 杀手锏特性 | 应用领域 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **C** | 手动 | 极快 | 低 | 指针/底层 | 操作系统、嵌入式 |
| **C++** | 手动/半手动 | 极快 | 中 | 零成本抽象/模板 | 游戏引擎、高频交易 |
| **Java** | 自动 (GC) | 快 | 中 | JVM/跨平台/稳定 | 大型后端、企业软件 |
| **Python** | 自动 (GC) | 慢 | 极高 | 语法简洁/AI生态 | AI、科学计算、脚本 |
| **Go** | 自动 (GC) | 快 | 高 | 轻量级协程/并发 | 云计算、后端服务 |
| **Rust** | 自动 (所有权) | 极快 | 中 | 内存安全/所有权 | 基础设施、底层重构 |

---

### 四、 如何根据“痛点”记忆？

*   如果你厌倦了 **C/C++** 总是崩溃报错内存泄露 $\rightarrow$ 选 **Rust**。
*   如果你厌倦了 **Java** 写个简单的并发要写几百行代码 $\rightarrow$ 选 **Go**。
*   如果你厌倦了 **Python** 在处理大规模数据时太慢 $\rightarrow$ 选 **C++ / Rust**。
*   如果你只是想快点验证一个算法或调个 AI 模型 $\rightarrow$ 选 **Python**。
*   如果你想去大厂做非常复杂的业务逻辑，需要团队协作 $\rightarrow$ 选 **Java**。