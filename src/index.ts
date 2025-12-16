#!/usr/bin/env node

/**
 * Auto-Commit CLI
 * 自动生成 Git 提交，填充 GitHub 贡献图
 */

import { Command } from 'commander';
import * as path from 'path';
import { CLIOptions, ExecutionStatus } from './types';
import {
  loadConfigFromFile,
  saveConfigToFile,
  parseCliOptions,
  mergeConfigs,
  validateConfig,
  createSampleConfig,
  ConfigError,
} from './lib/config';
import { CommitExecutor, previewCommitPlan } from './lib/executor';
import { previewPlan } from './lib/scheduler';
import { interactiveConfig, confirmExecution, confirmCancel } from './lib/interactive';
import { configFileExists, getConfigFilePath, isGitRepository } from './utils';

const VERSION = '2.0.0';

const program = new Command();

// 进度条字符
const PROGRESS_CHARS = {
  filled: '█',
  empty: '░',
};

/**
 * 渲染进度条
 */
function renderProgressBar(current: number, total: number, width: number = 30): string {
  const percent = Math.round((current / total) * 100);
  const filled = Math.round((current / total) * width);
  const empty = width - filled;
  const bar = PROGRESS_CHARS.filled.repeat(filled) + PROGRESS_CHARS.empty.repeat(empty);
  return `[${bar}] ${percent}% (${current}/${total})`;
}

/**
 * 清除当前行并打印
 */
function printProgress(message: string): void {
  process.stdout.write(`\r\x1b[K${message}`);
}

/**
 * 主程序
 */
program
  .name('auto-commit')
  .description('🚀 自动生成 Git 提交，填充 GitHub 贡献图')
  .version(VERSION);

/**
 * run 命令 - 执行提交
 */
program
  .command('run')
  .description('执行自动提交')
  .option('-c, --config <path>', '配置文件路径')
  .option('-r, --repo <path>', 'Git 仓库路径')
  .option('--from <date>', '开始日期 (YYYY-MM-DD)')
  .option('--to <date>', '结束日期 (YYYY-MM-DD)')
  .option('--commits <number>', '每天提交次数', '3')
  .option('-m, --message <message>', '提交信息')
  .option('-f, --file <filename>', '提交文件名')
  .option('--random', '启用随机提交数')
  .option('--random-range <range>', '随机提交数范围 (如: 1-5)')
  .option('--interval', '启用间隔提交')
  .option('--interval-days <days>', '间隔天数', parseInt)
  .option('--skip-days <days>', '跳过天数', parseInt)
  .option('--push', '自动推送 (默认开启)')
  .option('--no-push', '不自动推送')
  .option('--dry-run', '预览模式，不实际执行')
  .option('-y, --yes', '跳过确认')
  .option('-s, --silent', '静默模式')
  .action(async (options: CLIOptions) => {
    try {
      // 1. 加载配置
      let config;

      // 优先使用命令行参数
      const cliConfig = parseCliOptions(options);

      // 尝试加载配置文件
      const fileConfig = loadConfigFromFile(options.config);

      if (fileConfig) {
        config = mergeConfigs(fileConfig, cliConfig);
      } else if (options.from && options.to) {
        // 使用命令行参数构建配置
        config = mergeConfigs(cliConfig);
        config.repoPath = config.repoPath || process.cwd();
      } else {
        // 进入交互模式
        console.log('📝 未找到配置文件，进入交互模式...\n');
        const interactiveResult = await interactiveConfig();
        config = mergeConfigs(interactiveResult);
      }

      // 2. 验证配置
      validateConfig(config);

      // 3. 预览计划
      const { plans, stats } = previewCommitPlan(config);

      if (!options.silent) {
        console.log('\n' + previewPlan(plans));
      }

      // 4. 预览模式直接返回
      if (options.dryRun) {
        console.log('\n🔍 预览模式 - 未执行任何提交\n');
        return;
      }

      // 5. 确认执行
      if (!options.yes) {
        const confirmed = await confirmExecution(stats.totalCommits);
        if (!confirmed) {
          console.log('\n❌ 已取消\n');
          return;
        }
      }

      // 6. 执行提交
      console.log('\n🚀 开始执行...\n');

      const executor = new CommitExecutor(config, {
        dryRun: options.dryRun,
        silent: options.silent,
        onProgress: (current, total) => {
          if (!options.silent) {
            printProgress(`⏳ 提交进度: ${renderProgressBar(current, total)}`);
          }
        },
        onStatus: (status) => {
          if (!options.silent) {
            console.log(`\n📢 ${status}`);
          }
        },
      });

      // 处理 Ctrl+C
      let interrupted = false;
      const handleInterrupt = async () => {
        if (interrupted) return;
        interrupted = true;

        console.log('\n\n⚠️  收到中断信号...');
        executor.cancel();

        const completedCommits = executor.getCompletedCommits();
        if (completedCommits > 0) {
          const shouldRollback = await confirmCancel(completedCommits);
          if (shouldRollback) {
            executor.rollback();
          }
        }

        process.exit(1);
      };

      process.on('SIGINT', handleInterrupt);

      const result = await executor.execute();

      // 移除中断处理
      process.removeListener('SIGINT', handleInterrupt);

      // 7. 输出结果
      console.log('\n');

      switch (result.status) {
        case ExecutionStatus.COMPLETED:
          console.log(`✅ 完成！共提交 ${result.completedCommits} 次\n`);
          break;
        case ExecutionStatus.CANCELLED:
          console.log(`⚠️  已取消，完成 ${result.completedCommits}/${result.totalCommits} 次提交\n`);
          break;
        case ExecutionStatus.FAILED:
          console.error(`❌ 执行失败: ${result.error}\n`);
          process.exit(1);
          break;
      }
    } catch (error) {
      if (error instanceof ConfigError) {
        console.error(`\n❌ 配置错误: ${error.message}\n`);
      } else {
        console.error(`\n❌ 错误: ${error instanceof Error ? error.message : error}\n`);
      }
      process.exit(1);
    }
  });

