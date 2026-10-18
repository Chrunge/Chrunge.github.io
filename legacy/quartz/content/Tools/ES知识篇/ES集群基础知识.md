# ES核心概念



### 一、 逻辑数据模型 (Logical Model)

这部分概念描述了数据在 ES 中是如何组织和定义的，类似于数据库的“表结构”设计。

| 概念名称 | 英文名称 | 详细定义 | **运维核心关注点 (Ops Focus)** |
| :--- | :--- | :--- | :--- |
| **索引** | **Index** | 含有相同属性的**文档集合**。它是数据存储和查询的顶层逻辑命名空间。 | 1. **生命周期管理 (ILM)**：决定索引何时滚动（Rollover）、何时删除。 <br> 2. **配置管理**：Setting（分片数、刷新间隔）和 Mapping（字段类型）都在此层级定义。 |
| **文档** | **Document** | 可被索引的基础数据单元。使用 **JSON** 格式表示。包含具体的字段（Key-Value）。 | **数据大小**：单个文档不宜过大（例如超过 100MB），否则会给网络传输和内存带来巨大压力。 |
| **字段** | **Field** | JSON 文档中的 Key，类似于数据库表的列。 | **字段爆炸**：需监控 `index.mapping.total_fields.limit`（默认 1000）。如果业务随意增加字段导致超出限制，会导致写入被拒绝。 |
| **映射** | **Mapping** | 类似于数据库的 **Schema**。定义了索引中字段的名称、数据类型（String, Integer, Date等）以及如何分析这些字段。 | **类型冲突**：一旦字段类型被定义（如 Integer），就不能直接改为 String，否则需执行 Reindex（重建索引）操作，这是运维的高危操作。 |
| **ID** | **_id** | 每个文档的唯一标识符。可以由用户指定，也可以由 ES 自动生成（自动生成的写入性能稍高）。 | **更新策略**：如果 ID 重复，ES 会执行“覆盖”操作（实际上是标记删除旧版，写入新版）。 |

---

### 二、 物理集群架构 (Physical Architecture)

这部分概念描述了 ES 是如何利用多台服务器实现分布式存储和高可用的。

| 概念名称 | 英文名称 | 详细定义 | **运维核心关注点 (Ops Focus)** |
| :--- | :--- | :--- | :--- |
| **集群** | **Cluster** | 由一个或多个节点（服务器）组成的集合，共同存储数据并提供搜索能力。集群由唯一的 `cluster.name` 标识。 | **脑裂防护**：确保网络稳定，防止集群分裂成两个互相不认识的小集群（Split-brain）。 |
| **节点** | **Node** | 运行了 ES 实例的一台物理机或容器。每个节点都有唯一的 UUID 和名称。 | **资源监控**：包括 JVM Heap 使用率、CPU、磁盘 I/O。节点挂掉会导致集群变黄或变红。 |
| **分片** | **Shard** | 索引数据的**水平拆分**。一个索引的数据会被切分成多个分片，分布在不同节点上。分片是 ES 数据处理的最小单元（本质上是一个 Lucene 实例）。 | **容量规划**：<br>1. **大小**：建议单个分片保持在 **30GB - 50GB**。<br>2. **数量**：分片太多会消耗大量堆内存；分片太大会导致恢复时间极长。 |
| **主分片** | **Primary Shard** | 每个文档在写入时，必须先写入主分片，成功后再同步给副本分片。 | **决定写入上限**：索引创建后，主分片数量**不可修改**（除非重建索引）。 |
| **副本分片** | **Replica Shard** | 主分片的拷贝。提供**读取扩容**（并在副本上查询）和**高可用**（主挂了副本顶上）。 | **决定读取上限**：副本数量可以随时动态调整。增加副本可提高查询吞吐量，但会消耗更多磁盘空间。 |

---

### 三、 节点角色分类 (Node Roles)

在生产环境中，ES 节点通常各司其职，运维需要对不同角色的节点进行差异化配置。

