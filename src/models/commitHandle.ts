/*
 * Author       : OBKoro1
 * Date         : 2019-12-30 16:59:30
 * LastEditors  : OBKoro1
 * LastEditTime : 2019-12-30 20:21:13
 * FilePath     : /autoCommit/src/models/commitHandle.ts
 * Description  : commit 具体操作
 * https://github.com/OBKoro1
 */

import { webviewMsg } from '../util/dataStatement';
import * as moment from 'moment';
import * as fs from 'fs';
import { execSync } from 'child_process';
import { RandomNumber } from '../util/util';
import { getPanelWebview, outputLog } from '../util/vscodeUtil';
import WebView from './WebView';

class CommitHandle {
  public paramsObj: any;
  public timeArr: Array<string>;
  public autoCommitView: WebView;

  constructor(message: webviewMsg) {
    this.paramsObj = message.data;
    this.timeArr = [];
    this.timeHandle();
    this.autoCommitView = getPanelWebview();
  }
  // 处理所有时间段
  timeHandle() {
    // 处理所有时间范围
    this.paramsObj.formatTime.forEach((item: Array<string>) => {
      // 获取每个时间范围的具体日期
      let detailTimeArr = this.getAllDay(item[0], item[1]);
      // 日期去重
      detailTimeArr = detailTimeArr.filter(ele => {
        return !this.timeArr.includes(ele);
      });
      this.timeArr.push(...detailTimeArr);
    });
    this.sortTime();
  }
  // 日期排序
  sortTime() {
    this.timeArr = this.timeArr.sort((item1: string, item2: string): number => {
      const dateArr1: Array<any> = item1.split('-');
      const dateArr2: Array<any> = item2.split('-');
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
    });
    this.commitFn();
  }
  // TODO: 中断
  commitFn() {
    outputLog('将要commit的日期:', this.timeArr);
    outputLog('每个日期提交次数:', this.paramsObj.commitNumber);
    let totalNum = 0; // 总commit次数
    // 遍历日期
    this.timeArr.forEach(item => {
      // 每个日期commit次数
      for (let i = 0; i < this.paramsObj.commitNumber; i++) {
        let time = this.formatTime(item); // 2019-01-02 08:00
        time = moment(time).format(); // 2019-01-02T00:00:00+0800
        const commitContent = `${time} \n 随机数:${RandomNumber(1, 100000)}`;
        fs.writeFileSync(
          `${this.paramsObj.itemSrc}/${this.paramsObj.fileSrc}`,
          commitContent,
          'utf-8'
        );
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
        totalNum++;
        outputLog('commit内容', commitContent);
      }
      outputLog(`总commit次数${totalNum}`);
      outputLog('自动commit完成');
    });
  }
  // 格式化日期
  formatTime(time: string) {
    return `${time} 08:00`;
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
