//app.js
// const behavior_app = require("./behavior/app");
import { getUserFilledInfo } from "./api/api";
import { tokenKey, userFilledInfofoKey } from "./api/request";
App({
  // behaviors: [behavior_app],
  initRequest: false,
  async init(refreshUserInfo = false) {
    if (this.globalData.appInit == false || refreshUserInfo) {
      console.log("app init 未完成初始化");
      const userFilledInfo = wx.getStorageSync(userFilledInfofoKey);
      const fedToken = wx.getStorageSync(tokenKey);
      this.globalData.fedToken = fedToken;

      // debugger;
      if (!refreshUserInfo && userFilledInfo && userFilledInfo.userRegisted) {
        this.setGloableUserInfo(userFilledInfo);
        console.log("this.globalData", this.globalData);
        return this.globalData;
      } else {
        let userFilledInfo = await getUserFilledInfo();
        this.setGloableUserInfo(userFilledInfo);
        console.log("this.globalData", this.globalData);
        return this.globalData;
      }
    } else {
      console.log("this.globalData", this.globalData);
      return this.globalData;
    }

    // console.log("app.js init userFilledInfo:", userFilledInfo);
    // console.log("app.js init fedToken:", fedToken);
  },

  setGloableUserInfo(userFilledInfo) {
    this.globalData.userFilledInfo = userFilledInfo;
    this.globalData.userRegisted = userFilledInfo.userRegisted;

    this.globalData.userId = userFilledInfo.id;
    this.globalData.appInit = true;
    console.warn("用户注册：", userFilledInfo.userRegisted);
    console.log("app init 完成初始化");
  },

  onLaunch: async function() {
    await this.init(true);

    // 获取用户信息
    wx.getSetting({
      success: res => {
        // 判断用户是否已授权获取用户信息
        if (res.authSetting["scope.userInfo"]) {
          console.log("已授权");
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res);
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          });
        } else {
          console.log("未授权获取用户信息");
        }
      }
    });
  },
  globalData: {
    auth: true, // 是否开启权限验证
    appInit: false,
    statusBarHeight: 20, // 标题栏高度-适配首页
    userInfo: null, // 从微信获取的用户信息

    userFilledInfo: {}, // 用户填写的个人信息
    userId: null,
    fedToken: null
  }
});
