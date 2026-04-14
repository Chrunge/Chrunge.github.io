
---

## Shell 脚本编程速查手册

#### 1. 脚本的基础骨架 (起手式)

每个脚本都应该包含这三部分：**解释器声明**、**注释**、**安全选项**。

```bash
#!/bin/bash
# -------------------------------------------------------------------
# 脚本名称: deploy_app.sh
# 功能描述: 自动部署 Java 应用，包含备份、停止、启动、检测
# 编写时间: 2023-10-27
# 作者: Ops_Team
# -------------------------------------------------------------------

# [安全基石] 遇到错误立刻退出，遇到未定义变量报错
set -e
set -u
```
*   **`#!/bin/bash`**：**Shebang**。告诉系统用 bash 来执行，必须写在第一行。
*   **`set -e`**：**极重要**。如果哪一行命令报错（返回非0），脚本立刻停止。防止“前面删库失败，后面还在执行重启”，导致灾难。
*   **`set -u`**：如果你用了没定义的变量（比如 `rm -rf /$DIR` 但 DIR 没赋值），脚本报错停止。防止删根目录。

#### 2. 变量与引用 (存数据)

| 类型 | 语法 | 示例 | 注意事项 |
| :--- | :--- | :--- | :--- |
| **定义变量** | `变量名=值` | `APP_NAME="nginx"` | **等号两边不能有空格！** |
| **引用变量** | `${变量名}` | `echo "Start ${APP_NAME}"` | 建议都加花括号 `{}`，防止拼接错误。 |
| **命令替换**| `$(命令)` | `TODAY=$(date +%F)` | 把 date 命令的结果存给 TODAY。 |
| **特殊变量** | `$0` | 脚本文件名 | |
| | `$1`, `$2`... | **第1、2个参数** | 执行 `./script.sh start`，则 `$1` 是 "start"。 |
| | `$?` | **上个命令的状态码** | `0` 表示成功，非 `0` 表示失败。(判断成败核心) |
| | `$#` | 参数个数 | 用于判断用户有没有传参。 |


##### 1. 逻辑运算符 (Logical Operators)

这是脚本做出复杂决策的核心。Shell 中有两套逻辑体系：一种用于**命令执行控制**，一种用于**条件判断内部**。

| 运算符 | 说明 | 语法示例 | 解释 |
| :--- | :--- | :--- | :--- |
| **`&&`** | **逻辑与 (AND)** | `cmd1 && cmd2` | 仅当 cmd1 执行**成功**时，才执行 cmd2 |
| **`\|\|`** | **逻辑或 (OR)** | `cmd1 \|\| cmd2` | 仅当 cmd1 执行**失败**时，才执行 cmd2 |
| **`!`** | **逻辑非 (NOT)** | `! -f file` | 取反。例如文件不存在时为真 |
| **`-a`** | **条件与** (用于`[]`内) | `[ $a -gt 10 -a $b -lt 20 ]` | a 大于 10 **且** b 小于 20 |
| **`-o`** | **条件或** (用于`[]`内) | `[ $a -eq 10 -o $b -eq 10 ]` | a 等于 10 **或** b 等于 10 |

---

##### 2. 数值比较运算符 (Integer Comparison)

注意：这些运算符**仅适用于整数**。

| 运算符 | 说明 | 记忆口诀 | 举例 (`a=10, b=20`) |
| :--- | :--- | :--- | :--- |
| **`-eq`** | 等于 (EQual) | **eq**ual | `[ $a -eq $b ]` 返回 false |
| **`-ne`** | 不等于 (Not Equal) | **n**ot **e**qual | `[ $a -ne $b ]` 返回 true |
| **`-gt`** | 大于 (Greater Than) | **g**reater **t**han | `[ $a -gt $b ]` 返回 false |
| **`-lt`** | 小于 (Less Than) | **l**ess **t**han | `[ $a -lt $b ]` 返回 true |
| **`-ge`** | 大于等于 (Greater or Equal) | **g**reater **e**qual | `[ $a -ge $b ]` 返回 false |
| **`-le`** | 小于等于 (Less or Equal) | **l**ess **e**qual | `[ $a -le $b ]` 返回 true |

---

##### 3. 字符串运算符 (String Operators)

注意：字符串比较推荐使用双引号包裹变量，防止为空时报错。

| 运算符 | 说明 | 举例 (`str="hello"`) |
| :--- | :--- | :--- |
| **`=`** 或 **`==`** | 两个字符串相等 | `[ "$str" == "world" ]` |
| **`!=`** | 两个字符串不相等 | `[ "$str" != "world" ]` |
| **`-z`** | 字符串长度为 0 (空) | `[ -z "$str" ]` (Zero) |
| **`-n`** | 字符串长度不为 0 (非空) | `[ -n "$str" ]` (Non-zero) |
| **`$`** | 检测字符串是否为空 | `[ "$str" ]` (如果str非空返回真) |

