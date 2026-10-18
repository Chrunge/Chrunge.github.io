# 一、Kafka基础知识

### 1. 物理架构与集群组件

| 概念名称 | 英文名称 | 详细定义 | 运维关注点 (Ops Focus) |
| :--- | :--- | :--- | :--- |
| **代理** | **Broker** | Kafka 集群中的一台物理服务器或容器节点。每个 Broker 有一个唯一的整数 ID (`broker.id`)。 | 监控 Broker 的磁盘 IO、网络带宽和 CPU。如果 Broker 宕机，其上的 Leader 分区需要转移。 |
| **集群** | **Cluster** | 由多个 Broker 组成的集合，它们协同工作提供服务。 | 生产环境建议至少 3 个 Broker 以保证高可用（允许挂 1 台）。 |
| **控制器** | **Controller** | 集群中的“大脑”。它是从 Broker 中选举出来的一个节点，负责管理分区 Leader 选举、Topic 上下线等元数据变更。 | **关键**：Controller 必须保持稳定。如果 Controller 频繁切换（通过日志可见），通常意味着网络不稳定或 ZK 压力过大。 |
| **协调者** | **Zookeeper / KRaft** | 早期版本依赖 Zookeeper 存储元数据和选举；新版本（2.8+及3.x）逐步转向 KRaft 模式（去 ZK 化）。 | 如果使用 ZK，需独立监控 ZK 健康度。ZK 挂了，Kafka 集群将无法工作。 |

### 2. 数据模型与存储逻辑

| 概念名称 | 英文名称 | 详细定义 | 运维关注点 (Ops Focus) |
| :--- | :--- | :--- | :--- |
| **主题** | **Topic** | 消息的**逻辑分类**容器。生产者向 Topic 发送消息，消费者订阅 Topic。类似于数据库中的“表”。 | 运维需管理 Topic 的配置，如：数据保留时长 (`retention.ms`)、最大消息大小 (`max.message.bytes`)。 |
| **分区** | **Partition** | Topic 的**物理分片**。一个 Topic 可以分为多个 Partition，分布在不同的 Broker 上，实现水平扩展和并行处理。 | **性能关键**：分区数决定了最大并行度。分区过少导致吞吐上不去，分区过多可能导致打开文件句柄过多。 |
| **位移** | **Offset** | 一个 Partition 中每条消息的唯一标识符（递增整数）。它代表消息在分区中的位置。 | **数据一致性**：运维常需执行“重置 Offset”操作，帮助业务回溯消费历史数据或跳过毒药消息。 |
| **日志段** | **Log Segment** | Partition 在磁盘上对应的物理文件（`.log` 和 `.index`）。Kafka 会定期切分文件（滚动切分）。 | 关注磁盘清理策略。如果旧 Segment 没被删除，磁盘会爆满。 |

### 3. 高可用 (HA) 与 副本机制

这是 Kafka 运维中最核心的部分，直接关系到数据是否丢失。

| 概念名称 | 英文名称 | 详细定义 | 运维关注点 (Ops Focus) |
| :--- | :--- | :--- | :--- |
| **副本** | **Replica** | Partition 的备份。一个 Partition 通常配置多个副本（如 3 个），分为 1 个 Leader 和 N-1 个 Follower。 | 副本因子 (`replication-factor`) 建议设为 2 或 3。设为 1 则无容灾能力，单机挂即丢数据。 |
| **领导者** | **Leader** | 负责处理该 Partition 所有**读写请求**的副本。 | 监控 Leader 分布是否均匀。如果某台 Broker 上的 Leader 太多，该节点负载会过高。 |
| **追随者** | **Follower** | 不处理客户端请求，唯一的任务就是从 Leader 拉取数据保持同步。如果 Leader 挂了，Follower 可被选为新 Leader。 | 关注 Follower 是否追得上 Leader。追不上的副本会被踢出 ISR。 |
| **同步副本集合** | **ISR (In-Sync Replicas)** | **最核心指标**。当前与 Leader 保持同步的副本列表（包含 Leader 自己）。 | **必须监控**：`UnderReplicatedPartitions` 指标即基于此。如果 ISR 数量 < 配置副本数，说明集群处于“亚健康”状态。 |
| **高水位** | **HW (High Watermark)** | 消费者只能拉取到 HW 之前的消息。HW 由 ISR 中同步进度最慢的副本决定。 | 决定了数据的一致性可见性。 |

