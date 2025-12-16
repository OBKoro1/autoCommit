# Auto-Commit CLI

🚀 自动生成 Git 提交，填充 GitHub 贡献图（绿格子）的命令行工具。

基于 [OBKoro1/autoCommit](https://github.com/OBKoro1/autoCommit) 重构，从 VSCode 扩展改为独立的 CLI 工具，更简洁、易用、健壮。

## 特性

- 📅 **多日期范围支持** - 可配置多个日期范围，每个范围独立设置提交数
- 🎲 **随机提交数** - 可选随机化每天的提交数量，使贡献图更自然
- ⏰ **间隔提交** - 可选跳过某些天，避免连续提交看起来不自然
- 🔄 **自动推送** - 提交完成后自动推送到远程仓库
- ↩️ **安全回滚** - 支持取消操作和回滚已完成的提交
- 📝 **配置文件** - 支持配置文件，方便重复使用
- 🖥️ **交互模式** - 提供友好的交互式配置向导
- 🔍 **预览模式** - 执行前可预览提交计划

## 安装

### 从源码安装

```bash
# 克隆仓库
git clone https://github.com/Lynthar/autoCommit.git
cd autoCommit

# 安装依赖
npm install

# 构建
npm run build

# 全局链接（可选）
npm link
```

### 直接使用

```bash
# 不安装，直接运行
npx auto-commit-cli
```

## 快速开始

### 方式一：交互模式（推荐新手）

```bash
auto-commit run
```

如果没有配置文件，会自动进入交互式配置向导：

```
🚀 Auto-Commit CLI 交互式配置向导

──────────────────────────────────────────────────
📁 Git 仓库路径 (默认: 当前目录): /path/to/repo
✅ 仓库路径: /path/to/repo

📄 提交文件名 (默认: commit.md):

💬 提交信息 (默认: auto commit):

📅 配置日期范围
--- 日期范围 #1 ---
   开始日期 (YYYY-MM-DD): 2024-01-01
   结束日期 (YYYY-MM-DD): 2024-06-30
   每天提交次数 (默认: 3):

🎲 随机提交设置
   是否启用随机提交数? (Y/n):

⏰ 间隔提交设置
   是否启用间隔提交? (Y/n):

📤 推送设置
   提交完成后自动推送? (Y/n):
```

### 方式二：命令行参数

```bash
# 基本用法
auto-commit run --from 2024-01-01 --to 2024-06-30

# 完整参数
auto-commit run \
  --repo /path/to/repo \
  --from 2024-01-01 \
  --to 2024-06-30 \
  --commits 5 \
  --message "daily update" \
  --random \
  --random-range 1-5 \
  --interval \
  --push
```

### 方式三：配置文件

1. 初始化配置文件：

```bash
auto-commit init
# 或交互式初始化
auto-commit init -i
```

2. 编辑 `.autocommitrc.json`：

```json
{
  "repoPath": "/path/to/your/repo",
  "commitFile": "commit.md",
  "commitMessage": "auto commit",
  "dateRanges": [
    {
      "start": "2024-01-01",
      "end": "2024-03-31",
      "commitsPerDay": 3
    },
    {
      "start": "2024-04-01",
      "end": "2024-06-30",
      "commitsPerDay": 5
    }
  ],
  "randomCommits": true,
  "randomCommitRange": [1, 5],
  "intervalCommit": true,
  "intervalDays": 7,
  "skipDays": 2,
  "autoPush": true
}
```

3. 执行：

```bash
auto-commit run
```

## 命令详解

### `run` - 执行提交

```bash
auto-commit run [options]

选项:
  -c, --config <path>       配置文件路径 (默认: .autocommitrc.json)
  -r, --repo <path>         Git 仓库路径 (默认: 当前目录)
  --from <date>             开始日期 (YYYY-MM-DD)
  --to <date>               结束日期 (YYYY-MM-DD)
  --commits <number>        每天提交次数 (默认: 3)
  -m, --message <message>   提交信息 (默认: auto commit)
  -f, --file <filename>     提交文件名 (默认: commit.md)
  --random                  启用随机提交数
  --random-range <range>    随机提交数范围 (如: 1-5)
  --interval                启用间隔提交
  --interval-days <days>    间隔天数 (默认: 7)
  --skip-days <days>        每个间隔跳过的天数 (默认: 2)
  --push                    自动推送 (默认开启)
  --no-push                 不自动推送
  --dry-run                 预览模式，不实际执行
  -y, --yes                 跳过确认
  -s, --silent              静默模式
```

### `init` - 初始化配置

```bash
auto-commit init [options]

选项:
  -r, --repo <path>   Git 仓库路径 (默认: 当前目录)
  -f, --force         覆盖已存在的配置文件
  -i, --interactive   交互式配置
```

### `preview` - 预览计划

```bash
auto-commit preview [options]

选项:
  -c, --config <path>   配置文件路径
  --from <date>         开始日期
  --to <date>           结束日期
  --commits <number>    每天提交次数
```

示例输出：

```
📅 提交计划预览
────────────────────────────────────────
📊 统计信息:
   • 总天数: 120 天
   • 总提交: 360 次
   • 日期范围: 2024-01-01 ~ 2024-04-30
   • 平均每天: 3 次

📋 详细计划:
   2024-01-01: ███ (3)
   2024-01-02: █████ (5)
   2024-01-03: ██ (2)
   2024-01-05: ████ (4)
   ... 还有 116 天
────────────────────────────────────────
```

### `rollback` - 回滚提交

```bash
auto-commit rollback <count> [options]

参数:
  count               要回滚的提交数量

选项:
  -r, --repo <path>   Git 仓库路径 (默认: 当前目录)
  -y, --yes           跳过确认
```

## 配置文件详解

完整的配置文件示例：

```json
{
  "repoPath": "/path/to/your/repo",
  "commitFile": "commit.md",
  "commitMessage": "auto commit",
  "dateRanges": [
    {
      "start": "2024-01-01",
      "end": "2024-06-30",
      "commitsPerDay": 3
    }
  ],
  "randomCommits": true,
  "randomCommitRange": [1, 5],
  "intervalCommit": true,
  "intervalDays": 7,
  "skipDays": 2,
  "autoPush": true
}
```

### 配置项说明

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `repoPath` | string | 必填 | Git 仓库的绝对路径 |
| `commitFile` | string | `commit.md` | 用于记录提交的文件名 |
| `commitMessage` | string | `auto commit` | 提交信息 |
| `dateRanges` | array | 必填 | 日期范围配置数组 |
| `dateRanges[].start` | string | 必填 | 开始日期 (YYYY-MM-DD) |
| `dateRanges[].end` | string | 必填 | 结束日期 (YYYY-MM-DD) |
| `dateRanges[].commitsPerDay` | number | 必填 | 每天提交次数 (1-88) |
| `randomCommits` | boolean | `false` | 是否启用随机提交数 |
| `randomCommitRange` | [number, number] | `[1, 5]` | 随机提交数范围 |
| `intervalCommit` | boolean | `false` | 是否启用间隔提交 |
| `intervalDays` | number | `7` | 间隔天数 |
| `skipDays` | number | `2` | 每个间隔跳过的天数 |
| `autoPush` | boolean | `true` | 是否自动推送 |

## 使用场景

### 场景一：补充历史提交

```bash
# 补充过去一年的提交
auto-commit run --from 2023-01-01 --to 2023-12-31 --random --interval
```

### 场景二：预设未来提交

```bash
# 预设未来一个月的提交
auto-commit run --from 2024-07-01 --to 2024-07-31 --commits 2
```

### 场景三：测试提交（不推送）

```bash
# 只在本地生成提交，不推送
auto-commit run --from 2024-01-01 --to 2024-01-31 --no-push
```

### 场景四：预览计划

```bash
# 查看将会生成的提交计划
auto-commit run --from 2024-01-01 --to 2024-06-30 --dry-run
```

## 安全特性

1. **取消保护**: 在执行过程中可以按 `Ctrl+C` 取消，会提示是否回滚已完成的提交

2. **大量提交保护**: 当提交数量超过 100 次时，推送前会等待 10 秒，给用户取消的机会

3. **配置验证**: 执行前会严格验证配置，避免无效操作

4. **Git 仓库检查**: 自动检测目录是否是有效的 Git 仓库

## 与原项目的区别

| 特性 | 原 VSCode 扩展 | CLI 版本 |
|------|---------------|----------|
| 运行环境 | 需要 VSCode | 独立命令行 |
| 配置方式 | GUI 表单 | 配置文件/命令行/交互 |
| 依赖 | VSCode API、Vue、Element UI | 仅 commander |
| 代码量 | ~2000 行 | ~1000 行 |
| 可移植性 | 仅 VSCode | 任何终端 |
| 自动化 | 手动触发 | 可集成到脚本/CI |

## 开发

```bash
# 安装依赖
npm install

# 开发模式（监听文件变化）
npm run dev

# 构建
npm run build

# 本地测试
npm start run --help

# 全局链接测试
npm link
auto-commit --help
```

## 目录结构

```
auto-commit-cli/
├── src/
│   ├── index.ts           # CLI 入口
│   ├── types.ts           # 类型定义
│   ├── lib/
│   │   ├── config.ts      # 配置管理
│   │   ├── git.ts         # Git 操作
│   │   ├── scheduler.ts   # 日期调度
│   │   ├── executor.ts    # 执行引擎
│   │   └── interactive.ts # 交互模式
│   └── utils/
│       └── index.ts       # 工具函数
├── dist/                  # 编译输出
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT

## 致谢

感谢 [OBKoro1](https://github.com/OBKoro1) 的原始 [autoCommit](https://github.com/OBKoro1/autoCommit) 项目提供的灵感。