| 角色名称 | 英文名称 | 职责描述 | **运维核心关注点 (Ops Focus)** |
| :--- | :--- | :--- | :--- |
| **主节点** | **Master-eligible** | 负责管理集群元数据（创建/删除索引、跟踪节点状态、分片分配）。不承载实际数据流量。 | **稳定性第一**。配置低内存、低磁盘，但网络要好。通常配置 3 个组成仲裁组，防止脑裂。 |
| **数据节点** | **Data Node** | 负责存储数据（分片）、执行 CRUD 操作、聚合分析。 | **资源消耗大户**。主要吃磁盘 I/O（SSD）、内存（Filesystem Cache）和 CPU。扩容通常指扩数据节点。 |
| **协调节点** | **Coordinating Node** | 负责接收客户端请求（REST API），分发给数据节点，汇总结果（Reduce）并返回给客户端。 | **防 OOM**。对于深度分页或大聚合查询，协调节点需要大量内存来汇聚结果。如果查询太重，协调节点容易内存溢出。 |
| **摄取节点** | **Ingest Node** | 在文档写入索引之前，对文档进行预处理（Pipeline），如解析 UserAgent、转换 IP 地理位置等。 | CPU 密集型。如果处理逻辑复杂，建议单独部署，以免拖累数据节点。 |

---

### 四、 底层存储与检索原理 (Internal Mechanics)

这部分是 ES 性能调优的基石，理解这些有助于排查“为什么写得慢”或“为什么查得慢”。

| 概念名称 | 英文名称 | 详细定义 | **运维核心关注点 (Ops Focus)** |
| :--- | :--- | :--- | :--- |
| **倒排索引** | **Inverted Index** | ES 核心数据结构。记录“词汇 -> 文档ID”的映射关系。类似于书后的关键字索引。 | **不可变性**：倒排索引一旦生成就无法修改。这决定了 ES 的“修改”实际上是“标记删除 + 新增”。 |
| **段** | **Segment** | 分片在磁盘上的物理文件。一个分片包含多个 Segment。数据写入后先在内存，随后生成不可变的 Segment。 | **合并 (Merge)**：后台线程会不断将小 Segment 合并成大 Segment。此过程非常消耗 CPU 和 I/O，可能导致查询抖动。 |
| **事务日志** | **Translog** | 预写日志（Write Ahead Log）。用于故障恢复。数据写入内存的同时追加到 Translog，防止宕机数据丢失。 | **数据安全性**：Translog 只有在刷盘（fsync）后才算安全。默认每 5 秒或请求时刷盘。 |
| **近实时** | **NRT (Near Real-Time)** | 数据从写入到可以被搜索到，中间存在微小的延迟（默认 1 秒）。 | **Refresh 间隔**：默认 `refresh_interval` 为 1s。如果业务对实时性要求不高，**调大该值（如 30s）可显著提升写入性能**。 |
| **Doc Values** | **Doc Values** | 列式存储结构。用于排序（Sorting）和聚合（Aggregations）。 | 存储在磁盘上，依赖操作系统的文件系统缓存（Page Cache）。如果内存不足导致频繁读取磁盘，聚合性能会极差。 |

### 五、 概念层级关系总结

为了方便记忆，可以从大到小理解：

1.  **Cluster** (集群) 包含多个 **Node** (节点)。
2.  **Node** 上存储着许多 **Shard** (分片)。
3.  **Shard** 逻辑上属于某个 **Index** (索引)。
4.  **Shard** 物理上由多个 **Segment** (段文件) 组成。
5.  **Index** 中包含无数 **Document** (文档)。

--- 
--- 






# 运维方面：**集群健康、资源瓶颈、性能吞吐、底层机制**。

### 一、 集群健康维度 (Cluster Health)

这是最高层级的指标，用于判断“集群是否活着”以及“数据是否完整”。