### 4. 客户端与消费模型

| 概念名称 | 英文名称 | 详细定义 | 运维关注点 (Ops Focus) |
| :--- | :--- | :--- | :--- |
| **生产者** | **Producer** | 发送消息的客户端应用。 | 排查问题时，需确认生产者配置的 `acks` 参数（0, 1, all）与数据可靠性的关系。 |
| **消费者** | **Consumer** | 读取消息的客户端应用。 | 消费者通常是业务应用，运维需关注其消费速度。 |
| **消费者组** | **Consumer Group** | 多个消费者组成的逻辑组。组内成员**均分** Topic 的分区。一个分区只能被同一个组内的一个消费者消费。 | **扩容依据**：如果 Topic 有 10 个分区，消费者组最多只能有 10 个消费者生效，多余的会空闲。 |
| **消费积压** | **Lag** | `Lag = HW (最新消息) - Current Offset (已消费消息)`。表示还有多少条消息没被处理。 | **必设告警**：Lag 持续增长意味着生产速度 > 消费速度，需扩容消费者或排查下游故障。 |

### 5. 总结图示关系

为了方便记忆，可以这样理解它们的层级关系：

1.  **Cluster** 包含多个 **Broker**。
2.  **Topic** 逻辑上包含多个 **Partition**。
3.  **Partition** 物理上分散在不同 Broker，并复制为多个 **Replica**。
4.  **Replica** 选出一个 **Leader** 负责干活，其余是 **Follower** 负责备份。
5.  **ISR** 是当前健康的 Replica 集合。
6.  **Consumer Group** 订阅 Topic，组内每个 Consumer 认领部分 Partition 进行消费。



---
---

# 二、集群运维命令

### 1. 集群健康与故障排查 (Health Check)


| 场景 | 核心命令 & 参数 | 运维解释 (Ops Note) |
| :--- | :--- | :--- |
| **查找未同步分区** (最重要) | `kafka-topics.sh --describe --under-replicated-partitions` | **告警级别：高**。列出所有 ISR 数量少于副本因子的分区。如果有输出，说明有 Broker 宕机、网络拥堵或磁盘慢，导致 Follower 追不上 Leader。**必须为 0**。 |
| **查找不可用分区** (数据丢失) | `kafka-topics.sh --describe --unavailable-partitions` | **告警级别：灾难**。列出 Leader 已经挂掉且无法选举出新 Leader 的分区。此时该分区拒绝读写，意味着服务中断。 |
| **查看 Topic 详细分布** | `kafka-topics.sh --describe --topic <name>` | 检查 `Leader` 是否集中在某一台 Broker 上（热点问题），或者 `ISR` 列表是否在频繁波动。 |
| **检查节点是否在集群中** | `zookeeper-shell.sh` (旧) / `kafka-metadata-shell.sh` (新) | 查看 `/brokers/ids` 列表。确认 Broker 进程虽然在跑，但 ID 是否真的注册到了集群元数据中。 |

**💻 运维实战举例：**

1.  **快速筛查坏掉的分区（巡检脚本必用）：**
    ```bash
    # 如果没有任何输出，才是健康的
    bin/kafka-topics.sh --bootstrap-server localhost:9092 --describe --under-replicated-partitions
    ```

---

### 2. 负载均衡与数据迁移 (Rebalance & Migration)

