/**
 * 配置管理模块
 */

import * as path from 'path';
import { Config, DEFAULT_CONFIG, CLIOptions, DateRange } from '../types';
import {
  readJsonFile,
  writeJsonFile,
  getConfigFilePath,
  isGitRepository,
  isValidDateFormat,
  compareDates,
} from '../utils';

/**
 * 配置验证错误
 */
export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigError';
  }
}

/**
 * 从配置文件加载配置
 */
export function loadConfigFromFile(configPath?: string): Partial<Config> | null {
  const filePath = configPath || getConfigFilePath();
  return readJsonFile<Partial<Config>>(filePath);
}

/**
 * 保存配置到文件
 */
export function saveConfigToFile(config: Config, configPath?: string): void {
  const filePath = configPath || getConfigFilePath();
  writeJsonFile(filePath, config);
}

/**
 * 从 CLI 选项解析配置
 */
export function parseCliOptions(options: CLIOptions): Partial<Config> {
  const config: Partial<Config> = {};

  if (options.repo) {
    config.repoPath = path.resolve(options.repo);
  }

  if (options.file) {
    config.commitFile = options.file;
  }

  if (options.message) {
    config.commitMessage = options.message;
  }

  if (options.from && options.to) {
    const commits = options.commits ? parseInt(options.commits, 10) : 1;
    config.dateRanges = [
      {
        start: options.from,
        end: options.to,
        commitsPerDay: commits,
      },
    ];
  }

  if (options.random !== undefined) {
    config.randomCommits = options.random;
  }

  if (options.randomRange) {
    const [min, max] = options.randomRange.split('-').map(Number);
    if (!isNaN(min) && !isNaN(max)) {
      config.randomCommitRange = [min, max];
    }
  }

  if (options.interval !== undefined) {
    config.intervalCommit = options.interval;
  }

  if (options.intervalDays !== undefined) {
    config.intervalDays = options.intervalDays;
  }

  if (options.skipDays !== undefined) {
    config.skipDays = options.skipDays;
  }

  if (options.push !== undefined) {
    config.autoPush = options.push;
  }

  return config;
}

/**
 * 合并配置（CLI 选项优先级高于配置文件）
 */
export function mergeConfigs(...configs: Partial<Config>[]): Config {
  const merged = { ...DEFAULT_CONFIG } as Config;

  for (const config of configs) {
    if (!config) continue;

    for (const [key, value] of Object.entries(config)) {
      if (value !== undefined) {
        (merged as unknown as Record<string, unknown>)[key] = value;
      }
    }
  }

  return merged;
}

/**
 * 验证配置
 */
export function validateConfig(config: Config): void {
  // 验证仓库路径
  if (!config.repoPath) {
    throw new ConfigError('仓库路径 (repoPath) 不能为空');
  }

  if (!isGitRepository(config.repoPath)) {
    throw new ConfigError(`路径 "${config.repoPath}" 不是有效的 Git 仓库（缺少 .git 目录）`);
  }

  // 验证提交文件
  if (!config.commitFile) {
    throw new ConfigError('提交文件名 (commitFile) 不能为空');
  }

  // 验证提交信息
  if (!config.commitMessage) {
    throw new ConfigError('提交信息 (commitMessage) 不能为空');
  }

  // 验证日期范围
  if (!config.dateRanges || config.dateRanges.length === 0) {
    throw new ConfigError('至少需要配置一个日期范围 (dateRanges)');
  }

  for (let i = 0; i < config.dateRanges.length; i++) {
    const range = config.dateRanges[i];
    validateDateRange(range, i);
  }

  // 验证随机提交范围
  if (config.randomCommits) {
    const [min, max] = config.randomCommitRange;
    if (min < 1) {
      throw new ConfigError('随机提交最小值必须大于等于 1');
    }
    if (max > 88) {
      throw new ConfigError('随机提交最大值不能超过 88（避免异常提交模式）');
    }
    if (min > max) {
      throw new ConfigError('随机提交最小值不能大于最大值');
    }
  }

  // 验证间隔提交
  if (config.intervalCommit) {
    if (config.intervalDays < 1) {
      throw new ConfigError('间隔天数 (intervalDays) 必须大于等于 1');
    }
    if (config.skipDays < 0) {
      throw new ConfigError('跳过天数 (skipDays) 不能为负数');
    }
    if (config.skipDays >= config.intervalDays) {
      throw new ConfigError('跳过天数 (skipDays) 必须小于间隔天数 (intervalDays)');
    }
  }
}

/**
 * 验证单个日期范围
 */
function validateDateRange(range: DateRange, index: number): void {
  const prefix = `日期范围 #${index + 1}`;

  if (!range.start) {
    throw new ConfigError(`${prefix}: 开始日期 (start) 不能为空`);
  }

  if (!range.end) {
    throw new ConfigError(`${prefix}: 结束日期 (end) 不能为空`);
  }

  if (!isValidDateFormat(range.start)) {
    throw new ConfigError(`${prefix}: 开始日期格式无效，应为 YYYY-MM-DD`);
  }

  if (!isValidDateFormat(range.end)) {
    throw new ConfigError(`${prefix}: 结束日期格式无效，应为 YYYY-MM-DD`);
  }

  if (compareDates(range.start, range.end) > 0) {
    throw new ConfigError(`${prefix}: 开始日期不能晚于结束日期`);
  }

  if (range.commitsPerDay < 1) {
    throw new ConfigError(`${prefix}: 每日提交数 (commitsPerDay) 必须大于等于 1`);
  }

  if (range.commitsPerDay > 88) {
    throw new ConfigError(`${prefix}: 每日提交数 (commitsPerDay) 不能超过 88`);
  }
}

/**
 * 创建示例配置
 */
export function createSampleConfig(repoPath: string): Config {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  return {
    repoPath,
    commitFile: 'commit.md',
    commitMessage: 'auto commit',
    dateRanges: [
      {
        start: formatDate(thirtyDaysAgo),
        end: formatDate(today),
        commitsPerDay: 3,
      },
    ],
    randomCommits: true,
    randomCommitRange: [1, 5],
    intervalCommit: true,
    intervalDays: 7,
    skipDays: 2,
    autoPush: true,
  };
}
