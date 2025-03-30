---
title: Computer Architecture - useful C functions
top: false
cover: false
toc: true
mathjax: true
date: 2021-08-21 16:03:35
password:
description:
tags:
- C
- CS61C
categories:
- Language
---

## C函数库函数

1. `int feof(FILE * stream);` 检测到文件结束标示返回1, 否则返回0
   - 当文件内部位置指针指向文件结束时，并未立即置位FILE结构中的文件结束标记，只有再执行一次读文件操作，才会置位结束标志，此后调用`feof()`才会返回为真。
<!--more-->
2. `#define EOF (-1)`: 为End of file的缩写, `fgetc()`和`getc()`返回EOF时并不一定能表示文件结束, 当读取文件出错时也会返回EOF; 因此，我们需要`feof()`来判断文件是否结束.

3. `int fgetc(FILE *stream)`: 该函数以无符号`char`强制转换为`int`的形式返回读取的字符，如果到达文件末尾或发生读错误，则返回 EOF。

4. `int strcmp(const char *str1, const char *str2)`: 
    - 如果返回值小于 0，则表示 str1 小于 str2。
    - 如果返回值大于 0，则表示 str1 大于 str2。
    - 如果返回值等于 0，则表示 str1 等于 str2。
5. `char *strcpy(char *dest, const char *src)`: 该函数返回一个指向最终的目标字符串 dest 的指针。

6. `int fprintf(FILE *stream, const char *format, ...)`
   - `stream` 指向 FILE 对象的指针，该 FILE 对象标识了流。 
   - `format` 为C字符串。

7. `char *strdup(const char *s)`: This function returns a pointer to a null-terminated byte string, which is a duplicate of the string pointed to by s. The memory obtained is done **dynamically using malloc** and hence it can be freed using free().

8. 测量程序运行时间：
   1. 使用Linux命令：

      ```N
      time ./program

      real    0m29.313s
      user    0m29.043s
      sys     0m0.136s
      ```

   2. C函数库

      ```N
      #include <time.h>

     clock_t start, end;
     double cpu_time_used;

     start = clock();
     ... /* Do the work. */
     end = clock();
     cpu_time_used = ((double) (end - start)) / CLOCKS_PER_SEC;
     ```

### C语言注意事项

1. 通过指针引用的字符串，指针的值可以变；而通过数组名引用的字符串，**数组名的值为常数，不能变**。
2. 指针指向的**字符串常量**，其内容不可修改 。
3. C会在字符串后面自动添加`\0`，所以`总长度 = strlen(str) + 1`。
4. C语言的四种存储类型：auto(局部) static（整个运行期间不释放） register（寄存器） extern（外部变量声明）
5. `struct`的内存计算：
   - 有效对齐值：是给定值`#pragma pack(n)`和结构体中最长数据类型中的较小值（即<=n, n一般为4)
   - 结构体大小为有效对齐值的整数倍；结构体中每个成员相对于结构体首地址的偏移量（offset）都是成员大小的整数倍  
6. sizeof陷阱：
   1. 它是操作符，不是函数。
   2. sizeof能求出静态分配数组的大小，如`int temp[10]; sizeof(temp) == 40`为正， 但动态分配的数组，只能求出指针的大小。
7. 循环使用`pthread_create()`创建子线程时, 不能在同一个循环中调用`pthread_join()`, 因为一旦调用`pthread_join`,主线程就会被堵塞, 不能继续创建剩下的子线程, 此时的情况就相当于`serial computation`.
   - 需要在后面加另一个循环, 然后逐个`pthread_join()` 
   - `pthread_create()`中的每个线程接受的参数, 需要单独的存储空间. 如果共用一个存储空间, 则可能在该线程还未使用该参数时, 里面的值就被改变了, 被用于下个线程的创建.
8. C语言中的逻辑false: `0, NULL, '\0'`


## 字符串函数库

1. `strcpy()`：复制字符串。
   `strncpy()`：复制字符串，有长度限制。

   `strcat()`：连接两个字符串。
   `strncat()`：连接两个字符串，有长度限制。

   `strcmp()`：比较两个字符串。
   `strncmp()`：比较两个字符串，有长度限制。

   `strlen()`：返回字符串的字节数。

2. `char* strchr(char* str, int c);`: 查找指定字符, 返回该字符的指针
   `char* strrchr(char *str, int c);`: 反向查找指定字符
   `size_t strspn(char* str, const char* accept);`: 查找第一个不属于指定字符集范围内的字符串长度
   `size_t strcspn(char *str, const char *reject);`：查找第一个属于指定字符集范围的字符

   `char* strpbrk(const char* s1, const char* s2);`: 返回s1中第一个**属于s2字符集的字符**的指针

   `char *strstr( const char* str, const char* substr);`: 在`str`中查找子字符串`substr`, 并返回`str`中指向`substr`的指针

   `char* strtok(char* str, const char* delim);`: `strtok()`用来将一个字符串按照指定的分隔符(delimiter), 分解成一系列词元(tokens)。详细使用请见[阮一峰老师的C语言教程]((https://wangdoc.com/clang/lib/string.h.html#strchrstrrchr)).



## 参考文档

1. [阮一峰C语言教程](https://wangdoc.com/clang/lib/string.h.html#strchrstrrchr)