当你发现某台 Broker 磁盘快满了，或者 CPU 100% 了，或者新加了机器需要分担压力时，需要用到这些命令。

| 场景 | 核心脚本 | 运维解释 (Ops Note) |
| :--- | :--- | :--- |
| **分区副本重分配** | `kafka-reassign-partitions.sh` | **运维核心技能**。用于扩容后迁移数据、缩容前撤出数据、或解决磁盘热点。分三步走：`--generate` (生成计划) -> `--execute` (执行) -> `--verify` (验证进度)。 |
| **手动触发 Leader 选举** | `kafka-leader-election.sh` | **解决 Leader 不均**。当某台机器重启回来后，它上面的 Leader 往往被转移走了。使用此命令将 Leader 均衡回该节点 (`--election-type PREFERRED`)。 |
| **查看日志目录状态** | `kafka-log-dirs.sh` | 查看每个 Broker 上各个挂载盘（Log Dir）的使用情况。用于判断是否发生**磁盘倾斜**（比如一块盘满了一块盘是空的）。 |

**💻 运维实战举例：**

1.  **生成迁移计划（把 topic-A 的数据迁移到 Broker 4,5）：**
    *   运维通常需要先写一个 `topics-to-move.json`，然后：
    ```bash
    bin/kafka-reassign-partitions.sh --bootstrap-server localhost:9092 \
    --topics-to-move-json-file topics-to-move.json \
    --broker-list "4,5" \
    --generate
    ```

2.  **验证迁移是否完成（Verify）：**
    *   在执行迁移过程中，必须不断运行此命令监控进度，防止带宽打爆。
    ```bash
    bin/kafka-reassign-partitions.sh --bootstrap-server localhost:9092 \
    --reassignment-json-file expand-cluster-reassignment.json \
    --verify
    ```

3.  **平衡 Leader（重启机器后必做）：**
    ```bash
    bin/kafka-leader-election.sh --bootstrap-server localhost:9092 \
    --election-type PREFERRED --all-topic-partitions
    ```

---

### 3. 动态限流与配额管理 (Quotas & Throttling)

运维必须掌握的“防御性”命令。防止某个疯狂的业务方把集群带宽打满，导致其他重要业务受损。

| 场景 | 核心命令 & 参数 | 运维解释 (Ops Note) |
| :--- | :--- | :--- |
| **设置生产/消费限速** | `kafka-configs.sh --alter --add-config 'producer_byte_rate=1024'` | 针对特定的 User 或 ClientId 设置带宽上限（单位 bytes/sec）。 |
| **调整 Topic 级配置** | `kafka-configs.sh --alter --add-config 'min.insync.replicas=2'` | **数据可靠性调整**。设置 `min.insync.replicas` 强制要求至少有 N 个副本写入成功才算成功，防止数据丢失。 |
| **查看当前动态配置** | `kafka-configs.sh --describe` | 检查是否有前人留下的“坑”（比如偷偷限制了带宽或修改了保留时间）。 |

**💻 运维实战举例：**

1.  **紧急限流（限制某个 User 每秒只能写 1MB）：**
    ```bash
    bin/kafka-configs.sh --bootstrap-server localhost:9092 \
    --alter --add-config 'producer_byte_rate=1048576' \
    --entity-type users --entity-name bad_user_app
    ```

2.  **强制 Topic 高可靠（配合 acks=all）：**
    ```bash
    bin/kafka-configs.sh --bootstrap-server localhost:9092 \
    --alter --add-config 'min.insync.replicas=2' \
    --entity-type topics --entity-name important_payment_topic
    ```

---

### 4. 底层数据与日志分析 (Deep Dive)

当 Broker 启动失败，报错 "Corrupt Record" 或 "Index offset mismatch" 时，需要用这些工具分析底层文件。