---

##### 4. 文件测试运算符 (File Test Operators)

运维中最常用的检测手段。

| 运算符 | 说明 | 举例 |
| :--- | :--- | :--- |
| **`-d`** | file 是否为**目录** (directory) | `[ -d "/etc/nginx" ]` |
| **`-f`** | file 是否为**普通文件** (file) | `[ -f "/var/log/syslog" ]` |
| **`-e`** | file 是否**存在** (exist) | `[ -e "/tmp/lock" ]` |
| **`-r`** | file 是否**可读** (read) | `[ -r "config.cfg" ]` |
| **`-w`** | file 是否**可写** (write) | `[ -w "log.txt" ]` |
| **`-x`** | file 是否**可执行** (execute) | `[ -x "script.sh" ]` |
| **`-s`** | file 是否存在且**大小不为0** | `[ -s "data.txt" ]` |

---

##### 5. 算术运算符 (Arithmetic)

Shell 默认所有变量都是字符串，进行数学运算需要特殊语法。

| 语法 | 说明 | 推荐度 | 举例 |
| :--- | :--- | :--- | :--- |
| **`$(( ... ))`** | 双小括号，支持 + - * / % | ⭐⭐⭐⭐⭐ (推荐) | `res=$(( 1 + 2 ))` |
| **`let`** | let 命令执行算术 | ⭐⭐⭐ | `let res=1+2` |
| **`expr`** | expr 命令 (注意空格和转义) | ⭐ (老旧) | `res=$(expr 1 + 2)` |

---

##### 6. 特殊变量 (Special Variables)

脚本与系统交互的“暗号”。

| 变量 | 说明 | 应用场景 |
| :--- | :--- | :--- |
| **`$0`** | 当前脚本的文件名 | 用于打印帮助信息或日志 |
| **`$n`** | 第 n 个参数 (`$1`, `$2`...) | 获取用户输入的参数 |
| **`$#`** | 传递给脚本的参数个数 | 检查用户是否输入了足够的参数 |
| **`$*`** | 所有的参数 (作为一个整体) | 循环处理所有参数 |
| **`$@`** | 所有的参数 (每个独立引用) | 循环处理所有参数 (推荐) |
| **`$?`** | **上个命令的退出状态** (0为成功) | 判断命令是否执行成功 (极重要) |
| **`$$`** | 当前脚本的进程 ID (PID) | 生成临时文件命名防止冲突 |


#### 3. 流程控制 (做判断)

**A. 条件判断 (if)**
*   **运维场景**：文件是否存在？服务是否活着？参数对不对？

```bash
# 判断文件是否存在 (-f 文件, -d 目录)
if [[ -f "/etc/nginx/nginx.conf" ]]; then
    echo "配置文件存在"
else
    echo "配置文件丢失！"
    exit 1
fi

# 判断上一步是否成功
systemctl restart nginx
if [[ $? -eq 0 ]]; then
    echo "Nginx 重启成功"
else
    echo "Nginx 重启失败，请检查日志"
fi

# 字符串比较 (==, !=, -z 为空)
if [[ "$1" == "start" ]]; then
    # 启动逻辑
    ...
fi
```
> **坑点**：`[` 和 `]` 里面**必须有空格**！ `[ "$1" == "start" ]` 是对的，`["$1"=="start"]` 报错。

**B. 循环 (for / while)**
*   **运维场景**：批量处理多个文件、多台机器，或者死循环监控。

```bash
# for 循环：遍历列表 (最常用)
IP_LIST="192.168.1.5 192.168.1.6 192.168.1.7"
for IP in ${IP_LIST}; do
    echo "正在检查 ${IP} ..."
    ping -c 1 ${IP} &> /dev/null
    if [ $? -eq 0 ]; then
        echo "${IP} 在线"
    else
        echo "${IP} 离线"
    fi
done

# while 循环：死循环监控
while true; do
    # 比如每5秒查一次 CPU
    load=$(uptime | awk '{print $10}' | sed 's/,//')
    echo "当前负载: $load"
    sleep 5
done
```

#### 4. 字符串与数字运算

```bash
# 数字比较 (-eq等于, -gt大于, -lt小于, -ne不等于)
COUNT=$(ps -ef | grep nginx | wc -l)
if [ ${COUNT} -gt 0 ]; then
    echo "Nginx 正在运行"
fi

# 简单的算术运算 $(( ))
A=10
B=20
SUM=$((A + B))
```

