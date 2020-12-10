/*
 * Author       : OBKoro1
 * Date         : 2019-12-25 17:08:18
 * LastEditors  : OBKoro1
 * LastEditTime : 2020-12-10 16:39:26
 * FilePath     : \autoCommit\src\models\index.ts
 * Description  : 插件逻辑入口
 * https://github.com/OBKoro1
 */
import * as vscode from 'vscode';
import * as fs from 'fs';
import { sep } from 'path';
import WebView from './WebView';
import { WebviewMsg } from '../util/dataStatement';
import { setPanelWebview, isProduction, outputLog } from '../util/vscodeUtil';
import CommitHandle from './commitHandle';

const hasGit = (itemSrc: string) => {
  const url = `${itemSrc}${sep}.git`; // 文件路径
  try {
    const isDirectory = fs.statSync(url).isDirectory(); // 判断是否为文件夹 返回布尔值
    if (isDirectory) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

class ExtensionLogic {
  public readonly context: vscode.ExtensionContext;

  public autoCommitView!: WebView ; // 告诉ts我已经对它初始化了

  public CommitHandle: any;

  public constructor(context: vscode.ExtensionContext) {
    // 存储参数
    this.context = context;
  }

  public init() {
    this.autoCommitView = new WebView(
      this.context,
      this.messageCallBack.bind(this),
    ) as WebView;
    setPanelWebview(this.autoCommitView);
    this.createView();
  }

  createView() {
    const option = {
      type: 'autoCommit',
      title: 'autoCommit',
      fileName: 'autoCommit',
    };
    this.autoCommitView.create(option);
    this.autoCommitView.postMessage('isProduction', isProduction());
    const formData = this.context.globalState.get('commit-params');
    this.autoCommitView.postMessage('init-formData', formData);
  }

  // 处理webview的消息
  private messageCallBack(message: WebviewMsg) {
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
      canSelectMany: false, // 是否可以选择多个文件
    });
    if (!urlArr) return; // 用户取消选择
    let itemSrc = urlArr[0].path;
    if (sep === '\\') {
      // window 系統用不同的路径
      itemSrc = urlArr[0].fsPath;
    }

    if (hasGit(itemSrc)) {
      this.autoCommitView.postMessage('choose item success', itemSrc);
    } else {
      this.autoCommitView.postMessage('choose item error', itemSrc);
      outputLog('项目地址错误', `${itemSrc}根目录没有.git文件夹`);
    }
  }
}

export default ExtensionLogic;