| 场景 | 核心脚本 | 运维解释 (Ops Note) |
| :--- | :--- | :--- |
| **分析 Log 文件** | `kafka-dump-log.sh` | **最后手段**。直接读取磁盘上的 `.log` 文件。用于验证消息内容、查看消息批次（Batch）信息，或者确认文件是否损坏。 |
| **删除相关 ZooKeeper 节点** | `zookeeper-shell.sh` | 当 Topic 删不掉（处于 `marked for deletion` 卡死）时，可能需要去 ZK 里手动干预（`/brokers/topics/`）。 |

**💻 运维实战举例：**

1.  **检查索引文件是否损坏：**
    ```bash
    # --index-sanity-check 会检查索引是否匹配，不匹配则报错
    bin/kafka-dump-log.sh --files /data/kafka-logs/topic-0/00000.index --index-sanity-check
    ```

2.  **查看 Log 内部的具体 Payload（仅用于 Debug）：**
    ```bash
    bin/kafka-dump-log.sh --files /data/kafka-logs/topic-0/00000.log --print-data-log
    ```

---

### 5. 总结：运维人员的高频命令清单

作为运维，如果只记最核心的 5 个操作，应该是：

1.  `kafka-topics.sh --describe --under-replicated-partitions` (监控集群坏没坏)
2.  `kafka-consumer-groups.sh --describe` (监控业务慢没慢)
3.  `kafka-reassign-partitions.sh --execute/verify` (迁移数据/修机器)
4.  `kafka-configs.sh --alter` (动态调整参数/限流)
5.  `kafka-leader-election.sh` (平衡集群负载)

这些才是保证 Kafka **稳定性 (Stability)** 和 **可用性 (Availability)** 的真正武器。


---
---





# 三、集群使用命令：


---

### 1. Topic（主题）管理
**脚本：** `kafka-topics.sh`
**场景：** 业务上线建表、扩容分区、查看分区健康状态、回收废弃主题。

| 操作 | 关键参数 | 说明 |
| :--- | :--- | :--- |
| **创建 Topic** | `--create` | 需指定分区数 (`--partitions`) 和副本数 (`--replication-factor`)。 |
| **查看详情** | `--describe` | **运维最常用**。查看分区分布、Leader 位置、ISR（同步副本）状态。 |
| **列出所有 Topic** | `--list` | 查看集群当前有哪些 Topic。 |
| **修改分区数** | `--alter` | **注意**：只能增加分区，**不能减少**分区。 |
| **删除 Topic** | `--delete` | 标记删除。需 `delete.topic.enable=true` 配置生效，否则只是标记。 |

#### 📝 常用命令举例

1.  **创建一个标准的生产 Topic**
    *   3 个分区，2 个副本（保证高可用）。
    ```bash
    bin/kafka-topics.sh --bootstrap-server localhost:9092 \
    --create --topic my-topic-01 \
    --partitions 3 --replication-factor 2
    ```

2.  **查看 Topic 健康状况（排查问题必用）**
    *   重点观察输出中的 `ISR` 列表。如果 `Replicas` 有 3 个，但 `ISR` 只有 1 个，说明有 2 个副本掉线了。
    ```bash
    bin/kafka-topics.sh --bootstrap-server localhost:9092 \
    --describe --topic my-topic-01
    ```

3.  **扩容分区**
    *   当吞吐量不够时，增加分区以提高并行度。
    ```bash
    bin/kafka-topics.sh --bootstrap-server localhost:9092 \
    --alter --topic my-topic-01 --partitions 5
    ```

---

### 2. Consumer Group（消费者组）管理
**脚本：** `kafka-consumer-groups.sh`
**场景：** 监控消费积压（Lag）、重置位移（回溯数据）、清理死掉的消费者组。

| 操作 | 关键参数 | 说明 |
| :--- | :--- | :--- |
| **查看消费状态** | `--describe` | **运维最核心命令**。查看 **LAG**（积压量），判断消费是否跟得上。 |
| **列出消费者组** | `--list` | 查看当前集群活跃的消费者组列表。 |
| **重置位移** | `--reset-offsets` | 类似于“倒带”。让消费者重新消费历史数据，或跳过某些数据。 |
| **删除消费者组** | `--delete` | 删除不再使用的消费者组（需组内无活跃连接）。 |

