//app.js
// const behavior_app = require("./behavior/app");
import { getUserFilledInfo } from "./api/api";
import { userFilledInfofoKey } from "./api/request";
App({
  // behaviors: [behavior_app],
  async init() {
    const userFilledInfo = wx.getStorageSync(userFilledInfofoKey);
    if (userFilledInfo.id) {
      this.setGloableUserInfo(userFilledInfo);
      return this.globalData;
    } else {
      getUserFilledInfo().then(data => {
        this.setGloableUserInfo(data);
        return this.globalData;
      });
    }
  },

  setGloableUserInfo(userFilledInfo) {
    this.globalData.userFilledInfo = userFilledInfo;
    this.globalData.userRegisted = Object.keys(userFilledInfo).length > 0;
    this.globalData.userId = userFilledInfo.id;
  },

  onLaunch: async function() {
    await this.init();

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
    auth: false, // 是否开启权限验证
    statusBarHeight: 20, // 标题栏高度-适配首页
    openid: null, // openid
    sessionKey: null, // sessionKey
    userInfo: null, // 从微信获取的用户信息
    userRegisted: false, // 用户是否填写了个人信息
    userFilledInfo: null, // 用户填写的个人信息
    userId: null
  }
});
