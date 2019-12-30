/*
 * Author       : OBKoro1
 * Date         : 2019-12-25 17:13:30
 * LastEditors  : OBKoro1
 * LastEditTime : 2019-12-30 21:10:57
 * FilePath     : /autoCommit/src/util/vscodeUtil.ts
 * Description  : vscode 相关的公共方法
 * https://github.com/OBKoro1
 */
import * as vscode from 'vscode';

let extensionContext = '';
let webview: any;

// 存储插件上下午文
function setExtensionContext(context: any) {
  extensionContext = context;
}

// 获取插件上下文
function getExtensionContext() {
  return extensionContext;
}

// 存储webview
function setPanelWebview(webviewClass: any) {
  webview = webviewClass;
}

// 获取webview
function getPanelWebview() {
  return webview;
}

// 输出日志
function outputLog(...arr: any) {
  console.log('日志', ...arr);
  webview.postMessage('console-log', arr);
}

// vscode 消息通知
function showMessage(message: string, type = 'error') {
  const actions: any = {
    info: () => {
      vscode.window.showInformationMessage(message);
    },
    alert: () => {
      vscode.window.showWarningMessage(message);
    },
    error: () => {
      vscode.window.showErrorMessage(message);
    }
  };

  actions[type]();
}

export {
  outputLog, // 打印日志
  getPanelWebview, // 获取webview
  setPanelWebview, // 存储webview
  showMessage, // vscode 消息通知
  setExtensionContext, // 存储插件上下文
  getExtensionContext // 获取插件上下文
};
