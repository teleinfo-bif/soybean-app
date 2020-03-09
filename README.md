# soybean-app

微信小程序健康打卡，健康统计，0.4 版本

使用说明和常见问题，可参阅下面的说明 **开发人员务必查看下面初始化过程和编码说明 👇**

## 扫码体验

<img src="./doc/qr.jpeg" width="200px">

## 初始化

安装 npm 依赖，构建 npm

`npm install --registry=https://registry.npm.taobao.org`

## 编译说明

本项目使用基于 ES7 的语法，所以请在开发工具中开启 “增强编译”， 否则会提示以下错误：

```
thirdScriptError
 sdk uncaught third Error
 regeneratorRuntime is not defined
 ReferenceError: regeneratorRuntime is not defined
```

<img src="./doc/setting.jpg" width="300px" >

**如果你的开发工具没用看到“增强编译”的选项，请升级开发工具到最新版**

## 编码说明

- **`scss` 可以在相应目录自建同名 scss 文件,有 `scss` 文件的不要改 `wxss`,`sass` 编译是 `wxss` 文件会被覆盖掉
  使用 sass 可运行 `npm run dev` 可实时编译 scss 到同目录同名 `wxss` 文件**

- 不要随意修改 app.globalData 的值，app.globalData.userFilledInfo 是用户录入信息，包括微信基础信息，若后续操作会影响全局变量请考虑使用 deepclone

- api.js 没再细分，所以保证名字有特点不要冲突，get 方法，post 写了两种，1.request body 中 raw 形式直接用 post 2.需要拼接在 URL 参数里使用 postParams 方法可参考/api/api.js 写法

- 需要 userId 的接口无需在参数中添加，已在封装累中统一添加，直接放其他参数就可以，参数中携带的 userId 会覆盖当前用户的 userId

  独立开发的页面如果需要依赖用户数据，可以在`onLoad`中调用，开发结束后可以去掉

```
const app = getApp()
if(!app.globalData.appInit){
	app.init(() => {
		// 需要执行的函数或代码 和下面一样
	})
}esle{
// 需要执行的函数或代码
}

```

## 上线流程

1. 从 develop 分支建立新的发布版本 vxx
2. 修改新建发布分支 vxx 配置文件`/api/request.js`中的 baseURL
3. 提交体验版本，备注中说明为上线版本。
4. 管理员提交审核
5. 发布审核版本

（体验版本从`develop`分支提交，线上版本从`release`提交）
