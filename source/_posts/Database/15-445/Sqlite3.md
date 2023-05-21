---
title: SQL 
top: false
cover: false
toc: true
mathjax: true
date: 2021-11-08 20:36:28
password:
description: 
tags:
- C++
- SQL
- CS15-445
categories:
- Database
---

## Sqlite3

1. 连接数据库: sqlite3 database_name.db
1. 查看所有的tables: .tables
2. 查看Schema: .schema table_name
3. 退出: .quit
<!-- more -->
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

## 

1. 计算日期差值: `JulianDay(Date1) - Julian(Date2)`


### 其他

1. md5检验: `md5sum filename`
2. `On` 和 `Where`的区别:
   - On: 在`left outer join`的时候, 左表的一些行, 右表没有对应行; 此时不论条件是否为真, 它都会返回左表的内容.
   - Where: 它是在临时表生成以后, 统一进行过滤; 此时会过滤掉判断为false的全部行
   - 举例: `t1 LEFT OUTER JOIN t2 ON t1.name = t2.name`: 即使t1.name在t2中没有对应行, 也不会被过滤掉.
         `t1 LEFT OUTER JOIN T2 WHERE t1.name = t2.name`: t1.name若在t2中没有对应行, 则会被过滤掉, `LEFT OUTER JOIN`就没有发挥应有的作用.

3. `Having` 和 `Where`的区别:
   - `Having`: 是一个过滤声明, 在查询结果返回后, 对结果进行过滤, 可以使用聚合函数, 配合`GOURP BY`使用
   - `Where`: 是一个约束声明, WHERE在结果返回之前起作用, 不能用聚合函数