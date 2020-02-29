# soybean-app

微信小程序健康打卡，健康统计，0.4 版本

使用说明和常见问题，可参阅下面的说明

## 扫码体验

<img src="./" width="200px">

## 初始化

安装 npm 依赖，构建 npm

`npm install --registry=https://registry.npm.taobao.org`

运行 `npm run dev` 可实时编译 scss 到同目录同名 wxss 文件

## 编译说明

本项目使用基于 ES7 的语法，所以请在开发工具中开启 “增强编译”， 否则会提示以下错误：

```
thirdScriptError
 sdk uncaught third Error
 regeneratorRuntime is not defined
 ReferenceError: regeneratorRuntime is not defined
```

<img src="https://dcdn.it120.cc/2019/08/28/c5169c15-abda-4e5f-91d5-6dfcfe382fb2.png">

**如果你的开发工具没用看到“增强编译”的选项，请升级开发工具到最新版**
