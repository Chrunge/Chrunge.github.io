---
layout: page
title: 关于这座小岛
permalink: /about/
---
你好，欢迎来到 **云海小鲸**。

这里收藏技术笔记、创作灵感，还有一些关于云朵与海的故事。愿你在这里找到一段安静的阅读时间。

## 按自己的喜好阅读

右上角的「主题」可以选择九种渐变配色或深海夜间视图。「沉浸」会收起导航和装饰，留下内容；按 Esc 或右下角按钮即可退出。

在文章和小说页面，你还可以调整字号、查看目录。阅读位置会保存在当前浏览器，下次打开时可选择接着读。

## 保持联系

喜欢这里的内容，可以通过 [RSS 订阅]({{ '/feed.xml' | relative_url }})接收更新。

{% if site.data.links.size > 0 %}
## 其他小岛
{% for link in site.data.links %}
- [{{ link.title }}]({{ link.url }})
{% endfor %}
{% endif %}

