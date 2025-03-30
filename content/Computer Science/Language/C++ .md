---
title: C++
top: false
cover: false
toc: true
mathjax: true
date: 2021-11-08 20:36:28
password:
description: different syntax in C++ compared to C
tags: C++
categories:
- Language
---


## **1. 介绍**

1. 输出与输入：`cout << "...." << endl;`</br>
    `cin >> variable`</br>
    `endl`表示换行符，会立即flush，刷新缓冲区；</br>
    `'\n'`和`"\n"`也表示换行符，但不会flush，前者表示一个字符，后者表示一个字符串；

2. `using namespace xx`: 声明xx的命名空间</br>
    `std`为系统的标准命名空间</br>
    `::`为作用域符号，如`xx::member`表示xx中的成员member; 也可以用于在class外面定义method</br>

3. `.cpp`存放class的定义；`.h`存放class的声明

## **2. 数据类型**

1. 基本数据类型: bool, char, int, float, double, void, wchar_t

2. 基本类型修饰符: signed, unsign, short, long

3. 枚举类型: 
    `enum color {red, green, blue} c;` 默认情况下， `red == 0`, `green ==1`...

## **3. 变量类型**

1. 变量(和函数)定义, 声明, 初始化: </br>
    变量只能定义一次, 但可以多次声明.
    `int a = 10`: 定义变量a为int类型, 声明变量a, 并进行初始化.(变量和函数定义时会附带声明, 但声明不会附带定义)

2. lvalue: 指向内存位置的表达式被称为左值（lvalue）表达式 </br>
    rvalue: 存储在内存中某些地址的数值, 是不能对其赋值的表达式

3. `0, '\0', '0'`区别: </br>
    0: 32bit 0 </br>
    '\0': 8 bit 0 </br>
    '0': ASCII为48, 00110000.

## **4. 数据作用范围**: 全局变量, 局部变量, 静态全局变量, 静态局部变量, 静态函数

1. 全局变量: 存储在静态存储区中, 作用范围为所有源文件, 生命周期为整个程序运行期间; 其他没有定义它的源文件, 需要用`extern`声明
2. 局部变量: 存储在stack中, 作用范围定义它的函数体内, 只在函数执行期间存在的
3. 静态全局变量: 存储在静态存储区中, 作用范围为该.cpp文件中, 生命周期为整个程序运行期间
4. 静态局部变量: 存储在静态存储区中, 作用范围为定义它的函数体内, 声明周期为整个程序运行期间.
5. static function(): 只能在声明它的文件中使用, 不能被其他文件使用

## **5. 常量**: 在运行期间不会改变, 也称字面量

1. 整数常量, 浮点常量, 布尔常量, 字符常量

2. 字符串常量: 如 string s = "hello world"

3. 定义常量: define 和 const
    1. `#define WIDTH 5` </br>
    2. `char * const p`: p is a **constant pointer** to char </br>
        `char const *p`or `const char *p`: p is a pointer to **constant char**. </br>
        `const char * const p`.
    3. 区别:
        - define是在预处理阶段进行字符串替换, 不分配内存, 不会进行类型检查, 生命周期结束于编译时期; 定义后可以取消定义
        - const在程序编译,运行时使用, 分配内存, 会进行类型检查, 生命周期与变量的作用范围类似; 定义时必须赋值

## **6. 类型限定符**: const, volatile, restrict, explicit

1. volatile variable: variable不放入register, 让程序直接从内存中读取变量. 
2. restrict: restrict 修饰的指针是唯一一种访问它所指向的对象的方式
3. explicit: 由explicit修饰的构造函数, 实例化时必须要进行显式调用, 不是`Dog d = "miaomiao"`(隐式调用), 而是`Dog d("miaomiao)`.

## **7. 存储类**: auto, register, static, extern, mutable, thread_local

1. auto: 根据返回值, 自动推断变量的类型
2. register: 定义存储在寄存器中而不是RAM中的局部变量
3. extern: 在一个文件中声明另一个文件定义的全局变量或函数。
4. thread_local: 声明的变量可以被其他线程访问, 且每一个线程拥有自己的副本. 副本随着线程创建出现, 线程销毁而销毁.
5. static: 
    - 静态成员变量是先于类的对象而存在
    - 这个类的所有对象共用一个静态成员
    - 修饰类public成员时, 可以直接通过class name::member调用(与Java类似). 

## **8. 条件判断**

1. 取最大值: `m = a > b ? a: b`

## **9. 函数**