| 指标名称 | 英文 Key | 推荐告警阈值 | 运维核心关注点 (Ops Focus) |
| :--- | :--- | :--- | :--- |
| **集群状态** | `status` | **!= Green** | **最基础指标**。<br>🔴 **Red**: 主分片丢失，数据不可用，**P0级故障**。<br>🟡 **Yellow**: 副本分片未分配，单点故障风险，**P1级故障**。<br>🟢 **Green**: 一切正常。 |
| **未分配分片数** | `unassigned_shards` | **> 0** | 解释了为什么状态是 Yellow 或 Red。常见原因：节点掉线、磁盘空间不足、分片策略限制。 |
| **初始化分片数** | `initializing_shards` | 持续不降 | 节点重启或新建索引时，此值会升高。如果长期居高不下，说明分片恢复卡住了（可能是网络慢或文件损坏）。 |
| **节点数量** | `number_of_nodes` | **< 预期值** | 监控节点存活数。如果配置了 10 台机器，这里显示 9，说明有一台挂了或脱离集群了。 |
| **待处理任务数** | `pending_tasks` | **> 50** | Master 节点的任务积压（如创建索引、Mapping 变更）。如果堆积严重，Master 节点可能响应变慢甚至卡死。 |

---

### 二、 资源与 JVM 维度 (Resources & JVM)

ES 是**内存吞噬兽**，且对**磁盘水位**极其敏感。

| 指标名称 | 英文 Key | 推荐告警阈值 | 运维核心关注点 (Ops Focus) |
| :--- | :--- | :--- | :--- |
| **JVM 堆内存使用率** | `jvm.mem.heap_used_percent` | **> 75% (Warning)<br>> 85% (Critical)** | **ES 运维第一大敌**。<br>如果长期高于 85%，会触发频繁的 Full GC，导致节点 "Stop-the-world"（假死），随后被踢出集群。 |
| **GC 次数/耗时** | `jvm.gc.collectors.young/old` | **Old GC > 500ms** | 重点监控 **Old Gen GC**。如果老年代 GC 频繁且耗时长，说明内存不足或存在大查询（Large Aggregations）。 |
| **磁盘使用率** | `fs.total.disk_usage` | **> 80%** | **水位线机制 (Watermarks)**：<br>1. **85%**: 停止分配新分片。<br>2. **90%**: 尝试迁移分片。<br>3. **95%**: **强制只读 (Read-Only)**。一旦触发，必须手动解锁。 |
| **CPU 使用率** | `os.cpu.percent` | **> 80%** | 写入（Indexing）和复杂查询（Searching）都非常消耗 CPU。如果长期打满，需考虑扩容或优化查询语句。 |
| **打开文件描述符** | `process.open_file_descriptors` | **接近 ulimit** | ES 每个段（Segment）和网络连接都需要文件句柄。Linux 默认 1024 肯定不够，通常需调至 65536+。 |

---

### 三、 线程池与拒绝任务 (Thread Pools & Rejections)

这是判断 ES **“是否处理不过来”** 最直接的指标。当请求量超过 ES 处理能力时，任务会被拒绝。

| 指标名称 | 英文 Key | 推荐告警阈值 | 运维核心关注点 (Ops Focus) |
| :--- | :--- | :--- | :--- |
| **写入拒绝数** | `thread_pool.write.rejected` | **> 0** | **写入瓶颈**。说明批量写入（Bulk）请求太多，写入线程池和队列都满了。**后果：数据写入失败。**<br>*对策：增加节点、减小 Bulk 大小、优化磁盘 I/O。* |
| **查询拒绝数** | `thread_pool.search.rejected` | **> 0** | **查询瓶颈**。说明并发查询太高或某些查询太慢（占用线程时间长）。**后果：前端查询报错。** |
| **写入队列堆积** | `thread_pool.write.queue` | 持续较高 | 写入请求正在排队，虽然还没被拒绝，但延迟会增加。 |
| **查询队列堆积** | `thread_pool.search.queue` | 持续较高 | 查询请求正在排队。 |

---

### 四、 性能与延迟维度 (Performance & Latency)

监控业务体验，查慢查询或慢写入。

