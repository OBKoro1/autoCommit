/*
 * Author       : OBKoro1
 * Date         : 2019-12-25 17:13:30
 * LastEditors  : OBKoro1
 * LastEditTime : 2020-01-08 09:59:48
 * FilePath     : /autoCommit/src/util/vscodeUtil.ts
 * Description  : vscode 相关的公共方法
 * https://github.com/OBKoro1
 */
import * as vscode from 'vscode';

let extensionContext: vscode.ExtensionContext;
let webview: any;

// 存储插件上下午文
function setExtensionContext(context: any) {
  extensionContext = context;
}

// 获取插件上下文
function getExtensionContext(): vscode.ExtensionContext {
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

// 是否生产环境
function isProduction() {
  return process.env.NODE_ENV === 'production'; // production时 为打包安装版本
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
    },
  };

  actions[type]();
}

export {
  isProduction, // 是否生产环境
  outputLog, // 打印日志
  getPanelWebview, // 获取webview
  setPanelWebview, // 存储webview
  showMessage, // vscode 消息通知
  setExtensionContext, // 存储插件上下文
  getExtensionContext, // 获取插件上下文
};
