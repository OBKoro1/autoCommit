/*
 * Author       : OBKoro1
 * Date         : 2019-12-25 17:08:18
 * LastEditors  : OBKoro1
 * LastEditTime : 2019-12-26 17:41:05
 * FilePath     : /autoCommit/src/models/index.ts
 * Description  : 插件逻辑入口
 * https://github.com/OBKoro1
 */
import * as vscode from 'vscode';
import WebView from './WebView';
import { webviewMsg }  from '../util/dataStatement'


class ExtensionLogic {
  public readonly context: vscode.ExtensionContext;
  public MessageCallBack: any;
  public autoCommitView: WebView;
  
  public constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.autoCommitView  = new WebView(this.context, this.messageCallBack);
  }
  createView() {
      const option = {
        type: 'autoCommit',
        title: 'Github自动提交commit工具',
        fileName: 'autoCommit'
      }
    this.autoCommitView.create(option)
  }
  // 处理webview的消息
  private messageCallBack(message: webviewMsg) {
    if (message.data.id === 'user-login-message') {
    //   this.userLogin(message.params);
    }
  }
}

export default ExtensionLogic;