| 指标名称 | 英文 Key | 运维核心关注点 (Ops Focus) |
| :--- | :--- | :--- |
| **索引延迟** | `indexing_time` / `indexing_total` | **Indexing Latency**。计算公式：`时间差值 / 次数差值`。如果写入变慢，检查磁盘 I/O (`iowait`) 或 Translog 刷盘设置。 |
| **查询延迟** | `search_time` / `search_total` | **Search Latency**。如果查询均值很高，可能需要优化索引设计；如果偶尔飙高，可能有“杀手级”聚合查询。 |
| **段数量** | `indices.segments.count` | **Segment Count**。段越多，查询越慢。如果该值一直增长不下降，说明后台 Merge 线程跟不上，或者需要手动 Force Merge（针对冷索引）。 |
| **I/O 等待时间** | `fs.io_stats` | 既然是存储系统，磁盘慢就是原罪。监控磁盘的 IOPS 和 Latency。 |

---

### 五、 现场故障排查与监控实战

当监控报警时，你需要快速定位问题。

#### 1. 必配的 Dashboard 图表
如果你使用 Grafana，建议将以下 4 个图表放在最显眼的位置：

1.  **Cluster Status (0/1/2)**: 绿/黄/红状态变化。
2.  **Max JVM Heap Usage %**: 集群中最高的那个节点的内存使用率（最容易挂的那个点）。
3.  **Total Rejected Tasks (Write & Search)**: 整个集群的拒绝任务总数（判断是否过载）。
4.  **Max Disk Usage %**: 最满的那块磁盘（判断是否快锁住了）。

#### 2. 如何获取这些指标？
ES 本身提供了 `_nodes/stats` API，但通过工具采集更好：

*   **Prometheus**: 使用 `elasticsearch_exporter` (最主流方案)。
*   **Elastic Stack**: 使用 `Metricbeat` 采集并发送到监控集群。

### 六、 💡 总结：运维人员的“生死线”

如果资源有限，优先监控以下 **Top 5** 指标，一旦越线立即介入：

1.  **Cluster Status** (是不是 Red?)
2.  **Unassigned Shards** (有没有分片没分配?)
3.  **JVM Heap Usage > 85%** (内存是不是要爆?)
4.  **Disk Usage > 85%** (磁盘是不是要满?)
5.  **Thread Pool Rejected > 0** (是不是在丢请求?)

---
---

Elasticsearch 的所有运维操作和指标查看都通过 **RESTful API** 进行，最常用的工具是 `curl`（命令行）或者 Kibana 的 `Dev Tools`（可视化界面）。

以下是针对上述关键指标的查看命令，分为 **Cat API**（人类可读，适合快速概览）和 **Nodes Stats API**（JSON 格式，适合深入排查）。

---

### 一、 查看集群健康与分片状态 (Cluster Health)

**1. 查看集群红绿灯及关键计数**
用于判断集群总体状态、未分配分片数。

```bash
# 格式化输出 (?v 显示表头)
GET /_cat/health?v
```

**输出示例分析：**
```text
epoch      timestamp cluster       status node.total node.data shads pri rel init unassign pending_tasks
1698300000 08:00:00  my-es-cluster yellow          3         3   120  60   0    0        2             0
```
*   **status**: `yellow` (重点关注)
*   **unassign**: `2` (有 2 个分片未分配，重点关注)

**2. 查找具体是哪个索引/分片出问题了**
当集群变黄或红时，用此命令定位故障源。

```bash
# 只显示非正常状态的分片，并显示原因
GET /_cat/shards?v&h=index,shard,prirep,state,node,unassigned.reason&s=state
```
*   **关键列**：`unassigned.reason` (如 `ALLOCATION_FAILED`, `CLUSTER_RECOVERED` 等)。

---

### 二、 查看资源使用情况 (Resource & JVM)

**1. 查看各节点的 JVM 堆内存、CPU、负载**
这是运维最常用的命令之一，快速找出哪个节点负载高。

```bash
# h 参数用于指定显示的列
GET /_cat/nodes?v&h=ip,name,node.role,heap.percent,ram.percent,cpu,load_1m,master
```

