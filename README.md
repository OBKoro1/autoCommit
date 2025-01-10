<div align="center"><a name="readme-top"></a>

![][image-banner]

# Auto Commit

一款专为 Visual Studio Code 开发的自动化提交工具。本插件支持在任意指定的时间范围内进行 Git commit 操作，能够灵活设置每日提交频率，并通过随机化提交次数使提交记录更显真实自然。无需常驻运行，仅需在必要时花费数分钟即可一键填充 GitHub 个人主页的活跃度图表。

**简体中文** · [繁体中文](./README.zh-TW.md) · [Changelog][release-link] · [Documents][wiki-setup-link] · [Feedback][github-issues-link] · [BugReport][github-issues-link]

<!-- SHIELD GROUP -->

[![][github-star-shield]][github-star-link]
[![][wiki-shield]][wiki-setup-link]
[![][release-maintenance-shield]][release-link]
[![][release-version-shield]][release-link]
[![][license-shield]][license-link]

</div>

<details>
<summary><kbd>📖 内容目录</kbd></summary>

#### 

- [✨ 使用效果](#-使用效果)
- [⚡️ 功能特性](#️-功能特性)
    - [快速便捷](#快速便捷)
    - [灵活控制](#灵活控制)
    - [安全保障](#安全保障)
    - [高效执行](#高效执行)
- [🛠️ 提交功能测试](#️-提交功能测试)
- [👋🏻 快速开始](#-快速开始)
    - [安装插件](#安装插件)
    - [插件入口](#插件入口)
    - [自动 commit 演示](#自动-commit-演示)
- [🔗 其他开源推荐](#-其他开源推荐)
    - [`1` koroFileHeader](#1-korofileheader)
    - [`2` stop-mess-around](#2-stop-mess-around)
    - [`3` web-basics](#3-web-basics)
- [❤️ 赞助](#️-赞助)
- [✉️ 联系我](#️-联系我)

####

<br/>

</details>

## ✨ 使用效果

1. 使用本插件来控制 commit 次数.
2. 如下图，你甚至可以规划一下`commit`次数，然后画出图形, 天空才是你的极限。

![image-demo-packman]


## ⚡️ 功能特性

### 快速便捷
- 一键快速提交：设置参数后即可快速执行批量 commit
- 后台运行：不影响其他工作（如编码、浏览网页等）
- 配置自动保存：成功运行后自动保存参数，免去重复设置

### 灵活控制
- 多时间范围选择：支持在单次操作中提交不同日期的 commit，包括过去和未来日期
- 提交频率自定义：可控制每个日期的 commit 次数，实现不同深浅的活跃度展示
- 随机化提交：
  - 支持随机 commit 次数，使提交记录更自然
  - 可在指定时间范围内随机选择空档日，增加真实性

### 安全保障
- 提交取消机制：支持在 commit 过程中取消并回滚到未提交版本
- 安全提示：当提交次数超过 100 次时，强制等待 10 秒确认，防止误操作
- 完善的日志系统：清晰记录插件运行状态，方便追踪

### 高效执行
- 优异性能：例如 187 次 commit 仅需 20 秒完成
- [了解更多：commit 次数与颜色的对应关系][wiki-color-and-commit-link]

## 🛠️ 提交功能测试

在[储存库][github-repo-link]使用[测试账号][github-profile-testing-link]测试的测试结果

| 当日真实日期 | 尝试提交到日期 | 提交结果 |
| --- | --- | --- |
| 2019 年 12 月 | 2017 年 10 月 | ✅ |
| 2020 年 1 月 | 2020 年 2 月 | ✅ |

> \[!TIP]
>
> 这个工具能在所有时间范围做提交 Commit，几个月之前或之后都可以

> \[!NOTE]
> 
> 具体能提交最早和最晚的日期没有测试过，有兴趣的可以试试~

## 👋🏻 快速开始

### 安装插件

在 VSCode 的扩展商店中搜索 `auto commit` 安装  
或点击 [[打开 Auto Commit 扩展页面]][vscode-marketplace-link] 安装 

### 插件入口

1. 打开 VSCode 的命令面板

> \[!TIP]
>  
> 快捷键 mac: `command + p` window: `ctrl + p`

2. 输入 `> auto commit` 将会看到如下图所示的命令选项

<!-- // ![image-vscode-searchbar-1] -->
![image-vscode-searchbar-2]

> \[!INPORTANT]
>  
> 注意要有`>`符号才能进入插件命令选项，否则就只会文件搜索而已。

3. 最后点击 `Auto Commit` 或是 `enter` 进入插件

### 自动 commit 演示

![image-demo-vscode]

> \[!CAUTION]
>
> 请注意，提交的 commit 会在 GitHub 上显示，所以请不要提交敏感信息

> \[!NOTE]
>
> 超详细的说明书：[文档][wiki-setup-link]，画图教学请看[这里][wiki-color-and-commit-link]

## 🔗 其他开源推荐

### `1` [koroFileHeader][suggest-koroFileHeader-link]

用于一键生成文件头部注释并自动更新最后编辑人和编辑时间、函数注释自动生成和参数提取。  
插件支持所有主流语言,功能强大，配置灵活方便，文档齐全，食用简单！  
插件从 2018 年 5 月维护至今, 3K+ Star，关闭 issue 300+
目前拥有 250K+的用户，VSCode 图表统计日安装用户 100 多-400 多人，帮助用户养成良好的编码习惯，规范整个团队风格。

![头部注释][suggest-koroFileHeader-demo-1]  

![函数注释][suggest-koroFileHeader-demo-2]

### `2` [stop-mess-around][suggest-stopmessaround-link]

减少摸鱼的时间和频率的 Chrome 插件：
在上班/学习期间很容易下意识的打开摸鱼网站，插件帮助我们减少摸鱼的时间和频率，提高我们上班和学习的效率，节省时间用于学习提升自己或者享受生活。

![suggest-stopmessaround-demo]

### `3` [web-basics][suggest-webbasics-link]

收集和整理了一个大厂前端需要掌握能力的仓库，其中分为 JS 基础能力，大厂场景题、大厂面试真题。  
希望能够帮助大家提升自己的能力，在面试的时候能够游刃有余，轻松拿到高薪 offer。  

![suggest-webbasics-source]

## ❤️ 赞助

开源不易，本插件的开发与维护全都是利用业余时间。  
开源工作对我来说就是用爱发电，从 18 年开始在社区开源到现在，可以说基本没有收益。  
如果觉得这个效率工具还不错, 对你有所帮助，就赞助支持一下我的工作并留个 Star 吧 ⭐️ ~

![image-donate]

## ✉️ 联系我

[掘金](https://juejin.im/user/78820536236951)、[前端进阶积累](http://obkoro1.com/web_accumulate/)、[公众号](https://user-gold-cdn.xitu.io/2018/5/1/1631b6f52f7e7015?w=344&h=344&f=jpeg&s=8317)、[GitHub](https://github.com/OBKoro1)、[微信](https://raw.githubusercontent.com/OBKoro1/articleImg_src/master/weibo_img_move/005Y4rCogy1fsnslyz5pnj309j0cdgm6.jpg):OBkoro1、邮箱：obkoro1@foxmail.com

<details><summary><h4>📝 许可证</h4></summary>

Copyright 2020 [OBKoro1][github-profile-link]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

</details>

Copyright © 2020 [OBKoro1][github-profile-link]. <br />

<!-- LINK GROUP -->

[github-profile-link]: https://github.com/OBKoro1  
[github-profile-testing-link]: https://github.com/koroTest  
[github-repo-link]: https://github.com/OBKoro1/autoCommit
[github-issues-link]: https://github.com/OBKoro1/autoCommit/issues/new/choose  
[github-star-shield]: https://img.shields.io/github/stars/OBKoro1/autoCommit  
[github-star-link]: https://github.com/OBKoro1/koro1FileHeader  
[license-shield]: https://img.shields.io/badge/license-MIT-blue  
[license-link]: https://github.com/OBKoro1/autoCommit/blob/master/LICENSE  
[release-version-shield]: https://img.shields.io/badge/版本打包-release-blue
[release-maintenance-shield]: https://img.shields.io/badge/2020年开源-持续维护-blue  
[release-link]: https://github.com/OBKoro1/autoCommit/releases  
[suggest-koroFileHeader-link]: https://github.com/OBKoro1/koro1FileHeader  
[suggest-koroFileHeader-demo-1]: https://raw.githubusercontent.com/OBKoro1/koro1FileHeader/master/images/example.gif  
[suggest-koroFileHeader-demo-2]: https://raw.githubusercontent.com/OBKoro1/koro1FileHeader/master/images/function-params.gif
[suggest-stopmessaround-link]: https://github.com/OBKoro1/stop-mess-around  
[suggest-stopmessaround-demo]: https://github.com/OBKoro1/stop-mess-around/blob/dev/static/example/run-introduction.gif?raw=true
[suggest-webbasics-link]: https://github.com/OBKoro1/web-basics  
[suggest-webbasics-source]: https://github.com/OBKoro1/web-basics/blob/main/static/web-basic-example.gif?raw=true
[vscode-marketplace-link]: vscode:extension/OBKoro1.autoCommit
[wiki-shield]: https://img.shields.io/badge/wiki文档-齐全详细-blue  
[wiki-setup-link]: https://github.com/OBKoro1/autoCommit/wiki/配置及使用说明  
[wiki-color-and-commit-link]: https://github.com/OBKoro1/autoCommit/wiki/GitHub设置私有项目刷commit以及commit的次数与颜色  

<!-- IMAGE GROUP -->

[image-banner]: https://raw.githubusercontent.com/OBKoro1/autoCommit/refs/heads/master/images/banner.svg
[image-demo-packman]: https://raw.githubusercontent.com/OBKoro1/autoCommit/refs/heads/master/images/commit_img.png
[image-demo-vscode]: https://raw.githubusercontent.com/OBKoro1/autoCommit/refs/heads/master/images/autoCommit.gif
[image-donate]: https://raw.githubusercontent.com/OBKoro1/koro1FileHeader/dev/images/pay.jpg
<!-- //[image-vscode-searchbar-1]: https://raw.githubusercontent.com/OBKoro1/autoCommit/refs/heads/master/images/command.png -->
[image-vscode-searchbar-2]: https://raw.githubusercontent.com/OBKoro1/autoCommit/refs/heads/master/videos/autocommit-activate.mp4

<!-- DEV LINK GROUP, if add new image commit following in link group while editing this file -->

<!-- [image-banner]: images/banner.svg -->
<!-- [image-vscode-searchbar-2]: images/command-2.gif -->

