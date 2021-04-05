---
title: markdown格式写作
top: true
cover: false
toc: true
mathjax: true
date: 2020-09-25 18:13:08
password:
summary: Markdown写作格式介绍，以及该博客的模板
tags:
- markdown 
- blog
categories:
- 工具
---

## **博客写作模板介绍**

```null
- title: 写作主题
- top: 文章是否置顶，置顶则首页推荐
- cover: 该文章是否需要加入到首页轮播封面中
- toc: 是否开启TOC(还不知道它的作用)
- mathjax: 是否开启数学公式支持
- date: 日期
- password: 该文章是否加密访问
- summary: 摘要
- tags:标签，可多个
- categories: 文章分类，建议只有一个分类

- img: 文章特征图
- coverImmg：文章在首页轮播时的图片
```


## **博客写作模板举例**

```null
title: typora-vue-theme主题介绍
date: 2018-09-07 09:25:00
author: 赵奇
img: /source/images/xxx.jpg
top: true
cover: true
coverImg: /images/1.jpg
password: - 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
toc: false
mathjax: false
summary: 这是你自定义的文章摘要内容，如果这个属性有值，文章卡片摘要就显示这段文字，否则程序会自动截取文章的部分内容作为摘要
categories: Markdown
tags:
  - Typora
  - Markdown
```

## **Markdown写作说明**

### 1. 标题

```null
# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题
```

# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

### 2. 序列

```null
- 无序列表
+ 无序列表
* 无序列表
```

- 无序列表


```null
有序列表
1. 一一 (有空格)
2. 二二
3. 三三
```

1. 有序列表
2. 有序列表

```null
三个空格代表下一级
```

- 一级无序
  - 二级无序
    - 三级无序

1. 一级有序
   1. 二级有序
      1. 三级有序

### 3. 写代码

```null
    `单行代码或文字中的短代码`

    多行代码有两种方式
    1.
    ```python(语言类型)
    多行代码
    多行代码
    ```
    2.
    或者使用tab键(1-2次)
```

这是我的代码`print("ok")`

```python
多
行
代
码
```

### 4. **加粗,斜体,斜体加粗,删除,注释,引用**

```null
*斜体*: Ctrl + I
**加粗**: Ctrl + B
***斜体加粗***
~~删除线~~: Alt + S
注释:command + /
引用(>):control + Q
```

**加粗**

*斜体*

***斜体加粗***

~~删除线~~

### 5. 图片引用,链接引用

```

![图片描述](链接的地址):control + shift + I
- 图片alt是显示在图片下方的文字
- 图片title是图片的标题，当鼠标移到图片上时显示的内容。title可加可不加

链接:[文本内容](链接的地址):control + shift + L
```

![猫猫](https://chrunge.github.io/medias/featureimages/16.jpg )

[该教程参考这里](https://www.jianshu.com/p/191d1e21f7ed)


### 6.  **引用,添加横线**

```
>这是引用内容
>>这也是引用内容
>>>这还是引用内容
```

>这是引用内容
>>这也是引用内容
>>>这还是引用内容

```
添加横线
--- 
----
***
****
```
--- 
----
***
****



### 7.表格
```
表格:
表头|表头|表头
---|:--:|---:
内容|内容|内容
内容|内容|内容
```

姓名|技能|排行
---|:--:|---:
刘备|哭|大哥
关羽|打|二哥
张飞|骂|三弟

### 8. 缩进

- 首行缩进，在段首使用&ensp
- 输入一个空格,使用&emsp

### **最后:参考链接**

[韦神的博客](https://godweiyang.com/2018/04/13/hexo-blog/)

[hexo-theme-matery](https://github.com/blinkfox/hexo-theme-matery)

[Markdown基本语法](https://www.jianshu.com/p/191d1e21f7ed)