#### 📝 常用命令举例

1.  **查看消费积压 (Lag)**
    *   **关注列**：`LAG`。如果 LAG 数值持续很大且不下降，说明该 Group 消费出问题了。
    ```bash
    bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 \
    --describe --group my-consumer-group
    ```

2.  **回溯消费（重置到最早）**
    *   **注意**：执行此命令前，**必须先停止**对应的消费者程序。
    ```bash
    bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 \
    --group my-consumer-group \
    --topic my-topic-01 \
    --reset-offsets --to-earliest --execute
    ```

3.  **回溯到指定时间点**
    *   例如：应用在上午 10:00 发布后出现 Bug，修复后想重新消费 10:00 之后的数据。
    ```bash
    bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 \
    --group my-consumer-group \
    --topic my-topic-01 \
    --reset-offsets --to-datetime 2023-10-27T10:00:00.000 --execute
    ```

---

### 3. 配置管理（动态配置）
**脚本：** `kafka-configs.sh`
**场景：** 不重启 Broker 的情况下，动态修改 Topic 或 Broker 的参数（如消息保留时间、最大消息大小）。

| 操作 | 实体类型 (`--entity-type`) | 说明 |
| :--- | :--- | :--- |
| **查看配置** | `topics` / `brokers` | 查看当前生效的动态配置（非默认配置）。 |
| **修改/增加配置** | `topics` | 使用 `--add-config` 设置参数。 |
| **删除配置** | `topics` | 使用 `--delete-config` 恢复默认值。 |

#### 📝 常用命令举例

1.  **临时调整消息保留时间**
    *   默认通常是 7 天。如果磁盘紧张，可临时改为 12 小时（单位毫秒）。
    ```bash
    bin/kafka-configs.sh --bootstrap-server localhost:9092 \
    --entity-type topics --entity-name my-topic-01 \
    --alter --add-config retention.ms=43200000
    ```

2.  **修改最大消息大小**
    *   如果报错 "Record too large"，需调整此参数（默认 1MB）。
    ```bash
    bin/kafka-configs.sh --bootstrap-server localhost:9092 \
    --entity-type topics --entity-name my-topic-01 \
    --alter --add-config max.message.bytes=10485760
    ```

---

### 4. 调试与开发测试
**脚本：** `kafka-console-producer.sh` / `kafka-console-consumer.sh`
**场景：** 验证集群网络连通性、手动造数据测试、临时查看 Topic 里的消息内容。

| 操作 | 脚本 | 说明 |
| :--- | :--- | :--- |
| **生产消息** | `console-producer` | 启动一个交互式命令行，回车发送消息。 |
| **消费消息** | `console-consumer` | 打印 Topic 中的消息到屏幕。 |

#### 📝 常用命令举例

1.  **从头开始查看消息（验证数据存在性）**
    *   `--from-beginning`：从第一条消息开始读。如果不加，只读启动命令后新发的消息。
    *   `--max-messages 10`：读 10 条就退出（防止刷屏）。
    ```bash
    bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 \
    --topic my-topic-01 \
    --from-beginning --max-messages 10
    ```

2.  **测试发送消息**
    ```bash
    bin/kafka-console-producer.sh --bootstrap-server localhost:9092 \
    --topic my-topic-01
    > Hello Kafka
    > This is a test
    ```

---

### 5. 进阶运维（底层数据与性能）

这些命令通常在排查严重故障或压测时使用。