**输出示例分析：**
```text
ip           name    node.role heap.percent ram.percent cpu load_1m master
192.168.1.10 node-01 cdfhilmr            88          95  40    1.20 *
192.168.1.11 node-02 cdfhilmr            40          60  10    0.50 -
```
*   **heap.percent**: `88` (node-01 内存危险，接近 Full GC 风险)。

**2. 查看磁盘使用率**
防止磁盘写满导致集群只读。

```bash
# 按磁盘使用率倒序排列
GET /_cat/allocation?v&s=disk.percent:desc
```

**输出示例分析：**
```text
shards disk.indices disk.used disk.avail disk.total disk.percent host      ip         node
    40       10.5gb    85.0gb     15.0gb    100.0gb           85 10.0.0.1  10.0.0.1   node-01
```
*   **disk.percent**: `85` (达到高水位警戒线，不再分配新分片)。

---

### 三、 查看线程池与拒绝任务 (Thread Pool)

当业务反馈写入报错或查询超时时，必查此指标。

```bash
# 查看各节点的线程池状态，重点看 rejected 列
GET /_cat/thread_pool/write,search?v&h=node_name,name,active,queue,rejected,completed
```

**输出示例分析：**
```text
node_name name   active queue rejected completed
node-01   write       8   100     5020   2000000
node-01   search     10     0        0   5000000
```
*   **write.rejected**: `5020` (发生过大量写入拒绝，说明写入压力曾超过节点承受极限)。
*   **write.queue**: `100` (当前队列已满，新的请求即将被拒绝)。

---

### 四、 深入排查：Nodes Stats API (JSON 详情)

当 `_cat` API 看到概况后，如果需要更详细的数据（例如 GC 耗时详情、Segment 数量），需要用 `_nodes/stats`。

**1. 查看 GC 次数与耗时**
排查节点卡顿原因。

```bash
GET /_nodes/stats/jvm
```

**重点关注 JSON 路径：**
*   `nodes.{node_id}.jvm.gc.collectors.young.collection_count` (Young GC 次数)
*   `nodes.{node_id}.jvm.gc.collectors.old.collection_count` (Old GC 次数 - **关键**)
*   `nodes.{node_id}.jvm.gc.collectors.old.collection_time_in_millis` (Old GC 总耗时)

**2. 查看索引性能与 IO**
排查写入慢或查询慢。

```bash
GET /_nodes/stats/indices,fs
```

**重点关注 JSON 路径：**
*   `nodes.{node_id}.indices.indexing.index_time_in_millis` (总写入耗时)
*   `nodes.{node_id}.indices.search.query_time_in_millis` (总查询耗时)
*   `nodes.{node_id}.indices.segments.count` (段文件数量，越多越慢)

---

### 五、 实用运维命令速查表 (Cheat Sheet)

把这些命令保存到你的笔记里，随时复制粘贴：

| 场景 | 命令 | 作用 |
| :--- | :--- | :--- |
| **日常巡检** | `GET /_cat/health?v` | 看集群绿没绿 |
| **查负载均衡** | `GET /_cat/nodes?v&h=name,heap.percent,cpu,load_1m,disk.used_percent` | 看谁在干苦力 |
| **查磁盘空间** | `GET /_cat/allocation?v&s=disk.percent:desc` | 谁的盘快满了 |
| **查为什么黄** | `GET /_cat/shards?v&h=index,shard,prirep,state,unassigned.reason` | 找未分配的分片 |
| **查任务积压** | `GET /_cat/thread_pool/write,search?v&s=rejected:desc` | 有没有丢请求 |
| **查正在跑啥** | `GET /_cat/tasks?v&s=running_time:desc` | 抓那个跑了 10分钟的大查询 |

### 六、💡 小技巧：如何通过 curl 执行？

在 Linux 终端中，你可以直接这样用（假设 ES 在 localhost:9200）：

```bash
# 简单查看
curl -X GET "localhost:9200/_cat/health?v"

# 如果有账号密码 (X-Pack Security)
curl -u elastic:password -X GET "localhost:9200/_cat/nodes?v"
```

