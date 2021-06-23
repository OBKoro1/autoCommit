# autoCommit
> 用于刷commit记录，可以刷过去几年的commit以及未来的commit, 一键帮你把github首页的绿色格子填满。

* 它是一个VScode插件可以自由控制commit日期(提交过去几年的commit以及未来的commit)
* 它可以自由控制commit次数, 固定或者随机commit次数。
* 插件提供完善的日志: 清晰的了解插件的运行情况


### 使用效果

1. 使用本插件来控制commit次数.
2.  如下图，你甚至可以规划一下`commit`次数，然后画出图形, 天空才是你的极限。

![image](https://github.com/OBKoro1/autoCommit/blob/master/images/commit_img.png?raw=true)

#### 自动commit演示：

![image](https://github.com/OBKoro1/autoCommit/blob/master/images/autoCommit.gif?raw=true)

### 功能特性

* **一键提交**: 设置好参数之后，一键超快提交`commit`
* **选择多个日期范围**：一次操作即可提交不同日期`commit`, **还可以提交过去/未来日期的commit**。
* **控制每个日期的commit次数**: 可以用它来控制绿色格子的颜色，了解[commit次数与颜色](https://github.com/OBKoro1/autoCommit/wiki/GitHub%E8%AE%BE%E7%BD%AE%E7%A7%81%E6%9C%89%E9%A1%B9%E7%9B%AE%E5%88%B7commit%E4%BB%A5%E5%8F%8Acommit%E7%9A%84%E6%AC%A1%E6%95%B0%E4%B8%8E%E9%A2%9C%E8%89%B2#commit%E6%AC%A1%E6%95%B0%E4%B8%8E%E9%A2%9C%E8%89%B2)
* **随机commit次数**：随机commit次数让我们的提交看起来更加逼真。
* **间隔提交commit**: 在一定的时间长度内，随机选取几天不提交commit
* 取消commit: 用于在`commit`期间取消并回滚到未提交版本
* 超过100次提交，将强制考虑10秒是否要取消commit。
* 插件成功运行后，将自动保存配置参数，无须每次都要一通操作。
* 提供完善的日志: 清晰的了解插件的运行情况
* 后台运行，不影响编码、浏览网页等。
* 运行超快，如下图187次commit，20秒搞定。
* **觉得插件还不错的话，点个Star吧~**

#### 提交以前和未来的commit

在19年12月我创建了一个测试账号：[koroTest](https://github.com/koroTest)，经过测试：

1. 成功提交17年的10月份的commit。
2. 现在2020年1月份，成功提交了2020年2月份的commit。
3. 具体能提交最早和最晚的日期没有测试过，有兴趣的可以试试~

### 仓库地址:

[autoCommit](https://github.com/OBKoro1/autoCommit)

### 安装

在 Vscode 扩展商店中搜索`Auto Commit`,点击安装即可。

### 插件入口

1. 使用快捷键打开VSCode的命令面板。
    * `mac`: `command + p` window: `ctrl + p`
2. 输入`> auto commit将会看到如下图所示的命令选项，然后用鼠标点击或者回车都可启动插件。
    
    * 注意有`>`符号，老是用人不知道怎么用 o(╥﹏╥)o
    * 实际上可以输入下方选项的任何一段文字，都可以匹配到插件命令选项。

![image](https://github.com/OBKoro1/autoCommit/blob/master/images/command.png?raw=true)

### 文档

* [配置及使用说明](https://github.com/OBKoro1/autoCommit/wiki/%E9%85%8D%E7%BD%AE%E5%8F%8A%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E)
* [GitHub设置私有项目刷commit以及commit的次数与颜色](https://github.com/OBKoro1/autoCommit/wiki/GitHub%E8%AE%BE%E7%BD%AE%E7%A7%81%E6%9C%89%E9%A1%B9%E7%9B%AE%E5%88%B7commit%E4%BB%A5%E5%8F%8Acommit%E7%9A%84%E6%AC%A1%E6%95%B0%E4%B8%8E%E9%A2%9C%E8%89%B2)

### 插件声明

[autoCommit](https://github.com/OBKoro1/autoCommit)是本人兴之所至创建的个人项目，仅用于学习交流，禁止任何人商用以及用于非法之途。

插件如构成侵权，请通过邮件联系我。

### 其他开源推荐

#### koroFileHeader

1. 它是用于生成文件头部注释以及函数注释的，帮助我们养成良好的编码习惯，规范整个团队风格。
2. 插件从18年5月维护至今, 2.7K+ Star，插件支持所有主流语言,功能强大，灵活方便，文档齐全，食用简单！

![头部注释](https://raw.githubusercontent.com/OBKoro1/koro1FileHeader/master/images/example.gif)

![函数注释](https://github.com/OBKoro1/koro1FileHeader/raw/master/images/function-params.gif?raw=true)

#### stop-mess-around

chrome插件**通过强制的手段禁止大家浪费时间摸鱼**，在上班/学习期间下意识的打开摸鱼网站, 自动检测摸鱼网站, 提示激励信息后, 关闭摸鱼网站。

![](https://github.com/OBKoro1/stop-mess-around/raw/dev/static/start.gif?raw=true)

### License

[MIT](http://opensource.org/licenses/MIT)

### Star一下吧

如果插件觉得还不错的话，就给个 [Star](https://github.com/OBKoro1/autoCommit) ⭐️ 鼓励一下我吧~

[前端进阶积累](http://obkoro1.com/web_accumulate/)、[公众号](https://user-gold-cdn.xitu.io/2018/5/1/1631b6f52f7e7015?w=344&h=344&f=jpeg&s=8317)、[GitHub](https://github.com/OBKoro1)、[微信](https://raw.githubusercontent.com/OBKoro1/articleImg_src/master/weibo_img_move/005Y4rCogy1fsnslyz5pnj309j0cdgm6.jpg):OBkoro1、邮箱：obkoro1@foxmail.com

