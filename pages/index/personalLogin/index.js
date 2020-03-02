// pages/index/EnteringInfo/EnteringInfo.js
const app = getApp();
Component({
  lifetimes: {
    async attached() {
      console.log("录入身份信息 init");
      if (!app.globalData.userFilledInfo) {
        // ;
        app.init(globalData => {
          this.setData({
            globalData: globalData
          });
        });
      }
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    }
  },

  /**
   * 组件的属性列表
   */
  properties: {
    userFilledInfo: {
      type: Object,
      default: () => {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // userFilledInfo: app.globalData.userFilledInfo,
    // globalData: {}
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
      console.log(this.data.userFilledInfo);
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
