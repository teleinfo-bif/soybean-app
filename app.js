//app.js
import { appInit, getUserInfo } from "./api/request";
import { env } from "./config/index";
// import { getUnionId } from "./utils/unionId/demo";
App({
  initRequest: false,
  callbackList: [],
  // 需要依赖openid，用户录入信息的页面，判断如果页面没有完成初始化，调用此函数
  async init(callback) {
    this.callbackList.push(callback);
    return;
  },

  // 更新用户信息
  async refreshUserInfo(init = false) {
    if (init) {
      await this.onLaunch();
      return this.globalData.userFilledInfo;
    } else {
      let userFilledInfo = await getUserInfo();
      // console.log("===================================");
      console.log("app.js refreshUserInfo()更新用户信息成功", userFilledInfo);
      // console.log("===================================");
      this.setGloableUserInfo(userFilledInfo);
      console.log("app init 完成初始化");

      return userFilledInfo;
    }
  },

  // 设置app global 用户录入信息
  async setGloableUserInfo(userFilledInfo) {
    this.globalData.userFilledInfo = userFilledInfo;
    this.globalData.userRegisted = userFilledInfo.userRegisted;

    this.globalData.userId = userFilledInfo.id;
    this.globalData.appInit = true;
    // 请求完成之后，执行回调队列中的任务
    this.callbackList.forEach(callback => {
      // console.log(callback);
      callback(this.globalData);
    });
    this.callback = [];
    console.warn(`用户${userFilledInfo.userRegisted ? "已" : "未"}注册`);
  },

  onLaunch: async function() {
    // 环境判断
    this.globalData.release = env == "release";
    const initData = await appInit();
    // debugger;
    // getUnionId();
    this.globalData = {
      ...this.globalData,
      ...initData
    };
    // console.log("=============initData===================");
    // console.log(this.globalData);
    // console.log("=============initData===================");
    await this.setGloableUserInfo(initData.userFilledInfo);

    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     // 判断用户是否已授权获取用户信息
    //     if (res.authSetting["scope.userInfo"]) {
    //       console.log("已授权");
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           console.log(res);
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo;

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res);
    //           }
    //         }
    //       });
    //     } else {
    //       console.log("未授权获取用户信息");
    //     }
    //   }
    // });
  },
  globalData: {
    release: null, //是否是生产环境
    auth: true, // 是否开启权限验证
    appInit: false,
    statusBarHeight: 20, // 标题栏高度-适配首页
    userInfo: null, // 从微信获取的用户信息
    userFilledInfo: {}, // 用户填写的个人信息
    userId: null, // 用户id
    fedToken: null // token、session、openID信息
  }
});
