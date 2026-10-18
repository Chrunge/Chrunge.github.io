---
title: CS61A:Stucture and Interpretion of Computer Science
top: true
cover: false
toc: true
mathjax: true
date: 2020-09-27 18:44:16
password:
description: Berkeley大学的SICP课程学习笔记
tags: [Python, Scheme, SICP, CS61A]
categories: 
- 计算机基础
---

## **Lecture 1: Intro**

### **这门课是什么?**

1. **这是一门管理复杂性的课程,需要**
    - 精通抽象;
    - 掌握编程范例
2. **对编程进行介绍**
   - 完全理解python的基础
   - 在大项目中融合许多观点
   - 计算机是如何解释编程语言的

3. **课程的形式:**
    - Lecture,Lab!!!,Discussion!!!,textbook(composingprograms.com)
    - 8 programming homeworks
    - 4 programming projects
    - 1 diagnostic quiz, 1 midterm exam, and 1 final exam
    - Lots of course support and a great community

4. **课程概览**
   - 要求:
      - Learn the fundamentals of programming
      - Become comfortable with Python
   - 每周内容:
      - Introduction
      - Functions
      - Data
      - Language
      - Objects
      - Evaluation
      - Paradigms
      - Applications

5. **表达式(Expression)**
   - 先从左到右计算操作数,然后再计算操作符
如:`add(2,3)`,Evaluate the operator and then the operand subexpressions
   - [Apply the function that is the value of the operator subexpression to the
arguments that are the values of the operand subexpression]

6. **实验:python的两个option**
    - -i 运行python脚本,并打开交互界面
    - -m doctest filename.py 运行文件中的测试文档.文件中测试代码的位置放在整个文件的开头,或紧接着对象声明语句的下一行.

## **Lecture 2: Functions**

1. **变量赋值**
    - 函数都可以赋值给变量
    - 函数具有动态改变功能:函数的返回值可以跟随参数的改变而改变
    - python有三种函数形式:
        - `built-in`内置函数,
        - `import`导入函数,
        - 和`def`自定义函数

2. **Environment Diagrams: Including:**

   - Code:Statements and expressions
   - Frames:Each name is bound to a value,and within a frame, a name cannot be repeated.

```python
Assignment Statements:
a = 1
b = 2
b, a = a+b, b
1.从等号右边开始,从左到右计算
2.将所有计算结果通过 = 进行赋值
```

1. **Defining Functions**
   - 目前所学过的抽象:赋值语句,函数定义
   - def statements的步骤:
        - 创建一个拥有签名的函数`<name> < formal parameters>`;
        - 编写函数主体部分的代码;
        - 在当前框架下,将函数绑定到函数名上.
        - 调用自定义函数的步骤:
           - 添加一个局部框架以创建一个新的环境;
           - 在新环境下,将函数的形参改为实参;
           - 并执行函数的主体代码

2. **Notes:**
   - 一个环境中有许多框架;一个变量的取值,依照局部框架->全局框架的顺序进行查找.
   - python文档测试代码:python -m doctest -v(显示) filename.py

3. **区分pure function 和 non-pure function**

## **Lecture 11: Functional Decomposition and Debugging**

### 异常机制

1. 当程序发生错误时，Python会触发异常
2. 异常可以通过程序处理，以使程序继续运行
3. 未处理的异常则会导致程序停止，并打印出堆栈记录

#### 1. 精通异常小提示

- 异常也是一种对象，由专门的类进行构造
- 异常机制可以进行非本地连续控制：比如f调用g，g调用h，h可以直接返回给f，跳过g。

#### 2. Raising Exceptions : Assert 语句

- 形式：`Assert <Conditon>, <String>`, 错误则打印`String`
- 若想增加执行效率,可关闭`Assert`语句,可使用`Python -0`,`0`代表优化,即把`__debug__`的值变成了`False`.(`Assert`语句由`__debug__`进行可控制)
- 主动触发异常:`raise <expression>`,`<expressiong>`必须是`BaseExpection`的子类或者实例,如`raise TypeError('Bad Argument')`
- 异常种类:
  - TypeError:函数参数类型错误
  - NameError:未找到变量名
  - KeyError:Dict中的Key错误
  - RuntimeError:解释器运行过程中发生的一些错误

