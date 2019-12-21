/*
 * Author       : OBKoro1
 * Date         : 2019-12-19 20:23:57
 * LastEditors  : OBKoro1
 * LastEditTime : 2019-12-22 02:01:14
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
  getData(paramsObj) {
    let time1 = '2019-01-02';
    let time2 = '2019-01-02';
    this.getAllDay(time1, time2);
    console.log('timeArr', this.timeArr)
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
    for (var k = beginNumber; k <= endNumber;) {
      let day = new Date(parseInt(k))
      let dayFormat = moment(day).format('YYYY-MM-DD')
      this.timeArr.push(dayFormat)
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
      beginDay: '2019-01-02',
      endDay: '2019-01-10',
      commitNumber: 1 // 每天commit 次数
    }
    // TODO: 数组 每段时间commit几次，参数如上
    // 今天
    if (!paramsObj.endDay) {
      paramsObj.endDay = moment().format('YYYY-MM-DD')
    }
    this.getData();
    // this.commit();
  }
  readyCommit() {
    // const time = moment().format('DD/MM/YYYY HH:MM:ss');
    let time3 = moment('2019-01-02 08:00').format();
    fs.writeFileSync('./test.md', time, 'utf-8');

  }
  commit() {
    // git commit --amend --date="2019-01-02T00:00:00+0800" -am 'autoCommit'
    this.myExecSync(
      `git add . && git commit -m 'autoCommit' --date='2019-01-02T00:00:00+0800' && git pull && git push origin master`
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
