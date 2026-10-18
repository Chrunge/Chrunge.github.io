# 云海小鲸

个人博客与作品书架，使用 Jekyll 构建，由 GitHub Actions 检查并部署到 GitHub Pages。

- 网站：<https://chrunge.github.io/>
- 仓库：<https://github.com/Chrunge/Chrunge.github.io>，发布分支 `master`
- 本地源码：使用自己的克隆目录；文档以 `D:\Projects\personal-blog` 为示例
- [使用说明书](docs/使用说明书.md)：写作、图片、手动提交、预览与排错
- [架构说明](docs/architecture.md) · [架构图](docs/architecture.svg)：源码、生成数据与发布流程
- [维护历史](docs/HISTORY.md)：迁移、改版、问题排查与清理记录
- [素材致谢与授权](THIRD_PARTY_NOTICES.md)

导航：首页、博客、[周朝史](https://chrunge.github.io/Zhou-Dynasty-Timeline/)、[作品](https://chrunge.github.io/works/)、归档、标签、关于。作品收录小说、专题笔记与漫画。

日常更新只需编辑 Markdown 和图片，提交并推送。Pages 来源使用 **GitHub Actions**；发布前的内容生成、检查和部署由工作流完成。

## 提交邮箱与隐私

在 GitHub「Settings → Emails」启用隐藏邮箱，复制 GitHub 为账户提供的 noreply 地址。在本地仓库目录执行（将占位内容替换为自己的地址）：

```powershell
git config user.email "ID+username@users.noreply.github.com"
git config --get user.email
```

此设置只影响该仓库之后创建的提交。网页端提交也应启用邮箱隐私保护；它不会清除旧提交中的真实邮箱。修改当前文件同样不会删除 Git 历史、他人的克隆或外部缓存。

公开仓库中的 Markdown 源码也是公开内容；`published: false` 只控制网页展示。私人原稿和脱敏前备份应保存在仓库外，不应提交。详细操作见[使用说明书](docs/使用说明书.md)。