#### 3. try语句处理异常

- 用于程序触发异常时,也不停止运行
- 形式:

```python
     try:
        <try suite>
    expect <exception class> as e:
        <expect suite>
```

- 先运行`<try suite>`,若有错误,则将异常类型赋值给`e`,并继续执行`<expect suite>`.

## **Lecture 12: Tree**

### 1. 数据类型的闭合属性

- 闭合是一种组合方法,即组合的结果也可以被组合,如List中包括List

- **闭合属性创造出了严格的等级结构**

- 想了解复杂的数据,可使用Box-and-Pointer notation(框指表示法)

#### 2. Slicing(切片)

- 可作用于list或者range,如list[:]

#### 3. 处理iterable的一些函数

- sum(iterable[,start])
- max(iterable[,key = func])
- max(a,b,c....[,key = func])
- all(iterable): 若若有bool(x)都为True,则返回True

#### 4. Tree

   1. 递归描述(Wooden Tree)
      - A tree has a root and a list of branches
      - Each branch is a tree
      - A tree with zero branch is called a leaf

   2. 相对描述(Family Tree)
      - Each location in a tree is called a node
      - Each node has a label that can be any value
      - One node can be a parent/child of another

   3. 例子有点难,[请看视频](https://www.youtube.com/watch?v=qFCJANh5ht8&list=PLx38hZJ5RLZcSO6VGvle_jaPHHSbdq1aX&index=4)

## **Lecture 13:Mutable Sequences**

### 1. 对象是什么

   1. 对象表示一些信息
   2. 对象包括数据和行为,将它们绑定在一起以形成抽象体
   3. 对象也可以表示事物,特性,交互和过程
   4. 对象的类型被称为类,类是python中最高级的值
   5. 面向对象编程:
      - 是组织大型程序的一种比喻说法
      - 其特殊的语义可以改进程序的构成
   6. 在python中,每一种值都是对象
      - 它们都有各自的属性
      - 所有的数据操作都通过对象的方法进行
      - 函数只能作一件事,而对象可以做许多与之相关的事情

      -
----
----

## **上面是su20课程，由于lab和homework都没有solution，现换到20_fall课程**

----
----

## **Lecture 13:Binary Numbers**

   1. 计算机为什么要用binary numbers, not base 10: 因为电子电位具有波动性,无法准确的表示0-9的电位,而只有表示0-1的电位时才具有可靠性.
   2. 如何表示负数: 规定第一位为符号位, 0为positive, 1为negetive; 将正数转化为对应的负数:首先将01对调, 然后加1, 如`010(2)->101->110(-2)`. 特例:`100(值为-4, 1为符号位)->011->100(值为4, 1不为符号位)`. 所以带符号的n个二进制的表示范围为`-2**(n-1) ~ 2**(n-1) -1`. 该表示法的优势, 加法直接对位相加即可.
   3. 如何表示小数:`(-+) mantissa * base ** (-+)expoenet` 以上都可用signed binary numbers表示, 则可计算小数部分.

## **Lecture 16:Mutable Functions**

### 1.Non-local Statement

   1. 作用：用于存储随时间改变的状态量，比如银行里的余额；Future assignments to that name change its pre-existing binding in the first non-local frame(python会一直往上查找nonlocal name)(an enclosing scope in python3 Docs) of the current environment in which that name is bind.
   2. `nonlocal`的变量名指向的是an enclosing scope中的绑定；不能与local frame中的变量名重合。
   3. 在执行function body前，python会对框架中的name进行预处理；In function body，all the instances of a name must refer to the same frame.
   4. 为使变量值随事件改变且不用nonlocal，也可以使用list等mutable sequence.

## **Lecture 17: Iterator**

   1. Iterator只在需要时进行计算, 如range(n,m), because Iterator compute result lazily; Iter(Iterable)返回一个Iterator, next(Iterator)则返回Iterator的下一个值.
   2. String, List, Dict, Set都可以变为Iterator,其中Dict的顺序是元素添加时的顺序(python3.6以后),且Dict在变为Iterator后,不能改变结果, 否则出错.
   3. `for i in Iterator: <suite>`只能使用一次, 因为它的指针会跟着移动,但`for i in list:<suite>`可以调用多次.
   4. 针对Iteration的内置函数, 如map(func, Iterable):take each element of Iterable to func, filter(func, Iterable):Stop computing only func(element) return True, zip(fir_Iterable, Sec_Iterable),reversed(sequence),它们返回Iterator which only compute result on demand; 如需查看全部Iterator的值,可使用list(Iterator), tuple(Iterator)或sorted(Iterator)
   5. 刚开始，generator由generator function返回, next(generator)则执行一次yield后暂停; yield from a 等于 for i in a: yield a.

## **Lecture 18: Object**

   1. Class比作图纸，Object则是图纸造出来的东西。Class结合了Data和Function, 比如String(或Int)是Class，而实际的字符串则是它的Object, append则是它的函数
   2. Object-Oriented Programming
      - 是一种组织程序的比喻, 它拥有Abstraction Barriers, and bundling together information and related behavior.
      - A metaphor for computation using distributed state.
        - Each object has its own state.(与其他对象区别开)
        - Each object also how to manage its own local state, based on method call.(使用方法调用来管理本地状态)
        - Method calls are messages passed between objects.（使用方法调用来传递消息）
        - Several objects may all instances of a common type.
        - Different types may related to each other.
   3. A class serves as a template for its instances.
      - Idea: Each bank account has a balance and a holder, and Account class should add those attritutes to each newly created instance.
      - Idea: All bank accounts should have withdraw and deposit behavior.
   4. 当实例化对象时, 第一步:调用类将创建一个Object(地址) 第二步: 执行类中的__init__初始化函数, 将Object绑定给self.
      - Object + Function = Method

## **Lecture 19:Inheritance**

   1. Function和Method的区别：Object + Function = Method
   2. 区分Class Attribute 和 Instance Attribute: self.attr_name为实例属性，其余为类属性
   3. 继承：子类继承父类的属性和方法，同时子类复写父类的属性和方法；被复写的属性和方法也可直接通过父类名调用。
   4. 继承的目的是提高代码的通用程度，减少工作量
   5. python支持多继承，Inheritance is best for representing is-a relationship；composition is best for representing has-a relationship.

## **Lecture 20: representations**

   1. 内置的一些函数名：
      - ```__str__```:is legible to humans; str is a Class, not a function;必须要类属性就行调用,实例属性调用__str__会被忽略
      - ```__repr__```:is legible to python, return a Python expression(string) that evaluates to an equal object; 必须要类属性就行调用,实例属性调用__repr__会被忽略; 如果没有发现__str__,则会使用__repr__
      - ```__bool__;__init__;__float__;__add__```

   2. Polymorphic function: A function that applies to many (poly) different forms (morph) of data; repr和str都具有多态性,可以接受不同类型的变量

   3. message passing: Objects interact by looking up attributes on each other (passing messages)
   4. The attribute look-up rules allow different data types to respond to the same message;  A shared message (attribute name) that elicits similar behavior from different object
   classes is a powerful method of abstraction
   5. Interface:具有一组共享的信息,和明确的实施规格;Interface只能被继承并在子类中重写方法,不能直接实例化;由于Python中具有多继承,则Interface可能很少用.
   6. Type Dispatching:当传入的参数的类型不确定时,通过判断参数类型来调用不同的方法.
   7. Type Coercion:与Type Dispatching不同,它将传入的参数类型转化为特定类型来实现参数类型统一化.

## **Lecture21:Compositon**

   1. To implement Linked List and Tree by using Class and recursive
   2. 递归:
      1. 想明白这个函数需要实现的功能
      2. 写出递归的base case
      3. 将大问题转化为次问题的变形形式
   3. 迭代:从基础问题开始,将小问题逐渐迭代为大问题.

## **Lecture22:Efficiency**

   1. 资源的使用-关于时间复杂度与空间复杂度的问题
   2. 区分O(n)与Theta of n

## **Lecture23: Decomposition**

   1. Modular Design:将大型程序的关键部分隔开，独立进行开发和测试
   2. set:
      1. 不包含没有重复的元素，时间复杂度为constant.
      2. Intersection and Union operations will create a new set.

## **Lecture24: Data Examples**

   关于map(), filter(), reduce()的用法

   ```python
   >>> def cube(x):
           return x*x*x
   >>> list(map(cube, range(1, 11)))
   [1, 8, 27, 64, 125, 216, 343, 512, 729, 1000]
   >>> def f(x):
       return x % 2 != 0 and x % 3 != 0
   >>> list(filter(f, range(2, 25)))
   [5, 7, 11, 13, 17, 19, 23]

   >>> def add(x,y):
           return x+y
   >>> reduce(add, range(1, 11))
   55
   ```

   关于any, all, count的用法

   ```python
   >>> any([True, False, False]) ## or的用法
   True

   >>> all([True, False, False]) ## and的用法
   False

   >>> [1, 2, 3, 4, 4].count(4) ##计算元素个数
   2
   ```

## **25:User**

   ***Doing with images makes symbols***

   **计算机发展现状:**

   这是80年代的视频, 说的是60年代时的计算机. 当时计算机第一次有了图形界面, 通过算法已经成功实现了机械制图, 电路制图和制作流程图等, 且操作起来非常智能化, 感觉电脑能懂我.

   **计算机科学家们的目标:**

   计算机科学家们的目标是让计算机对人类更加友好, 所以他们与普通人打交道, 了解他们需要什么, 如何使计算机的操作更加的方便, 使它更加符合人们的习惯, 例如, 直接用笔在pad上面书写; 绘画时, 直接将人物模型拖动到马模型上, 完成骑马模型.

   **学习方法->具体化:**

   但最重要的主题是, 如何让人们在短时间内掌握一项技能. 主讲人分享了一份调查报告和一份实际案例, 报告调查了100+科学家, 他们都在学习的过程中将抽象的东西具体化, 其中绝大部分可以将symbols转化为images; 少数科学家如Einstein甚至可以将抽象符号转化为实际事物来帮助记忆和学习. 人们并不善于处理抽象的东西, 而善于实际存在的事物, 其次是图片, 最后才是符号. 案例讲述的是一位20多年没有运动的女士, 通过实验人员的帮助, 一小时内学会了打网球, 从此开启了她的运动生涯, 甚至改变了她的人生. 实验过程中, 实验人员帮她排除了一切干扰, 让她先想像如何用拍击打网球, 然后实际操作.
   *综上, 学习过程中不要充满抽象符号, 毕竟它只是实际事物的抽象, 来源于实际. 若遗忘了实际事物, 抽象的东西也就没什么意义. 所以应更加依靠Doing and images来形成抽象, 从具体到抽象; 也只有真正从具体中提炼出了抽象, 明白了其中的过程, 才能从抽象到具体.

## **26:Ethical & Data:**

   由于科技领域发展的太快, 数据算法不断的进步, 导致出现了各种各样的问题. 如困于系统中的美团外卖员, 侵犯隐私的摄像头和人脸识别, 出狱人员的下次犯罪率. 虽然以前也有此种问题, 比如广告推送, 银行信用贷款等. 但现在是科技发展的太快, 以至于监管远远的被甩在了后面.
   但如果你以后想成为一个数据算法工程师, 我希望你能精通自己的技能, 让你设计算法更加的中立, 更加的人性化. 否则, 它可能会使许多无辜的人入狱(如缓刑与假释被拒), 使许多无辜的人面临生命危险(如外卖员), 侵犯他们的隐私(人脸识别), 侵犯他们的自由(棱镜计划-监控所有人, 包括总统). 而最终, 所有人都将困于系统, 包括你.
   当, 只有以后能在工作中想起这个问题, 并付出实践才有用.

## **27:Scheme**

1. primitive types: including numbers, booleans, symbols; and the expressions take a single step to evaluate. *Diffierent from python, a symbol in scheme is a type of value, and expressions can be evaluated to a symbol(python can not do it).*

2. Call expressions: `(<operator> <operand1> <operand2> ...)(- 1 2); (- 10 (+ 1 2))`
   1. build-in function:quotient, modulo, even?, odd?, null?

3. Special form: if, cond, define, lambda;
   1. if: `(if <predicate> <if-true> [if-false])`

   2. cond:

   ```scheme
   (cond
   (<p1> <e1>)
   (<p2> <e2>)
   ...
   (<pn> <en>)
   [(else <else-expression>)])
   ```

4. list:

   ```scheme
   scm> (define a (cons 1 (cons 2 (cons 3 nil))))
   scm> a
   (1 2 3)
   scm> (car a)
   1
   scm> (cdr a)
   (2 3)
   scm> (list 1 2 3)
   (1 2 3)
   ```

5. Built-In Procedures for Lists

   ```scheme
   scm> (null? nil)
   #t
   scm> (append '(1 2 3) '(4 5 6))
   (1 2 3 4 5 6)
   scm> (length '(1 2 3 4 5))
   5
   ```

6. define procedures, lambdas

   ```scheme
   (define <name> <expression>)
   scm> (define foo lambda (x y)(+ x y))
   ;定义variants foo
   foo
   scm> (define (foo x y) (+ x y))
   ;定义function foo
   foo

   (lambda (<param1> <param2> ...) <body>)
   scm> (lambda (x y) (+ x y))
   (lambda (x y) (+ x y))
   scm> ((lambda (x y) (+ x y)) 3 4))
   7
   ```

7. filter, 也许也存在map, reduce procedure.

   ```scheme
   (def (remove item lst)
   filter (lambda (x) (not (= x item)) lst)
   )
   ```

8. `=` can be used to compare numbers
   `eq?` used to compare two non-pairs, behaves like `is` in python
   `equal?` compare two pa irs

9. [Scheme specification](https://cs61a.org/articles/scheme-spec.html#set)
   [Scheme built-in procedure reference](https://cs61a.org/articles/scheme-builtins.html)

## **28:Expection(见Lecture11)**

**Handle Error**:

1. A built-in mechanism to declare and reponse to errors. So when an error occurs, python will raise an exception, and it can be handle by programmers, or the execuction will halt.
2. Exceptions are *objects*, they have classes with constructors. *They enable non-local continuations of control*: if f calls g and g calls h, exceptions can shift contorl from h to g without waitting for g to return.

## **29: Calculator**

1. 第一遍Reading没看懂, Lecture没看懂. 不过有一点心得体会, 关于SCIP是什么?
   在物质世界中, 宇宙是由原子构成的, 原子组成了各类物质, 比如树木, 斧头, 锯子等. 而在计算机这个宇宙中, 0101就代表原子, 它们组成了各种编程语言, 如JAVA, Python, C; 和各种程序, 如PS, Matlab, Firefox.
   对于砍伐不同大小的树木, 我们需要不同的工具, 小树需要斧子, 大树需要锯子. 而对于不同的问题, 我们也需要不同的编程语言来处理.
   SICP想告诉我们为何要这样设计编程语言和如何写程序, 即为何要这样设计斧头, 锯子和如何砍树. 斧头的刀刃应该设计的多锋利, 把柄应该设计的多长, 如何砍树才有效率, 这都是这门课程研究的问题.
   对于一个工具, 不论是编程语言还是斧头锯子, 如果你能从本质上来认识它, 即认识它发明的原因, 发明的过程和使用的方法. 那么不假时日, 你使用此剑就能达到如火纯青的地步, 先人剑合一, 最后则舍弃此剑, 飞花走石皆为剑.

2. 第二遍来了来了
   Preface:
   Machine languages: statements are interpreted by the hardware itself.
   High-level languages:statements & expressions are interpreted by another program or compiled (translated) into another language
      - Provide means of abstraction such as name, function, object and class.
      - Abstract away system details to be independent of hardware and operating system.
      - Attributes including: Syntax(how to write) and Semantics(how to evaluate)
      - to create a high-level language: Specification or canonical implemetation.
3. Goal: Creat a Scheme-Syntax calculator in Python.
   - Parsing: text => tokens => expression => values
   - text => tokens: **lexical analysis(tokenizer)**. Attributes: iterative, checks for malformed tokens, determines types of tokens, processes one line at a time.
   - tokens => expression: **Syntatic analysis**. Attributes: Tree recursive, balance parentheses, return tree sturcture(using Pairs instance to represent it), process multiple lines.
   - expression => values: First, to evaluate operand to values by recursive and dispatching types. Then combine these values to operator to evaluate result.
   - others: Exception handle.
4. REPL(Read_Eval_Print_Loop:交互式界面)

## **30: Interpreter**

None

## **31: Declarative programing, 32: Table, 33: Aggregation, 34: database**

**Procedural programing VS declarative Programing**: In Python, computational processes are described directly by the programmer. A declarative language abstracts away procedural details, instead focusing on the form of the result.
SQL is a example of decalrative language:

**Table:**

- A table with a single row can be created using **select** statement:

```SQL
select 38 as latitude, 122 as longitude, "Berkeley" as name;
38|122|Berkeley
```

- A multi-line table can be constructed by **union**, which combines the rows of two tables:

```SQL
select 38 as latitude, 122 as longitude, "Berkeley" as name union
   ...> select 42,             71,               "Cambridge"        union
   ...> select 45,             93,               "Minneapolis";
```

- A table can be given a name using a **create table** statement:

```SQL
  sqlite> create table cities as
   ...>    select 38 as latitude, 122 as longitude, "Berkeley" as name
select * from cities;
   38|122|Berkeley
   42|71|Cambridge
   45|93|Minneapolis
```

**Select Statement:**:

- select [column description] from [existing table name]:

```SQL
sqlite> select name, 60*abs(latitude-38) from cities;
   Berkeley|0
   Cambridge|240
   Minneapolis|420
```

- **where**:to filter the rows that are projected:

```SQL
sqlite> create table cold as
   ...>   select name from cities where latitude > 43;
```

- **Order by**: to express an ordering over the resulting table

```SQL
sqlite> select distance, name from distances order by -distance;
   84|Minneapolis
   48|Cambridge
   0|Berkeley
```

Joins: Data are combined by **joining** multiple tables together into one

```SQL
sqlite> create table temps as
   ...>   select "Berkeley" as city, 68 as temp union
   ...>   select "Chicago"         , 59         union
   ...>   select "Minneapolis"     , 55;
```

```SQL
sqlite> select * from cities, temps;
38|122|Berkeley|Berkeley|68
38|122|Berkeley|Chicago|59
38|122|Berkeley|Minneapolis|55
42|71|Cambridge|Berkeley|68
42|71|Cambridge|Chicago|59
42|71|Cambridge|Minneapolis|55
45|93|Minneapolis|Berkeley|68
45|93|Minneapolis|Chicago|59
45|93|Minneapolis|Minneapolis|55

sqlite> select name, latitude, temp from cities, temps where name = city;
  Berkeley|38|68
  Minneapolis|45|55
```

**Aggregation and Grouping:**

```SQL
sqlite> create table animals as
  ....>   select "dog" as name, 4 as legs, 20 as weight union
  ....>   select "cat"        , 4        , 10           union
  ....>   select "ferret"     , 4        , 10           union
  ....>   select "t-rex"      , 2        , 12000        union
  ....>   select "penguin"    , 2        , 10           union
  ....>   select "bird"       , 2        , 6;
```

- Aggregation:
  - max, min, sum，avg
  - count: The special count(*) syntax counts the number of rows.
  - distinct:The *distinct* keyword ensures that no repeated values in a column are included in the aggregation.

```SQL
sqlite> create table animals as
  ....>   select "dog" as name, 4 as legs, 20 as weight union
  ....>   select "cat"        , 4        , 10           union
  ....>   select "ferret"     , 4        , 10           union
  ....>   select "t-rex"      , 2        , 12000        union
  ....>   select "penguin"    , 2        , 10           union
  ....>   select "bird"       , 2        , 6;
sqlite> select max(legs) from animals;
4
sqlite> select sum(weight) from animals;
12056
sqlite> select min(legs), max(weight) from animals where name <> "t-rex";
2|

sqlite> select count(legs) from animals;
6
sqlite> select count(*) from animals;
6
sqlite> select count(distinct legs) from animals;
# distinct legs only keep the different legs.
2
```

**Group by and having:**

```SQL
sqlite> select legs, max(weight) from animals group by legs;
2|12000
4|20
sqlite> select weight from animals group by weight having count(*)>1;
# having [expression] can use [aggregation function] to get rid of some groups.
10
```

**Create Table and Drop Table:**

```Sql
sqlite> create table primes (n, prime);
sqlite> drop table primes;
sqlite> drop table if exists primes;
sqlite> create table primes (n unique, prime default 1); # 该列包括唯一值和默认值1
sqlite> create table if not exists primes (n, prime);
```

**Modifying Tables:**

- insert into

```Sql
sqlite> insert into primes values (2, 1), (3, 1);
sqlite> select * from primes;
2|1
3|1
sqlite> insert into primes(n) values (4), (5);
sqlite> select * from primes;
2|1
3|1
4|1
5|1
sqlite> insert into primes(n) select n + 4 from primes;
sqlite> select * from primes;
2|1
3|1
4|1
5|1
6|1
7|1
8|1
9|1
```

- update and delete from

```Sql
sqlite> update primes set prime = 0 where n > 2 and n % 2 = 0;
sqlite> update primes set prime = 0 where n > 3 and n % 3 = 0;
sqlite> select * from primes;
2|1
3|1
4|0
5|1
6|0
7|1
8|0
9|0
sqlite> delete from primes where prime = 0;
sqlite> select * from primes;
2|1
3|1
5|1
7|1
```

## **35: tail calls**

1. 函数式编程:
   - 所有函数都是纯函数
   - 不能重新赋值, 没有可变的数据类型
   - 变量和值永远的绑定在一起
   - 优点:
     - 该表达式的值与子表达式的执行顺序无关
     - 子表达式可以并行计算或按需计算
     - 参照透明(referential transparency): 当用子表达式的结果去替换子表达式时, 该表达式的结果不会发生改变.
   - 但是没有for, while循环

尾调用是一个函数在执行的最后调用另一个函数.

尾调用优化:尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用记录，因为调用位置、内部变量等信息都不会再用到了，只要直接用内层函数的调用记录，取代外层函数的调用记录就可以了。

函数调用自身，称为递归。如果尾调用自身，就称为尾递归。
尾递归(已暗含了尾调用优化):在函数式编程语言中（比如scheme)，由于没有for和while循环，所以必须实现尾递归. 即使程序的表面形式是递归的，但是程序所占用的调用栈空间是常数，即与for和while占用的空间相同。

```Scheme
;非尾递归优化
(define (factorial n)
(if (zero? n) 1
    (* n (factorial (- n 1)))
)
)

factorial(5) ;120

(define (factorial n k)
(if (zero? n) k
   (factorial (- n 1)
              (* k n))
))

(factorial 5 1) ;120
```

## **Final Example**

1. Tree:
   - 最重要的特性：Tree can contain other trees.
   - 学习recursive的一个重要原因：Tree processing often involves recursive calls on subtrees.

2. sovling problem steps:
   1. understand the question: 将一些抽象的语句转化为简单的案例实现（画图示意），以理解问题。
   2. 如果函数的参数中不能传递所需信息，则可以添加helper function。
   3. 递归的过程中，弄明白该传递什么参数。
   4. check answer: trace what the program would do.

3. How to design function：[《how to design programs》](https://htdp.org)
   1. From problems analysis to data definitions: 如何去表示数据，给出例子。
   2. signature, purpose statements, header: 知晓输入和输出，函数功能描述
   3. Functional **examples**: illustrate the function's purpose
   4. Funcion template: translate the data definitions into the outline of the function
   5. Function Definition: fill in the gap in the template. Exploit the purpose statements and examples.
   6. Testing

## **Conclusion**

1. Society
   1. For computer science, it not only includes about sovling resursion problems, but also about how to bulid software, and more important, is about the software's implication about the society and world. **Maybe what should not to bulid. Should we bulid this?**
      - To take a history course, a philosophy course and an ethics course.
      - Tim cook says: person data minimized, right to knowledge, right to access, right to security.
2. Software
   1. Does the system work correctly.
      - Uber self-driver killed the first person.
      - Amazon trained their AI to vet resume, and what AI excel to do is to recreate the history, which de-priorizes women.
3. **Life**
   1. Freedom
      - We can't sovle every problem, what we decide to work on actually influence what gets built in this world and also influence our own.  
      - Freedom means that you are selective and find something you are good fit. Maybe you good at it, like it, and it matters with the world.
   2. dual career: people in cs major and economics/ policy minor is better than one deep in single field.
   3. To pick up a bit of broader as a target rather than a concrete target like being a professor, and then to find what you want.
   4. Think of down the line, when we get through the tough time, we will come back better, stronger, more mature and able to solve hardship.
   5. **Don't compare. It is very internal thing of what are you doing, who do you want to be, how do you want to go through this world.**

## Lab,Homework and Project

### **Lab00**

   1. ls: lists all files in the current directory
   2. `cd <path to directory>`: change into the specified directory
   3. `mkdir <directory name>`: make a new directory with the given name
   4. `mv <source path> <destination path>`: move the file at the given source to the given destination

   5. python -i: 交互式界面
   6. python -m doctest: 进行文档测试
   7. python的浅复制：新瓶装旧酒

### **DISC00**

   1. 不懂则问, 本课程重要的不是让你如何去解决问题的, 而是让你的思维更加清晰, 去弄清你的疑惑之所在.
   2. 完成所有的家庭作业和实验练习,若时间充足,则还可完成extra practice.
   3. 在课前先阅读本章书籍.
   4. 在小组中学习, 去办公室.

### **数据挖掘课程**

   0. python数据类型: bool, int, float, str, list, tuple, dict, set.
   1. `list.extend('abc')`: 将sequence(如'abc')拆分为各个元素, 然后逐个添加.
   2. list, tuple, str all are sequences.
   3. `lst + lst, lst * 3` 执行lst串联.
   4. `a, b = 10, 20`: 对tuple(10, 20)进行unpack, 并赋值
   5. `for index, value in enumerate(s): print(index, value)`

**numpy.array数组:**

1. array的运算都是元素级的, 维度不统一时会进行广播; numpy的切片是**引用拷贝**, 与python中的浅拷贝不同; 如需复制则使用copy().
2. method:
   - `np.array(list)`:将list转化为ndarray对象; `astype()`:转换数据类型
   - `np.arange()`, `shape(形状), ndim(维度), dtype(元素数据类型相同), zeros, ones, empty(申请空间)`
   - `np.nditer(arr)`:(迭代每个元素)
   - `np.concatenate((arr1),(arr2))`:链接数组, `hstack()`:沿行堆叠, `bstack()`:沿列堆叠, `dstack()`:沿高度堆叠, `array_split()`:分割数组; 其他拆分同理
   - `where()`:在数组中**检索**某个值，然后返回获得匹配的索引
   - `sort()`: **排序**
   - **过滤**:如果索引处的值为 True，则该元素包含在过滤后的数组中;反之则不包括
3. **随机数**:
   - `randn()`:正态分布随机数
   - `rand(3,5)`:0~1的随机浮点数
   - `random.randint(10[, size=(3, 5)])`:0~10生成随机整数
   - `x = random.choice([3, 5, 7, 9], size=(3, 5))`基于值数组生成随机值
4. array索引:`arr[0, 2]`
5. 数据类型:
   - i - 整数
   - b - 布尔
   - u - 无符号整数
   - f - 浮点
   - c - 复合浮点数
   - m - timedelta
   - M - datetime
   - O - 对象
   - S - 字符串
   - U - unicode 字符串
   - V - 固定的其他类型的内存块 ( void )
6. [参考网址](https://www.runoob.com/numpy/numpy-sort-search.html)

**正则表达式：**

1. []表示匹配[...]中的所有字符(非字符串); ()捕获和分组; {n[,m]}代表匹配的次数.
2. (?:pattern)等非获取匹配不存储匹配的子字符串, 只用于返回完整的字符串.
3. [参考网址1](https://zh.wikipedia.org/zh-cn/%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F), [参考网址2](https://tool.oschina.net/uploads/apidocs/jquery/regexp.html)
4. [Python中的re正则表达式模块](https://www.w3school.com.cn/python/python_regex.asp)
