# 云海小鲸

一个留白充足的个人博客，包含文章、角色画集与故事阅读。使用 Jekyll 生成静态页面，部署到 GitHub Pages。

## 已实现

- 首页只保留简介、最近文章与精选作品；移动端单列排版。
- 赤、橙、黄、绿、青、蓝、紫、彩色、白色九种渐变主题，以及夜间视图。右上角「主题」直接切换，选择保存在当前浏览器。
- 沉浸模式隐藏导航、页脚和首页装饰；右下角按钮或 Esc 可退出。
- 文章、小说、画集都有独立网址。文章目录、字号设置、代码复制、阅读位置恢复；画集连续／逐页浏览。
- Markdown 内容与页面模板、样式、交互分离；无需修改 JavaScript 就能更新文章与作品。
- 本地 CSS、系统字体，无前台样式 CDN 依赖。图片保留完整比例。
- SEO、RSS、站点地图、404 页面；支持 GitHub 项目子路径。

## 本地运行

需要 Ruby 3.3、Bundler。首次执行：

```sh
bundle install
bundle exec jekyll serve --host 127.0.0.1
```

打开 http://127.0.0.1:4000 。不要直接双击源目录的 index.html；它是 Jekyll 模板，需要先构建。

验证：

```sh
bundle exec jekyll build
python scripts/check_site.py _site
node --check assets/js/site.js
```

本次另提供 `.preview/site/` 本地预览，采用 LiquidJS 和 Markdown 渲染，在未安装 Ruby 时检查视觉与交互。它不是正式 Jekyll 构建，不能替代构建验证，也不要作为源码发布。预览可使用 `python -m http.server 4173 --bind 127.0.0.1 --directory .preview/site` 打开。

## GitHub Pages 部署

1. 将本目录源码上传到 GitHub 仓库的 `master` 分支，保留 `.github` 目录。不上传 `.preview`、依赖文件夹、备份和生成的 `_site`。
2. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 推送后在 Actions 查看 `Build and deploy Cloud Whale`。工作流先测试 `/path-check` 子路径，再读取 Pages 的域名与子路径，构建并发布。
4. 成功后打开 Pages 显示的网址。个人站点和项目站点都支持，无须硬编码仓库名。
5. 若使用自定义域名，在 Pages 设置域名并配置 DNS。首次构建通过后，建议生成并提交 `Gemfile.lock` 固定依赖版本。

发布目标为 https://chrunge.github.io ，源码仓库为 Chrunge/Chrunge.github.io。请选择 Actions 构建；本项目使用 Jekyll 4，不使用 Pages 的分支内置构建。

## 写文章与更新作品

- 文章：`_posts/YYYY-MM-DD-slug.md`；标题、日期、分类、`description`（短摘要）、`tags` 放在 YAML 头部，下面是 Markdown 正文。
- 画集：`_manga/*.md`；`cover` 为封面，`pages` 按阅读顺序列出图片路径。
- 小说：`_novels/*.md`；使用二级标题划分章节，页面自动生成目录。
- 友链：`_data/links.yml`；填写实际地址后在关于页面显示。
- 配色：`_data/themes.yml` 管理选项名称，`assets/css/themes.css` 管理颜色；`assets/css/site.css` 管理排版。
- 文章内图片建议写成 `![描述]({{ '/assets/images/uploads/example.png' | relative_url }})`。CMS 的 `/assets/` 图片也由内容模板补齐项目子路径。

原包的三篇演示文章已整理为简短示例，移除未实现功能的宣传；小说示例标为「故事片段」。可以直接替换为自己的正文。

## 可选评论与后台

评论默认关闭。要启用 Giscus：先启用仓库 Discussions 并安装 Giscus，再到 giscus.app 获取配置，将 `_config.yml` 中 `comments` 的 `repo`、`repo_id`、`category`、`category_id` 填完整，最后设置 `enabled: true`。未配置时不会显示假留言或错误组件。Giscus 需要 GitHub 登录，主题随网站同步。

`/admin/` 保留 Sveltia CMS 入口，需在 `admin/config.yml` 填写仓库并完成其 GitHub 认证后使用。当前未连接仓库，不出现在访客导航中。不要将访问令牌写入源码；也可直接通过 GitHub 编辑 Markdown，无需启用 CMS。外部 CMS 依赖仅在打开后台时加载。

## 架构与检查

见 [架构说明](docs/architecture.md)、[架构图](docs/architecture.svg) 和 [检查记录](docs/verification.md)。原始完整备份位于项目之外，未纳入部署内容。

## 阅读笔记与旧站迁移

本次导入四篇阅读笔记，正文保留，适配了网页标题层级。源目录 README 作为说明保存在 docs 中；导入文件校验记录见 docs/reading-import.json。

旧笔记已导入 _posts，旧框架已从主分支移除；原提交历史保留，备份分支为 archive/pre-cloud-whale-20261016。


日常写作与提交统一使用 `D:/Projects/jingxiaoshao-jekyll-site`。完整操作步骤见 [使用说明书](docs/使用说明书.md)。
