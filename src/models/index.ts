/*
 * Author       : OBKoro1
 * Date         : 2019-12-25 17:08:18
 * LastEditors  : OBKoro1
 * LastEditTime : 2020-01-02 14:35:12
 * FilePath     : /autoCommit/src/models/index.ts
 * Description  : 插件逻辑入口
 * https://github.com/OBKoro1
 */
import * as vscode from 'vscode';
import WebView from './WebView';
import { webviewMsg } from '../util/dataStatement';
import { setPanelWebview, isProduction } from '../util/vscodeUtil';
import CommitHandle from './commitHandle';
import { outputLog } from '../util/vscodeUtil';
import * as fs from 'fs';
import { sep } from 'path';

class ExtensionLogic {
  public readonly context: vscode.ExtensionContext;
  public MessageCallBack: any;
  public autoCommitView: WebView;
  public CommitHandle: any;

  public constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.autoCommitView = new WebView(
      this.context,
      this.messageCallBack.bind(this)
    );
    setPanelWebview(this.autoCommitView);
    this.createView();
  }
  createView() {
    const option = {
      type: 'autoCommit',
      title: 'Github自动提交commit工具',
      fileName: 'autoCommit'
    };
    this.autoCommitView.create(option);
    this.autoCommitView.postMessage('isProduction', isProduction());
  }
  // 处理webview的消息
  private messageCallBack(message: webviewMsg) {
    if (message.command === 'commit') {
      this.CommitHandle = new CommitHandle(message);
    } else if (message.command === 'choose-item') {
      this.publishChooseFile();
    } else if (message.command === 'cancel autoCommit') {
      this.CommitHandle.closeCommit();
    }
  }
  // 选择项目文件夹
  async publishChooseFile() {
    const urlArr: any = await vscode.window.showOpenDialog({
      canSelectFiles: false, // 允许选择文件
      canSelectFolders: true, // 是否可以选择文件夹
      canSelectMany: false // 是否可以选择多个文件
    });
    if (!urlArr) return; // 用户取消选择
    const itemSrc = urlArr[0].path;
    if (this.hasGit(itemSrc)) {
      this.autoCommitView.postMessage('choose item success', itemSrc);
    } else {
      this.autoCommitView.postMessage('choose item error', itemSrc);
      outputLog('项目地址错误', `${itemSrc}根目录没有.git文件夹`);
    }
  }
  public hasGit(itemSrc: string) {
    const url = `${itemSrc}${sep}.git`; // 文件路径
    try {
      let isDirectory = fs.statSync(url).isDirectory(); // 判断是否为文件夹 返回布尔值
      if (isDirectory) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }
}

export default ExtensionLogic;
