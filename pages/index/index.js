//index.js
//获取应用实例
const app = getApp();
const chooseLocation = requirePlugin("chooseLocation");

Page({
  data: {
    globalData: app.globalData,
    statusBarHeight: 20,
    userInfo: app.globalData.userInfo,
    userFilledInfo: app.globalData.userFilledInfo,
    hasUserInfo: false,
    canIUse: wx.canIUse("button.open-type.getUserInfo")
  },
  setBarHeight() {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          statusBarHeight: res.statusBarHeight
        });
      }
    });
  },
  onLoad: async function() {
    this.setBarHeight();
    let globalData;
    if (!app.globalData.userFilledInfo.userRegisted) {
      globalData = await app.init(true);
    } else {
      globalData = app.globalData;
    }
    this.setData({
      globalData: globalData,
      userFilledInfo: globalData.userFilledInfo
    });
    // 动态设置小程序的顶部标题
  },
  getUserInfo: function(e) {
    // console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  },
  onShow() {
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    // console.log("====");
    // console.log(location);
  }
});
