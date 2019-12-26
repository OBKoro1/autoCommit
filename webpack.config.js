/*
 * Author       : OBKoro1
 * Date         : 2019-12-26 17:42:32
 * LastEditors  : OBKoro1
 * LastEditTime : 2019-12-26 20:58:58
 * FilePath     : /autoCommit/webpack.config.js
 * Description  : webpack 配置
 * https://github.com/OBKoro1
 */


//@ts-check

'use strict'

const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const outputPathName = 'out'

const pathResolve = p => {
  return path.resolve(__dirname, p)
}

/**@type {import('webpack').Configuration}*/
const config = {
  target: 'node', // vscode插件运行在Node.js环境中 📖 -> https://webpack.js.org/configuration/node/

  entry: './src/extension.ts', // 插件的入口文件 📖 -> https://webpack.js.org/configuration/entry-context/
  output: {
    // 打包好的文件储存在'dist'文件夹中 (请参考package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: pathResolve(outputPathName),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]'
  },
  devtool: 'source-map',
  externals: {
    vscode: 'commonjs vscode' // vscode-module是热更新的临时目录，所以要排除掉。 在这里添加其他不应该被webpack打包的文件, 📖 -> https://webpack.js.org/configuration/externals/
  },
  resolve: {
    alias: {
      '~': pathResolve('src')
    },
    // 支持读取TypeScript和JavaScript文件, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: pathResolve('src/views'),
        to: pathResolve(`${outputPathName}/views`),
        ignore: ['.*']
      },
      {
        from: pathResolve('src/assets'),
        to: pathResolve(`${outputPathName}/assets`),
        ignore: ['.*']
      }
    ])
  ]
}

module.exports = config
