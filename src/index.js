/*
 * Author       : OBKoro1
 * Date         : 2019-12-19 20:23:57
 * LastEditors  : OBKoro1
 * LastEditTime : 2019-12-25 15:23:38
 * FilePath     : /autoCommit/src/index.js
 * Description  : 自动commit
 * https://github.com/OBKoro1
 */

const { execSync } = require('child_process')
const moment = require('moment')
const fs = require('fs')

class autoCommit {
  constructor () {
    this.init()
  }
  getData () {
    this.getAllDay(this.paramsObj.beginDay, this.paramsObj.endDay)
    this.readyCommit()
  }
  // 格式化日期
  formatTime (time) {
    return `${time} 08:00`
  }
  // 获取两个日期之间的间隔: [ '2019-02-02', '2019-02-03' ... ]
  getAllDay (begin, end) {
    this.timeArr = []
    const beginSplit = begin.split('-')
    const endSplit = end.split('-')
    const beginDate = new Date()
    beginDate.setUTCFullYear(beginSplit[0], beginSplit[1] - 1, beginSplit[2])
    const endDate = new Date()
    endDate.setUTCFullYear(endSplit[0], endSplit[1] - 1, endSplit[2])
    const beginNumber = beginDate.getTime()
    const endNumber = endDate.getTime()
    for (let k = beginNumber; k <= endNumber;) {
      const day = new Date(parseInt(k))
      const dayFormat = moment(day).format('YYYY-MM-DD')
      this.timeArr.push(dayFormat)
      k = k + 24 * 60 * 60 * 1000
    }
  }
  init () {
    // TODO: 获取参数
    let paramsObj = {
      beginDay: '2019-12-20',
      itemSrc: '/Users/koro/work/web_my/testCommit' // 要commit的项目地址
    }
    let defaultOption = {
      beginDay: moment().format('YYYY-MM-DD'), // 默认为今天
      endDay: moment().format('YYYY-MM-DD'), // 默认为今天
      fileSrc: `commit.md`,
      commitNumber: 1 // 每天commit 次数
    }
    this.paramsObj = Object.assign(defaultOption, paramsObj)
    this.getData()
  }
  // commit
  readyCommit () {
    console.log('日期数组:', this.timeArr)
    console.log('每个日期提交次数:', this.paramsObj.commitNumber)
    let totalNum = 0 // 总commit次数
    // 遍历日期
    this.timeArr.forEach(item => {
      // 每个日期commit次数
      for (let i = 0; i < this.paramsObj.commitNumber; i++) {
        let time = this.formatTime(item) // 2019-01-02 08:00
        time = moment(time).format() // 2019-01-02T00:00:00+0800
        const commitContent = `${time}${i}`
        fs.writeFileSync(
          `${this.paramsObj.itemSrc}/${this.paramsObj.fileSrc}`,
          commitContent,
          'utf-8'
        )
        this.myExecSync(
          `cd ${this.paramsObj.itemSrc} && git add . && git commit -m 'autoCommit' --date='${time}' && git pull && git push origin master`
        )
        let cmd = `git log -1 \
        --date=iso --pretty=format:'{"commit": "%h","author": "%aN <%aE>","date": "%ad","message": "%s"},' \
        $@ | \
        perl -pe 'BEGIN{print "["}; END{print "]\n"}' | \
        perl -pe 's/},]/}]/'`
        this.myExecSync(cmd)
        this.totalNum++

        console.log('commit内容', commitContent)
        console.log(`总commit次数${totalNum}`)
      }
    })
  }

  myExecSync (cmd) {
    // 除了该方法直到子进程完全关闭后才返回 执行完毕 返回
    try {
      const res = execSync(cmd, {
        encoding: 'utf8',
        timeout: 0,
        maxBuffer: 200 * 1024,
        killSignal: 'SIGTERM',
        cwd: undefined,
        env: undefined
      })
      return res
    } catch (err) {
      console.log(`执行命令出错:${cmd}`)
    }
  }
}

new autoCommit()
