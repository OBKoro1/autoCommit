/*
 * Author       : OBKoro1
 * Date         : 2019-12-19 20:23:57
 * LastEditors  : OBKoro1
 * LastEditTime : 2019-12-20 11:38:56
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

  init() {
    const time = moment().format('DD/MM/YYYY HH:MM:ss');
    fs.writeFileSync('./test.md', time, 'utf-8');
    this.commit();
  }
  commit() {
    this.myExecSync(
      `sudo visudo && koro ALL = NOPASSWD: /sbin/poweroff, /sbin/start, /sbin/stop`
    );
    this.myExecSync(
      `sudo systemsetup -setusingnetworktime off && sudo systemsetup -setdate 09/02/19 && sudo systemsetup -setusingnetworktime on`
    );
    this.myExecSync(
      `git add . && git commit -m 'autoCommit' && git pull && git push`
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
      console.log(err, err.message, err.stack);
      console.log(`执行命令出错:${cmd}`);
    }
  }
}

new autoCommit();
