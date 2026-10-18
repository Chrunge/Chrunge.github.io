# 云海小鲸

使用 Jekyll 生成、由 GitHub Actions 检查并发布到 GitHub Pages 的个人博客。

- 网站：<https://chrunge.github.io/>
- 仓库：<https://github.com/Chrunge/Chrunge.github.io>，发布分支 `master`
- 本地目录：`D:/Projects/个人Blog`
- [使用说明书](docs/使用说明书.md)：添加文章、章节和漫画，手动提交与排错
- [架构说明](docs/architecture.md) · [架构图](docs/architecture.svg)

## 内容放在哪里

| 内容 | 编辑位置 |
| --- | --- |
| 博客文章、随笔 | `_posts/`：文件名使用 `YYYY-MM-DD-slug.md` |
| 小说、课程、工具手册 | `_novels/分类/作品名/`：一份 Markdown 是一章 |
| 漫画、画集 | `_manga/`：`pages` 按阅读顺序列出图片 |
| 图片 | `assets/images/` |
| 栏目入口（作品、博客、归档、标签、关于等） | `pages/` |

`_library/`、`_data/library*.json`、`_data/discovery.json` 和 `redirects/` 由脚本生成，不作为写作入口。

主导航：首页、博客、[周朝史](https://chrunge.github.io/Zhou-Dynasty-Timeline/)、[作品](https://chrunge.github.io/works/)、归档、标签、关于。作品统一收录小说、专题和漫画。

## 根目录与栏目入口

博客、作品、小说书架、漫画、归档、标签和关于的7个入口文件集中放在 `pages/`。首页 `index.html`、错误页 `404.html`、`_config.yml`、`Gemfile` 和项目说明保留在根目录。`_posts/`、`_novels/`、`_manga/`、`_layouts/`、`_includes/`、`_data/` 继续使用 Jekyll 的约定位置。

栏目网址由文件头部的 `permalink` 固定，例如 `pages/about.md` 仍发布到 `/about/`。新增栏目放在 `pages/` 并显式设置 `permalink`；导航继续使用网站网址，不要改成 `/pages/...` 的源码路径。

## 发布

编辑后提交并推送到 `master`，GitHub Actions 会自动更新书架与索引、检查内容信息、构建页面并检查链接，成功后发布。日常更新可使用 GitHub Desktop 或 GitHub 网页，不要求本机安装 Ruby。

仓库 **Settings → Pages → Source** 应使用 **GitHub Actions**。发布状态见 [Actions](https://github.com/Chrunge/Chrunge.github.io/actions)，工作流名称为 `Build and deploy Cloud Whale`。

## 本地预览与检查

需要 Ruby 3.3、Bundler；Windows 原生扩展安装可能需要 RubyInstaller 开发工具。先在本目录执行 `bundle install`，然后：

```powershell
ruby scripts/prepare_library.rb
ruby scripts/prepare_indexes.rb
ruby scripts/check_content.rb
bundle exec jekyll serve --host 127.0.0.1
```

打开 <http://127.0.0.1:4000>。正式页面检查还需 Python 3：

```powershell
bundle exec jekyll build
python scripts/check_site.py _site
```

不要直接双击源目录的 `index.html`。它包含模板语法，需要先由 Jekyll 构建。


第三方角色素材的署名、来源与授权范围见 [素材致谢与授权](THIRD_PARTY_NOTICES.md)。
