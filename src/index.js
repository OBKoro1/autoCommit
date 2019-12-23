/*
 * Author       : OBKoro1
 * Date         : 2019-12-19 20:23:57
 * LastEditors  : OBKoro1
 * LastEditTime : 2019-12-23 19:56:54
 * FilePath     : /autoCommit/index.js
 * Description  : 自动commit
 * https://github.com/OBKoro1
 */

const { execSync } = require('child_process');
const moment = require('moment');
const fs = require('fs');

class autoCommit {
  constructor() {
    this.init();
  }
  getData() {
    this.getAllDay(this.paramsObj.beginDay, this.paramsObj.endDay);
    this.readyCommit();
    console.log('timeArr', this.timeArr);
  }
  formatTime(time) {
    return `${time} 08:00`;
  }
  getAllDay(begin, end) {
    this.timeArr = [];
    const beginSplit = begin.split('-');
    const endSplit = end.split('-');
    const beginDate = new Date();
    beginDate.setUTCFullYear(beginSplit[0], beginSplit[1] - 1, beginSplit[2]);
    const endDate = new Date();
    endDate.setUTCFullYear(endSplit[0], endSplit[1] - 1, endSplit[2]);
    const beginNumber = beginDate.getTime();
    const endNumber = endDate.getTime();
    for (let k = beginNumber; k <= endNumber; ) {
      const day = new Date(parseInt(k));
      const dayFormat = moment(day).format('YYYY-MM-DD');
      this.timeArr.push(dayFormat);
      k = k + 24 * 60 * 60 * 1000;
    }
  }
  // 只commit今天
  commitToday() {
    const time = moment().format('DD/MM/YYYY HH:MM:ss');
    // TODO:
  }
  init() {
    let paramsObj = {
      beginDay: '2019-02-02',
      endDay: '2019-03-02',
      itemSrc: '../../testCommit', // 要commit的项目地址
      commitNumber: 1 // 每天commit 次数
    };
    let defaultOption = {
      endDay: moment().format('YYYY-MM-DD'), // 默认为今天
      fileSrc: `${paramsObj.itemSrc}/commit.md`
    };
    this.paramsObj = paramsObj;
    this.getData();
    // this.commit();
  }
  readyCommit() {
    // 遍历日期
    this.timeArr.forEach(item => {
      // 每个日期commit次数
      for (let i = 0; i++; i < this.paramsObj.commitNumber) {
        let time = this.formatTime(item); // 2019-01-02 08:00
        time = moment(time).format(); // 2019-01-02T00:00:00+0800
        fs.writeFileSync(
          `${this.paramsObj.itemSrc}/commit.md`,
          `${time}${i}`,
          'utf-8'
        );
        console.log('each', time);
      }
      // this.commit()
    });
  }
  commit(commitTime) {
    // git commit --amend --date="2019-01-02T00:00:00+0800" -am 'autoCommit'
    // TODO: cd 项目 重写文件和commit
    this.myExecSync(
      `cd ${this.paramsObj.itemSrc} && git add . && git commit -m 'autoCommit' --date='${commitTime}' && git pull && git push origin master`
    );
  }

  myExecSync(cmd) {
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
      console.log(`执行命令出错:${cmd}`);
    }
  }
}

new autoCommit();
