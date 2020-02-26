//app.js
import { getOpenId, getUserFilledInfo } from "./api/api.js";

App({
  getUserFilledInfo(openid) {
    getUserFilledInfo({ openid: openid }).then(data => {
      this.globalData.userFilledInfo = data;
      console.log(Object.keys(data).length > 0);
      this.globalData.userRegisted = Object.keys(data).length > 0;
      console.log(data);
    });
  },

  // 公用跳转方法
  navigateTo({ url = "", ...option }) {
    wx.navigateTo({
      url,
      ...option
    });
  },

  onLaunch: function() {
    //  判断storage中有没有openid，没有则像服务端请求，然后获取用户信息
    const openid = wx.getStorageSync("openid");
    if (openid) {
      this.globalData.openid = openid;
      this.getUserFilledInfo(openid);
    } else {
      getOpenId().then(({ openid }) => {
        this.globalData.openid = openid;
        this.globalData.session_key = openid;
        this.getUserFilledInfo(openid);
      });
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // 判断用户是否已授权获取用户信息
        if (res.authSetting["scope.userInfo"]) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
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
        // 判断用户是否授权了位置信息
        if (res.authSetting["scope.userLocation"]) {
          console.log("已授权位置信息");
          // wx.getLocation({
          //   altitude: true,
          //   success(res2) {
          //     const latitude = res.latitude;
          //     const longitude = res.longitude;
          //     const speed = res.speed;
          //     const accuracy = res.accuracy;
          //     console.log(res2);
          //     // wx.navigateTo({ url: getLocationPluginMapUrl(res2) });
          //   }
          // });
        } else {
          console.log("未授权位置信息");
        }
      }
    });

    // wx.getUserLo

    // wx.lo
    // 展示本地存储能力
    var logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);
  },
  globalData: {
    auth: false,
    statusBarHeight: 20,
    openid: null,
    session_key: null,
    userInfo: null,
    userRegisted: false,
    userFilledInfo: null
  }
});
