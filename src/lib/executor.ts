/**
 * 提交执行引擎
 */

import { Config, ExecutionStatus, ExecutionResult, CommitDetail } from '../types';
import { generateDayPlans, generateCommitDetails, getPlanStatistics } from './scheduler';
import { performCommit, pushChanges, rollbackCommits, hasRemote } from './git';
import { sleep } from '../utils';

/**
 * 进度回调类型
 */
export type ProgressCallback = (
  current: number,
  total: number,
  detail: CommitDetail
) => void;

/**
 * 状态回调类型
 */
export type StatusCallback = (status: string) => void;

/**
 * 执行器选项
 */
export interface ExecutorOptions {
  /** 是否是预览模式（不实际执行） */
  dryRun?: boolean;
  /** 是否静默模式 */
  silent?: boolean;
  /** 进度回调 */
  onProgress?: ProgressCallback;
  /** 状态回调 */
  onStatus?: StatusCallback;
}

/**
 * 提交执行器类
 */
export class CommitExecutor {
  private config: Config;
  private options: ExecutorOptions;
  private cancelled: boolean = false;
  private completedCommits: number = 0;

  constructor(config: Config, options: ExecutorOptions = {}) {
    this.config = config;
    this.options = options;
  }

  /**
   * 取消执行
   */
  cancel(): void {
    this.cancelled = true;
  }

  /**
   * 检查是否已取消
   */
  isCancelled(): boolean {
    return this.cancelled;
  }

  /**
   * 获取已完成的提交数
   */
  getCompletedCommits(): number {
    return this.completedCommits;
  }

  /**
   * 执行提交计划
   */
  async execute(): Promise<ExecutionResult> {
    this.cancelled = false;
    this.completedCommits = 0;

    try {
      // 1. 生成计划
      this.emitStatus('生成提交计划...');
      const plans = generateDayPlans(this.config);
      const stats = getPlanStatistics(plans);

      if (stats.totalCommits === 0) {
        return {
          status: ExecutionStatus.COMPLETED,
          totalCommits: 0,
          completedCommits: 0,
        };
      }

      // 2. 生成详细提交列表
      const commits = generateCommitDetails(plans);

      // 3. 预览模式直接返回
      if (this.options.dryRun) {
        return {
          status: ExecutionStatus.COMPLETED,
          totalCommits: commits.length,
          completedCommits: 0,
        };
      }

      // 4. 执行提交
      this.emitStatus('开始执行提交...');
      await this.executeCommits(commits);

      // 5. 检查是否被取消
      if (this.cancelled) {
        return {
          status: ExecutionStatus.CANCELLED,
          totalCommits: commits.length,
          completedCommits: this.completedCommits,
        };
      }

      // 6. 推送（如果配置了）
      if (this.config.autoPush && hasRemote(this.config.repoPath)) {
        await this.executePush(commits.length);
      }

      return {
        status: ExecutionStatus.COMPLETED,
        totalCommits: commits.length,
        completedCommits: this.completedCommits,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        status: ExecutionStatus.FAILED,
        totalCommits: 0,
        completedCommits: this.completedCommits,
        error: errorMessage,
      };
    }
  }

  /**
   * 执行所有提交
   */
  private async executeCommits(commits: CommitDetail[]): Promise<void> {
    const total = commits.length;

    for (const commit of commits) {
      // 检查取消状态
      if (this.cancelled) {
        break;
      }

      // 执行单次提交
      performCommit(
        this.config.repoPath,
        this.config.commitFile,
        this.config.commitMessage,
        commit.timestamp,
        commit.index,
        total
      );

      this.completedCommits++;

      // 触发进度回调
      if (this.options.onProgress) {
        this.options.onProgress(this.completedCommits, total, commit);
      }

      // 小延迟避免时间戳完全相同
      await sleep(10);
    }
  }

  /**
   * 执行推送
   */
  private async executePush(totalCommits: number): Promise<void> {
    // 如果提交数量大于 100，等待一段时间以便用户可以取消
    if (totalCommits > 100) {
      this.emitStatus('大量提交完成，等待 10 秒后推送（可取消）...');
      await sleep(10000);

      if (this.cancelled) {
        return;
      }
    } else {
      // 小延迟
      await sleep(2000);

      if (this.cancelled) {
        return;
      }
    }

    this.emitStatus('正在推送到远程仓库...');
    await pushChanges(this.config.repoPath);
    this.emitStatus('推送完成！');
  }

  /**
   * 回滚已完成的提交
   */
  rollback(): void {
    if (this.completedCommits > 0) {
      this.emitStatus(`回滚 ${this.completedCommits} 个提交...`);
      rollbackCommits(this.config.repoPath, this.completedCommits);
      this.emitStatus('回滚完成！');
    }
  }

  /**
   * 触发状态回调
   */
  private emitStatus(status: string): void {
    if (this.options.onStatus && !this.options.silent) {
      this.options.onStatus(status);
    }
  }
}

/**
 * 便捷函数：执行提交
 */
export async function executeCommits(
  config: Config,
  options?: ExecutorOptions
): Promise<ExecutionResult> {
  const executor = new CommitExecutor(config, options);
  return executor.execute();
}

/**
 * 便捷函数：预览计划
 */
export function previewCommitPlan(config: Config): {
  plans: ReturnType<typeof generateDayPlans>;
  stats: ReturnType<typeof getPlanStatistics>;
  commits: CommitDetail[];
} {
  const plans = generateDayPlans(config);
  const stats = getPlanStatistics(plans);
  const commits = generateCommitDetails(plans);
  return { plans, stats, commits };
}
