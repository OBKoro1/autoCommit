/*
 * Author       : OBKoro1
 * Date         : 2019-12-27 15:55:42
 * LastEditors  : OBKoro1
 * LastEditTime : 2019-12-27 15:57:54
 * FilePath     : /autoCommit/src/util/util.ts
 * Description  : 公共函数
 * https://github.com/OBKoro1
 */

//  生成指定范围的随机数
function RandomNumber(min: number, max: number): number {
  return Math.round(Math.random() * (max - min)) + min;
}

export { 
    RandomNumber // 生成指定范围的随机数
};
