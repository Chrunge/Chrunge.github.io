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

`_library/`、`_data/library*.json`、`_data/discovery.json` 和 `redirects/` 由脚本生成，不作为写作入口。

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
