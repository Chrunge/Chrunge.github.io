---
title: SQL 
top: false
cover: false
toc: true
mathjax: true
date: 2023-04-09
password:
description: CMU15-445数据库的学习笔记
tags:
- C++
- Sqlite
- 15-445
categories:
- Database
---

## 前置笔记
1. [sqlite的下载与安装](https://www.tutorialspoint.com/sqlite/sqlite_installation.htm)
2. [检查sqlite是否正常工作](https://sqlite.org/cli.html#getting_started)
3. 数据包md5检查与解压: `md5sum filename`, `gunzip filename`
4. 

## Sqlite3

1. 连接数据库: sqlite3 database_name.db
1. 查看所有table: .tables
3. 查看table schema: .schema table_name
4. 创建索引: CREATE INDEX index_name ON table_name (colomn_name)
5. 退出: .quit
<!-- more -->

## CTE(Common Table Expressions)
1. [CTE](https://sqlite.org/lang_with.html)分为odinary and recursive, odinary相当于将nested queries提取出来作为temporary view, 使表达更加清楚. Recursive用于遍历Tree和Graph.

## 字符串

1. 字符串连接符: `str1||str2`
2. 获取部分字符串: `substring(str, start_pos, end_pos);
3. 获取`xx`字符串的位置: `instr(str, 'xx')`
4. 匹配字符串:
   - `Like`: `%`表示0到多个数字或字符, `_`表示一个数字或字符; 不区分大小写
   - `Glob`: `*`同上, `?`同上; 区分大小写

### If...Condition

1. `IIF(expression, true_expression, false_expression);`
2. 替换NULL: `IFNULL(column, '替换字符`)
3.   ```
      CASE 
              WHEN ShipCountry IN ('USA', 'Mexico','Canada')
              THEN 'NorthAmerica'
              ELSE 'OtherPlace'
       END
       ```
3. 相当于:
   ```
   CASE
    WHEN expression
        THEN true_expression
    ELSE
        false_expression
   END  
   ```

### LIMIT, ORDER, Decimal, 

3. 限制行数: `LIMIT num`
4. 排序: `ORDER BY column [ASC,DESC]`
5. 保留两位小数: `Round(int1 * 1.0 / int2, 2);`

### Aggregation and Window Function

1. 筛选计数: `Sum(IFF(condition, 1, 0))`, 感觉是`count(*)`的通用版
2. 获取前一行的值: `LAG(expression, offest, default)`
3. 将row装入不同的bucket: `NTILE( num ) OVER (PARTITION BY colume1 ORDER BY colume2)`

## 日期

1. 计算日期差值: `JulianDay(Date1) - Julian(Date2)`

### 其他

1. md5检验: `md5sum filename`
2. `On` 和 `Where`的区别:
   - On: 在`left outer join`的时候, 左表的一些行, 右表没有对应行; 此时不论条件是否为真, 它都会返回左表的内容.
   - Where: 它是在临时表生成以后, 统一进行过滤; 此时会过滤掉判断为false的全部行
   - 举例: `t1 LEFT OUTER JOIN t2 ON t1.name = t2.name`: 即使t1.name在t2中没有对应行, 也不会被过滤掉.
         `t1 LEFT OUTER JOIN T2 WHERE t1.name = t2.name`: t1.name若在t2中没有对应行, 则会被过滤掉, `LEFT OUTER JOIN`就没有发挥应有的作用.

3. `Having` 和 `Where`的区别:
   - `Having`: 是一个过滤声明, 在**查询结果返回后, 对结果进行过滤**, 可以使用聚合函数, 配合`GOURP BY`使用
   - `Where`: 是一个约束声明, WHERE在**结果返回之前起作用**, 不能用聚合函数