---



---

### 十、 运维黄金脚本实战模板

#### 实战 1：通用的服务启动/停止脚本
这个脚本结构非常经典，稍作修改就能管理 Java Jar 包、Python 脚本等。

```bash
#!/bin/bash
# 用法: ./app.sh {start|stop|restart|status}

APP_NAME="myapp.jar"
PID_FILE="app.pid"

# 1. 启动函数
start() {
    # 检查是否已启动
    if [ -f "${PID_FILE}" ] && kill -0 $(cat "${PID_FILE}") 2>/dev/null; then
        echo "${APP_NAME} 已经在运行中."
        return
    fi
    
    echo "正在启动 ${APP_NAME}..."
    # nohup 后台启动，日志重定向
    nohup java -jar ${APP_NAME} > app.log 2>&1 &
    # 获取 PID 并存入文件
    echo $! > ${PID_FILE}
    echo "启动完成，PID: $!"
}

# 2. 停止函数
stop() {
    if [ ! -f "${PID_FILE}" ]; then
        echo "${APP_NAME} 未运行."
        return
    fi
    
    PID=$(cat "${PID_FILE}")
    echo "正在停止 PID: ${PID}..."
    kill ${PID}
    # 等待进程退出
    sleep 3
    # 如果还在，强制杀
    if kill -0 ${PID} 2>/dev/null; then
        kill -9 ${PID}
    fi
    rm -f "${PID_FILE}"
    echo "已停止."
}

# 3. 主逻辑 case
case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        stop
        sleep 2
        start
        ;;
    status)
        if [ -f "${PID_FILE}" ] && kill -0 $(cat "${PID_FILE}") 2>/dev/null; then
            echo "${APP_NAME} 运行中 (PID: $(cat ${PID_FILE}))"
        else
            echo "${APP_NAME} 未运行"
        fi
        ;;
    *)
        echo "用法: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac
```

#### 实战 2：日志自动归档备份脚本 (Crontab 用)
每天凌晨把昨天的日志压缩备份，并删除 7 天前的旧备份。

```bash
#!/bin/bash
# 建议放入 crontab: 0 1 * * * /scripts/backup_log.sh

LOG_DIR="/var/log/nginx"
BACKUP_DIR="/data/backup/nginx"
DATE=$(date -d "yesterday" +%Y%m%d) # 获取昨天的日期

# 1. 创建备份目录
mkdir -p ${BACKUP_DIR}

# 2. 压缩昨天的日志
# 假设 nginx 日志已轮转为 access.log-20231027 格式
# 如果没有轮转，这里通常配合 logrotate 使用，或者简单的 mv 操作
cd ${LOG_DIR}
if [ -f access.log ]; then
    mv access.log access_${DATE}.log
    # 发信号让 Nginx 生成新日志文件
    kill -USR1 $(cat /var/run/nginx.pid)
    
    tar -czf ${BACKUP_DIR}/nginx_logs_${DATE}.tar.gz access_${DATE}.log
    rm -f access_${DATE}.log
    echo "[${DATE}] 备份成功"
else
    echo "[${DATE}] 日志文件不存在"
fi

# 3. 清理 7 天前的备份
find ${BACKUP_DIR} -name "*.tar.gz" -mtime +7 -delete
echo "清理旧备份完成"
```

---

### ⚠️ 写脚本的避坑指南 (血泪经验)

1.  **路径问题**：
    *   在脚本里，**永远使用绝对路径**！
    *   不要写 `cd logs`，要写 `cd /opt/app/logs`。
    *   因为你把脚本放在 Crontab 里跑时，它的当前目录可能不是脚本所在目录，而是用户的家目录。

2.  **变量判空**：
    *   `rm -rf ${DIR}/*`
    *   如果变量 `$DIR` 是空的，命令就变成了 `rm -rf /*` (删根目录)。
    *   **防御式编程**：
        ```bash
        if [ -z "${DIR}" ]; then
            echo "变量为空，退出！"
            exit 1
        fi
        ```

3.  **调试脚本**：
    *   如果脚本执行结果不对，在头文件把 `#!/bin/bash` 改成 **`#!/bin/bash -x`**。
    *   这样执行时会打印出每一行实际执行的命令和变量的值，方便排错。

4.  **Windows 换行符坑**：
    *   如果在 Windows 上写脚本，传到 Linux 上运行报错 `/bin/bash^M: bad interpreter`。
    *   这是因为 Windows 的换行是 `\r\n`，Linux 是 `\n`。
    *   **解决**：`dos2unix script.sh`。

5. **建议使用[[ ]],而非[ ]进行判断**。
---
---


