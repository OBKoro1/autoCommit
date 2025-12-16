/**
 * 交互式配置模块
 */

import * as readline from 'readline';
import * as path from 'path';
import { Config, DateRange, DEFAULT_CONFIG } from '../types';
import { isGitRepository, isValidDateFormat, formatDate } from '../utils';

/**
 * 创建 readline 接口
 */
function createReadline(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * 提问并获取输入
 */
async function question(rl: readline.Interface, prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * 提问并获取确认
 */
async function confirm(rl: readline.Interface, prompt: string, defaultValue: boolean = true): Promise<boolean> {
  const defaultStr = defaultValue ? 'Y/n' : 'y/N';
  const answer = await question(rl, `${prompt} (${defaultStr}): `);

  if (answer === '') {
    return defaultValue;
  }

  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

/**
 * 提问并获取数字
 */
async function questionNumber(
  rl: readline.Interface,
  prompt: string,
  defaultValue: number,
  min?: number,
  max?: number
): Promise<number> {
  while (true) {
    const answer = await question(rl, `${prompt} (默认: ${defaultValue}): `);

    if (answer === '') {
      return defaultValue;
    }

    const num = parseInt(answer, 10);
    if (isNaN(num)) {
      console.log('❌ 请输入有效的数字');
      continue;
    }

    if (min !== undefined && num < min) {
      console.log(`❌ 数字不能小于 ${min}`);
      continue;
    }

    if (max !== undefined && num > max) {
      console.log(`❌ 数字不能大于 ${max}`);
      continue;
    }

    return num;
  }
}

/**
 * 提问并获取日期
 */
async function questionDate(
  rl: readline.Interface,
  prompt: string,
  defaultValue?: string
): Promise<string> {
  const defaultStr = defaultValue ? ` (默认: ${defaultValue})` : '';

  while (true) {
    const answer = await question(rl, `${prompt}${defaultStr}: `);

    if (answer === '' && defaultValue) {
      return defaultValue;
    }

    if (!isValidDateFormat(answer)) {
      console.log('❌ 日期格式无效，请使用 YYYY-MM-DD 格式');
      continue;
    }

    return answer;
  }
}

/**
 * 交互式获取日期范围
 */
async function questionDateRanges(rl: readline.Interface): Promise<DateRange[]> {
  const ranges: DateRange[] = [];

  console.log('\n📅 配置日期范围');
  console.log('   (可添加多个日期范围，每个范围可设置不同的每日提交数)\n');

  // 默认日期：过去30天到今天
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const defaultStart = formatDate(thirtyDaysAgo);
  const defaultEnd = formatDate(today);

  while (true) {
    const rangeIndex = ranges.length + 1;
    console.log(`\n--- 日期范围 #${rangeIndex} ---`);

    const start = await questionDate(
      rl,
      '   开始日期 (YYYY-MM-DD)',
      rangeIndex === 1 ? defaultStart : undefined
    );

    const end = await questionDate(
      rl,
      '   结束日期 (YYYY-MM-DD)',
      rangeIndex === 1 ? defaultEnd : undefined
    );

    const commitsPerDay = await questionNumber(
      rl,
      '   每天提交次数',
      3,
      1,
      88
    );

    ranges.push({ start, end, commitsPerDay });

    const addMore = await confirm(rl, '\n   是否添加更多日期范围?', false);
    if (!addMore) {
      break;
    }
  }

  return ranges;
}

/**
 * 交互式获取完整配置
 */
export async function interactiveConfig(): Promise<Config> {
  const rl = createReadline();

  console.log('\n🚀 Auto-Commit CLI 交互式配置向导\n');
  console.log('─'.repeat(50));

  try {
    // 1. 仓库路径
    let repoPath: string;
    while (true) {
      const input = await question(rl, '📁 Git 仓库路径 (默认: 当前目录): ');
      repoPath = input || process.cwd();
      repoPath = path.resolve(repoPath);

      if (!isGitRepository(repoPath)) {
        console.log(`❌ "${repoPath}" 不是有效的 Git 仓库（缺少 .git 目录）`);
        continue;
      }

      console.log(`✅ 仓库路径: ${repoPath}`);
      break;
    }

    // 2. 提交文件
    const commitFile = await question(rl, '\n📄 提交文件名 (默认: commit.md): ') || 'commit.md';

    // 3. 提交信息
    const commitMessage = await question(rl, '\n💬 提交信息 (默认: auto commit): ') || 'auto commit';

    // 4. 日期范围
    const dateRanges = await questionDateRanges(rl);

    // 5. 随机提交
    console.log('\n🎲 随机提交设置');
    const randomCommits = await confirm(rl, '   是否启用随机提交数?', true);

    let randomCommitRange: [number, number] = [1, 5];
    if (randomCommits) {
      const min = await questionNumber(rl, '   最少每天提交', 1, 1, 88);
      const max = await questionNumber(rl, '   最多每天提交', 5, min, 88);
      randomCommitRange = [min, max];
    }

    // 6. 间隔提交
    console.log('\n⏰ 间隔提交设置 (使提交看起来更自然)');
    const intervalCommit = await confirm(rl, '   是否启用间隔提交?', true);

    let intervalDays = DEFAULT_CONFIG.intervalDays!;
    let skipDays = DEFAULT_CONFIG.skipDays!;
    if (intervalCommit) {
      intervalDays = await questionNumber(rl, '   每隔多少天', 7, 2, 30);
      skipDays = await questionNumber(rl, '   跳过几天', 2, 1, intervalDays - 1);
    }

    // 7. 自动推送
    console.log('\n📤 推送设置');
    const autoPush = await confirm(rl, '   提交完成后自动推送?', true);

    console.log('\n' + '─'.repeat(50));
    console.log('✅ 配置完成！\n');

    rl.close();

    return {
      repoPath,
      commitFile,
      commitMessage,
      dateRanges,
      randomCommits,
      randomCommitRange,
      intervalCommit,
      intervalDays,
      skipDays,
      autoPush,
    };
  } catch (error) {
    rl.close();
    throw error;
  }
}

/**
 * 交互式确认执行
 */
export async function confirmExecution(totalCommits: number): Promise<boolean> {
  const rl = createReadline();

  try {
    console.log(`\n⚠️  即将执行 ${totalCommits} 次提交`);
    const confirmed = await confirm(rl, '确认执行?', true);
    rl.close();
    return confirmed;
  } catch (error) {
    rl.close();
    throw error;
  }
}

/**
 * 交互式确认取消
 */
export async function confirmCancel(completedCommits: number): Promise<boolean> {
  const rl = createReadline();

  try {
    console.log(`\n⚠️  已完成 ${completedCommits} 次提交`);
    const confirmed = await confirm(rl, '是否回滚这些提交?', true);
    rl.close();
    return confirmed;
  } catch (error) {
    rl.close();
    throw error;
  }
}
