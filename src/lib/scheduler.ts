/**
 * 日期调度模块
 * 负责生成提交计划
 */

import { Config, DayCommitPlan, CommitDetail } from '../types';
import { getDateRange, randomInt, randomTimeOnDate, compareDates } from '../utils';

/**
 * 从配置生成每日提交计划
 */
export function generateDayPlans(config: Config): DayCommitPlan[] {
  const dateCommitMap = new Map<string, number>();

  // 1. 处理所有日期范围，合并重复日期
  for (const range of config.dateRanges) {
    const dates = getDateRange(range.start, range.end);

    for (const date of dates) {
      // 如果日期已存在，取较大的提交数
      const existing = dateCommitMap.get(date) || 0;
      const newCommits = range.commitsPerDay;
      dateCommitMap.set(date, Math.max(existing, newCommits));
    }
  }

  // 2. 转换为数组
  let plans: DayCommitPlan[] = Array.from(dateCommitMap.entries()).map(
    ([date, commits]) => ({ date, commits })
  );

  // 3. 按日期排序
  plans.sort((a, b) => compareDates(a.date, b.date));

  // 4. 应用随机提交数
  if (config.randomCommits) {
    plans = applyRandomCommits(plans, config.randomCommitRange);
  }

  // 5. 应用间隔提交（跳过某些天）
  if (config.intervalCommit) {
    plans = applyIntervalSkip(plans, config.intervalDays, config.skipDays);
  }

  return plans;
}

/**
 * 应用随机提交数
 */
function applyRandomCommits(
  plans: DayCommitPlan[],
  range: [number, number]
): DayCommitPlan[] {
  const [min, max] = range;
  return plans.map((plan) => ({
    ...plan,
    commits: randomInt(min, max),
  }));
}

/**
 * 应用间隔跳过
 * 在每 intervalDays 天内随机跳过 skipDays 天
 */
function applyIntervalSkip(
  plans: DayCommitPlan[],
  intervalDays: number,
  skipDays: number
): DayCommitPlan[] {
  if (plans.length === 0 || skipDays === 0) return plans;

  const result: DayCommitPlan[] = [];

  // 按照间隔天数分组处理
  for (let i = 0; i < plans.length; i += intervalDays) {
    const chunk = plans.slice(i, i + intervalDays);

    // 在这个区间内随机选择要跳过的天
    const skipCount = Math.min(skipDays, chunk.length - 1); // 至少保留一天
    const skipIndices = new Set<number>();

    while (skipIndices.size < skipCount) {
      const randomIndex = randomInt(0, chunk.length - 1);
      skipIndices.add(randomIndex);
    }

    // 添加未被跳过的天
    chunk.forEach((plan, index) => {
      if (!skipIndices.has(index)) {
        result.push(plan);
      }
    });
  }

  return result;
}

/**
 * 从每日计划生成详细的提交列表
 * 每个提交都有具体的时间戳
 */
export function generateCommitDetails(plans: DayCommitPlan[]): CommitDetail[] {
  const details: CommitDetail[] = [];
  let globalIndex = 0;

  for (const plan of plans) {
    for (let i = 0; i < plan.commits; i++) {
      globalIndex++;
      details.push({
        date: plan.date,
        timestamp: randomTimeOnDate(plan.date),
        index: globalIndex,
      });
    }
  }

  // 按时间戳排序（确保提交顺序正确）
  details.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // 重新编号
  details.forEach((detail, index) => {
    detail.index = index + 1;
  });

  return details;
}

/**
 * 获取计划统计信息
 */
export function getPlanStatistics(plans: DayCommitPlan[]): {
  totalDays: number;
  totalCommits: number;
  startDate: string;
  endDate: string;
  avgCommitsPerDay: number;
} {
  if (plans.length === 0) {
    return {
      totalDays: 0,
      totalCommits: 0,
      startDate: '',
      endDate: '',
      avgCommitsPerDay: 0,
    };
  }

  const totalCommits = plans.reduce((sum, plan) => sum + plan.commits, 0);

  return {
    totalDays: plans.length,
    totalCommits,
    startDate: plans[0].date,
    endDate: plans[plans.length - 1].date,
    avgCommitsPerDay: Math.round((totalCommits / plans.length) * 10) / 10,
  };
}

/**
 * 预览计划（返回可读的字符串）
 */
export function previewPlan(plans: DayCommitPlan[], maxDisplay: number = 10): string {
  const stats = getPlanStatistics(plans);
  const lines: string[] = [];

  lines.push('📅 提交计划预览');
  lines.push('─'.repeat(40));
  lines.push(`📊 统计信息:`);
  lines.push(`   • 总天数: ${stats.totalDays} 天`);
  lines.push(`   • 总提交: ${stats.totalCommits} 次`);
  lines.push(`   • 日期范围: ${stats.startDate} ~ ${stats.endDate}`);
  lines.push(`   • 平均每天: ${stats.avgCommitsPerDay} 次`);
  lines.push('');
  lines.push('📋 详细计划:');

  const displayPlans = plans.slice(0, maxDisplay);
  for (const plan of displayPlans) {
    const bar = '█'.repeat(Math.min(plan.commits, 20));
    lines.push(`   ${plan.date}: ${bar} (${plan.commits})`);
  }

  if (plans.length > maxDisplay) {
    lines.push(`   ... 还有 ${plans.length - maxDisplay} 天`);
  }

  lines.push('─'.repeat(40));

  return lines.join('\n');
}