1. 函数声明: `max(int, int)`, 可以不用指定参数名, 只需要参数类型
2. lambda表达式: 如`auto add = [](int a, int b) -> int { return a + b; };` </br>
   []用于捕获lambda外的变量, 以供lambda表达式使用:
    ```
    []：默认不捕获任何变量；
    [=]：默认以值捕获所有变量；
    [&]：默认以引用捕获所有变量；
    [x]：仅以值捕获x，其它变量不捕获；
    [&x]：仅以引用捕获x，其它变量不捕获；
    [=, &x]：默认以值捕获所有变量，但是x是例外，通过引用捕获；
    [&, x]：默认以引用捕获所有变量，但是x是例外，通过值捕获；
    [this]：通过引用捕获当前对象（其实是复制指针）；
    [*this]：通过传值方式捕获当前对象； 
    ```

## **10. 数组**

1. 初始化char数组时, 需要手动添加`'\0'`, 如` char a = ['k, 'k', '\0']`;
    `char a[] = "kk"`, 自动在末尾添加`'\0'`</br>
    `char a[7] = runoob`, 注意这里是7, 6会报错.
2. setw(int n)可以用来控制输出间隔
3. C/C++对char型数组做了特殊规定，直接输出首地址时，会输出数组内容。如果想得到地址，可采用 & 。

## **11. 引用 vs 指针**

1. C++ FAQ: *Even though a reference is often implemented using an address in the underlying assembly language, please do not think of a reference as a funny looking pointer to an object. A reference is the object. It is not a pointer to the object, nor a copy of the object. It is the object.*
2. 一般情况下, 可以将reference看作时objcet本身即可.
3. 但其实啊, 它有点类似const pointer, 并会automatic indirection(ie the compiler will apply the * operator for you.).
4. reference必须在定义时赋值, 且不能时nullptr.

## **12. 结构体**

1. class中默认成员访问为private, 而struct中默认public
2. class继承默认为private, struct中默认public(继承是怎从么回事???)

3. 结构体大小与内存对齐
4. C的结构体中不能有函数, C++可以</br> </br> </br>

## **1. 类与对象**

1. 在类内部定义的成员函数默认为`inline`的; 在外部定义的成员函数时, 格式为`return_type class_name:: function_name(){}`, 如果要inline, 则在前面加上inline.(inline有什么用?) 
2. `::‵前不加类名时, 表示全局函数或全局变量

3. 类访问修饰符: `public`, `protected`, `private`.
   - private: 在本类和friend类中可访问 
   - protected: 只在子类中可访问 

4. 构造函数, 析构函数, 拷贝函数:
   - 构造函数可以override, 使用初始化列表来初始化字段:`Line::Line(double len): length(len){}`相当于`length = len`
   - 析构函数没有返回值和参数, 内部使用`delete‵来释放资源.
   - 当类成员中含有指针类型成员或需要对其分配内存时，需要定义拷贝函数(最好是private) 
   - inline: 如果一个函数是内联的，那么在编译时，编译器会把该函数的代码副本放置在每个调用该函数的地方.(用空间换时间)</br>
     在类定义中的定义的函数都是内联函数，即使没有使用`inline`说明符。
   - friend函数: 友元函数有权访问类的所有私有（private）成员和保护（protected）成员。友元函数需要在类的定义中声明, 但是它并不属于类的成员函数。
   - this指针: 是指向自身object的**指针**
   - static: 静态成员只有一个副本, 静态成员的初始化不能在类的定义中.

## **2. 继承与多态**

1. 子类不继承父类的: 构造函数, 析构函数, 拷贝构造函数; 重载运算符; 友元函数
2. 多态需要`virtual`来创建虚函数, 进行**动态链接**子类`overwrite`的实现函数.</br>
   动态连接: 每个带有虚函数的类都有一个VTABLE, 子类的VTABLE继承父类的VTABLE, 并且会修改已被`overwrite`的函数的虚拟地址.
3. 纯虚函数: 该类为抽象类, 不可实例化, 同时需要子类实现该接口. 


## **3. 重载**

1. 函数重载(override): 函数同名但参数不同
2. 运算符重载: 如重载`+`运算符: `Box operator+(const Box&){...};`</br> </br> </br>


## **1. 异常处理**

## **2. 动态内存**

1. `new`动态分配内存, 并创建对象; `malloc`只分配内存; 都返回指针
2. `delete`与`free`类似, 释放内存

3. `delete`与`delete []`区别: 
   - 对于简单类型(如int, double, struct), 无论是数组还是非数组形式, `delete` and `delete []`的内存释放效果相同
   - 对于一组数组对象, 则需要调用`delete []`来释放内存

## **3. 模板**

1. 将`template <typename/class T>`放在类或者函数前面, `T`就是数据类型的placeholder.

## **4. 预处理与#,##运算符**

## **5. 信号**

1. `signal(registerd signal, signal handler)`, 使用handler函数处理信号
2. `raise(signal sig)`可以引发信号