//index.js
//获取应用实例
const app = getApp();
// const chooseLocation = requirePlugin("chooseLocation");

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
    // let { userFilledInfo } = app.globalData;
    if (!app.globalData.appInit) {
      app.init(globalData => {
        this.setData({
          globalData: globalData,
          userFilledInfo: globalData.userFilledInfo
        });
      });
    } else {
      this.setData({
        globalData: app.globalData,
        userFilledInfo: app.globalData.userFilledInfo
      });
    }

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
    // 回退后刷新用户信息
    console.log("show update");
    app.refreshUserInfo();
    // const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    // console.log("====");
    // console.log(location);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