| 场景 | 脚本 | 用途 |
| :--- | :--- | :--- |
| **查看日志文件内容** | `kafka-dump-log.sh` | **查坏数据**。直接读取磁盘上的 `.log` 或 `.index` 文件，查看内部数据结构。 |
| **性能压测** | `kafka-producer-perf-test.sh` | **基准测试**。测试当前 Kafka 集群的写入吞吐量极限。 |
| **分区重分配** | `kafka-reassign-partitions.sh` | **集群扩容**。新增 Broker 后，将旧数据迁移到新节点（需编写 JSON 文件，较复杂）。 |

#### 📝 常用命令举例

1.  **基准压测（测试集群写入能力）**
    *   向 `test-topic` 发送 10万条消息，每条 1KB，查看每秒吞吐量。
    ```bash
    bin/kafka-producer-perf-test.sh --topic test-topic \
    --num-records 100000 --record-size 1024 --throughput -1 \
    --producer-props bootstrap.servers=localhost:9092 acks=1
    ```

2.  **查看 Log 文件详情（Debug）**
    *   不显示内容，只显示 Offset 和 Position，用于验证文件是否损坏。
    ```bash
    bin/kafka-dump-log.sh --files /tmp/kafka-logs/my-topic-01-0/00000000000000000000.log \
    --print-data-log
    ```

### 💡 运维小贴士

1.  **Bootstrap Server**: 永远习惯使用 `--bootstrap-server`。
2.  **权限**: 某些生产环境开启了 ACL（权限控制），执行上述命令可能需要配置 `command-config` 加载 `client.properties` 认证文件。
3.  **不要手滑**: 特别是 `--delete` 和 `--reset-offsets`，执行前务必三思。


---
---





# 四、集群关键指标:

### 1. 集群健康类（Health & Availability）—— 生死指标

这一类指标报警，意味着集群已经出问题或即将崩溃，必须立即介入（P0/P1 级告警）。

| 指标名称 | JMX MBean 关键字 | 推荐告警阈值 | 运维含义与处理 |
| :--- | :--- | :--- | :--- |
| **UnderReplicatedPartitions** | `UnderReplicatedPartitions` | **> 0** | **最核心指标**。表示 ISR 数量 < 副本因子。意味着有副本挂了、网络断了或磁盘太慢追不上。**若不及时处理，再挂一个节点可能导致数据丢失。** |
| **OfflinePartitionsCount** | `OfflinePartitionsCount` | **> 0** | **灾难指标**。表示 Partition 的所有副本都挂了，或者 Controller 选不出 Leader。该分区处于不可读写状态，**业务中断**。 |
| **ActiveControllerCount** | `ActiveControllerCount` | **!= 1** | 整个集群该指标之和必须等于 1。如果为 0，集群无主（不可写）；如果 > 1，发生脑裂（数据不一致）。 |
| **UncleanLeaderElections** | `UncleanLeaderElectionsPerSec` | **> 0** | **数据丢失指标**。表示是否发生了从非 ISR 副本中选举 Leader 的情况。虽然保住了可用性，但必然导致**数据丢失/Offset错乱**。 |
| **ISRShrink/ExpandRate** | `IsrShrinksPerSec` | 突增 | ISR 频繁收缩/扩张，说明集群网络极不稳定，或者某台 Broker 频繁 GC/卡顿，正在“反复仰卧起坐”。 |

---

### 2. 性能与资源饱和度（Performance & Saturation）—— 瓶颈指标

这一类指标帮助你判断 Broker 是否过载，是否需要扩容或限流。

