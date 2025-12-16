/**
 * Git 操作模块
 */

import { execSync, ExecSyncOptions } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Git 操作错误
 */
export class GitError extends Error {
  constructor(
    message: string,
    public readonly command: string,
    public readonly stderr?: string
  ) {
    super(message);
    this.name = 'GitError';
  }
}

/**
 * 执行 Git 命令
 */
function execGit(
  command: string,
  cwd: string,
  env?: NodeJS.ProcessEnv
): string {
  const options: ExecSyncOptions = {
    cwd,
    encoding: 'utf-8',
    env: { ...process.env, ...env },
    stdio: ['pipe', 'pipe', 'pipe'],
  };

  try {
    return execSync(command, options) as string;
  } catch (error: unknown) {
    const err = error as { stderr?: Buffer | string; message?: string };
    const stderr = err.stderr?.toString() || '';
    throw new GitError(
      `Git 命令执行失败: ${command}`,
      command,
      stderr
    );
  }
}

/**
 * 检查是否有未提交的更改
 */
export function hasUncommittedChanges(repoPath: string): boolean {
  try {
    const status = execGit('git status --porcelain', repoPath);
    return status.trim().length > 0;
  } catch {
    return false;
  }
}

/**
 * 获取当前分支名称
 */
export function getCurrentBranch(repoPath: string): string {
  return execGit('git branch --show-current', repoPath).trim();
}

/**
 * 检查是否有远程仓库
 */
export function hasRemote(repoPath: string): boolean {
  try {
    const remotes = execGit('git remote', repoPath);
    return remotes.trim().length > 0;
  } catch {
    return false;
  }
}

/**
 * 写入提交文件内容
 */
export function writeCommitFile(
  repoPath: string,
  fileName: string,
  content: string
): void {
  const filePath = path.join(repoPath, fileName);
  fs.appendFileSync(filePath, content, 'utf-8');
}

/**
 * 生成提交文件内容
 */
export function generateCommitContent(
  timestamp: Date,
  index: number,
  total: number
): string {
  const timeStr = timestamp.toISOString();
  return `commit ${index}/${total}: ${timeStr}\n`;
}

/**
 * 执行 git add
 */
export function gitAdd(repoPath: string, files: string = '.'): void {
  execGit(`git add ${files}`, repoPath);
}

/**
 * 执行带日期的 git commit
 */
export function gitCommit(
  repoPath: string,
  message: string,
  date: Date
): void {
  const isoDate = date.toISOString();

  // 使用环境变量设置作者和提交者日期
  const env = {
    GIT_AUTHOR_DATE: isoDate,
    GIT_COMMITTER_DATE: isoDate,
  };

  // 转义消息中的特殊字符
  const escapedMessage = message.replace(/"/g, '\\"');

  execGit(`git commit -m "${escapedMessage}"`, repoPath, env);
}

/**
 * 执行 git pull --rebase
 */
export function gitPull(repoPath: string): void {
  execGit('git pull --rebase', repoPath);
}

/**
 * 执行 git push
 */
export function gitPush(repoPath: string): void {
  execGit('git push', repoPath);
}

/**
 * 回滚指定数量的提交
 */
export function gitReset(repoPath: string, count: number): void {
  if (count <= 0) return;
  execGit(`git reset --hard HEAD~${count}`, repoPath);
}

/**
 * 获取提交数量
 */
export function getCommitCount(repoPath: string): number {
  try {
    const result = execGit('git rev-list --count HEAD', repoPath);
    return parseInt(result.trim(), 10);
  } catch {
    return 0;
  }
}

/**
 * 完整的提交流程
 */
export function performCommit(
  repoPath: string,
  fileName: string,
  message: string,
  timestamp: Date,
  index: number,
  total: number
): void {
  // 1. 写入文件内容
  const content = generateCommitContent(timestamp, index, total);
  writeCommitFile(repoPath, fileName, content);

  // 2. 暂存更改
  gitAdd(repoPath);

  // 3. 提交
  gitCommit(repoPath, message, timestamp);
}

/**
 * 推送更改（带 pull rebase）
 */
export async function pushChanges(repoPath: string): Promise<void> {
  // 先 pull 以处理可能的冲突
  if (hasRemote(repoPath)) {
    try {
      gitPull(repoPath);
    } catch (error) {
      // pull 失败可能是因为没有远程分支，继续尝试 push
      console.warn('Pull 失败，尝试直接 push...');
    }
    gitPush(repoPath);
  }
}

/**
 * 回滚提交
 */
export function rollbackCommits(repoPath: string, count: number): void {
  gitReset(repoPath, count);
}
