// pages/index/EnteringInfo/EnteringInfo.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    userFilledInfo: app.globalData.userFilledInfo,
    globalData: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // toNextPage() {
    //   wx.navigateTo({
    //     url: "/pages/personal/index"
    //   });
    // },
    test() {
      console.log(this.data);
      console.log(app.globalData);
    },
    bindGetUserInfo(e) {
      if (e.detail.userInfo) {
        app.globalData.userInfo = e.detail.userInfo;
        wx.navigateTo({
          url: "/pages/personal/index"
        });
      } else {
      }
    }
  }
});