| 指标名称 | JMX MBean 关键字 | 运维关注点 | 运维含义与处理 |
| :--- | :--- | :--- | :--- |
| **NetworkProcessorAvgIdlePercent** | `NetworkProcessorAvgIdlePercent` | **< 0.3 (30%)** | **CPU 瓶颈核心指标**。网络线程空闲率。如果长期低于 30%，说明 CPU 忙于处理网络请求。需**增加 `num.network.threads`** 或扩容 Broker。 |
| **RequestHandlerAvgIdlePercent** | `RequestHandlerAvgIdlePercent` | **< 0.3 (30%)** | **I/O 瓶颈核心指标**。I/O 线程空闲率。如果低，说明磁盘 I/O 处理不过来。需**增加 `num.io.threads`** 或更换更快的磁盘（SSD）。 |
| **RequestTotalTimeMs** | `RequestTotalTimeMs` | 突增 / >500ms | 端到端请求延迟（包含排队+处理+发送）。如果飙升，通常是磁盘写入慢或网络拥堵。 |
| **RequestQueueSize** | `RequestQueueSize` | 持续 > 10 | 请求队列堆积。说明处理线程处理不过来了，是上述 IdlePercent 低的直接后果。 |
| **LogFlushRateAndTimeMs** | `LogFlushRateAndTimeMs` | 耗时过长 | 刷盘耗时。如果该值很高，说明磁盘写入性能极差。 |

---

### 3. 流量与吞吐（Throughput）—— 容量规划

用于监控业务流量变化，判断是否需要扩容。

| 指标名称 | JMX MBean 关键字 | 运维含义 |
| :--- | :--- | :--- |
| **BytesInPerSec** | `BytesInPerSec` | **入站流量**。需结合网卡带宽监控。例如万兆网卡，如果单机入站超过 800MB/s 就很危险了。 |
| **BytesOutPerSec** | `BytesOutPerSec` | **出站流量**。通常出站流量是入站的 N 倍（N = 消费者组数量）。如果出站流量打满网卡，会导致 ISR 同步变慢，进而引发集群不稳定。 |
| **MessagesInPerSec** | `MessagesInPerSec` | **TPS**。每秒写入消息数。用于评估业务量的增长趋势。 |

---

### 4. OS 与 JVM 层面 —— 基础设施

Kafka 是跑在 JVM 上的，且极其依赖文件系统（Page Cache）。

| 指标名称 | 关注点 | 运维含义 |
| :--- | :--- | :--- |
| **Disk Usage** | **> 80%** | **必配告警**。Kafka 磁盘写满会直接 Crash。务必留足缓冲空间。注意监控具体的挂载点（Log Dir）。 |
| **Open File Descriptors** | **接近 ulimit** | Kafka 会打开大量 `index/log` 文件和 socket 连接。需确保 OS 的 `ulimit -n` 设置得足够大（通常推荐 100,000+）。 |
| **JVM GC Time (G1)** | **> 1秒** | 如果 Full GC 或 Young GC 耗时过长，会造成 Broker "假死"，导致被剔出 ISR。 |
| **Page Cache 使用率** | 越高越好 | Kafka 利用 OS 的 Page Cache 加速读写。如果剩余内存太少导致 Swap 使用，性能会断崖式下跌。**严禁 Kafka 使用 Swap。** |

---

### 5. 消费端指标（Consumer）

虽然这是业务的事，但业务方经常会问运维“为什么不消费了”。

| 指标名称 | 来源 | 运维含义 |
| :--- | :--- | :--- |
| **Consumer Lag** | Kafka Exporter / Burrow | **消费积压**。Lag = HW - CurrentOffset。最直观反映消费是否健康。 |
| **JoinRate / SyncRate** | Coordinator Metrics | 如果消费者组频繁 Rebalance（重平衡），会导致消费暂停。监控此指标可发现不稳定的消费者客户端。 |

---

### 6.💡 总结：运维监控的“黄金三板斧”

如果你没有精力配置几十个指标，**请务必死死盯住以下 5 个**：

1.  **UnderReplicatedPartitions** (集群坏没坏？)
2.  **OfflinePartitionsCount** (数据丢没丢？)
3.  **ActiveControllerCount** (脑裂了吗？)
4.  **NetworkProcessorAvgIdlePercent** (CPU 忙死了吗？)
5.  **Disk Usage** (磁盘满了吗？)

只要这 5 个正常，Kafka 集群基本就能稳定运行。