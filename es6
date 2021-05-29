模块。出口 =  {
  扩展：[ 'airbnb-typescript/base' ] ，
  解析器选项：{
    createDefaultProgram : true ,
    项目：'./tsconfig.json' ，
  },
  解析器：'@typescript-eslint/parser' ，
  插件：[ '@typescript-eslint' ] ，
  规则：{
    '无控制台' : '关闭' ,
    'no-restricted-syntax' : 'off' ,
    'no-continue'：'off' ，
    // 禁止使用 var
    '无变量'：'错误' ，
    // 优先使用 interface 而不是 type
    '@typescript-eslint/consistent-type-definitions' : [ 'error' ,  'interface' ] ,
  },
