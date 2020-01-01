/*
 * Author       : OBKoro1
 * Date         : 2019-12-30 16:59:30
 * LastEditors  : OBKoro1
 * LastEditTime : 2020-01-01 18:06:25
 * FilePath     : /autoCommit/src/models/commitHandle.ts
 * Description  : commit 具体操作
 * https://github.com/OBKoro1
 */

import { webviewMsg } from '../util/dataStatement';
import * as moment from 'moment';
import * as fs from 'fs';
import { execSync } from 'child_process';
import { RandomNumber } from '../util/util';
import { getPanelWebview, outputLog, isProduction } from '../util/vscodeUtil';
import WebView from './WebView';

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
  public timeArr: Array<dayTime>;
  public autoCommitView: WebView;
  private userCancel: boolean;
  constructor(message: webviewMsg) {
    this.paramsObj = message.data;
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
        // 添加不存在的日期
        if (index === -1) {
          this.timeArr.push({
            value: ele,
            commitNumber: item.commitNumber
          });
        }
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
    this.commitFn();
  }
  async commitFn() {
    outputLog('将要commit的日期:', JSON.stringify(this.timeArr));
    let totalNum = 0; // 总commit次数
    // 遍历日期
    for (let item of this.timeArr.values()) {
      if (this.cancelCommit()) break;
      // 每个日期commit次数
      let dayCommitNumber = this.paramsObj.commitNumber;
      if (item.commitNumber !== 0) {
        // 如果该范围有commit次数 则用该范围的
        dayCommitNumber = item.commitNumber;
      }
      for (let i = 0; i < dayCommitNumber; i++) {
        if (this.cancelCommit()) break;
        let time = this.formatTime(item.value); // 2019-01-02 08:00
        time = moment(time).format(); // 2019-01-02T00:00:00+0800
        const commitContent = `${time} \n随机数:${RandomNumber(
          1,
          100000
        )}\n提交次数:${totalNum + 1}`;
        fs.writeFileSync(
          `${this.paramsObj.itemSrc}/${this.paramsObj.fileName}`,
          commitContent,
          'utf-8'
        );
        const isDebug = true; // 手动更改调试模拟是否提交git
        if (!isProduction() && !isDebug) {
          // TODO: 测试提交 以及接受log
          const res = this.myExecSync(
            `cd ${this.paramsObj.itemSrc} && git add . && git commit -m 'autoCommit' --date='${time}' && git pull && git push origin master`
          );
          console.log('res 结束', res);
          // 当前最新版本commit 信息
          const cmd = `git log -1 \
                  --date=iso --pretty=format:'{"commit": "%h","author": "%aN <%aE>","date": "%ad","message": "%s"},' \
                  $@ | \
                  perl -pe 'BEGIN{print "["}; END{print "]\n"}' | \
                  perl -pe 's/},]/}]/'`;
          // [{"commit": "a6b5f3d","author": "OBKoro1 <1677593011@qq.com>","date": "2019-12-26 21:05:57 +0800","message": "init"}]
          const log = this.myExecSync(cmd);
          console.log('log 开始', log);
        } else {
          // 模拟git提交
          const test = await new Promise((resolve, reject) => {
            setTimeout(() => {
              outputLog('延迟一秒');
              resolve('延迟一秒');
            }, 1000);
          });
        }
        totalNum++;
        outputLog('commit内容', commitContent);
      }
    }
    this.commitEnd(totalNum);
  }
  commitEnd(totalNum: number) {
    this.userCancel = false; // 重新打开终止开关
    this.autoCommitView.postMessage('commit 完成', 'commit 完成');
    outputLog('自动commit完成', `总commit次数${totalNum}`);
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
  // 当天的随机时间
  //   formatTime(time: string) {
  //     const hour = `${RandomNumber(0, 1)}${RandomNumber(0, 9)}`;
  //     const minute = `${RandomNumber(0, 5)}${RandomNumber(0, 9)}`;
  //     return `${time} ${hour}:${minute}`;
  //   }
  // TODO: 某天的随机时间 代码块 
  // 获取当天的随机时间
  formatTime(time: string) {
    const hour1 = RandomNumber(0, 2);
    let hour2 = RandomNumber(0, 9);
    if (hour1 === 2) {
      // 小时第一个数字为2 则小时第二个数字最多为4
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
  myExecSync(cmd: string) {
    // 除了该方法直到子进程完全关闭后才返回 执行完毕 返回
    try {
      const res = execSync(cmd, {
        encoding: 'utf8',
        timeout: 0,
        maxBuffer: 200 * 1024,
        killSignal: 'SIGTERM',
        cwd: undefined,
        env: undefined
      });
      return res;
    } catch (err) {
      outputLog(`执行命令出错:${cmd}`);
      outputLog(`错误信息:${err}`);
      return err;
    }
  }
}

export default CommitHandle;
