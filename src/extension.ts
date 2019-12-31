/*
 * Author       : OBKoro1
 * Date         : 2019-12-25 15:15:42
 * LastEditors  : OBKoro1
 * LastEditTime : 2019-12-31 16:29:11
 * FilePath     : /autoCommit/src/extension.ts
 * Description  : 自动commit插件 入口
 * https://github.com/OBKoro1
 */

import * as vscode from 'vscode';
import ExtensionLogic from './models/index'
import { setExtensionContext } from './util/vscodeUtil'


// 扩展激活 默认运行
export function activate(context: vscode.ExtensionContext) {
	setExtensionContext(context)
	const autoCommit = vscode.commands.registerCommand('extension.autoCommit', () => {
		new ExtensionLogic(context)
	  })

  // 当插件关闭时被清理的可清理列表
	context.subscriptions.push(autoCommit);
}

// 扩展被禁用 调用
export function deactivate() {}
