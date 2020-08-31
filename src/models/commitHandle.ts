/*
 * Author       : OBKoro1
 * Date         : 2019-12-30 16:59:30
 * LastEditors  : OBKoro1
 * LastEditTime : 2020-08-31 11:33:00
 * FilePath     : \autoCommit\src\models\commitHandle.ts
 * Description  : commit 具体操作
 * https://github.com/OBKoro1
 */

import { webviewMsg } from '../util/dataStatement';
import * as moment from 'moment';
import * as fs from 'fs';
import { execSync, exec } from 'child_process';
import { RandomNumber } from '../util/util';
import {
  getPanelWebview,
  outputLog,
  isProduction,
  getExtensionContext
} from '../util/vscodeUtil';
import WebView from './WebView';
import { sep } from 'path';

interface timeElement {
  value: Array<string>;
  commitNumber: number;
}

interface dayTime {
  value: string;
  commitNumber: number;
}

class CommitHandle {
  public paramsObj: any;
  public moreObj: any;
  public timeArr: Array<dayTime>;
  public autoCommitView: WebView;
  private userCancel: boolean;
  constructor(message: webviewMsg) {
    this.paramsObj = message.data.form;
    this.moreObj = message.data.moreObj;
    this.timeArr = [];
    this.timeHandle();
    this.autoCommitView = getPanelWebview();
    this.userCancel = false;
  }
  // 处理所有时间段
  timeHandle() {
    // 处理所有时间范围
    this.paramsObj.timeArr.forEach((item: timeElement) => {
      // 获取每个时间范围的具体日期
      let detailTimeArr = this.getAllDay(item.value[0], item.value[1]);
      // 日期去重 组织数据
      detailTimeArr.forEach(ele => {
        let index = this.timeArr.findIndex(element => {
          return element.value === ele;
        });
        // 删除重复日期
        if (index !== -1) {
          this.timeArr.splice(index, 1);
        }
        this.timeArr.push({
          value: ele,
          commitNumber: item.commitNumber
        });
      });
    });
    this.sortTime();
  }
  // 日期排序
  sortTime() {
    this.timeArr = this.timeArr.sort(
      (item1: dayTime, item2: dayTime): number => {
        const dateArr1: Array<any> = item1.value.split('-');
        const dateArr2: Array<any> = item2.value.split('-');
        if (dateArr1[0] === dateArr2[0]) {
          if (dateArr1[1] === dateArr2[1]) {
            // 日期不同就比较日期
            return dateArr1[2] - dateArr2[2];
          } else {
            // 月份不同就比较月份
            return dateArr1[1] - dateArr2[1];
          }
        } else {
          //  年份不同就比较年份
          return dateArr1[0] - dateArr2[0];
        }
      }
    );
    this.deleteDayArrDay()
    this.commitFn()
  }
  // 随机删除日期数组中的某几天
  deleteDayArrDay() {
    const noCommitDay = this.moreObj.noCommitDay
    const scopeDay = this.moreObj.scopeDay
    if(scopeDay < 1 || noCommitDay < 1) return // 必须大于1
    if(scopeDay > this.timeArr.length) return // 日期不够
    // 删除
    for(let i = 0; i < noCommitDay; i++){
       let ranDomNum = Math.floor(Math.random() * this.timeArr.length); // 随机数
       this.timeArr.splice(ranDomNum, 1);
     }
  }
  async commitFn() {
    await outputLog('将要commit的日期:', JSON.stringify(this.timeArr));
    let totalNum = 0; // 总commit次数
    // 遍历日期
    for (let item of this.timeArr.values()) {
      if (this.cancelCommit()) break;
      // 每个日期commit次数
      let dayCommitNumber = this.getDayCommitNumber(item);
      if(sep === '\\'){
        const reg = new RegExp(/\\/g)
        this.paramsObj.itemSrc = `${this.paramsObj.itemSrc.replace(reg, '/')}`;
      }

      for (let i = 0; i < dayCommitNumber; i++) {
        if (this.cancelCommit()) break;
        let time = this.formatTime(item.value); // 2019-01-02 08:00
        time = moment(time).format(); // 2019-01-02T00:00:00+0800
        let commitContent = this.commitFileContent(time, totalNum);
        let commitMsg: string = '';
        const isDebug = false; // 手动更改调试模拟是否提交git
        if (!isProduction() || !isDebug) {
          try {
            // 异步执行命令 让出线程 打印日志 等
            commitMsg = await new Promise((resolve, reject) => {
              const cmd = `git add . && git commit -m '${this.paramsObj.commitMsg}' --date='${time}'`;
              exec(cmd, {
                encoding: 'utf8',
                cwd: this.paramsObj.itemSrc,
                env: undefined
              },(error, stdout, stderr) => {
                if (error) {
                  outputLog(`执行命令出错:${cmd}`);
                  outputLog(`错误信息:${error}`, stderr);
                  reject(error);
                  return;
                }
                resolve(stdout);
              });
            });
          } catch (err) {
            continue; // 错误 退出本次循环
          }
        } else {
          // 模拟git提交
          const test = await new Promise((resolve, reject) => {
            setTimeout(() => {
              outputLog('延迟一秒');
              resolve('延迟一秒');
            }, 1000);
          });
        }
        outputLog(`${totalNum + 1}commit内容`, commitContent);
        outputLog(`${totalNum + 1}commit信息`, commitMsg);
        totalNum++;
      }
    }
    this.pushCommitFn(totalNum);
  }
  async pushCommitFn(totalNum: number) {
    const commitNumberBig = 100; // commit数量过大
    let thinkNumber = 10000; // 考虑时间 避免运行过快导致误操作
    if (totalNum > commitNumberBig) {
      outputLog(`commit数量:${totalNum}`);
      outputLog('commit数量超过100次,请考虑10秒钟是否需要取消commit');
    } else {
      thinkNumber = 2000; // 无感 考虑两秒
    }
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, thinkNumber);
    });
    if (this.cancelCommit()) {
      if (totalNum === 0) return;
      await this.resetCommit(totalNum);
      this.commitEnd(totalNum, true);
    } else {
      outputLog('提交中...');
      this.autoCommitView.postMessage('提交中...', '提交中');
      const res = await new Promise((resolve, reject) => {
        const cmd = `git pull && git push`;
        exec(cmd,{
          encoding: 'utf8',
          cwd: this.paramsObj.itemSrc,
          env: undefined
        },(error, stdout, stderr) => {
          if (error) {
            outputLog(`执行命令出错:${cmd}`);
            outputLog(`错误信息:${error}`, stderr);
            outputLog(
              `git push失败很可能是你的网络有问题，请换到一个网络状况比较良好的地方，然后再项目下执行 git push操作。`
            );
            reject(error);
            return;
          }
          resolve(stdout);
        });
      });
      outputLog('提交信息:', res);
      this.commitEnd(totalNum);
    }
  }
  async resetCommit(totalNum: number) {
    this.autoCommitView.postMessage('回滚', '回滚');
    outputLog('回滚中...');
    return await new Promise((resolve, reject) => {
      const cmd = `git reset --hard HEAD~${totalNum}`;
      exec(cmd,{
        encoding: 'utf8',
        cwd: this.paramsObj.itemSrc,
      }, (error, stdout, stderr) => {
        if (error) {
          outputLog(`执行命令出错:${cmd}`);
          outputLog(`回滚失败:${error}`, stderr);
          reject(error);
          return;
        }
        outputLog(`回滚${totalNum}次commit成功:`, stdout);
        resolve(stdout);
      });
    });
  }
  commitEnd(totalNum: number, cancel: boolean = false) {
    this.userCancel = false; // 重新打开终止开关
    if (!cancel) {
      this.autoCommitView.postMessage('commit 完成', this.paramsObj);
      getExtensionContext().globalState.update('commit-params', this.paramsObj);
      outputLog('自动commit完成', `总commit次数${totalNum}`);
    }
    outputLog('保存参数信息');
  }
  cancelCommit() {
    if (this.userCancel) {
      outputLog('终止自动commit');
    }
    return this.userCancel;
  }
  public closeCommit() {
    this.userCancel = true;
  }
  // 组织commit文件的内容
  commitFileContent(time: string, totalNum: number) {
    const commitContent = `${time}\n随机数:${RandomNumber(
      1,
      100000
    )}\n提交次数:${totalNum + 1}`;
    // 写入内容
    fs.writeFileSync(
      `${this.paramsObj.itemSrc}/${this.paramsObj.fileName}`,
      commitContent,
      'utf-8'
    );
    return commitContent;
  }
  getDayCommitNumber(item: dayTime) {
    let dayCommitNumber = this.paramsObj.commitNumber;
    if (this.paramsObj.randomCommit) {
      // 随机commit次数
      dayCommitNumber = RandomNumber(1, this.paramsObj.commitNumber);
    }
    if (item.commitNumber !== 0) {
      // 如果该范围有commit次数 则用该范围的
      dayCommitNumber = item.commitNumber;
    }
    return dayCommitNumber;
  }
  // 获取当天的随机时间
  formatTime(time: string) {
    const hour1 = RandomNumber(0, 2);
    let hour2 = RandomNumber(0, 9);
    if (hour1 === 2) {
      // 小时第一个数字为2 则小时第二个数字最多为3
      hour2 = RandomNumber(0, 3);
    }
    const minute = `${RandomNumber(0, 5)}${RandomNumber(0, 9)}`;
    const hour = `${hour1}${hour2}`;
    return `${time} ${hour}:${minute}`;
  }
  // 获取两个日期之间的间隔: [ '2019-02-02', '2019-02-03' ... ]
  getAllDay(begin: string, end: string) {
    const timeArr = [];
    const beginSplit: Array<string> = begin.split('-');
    const endSplit: Array<string> = end.split('-');
    const beginDate = new Date();
    beginDate.setUTCFullYear(
      Number(beginSplit[0]),
      Number(beginSplit[1]) - 1,
      Number(beginSplit[2])
    );
    const endDate = new Date();
    endDate.setUTCFullYear(
      Number(endSplit[0]),
      Number(endSplit[1]) - 1,
      Number(endSplit[2])
    );
    const beginNumber = beginDate.getTime();
    const endNumber = endDate.getTime();
    for (let k: any = beginNumber; k <= endNumber; ) {
      const day = new Date(parseInt(k));
      const dayFormat = moment(day).format('YYYY-MM-DD');
      timeArr.push(dayFormat);
      k = k + 24 * 60 * 60 * 1000;
    }
    return timeArr;
  }
}

export default CommitHandle;
