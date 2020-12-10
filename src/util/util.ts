/*
 * Author       : OBKoro1
 * Date         : 2019-12-27 15:55:42
 * LastEditors  : OBKoro1
 * LastEditTime : 2020-12-10 18:57:11
 * FilePath     : \autoCommit\src\util\util.ts
 * Description  : 公共函数
 * https://github.com/OBKoro1
 */

/**
 * @description: 生成指定范围的随机数
 * @param {number} min
 * @param {number} max
 * @return {*}
 */
// eslint-disable-next-line import/prefer-default-export
export function RandomNumber(min: number, max: number): number {
  return Math.round(Math.random() * (max - min)) + min;
}