/**
 * init 命令 - 初始化配置文件
 */
program
  .command('init')
  .description('初始化配置文件')
  .option('-r, --repo <path>', 'Git 仓库路径 (默认: 当前目录)')
  .option('-f, --force', '覆盖已存在的配置文件')
  .option('-i, --interactive', '交互式配置')
  .action(async (options) => {
    try {
      const configPath = getConfigFilePath();

      // 检查配置文件是否已存在
      if (configFileExists() && !options.force) {
        console.log(`\n⚠️  配置文件已存在: ${configPath}`);
        console.log('   使用 --force 选项覆盖\n');
        return;
      }

      let config;

      if (options.interactive) {
        // 交互式配置
        config = await interactiveConfig();
      } else {
        // 使用默认配置
        const repoPath = path.resolve(options.repo || process.cwd());

        if (!isGitRepository(repoPath)) {
          console.error(`\n❌ "${repoPath}" 不是有效的 Git 仓库\n`);
          process.exit(1);
        }

        config = createSampleConfig(repoPath);
      }

      // 保存配置
      saveConfigToFile(config);

      console.log(`\n✅ 配置文件已创建: ${configPath}`);
      console.log('\n📝 请编辑配置文件，然后运行:');
      console.log('   auto-commit run\n');
    } catch (error) {
      console.error(`\n❌ 错误: ${error instanceof Error ? error.message : error}\n`);
      process.exit(1);
    }
  });

/**
 * preview 命令 - 预览提交计划
 */
program
  .command('preview')
  .description('预览提交计划')
  .option('-c, --config <path>', '配置文件路径')
  .option('--from <date>', '开始日期 (YYYY-MM-DD)')
  .option('--to <date>', '结束日期 (YYYY-MM-DD)')
  .option('--commits <number>', '每天提交次数', '3')
  .action(async (options: CLIOptions) => {
    try {
      // 加载配置
      const cliConfig = parseCliOptions(options);
      const fileConfig = loadConfigFromFile(options.config);

      let config;
      if (fileConfig) {
        config = mergeConfigs(fileConfig, cliConfig);
      } else if (options.from && options.to) {
        config = mergeConfigs(cliConfig);
        config.repoPath = config.repoPath || process.cwd();
      } else {
        console.error('\n❌ 请提供配置文件或使用 --from 和 --to 参数\n');
        process.exit(1);
      }

      // 验证配置
      validateConfig(config);

      // 生成并显示预览
      const { plans } = previewCommitPlan(config);
      console.log('\n' + previewPlan(plans, 30) + '\n');
    } catch (error) {
      if (error instanceof ConfigError) {
        console.error(`\n❌ 配置错误: ${error.message}\n`);
      } else {
        console.error(`\n❌ 错误: ${error instanceof Error ? error.message : error}\n`);
      }
      process.exit(1);
    }
  });

/**
 * rollback 命令 - 回滚提交
 */
program
  .command('rollback <count>')
  .description('回滚指定数量的提交')
  .option('-r, --repo <path>', 'Git 仓库路径 (默认: 当前目录)')
  .option('-y, --yes', '跳过确认')
  .action(async (count: string, options) => {
    try {
      const repoPath = path.resolve(options.repo || process.cwd());
      const commitCount = parseInt(count, 10);

      if (isNaN(commitCount) || commitCount < 1) {
        console.error('\n❌ 请输入有效的提交数量\n');
        process.exit(1);
      }

      if (!isGitRepository(repoPath)) {
        console.error(`\n❌ "${repoPath}" 不是有效的 Git 仓库\n`);
        process.exit(1);
      }

      // 确认
      if (!options.yes) {
        const confirmed = await confirmCancel(commitCount);
        if (!confirmed) {
          console.log('\n❌ 已取消\n');
          return;
        }
      }

      // 执行回滚
      const { rollbackCommits } = require('./lib/git');
      rollbackCommits(repoPath, commitCount);

      console.log(`\n✅ 已回滚 ${commitCount} 个提交\n`);
    } catch (error) {
      console.error(`\n❌ 错误: ${error instanceof Error ? error.message : error}\n`);
      process.exit(1);
    }
  });

// 默认命令 - 如果没有子命令，执行 run
program.action(async () => {
  // 如果没有参数，显示帮助
  if (process.argv.length <= 2) {
    program.help();
  }
});

// 解析命令行参数
program.parse();
