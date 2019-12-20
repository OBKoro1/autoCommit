/*
 * Author       : OBKoro1
 * Date         : 2019-12-19 20:23:57
 * LastEditors  : OBKoro1
 * LastEditTime : 2019-12-20 18:54:45
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
    let time1 = '2019-01-02';
    let time2 = '2019-01-10';
    this.getAll(time1, time2);
  }
  formatTime(time) {
    return `${time} 08:00`;
  }
  getAll(begin, end) {
    let timeArr = []; // TODO: 时间段
    const beginSplit = begin.split('-');
    const endSplit = end.split('-');
    const beginDate = new Date();
    beginDate.setUTCFullYear(beginSplit[0], beginSplit[1] - 1, beginSplit[2]);
    const endDate = new Date();
    endDate.setUTCFullYear(endSplit[0], endSplit[1] - 1, endSplit[2]);
    const beginNumber = beginDate.getTime();
    const endNumber = endDate.getTime();
    for (var k = timeNumber; k <= endNumber; ) {
      console.log(new beginNumber(parseInt(k)).format());
      k = k + 24 * 60 * 60 * 1000;
    }
  }
  init() {
    this.getData();
    const time = moment().format('DD/MM/YYYY HH:MM:ss');
    let time3 = moment('2019-01-02 08:00').format();
    console.log('time', time2, time3);
    fs.writeFileSync('./test.md', time, 'utf-8');
    // this.commit();
  }
  getTime() {
    return '';
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
