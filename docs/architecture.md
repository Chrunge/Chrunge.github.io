# 云海小鲸架构

![云海小鲸内容、构建与发布架构](architecture.svg)

本站以 Markdown 为内容源，由 Ruby 脚本整理目录与索引，再由 Jekyll 渲染为静态网站。GitHub Actions 负责检查和发布；阅读偏好保存在浏览器中。

## 内容与生成数据

| 来源 | 职责 | 网站入口 |
| --- | --- | --- |
| `_posts/` | 博客文章、随笔、阅读笔记 | 首页最近文章、博客、归档 |
| `_novels/分类/作品名/*.md` | 小说或知识专题，每个文件是一章 | 小说／专题书架、作品详情、章节阅读 |
| `_manga/`、`assets/images/` | 漫画资料及按顺序展示的图片 | 漫画、画集阅读 |
| `_config.yml`、`_data/themes.yml`、`_data/links.yml` | 站点参数、主题选项、友链 | 公共布局及关于页 |

`scripts/prepare_library.rb` 根据 `_novels` 的目录和文件生成作品、章序和导航，更新：

- `_library/`：作品详情页入口。
- `_data/library.json`、`_data/library_tree.json`：作品、章节与目录树。
- 章节头部的 `layout`、`book_id`、`chapter_index`、`permalink`。
- `redirects/`：已有 `legacy_url` 对应的旧文章地址跳转页。

`scripts/prepare_indexes.rb` 在章节网址生成后，读取文章、章节和画集资料，生成 `_data/discovery.json`。归档仅列博客文章；标签索引覆盖三类内容。

以上输出可重新生成，不是独立内容源。它们保留在仓库中，发布前仍会重新生成。章节文件名与作品目录影响网址，应保持稳定。

## 页面与浏览器交互

| 层 | 位置 | 作用 |
| --- | --- | --- |
| 栏目入口 | `index.html`、`blog.html`、`novels.html`、`manga.html`、`archive.html`、`tags.html`、`about.md` | 七个导航栏目；`works.html` 保留旧书架入口 |
| 页面模板 | `_layouts/` | 公共框架、文章、作品详情、章节、画集、跳转页 |
| 公共组件 | `_includes/` | 导航、主题面板、作品卡片、目录树、阅读工具及可选评论 |
| 样式 | `assets/css/site.css`、`themes.css`、`library.css`、`refresh.css` | 基础阅读排版、主题变量、章节书架、紧凑首屏与导航 |
| 交互 | `assets/js/theme-init.js`、`site.js`、`redirect.js` | 主题初始化、搜索与阅读工具、旧网址跳转 |

页面内容、目录链接和章节导航均由静态 HTML 提供。JavaScript 增强主题切换、搜索、沉浸、字号、代码复制与阅读记录；`localStorage` 保存当前浏览器的偏好和进度。首页品牌插图为透明 SVG。

Giscus 评论是独立可选服务，默认关闭。启用后留言存于 GitHub Discussions；站点本身不维护数据库或登录后台。

## 构建与发布

`.github/workflows/jekyll-gh-pages.yml` 在 `master` 推送、针对 `master` 的拉取请求及手动触发时执行：

1. 安装 Ruby、Python、Node 与项目依赖。
2. 运行书架及归档／标签生成脚本。
3. `check_content.rb` 检查公共 YAML 字段、日期、章目录完整性及网址唯一性；Node 检查脚本语法。
4. Jekyll 使用 `/path-check` 模拟子路径构建，`check_site.py` 检查链接、图片、主标题、重复 ID、锚点和路径前缀。
5. 非拉取请求构建读取 GitHub Pages 地址，生成正式页面并再次检查。
6. 上传站点产物并部署到 GitHub Pages。

拉取请求只做构建验证，不部署。仓库 Pages 的来源应设置为 GitHub Actions。

本地预览使用相同生成脚本和 Jekyll；`_site/` 是构建产物，`vendor/` 与 `.bundle/` 是可重新安装的本地依赖、配置或缓存，均不提交。操作步骤见[使用说明书](使用说明书.md)。
