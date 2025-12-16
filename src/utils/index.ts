/**
 * 工具函数模块
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * 生成指定范围内的随机整数
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 生成指定日期内的随机时间
 * @param date 日期字符串 YYYY-MM-DD
 */
export function randomTimeOnDate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number);
  const hour = randomInt(9, 23); // 9:00 - 23:59 更符合开发者习惯
  const minute = randomInt(0, 59);
  const second = randomInt(0, 59);
  return new Date(year, month - 1, day, hour, minute, second);
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 解析日期字符串
 */
export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * 获取两个日期之间的所有日期
 * @param start 开始日期 YYYY-MM-DD
 * @param end 结束日期 YYYY-MM-DD
 */
export function getDateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const startDate = parseDate(start);
  const endDate = parseDate(end);

  const current = new Date(startDate);
  while (current <= endDate) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * 检查路径是否是有效的 Git 仓库
 */
export function isGitRepository(repoPath: string): boolean {
  const gitDir = path.join(repoPath, '.git');
  return fs.existsSync(gitDir);
}

/**
 * 确保目录存在
 */
export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * 读取 JSON 文件
 */
export function readJsonFile<T>(filePath: string): T | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

/**
 * 写入 JSON 文件
 */
export function writeJsonFile(filePath: string, data: unknown): void {
  const content = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * 延迟执行
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 验证日期格式
 */
export function isValidDateFormat(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

/**
 * 比较两个日期字符串
 * @returns -1 if a < b, 0 if a === b, 1 if a > b
 */
export function compareDates(a: string, b: string): number {
  const dateA = parseDate(a);
  const dateB = parseDate(b);
  return dateA.getTime() - dateB.getTime();
}

/**
 * 获取配置文件路径
 */
export function getConfigFilePath(): string {
  return path.join(process.cwd(), '.autocommitrc.json');
}

/**
 * 检查配置文件是否存在
 */
export function configFileExists(): boolean {
  return fs.existsSync(getConfigFilePath());
}
