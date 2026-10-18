# 云海小鲸架构

![云海小鲸内容、构建与发布架构](architecture.svg)

本站以 Markdown 为内容源，由 Ruby 脚本整理目录与索引，再由 Jekyll 渲染为静态网站。GitHub Actions 负责检查和发布；阅读偏好保存在浏览器中。

## 内容与生成数据

| 来源 | 职责 | 网站入口 |
| --- | --- | --- |
| `_posts/` | 博客文章、随笔、阅读笔记 | 首页最近文章、博客、归档 |
| `_novels/分类/作品名/*.md` | 小说或知识专题，每个文件是一章 | 小说／专题书架、作品详情、章节阅读 |
| `_manga/`、`assets/images/` | 漫画资料及按顺序展示的图片 | 漫画、画集阅读 |
| `_config.yml`、`_data/themes.yml`、`_data/links.yml`、`_data/tag_rules.yml` | 站点参数、主题选项、友链与标签分类规则 | 公共布局及关于页 |

`scripts/prepare_library.rb` 根据 `_novels` 的目录和文件生成作品、章序和导航，并按 `_data/tag_rules.yml` 收拢计算机标签，更新：

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
| 公共组件 | `_includes/` | 公共页头与页脚、脚本入口、主题面板、卡片、目录树、续读卡片与阅读工具 |
| 样式 | `assets/css/site.css`、`themes.css`、`library.css`、`refresh.css`、`reader.css` | 基础阅读排版、主题变量、章节书架、紧凑首屏、卡片描边与阅读增强 |
| 交互 | `assets/js/` | 按主题、阅读、图表、图片放大、画集及跳转拆分 |

页面内容、目录链接和章节导航均由静态 HTML 提供。JavaScript 增强主题切换、搜索、沉浸、字号、代码复制与阅读记录；`localStorage` 保存当前浏览器的偏好和进度。首页品牌插图为透明 SVG。

### 交互模块边界

- `theme-init.js`：样式加载前恢复主题，避免主题闪烁。
- `site.js`：主题面板、搜索、沉浸、图片失败重试；通过 `whale:theme`、`whale:layout` 事件通知其他模块。
- `reading.js`：字号、代码角标与复制、正文及桌面目录、章节快捷键、正文进度和首页续读。首页用构建时生成的内容目录校验续读网址，已删除内容不会继续展示。
- `gallery.js`：连续／逐页切换、方向键、当前与相邻图片预加载，仅在画集页加载。
- `lightbox.js`：原生 `dialog` 图片查看器，负责缩放、拖动、焦点与底层滚动恢复；响应图表的 `whale:zoom` 事件。
- `diagrams.js`：识别 Mermaid 代码块，仅在存在图表时加载固定版本 Mermaid 11.12.0（jsDelivr）；严格模式渲染 SVG，并移除图表链接。主题变化会重绘；失败保留可复制的源码并允许重试。`whale:diagrams-ready` 事件让续读等待排版稳定。

`_includes/scripts.html` 管理页面需要的脚本，公共框架只负责组合页头、正文插槽、页脚。Markdown 仍由构建期 Kramdown/Rouge 渲染；没有新增浏览器 Markdown 解析器或 Hash 路由。

阅读记录仅存于当前浏览器，保留按网址进度与最后章节，并新增最近一次阅读摘要；首页只展示一项。清除记录会删除阅读进度及最后章节，保留主题、字号。桌面侧目录只在足够宽的屏幕显示，手机与沉浸模式使用文内折叠目录。

Giscus 评论是独立可选服务，默认关闭。启用后留言存于 GitHub Discussions；站点本身不维护数据库或登录后台。

## 构建与发布

`.github/workflows/jekyll-gh-pages.yml` 在 `master` 推送、针对 `master` 的拉取请求及手动触发时执行：

1. 安装 Ruby、Python、Node 与项目依赖。
2. 运行书架及归档／标签生成脚本。
3. `check_content.rb` 检查公共 YAML 字段、日期、章目录完整性及网址唯一性；Node 检查全部交互脚本语法。
4. Jekyll 使用 `/path-check` 模拟子路径构建，`check_site.py` 检查链接、图片、主标题、重复 ID、锚点和路径前缀。
5. 独立构建测试站点，运行 Playwright 检查图表、弹窗、续读、键盘与失败兜底；测试使用本地安装的固定版本 Mermaid，不依赖 CDN 可用性。
6. 非拉取请求构建读取 GitHub Pages 地址，生成正式页面并再次检查。
7. 上传站点产物并部署到 GitHub Pages。

拉取请求只做构建验证，不部署。仓库 Pages 的来源应设置为 GitHub Actions。

本地预览使用相同生成脚本和 Jekyll；`_site/` 是构建产物，`vendor/` 与 `.bundle/` 是可重新安装的本地依赖、配置或缓存，均不提交。操作步骤见[使用说明书](使用说明书.md)。

浏览器检查：`npm ci --prefix tests`，`node tests/node_modules/playwright/cli.js install chromium`，构建后执行 `node tests/reading.cjs _site`。这些依赖只用于开发检查，发布站点不包含 Node、测试文件或测试依赖。
