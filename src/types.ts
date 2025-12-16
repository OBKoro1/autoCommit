/**
 * auto-commit CLI 类型定义
 */

/** 日期范围配置 */
export interface DateRange {
  /** 开始日期 YYYY-MM-DD */
  start: string;
  /** 结束日期 YYYY-MM-DD */
  end: string;
  /** 每天提交次数 */
  commitsPerDay: number;
}

/** 主配置接口 */
export interface Config {
  /** Git 仓库路径 */
  repoPath: string;
  /** 提交文件名 */
  commitFile: string;
  /** 提交信息 */
  commitMessage: string;
  /** 日期范围列表 */
  dateRanges: DateRange[];
  /** 是否启用随机提交数 */
  randomCommits: boolean;
  /** 随机提交数范围 [min, max] */
  randomCommitRange: [number, number];
  /** 是否启用间隔提交（跳过某些天） */
  intervalCommit: boolean;
  /** 间隔天数（在多少天内跳过几天） */
  intervalDays: number;
  /** 跳过的天数 */
  skipDays: number;
  /** 提交完成后是否自动推送 */
  autoPush: boolean;
}

/** 默认配置 */
export const DEFAULT_CONFIG: Partial<Config> = {
  commitFile: 'commit.md',
  commitMessage: 'auto commit',
  randomCommits: false,
  randomCommitRange: [1, 5],
  intervalCommit: false,
  intervalDays: 10,
  skipDays: 2,
  autoPush: true,
};

/** 单日提交计划 */
export interface DayCommitPlan {
  /** 日期 YYYY-MM-DD */
  date: string;
  /** 该天的提交次数 */
  commits: number;
}

/** 单次提交详情 */
export interface CommitDetail {
  /** 日期 */
  date: string;
  /** 具体时间戳 */
  timestamp: Date;
  /** 提交序号 */
  index: number;
}

/** 执行状态 */
export enum ExecutionStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

/** 执行结果 */
export interface ExecutionResult {
  status: ExecutionStatus;
  totalCommits: number;
  completedCommits: number;
  error?: string;
}

/** CLI 选项 */
export interface CLIOptions {
  config?: string;
  repo?: string;
  from?: string;
  to?: string;
  commits?: string;
  message?: string;
  file?: string;
  random?: boolean;
  randomRange?: string;
  interval?: boolean;
  intervalDays?: number;
  skipDays?: number;
  push?: boolean;
  dryRun?: boolean;
  yes?: boolean;
  silent?: boolean;
}
