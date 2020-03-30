// pages/index/EnteringInfo/EnteringInfo.js
import { getUserPhone } from "../../../api/api.js";
import { checkSessionKey } from "../../../api/request.js";
const app = getApp();
Component({
  lifetimes: {
    async attached() {
      // console.log("录入身份信息 init");
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
      // console.log(this.data);
      // console.log(this.data.userFilledInfo);
    },
    bindGetUserInfo(e) {
      if (e.detail.userInfo) {
        app.globalData.userInfo = e.detail.userInfo;
        wx.navigateTo({
          url: "/pages/personal/index"
        });
      } else {
      }
    },
    toPersonal() {
      wx.navigateTo({
        url: "/pages/personal/index"
      });
    },
    getPhoneNumberFromServer(data = {}) {
      // this.triggerEvent("change", 10010010011);
      getUserPhone(data)
        .then(res => {
          console.log(res);
          app.updateUserInfoByPhone(res.phoneNumber, true);
          // this.triggerEvent("change", res.phoneNumber);
        })
        .catch(e => {
          console.error("错误：获取手机号码失败", e);
          wx.showToast({
            title: "获取手机号码失败",
            icon: "none"
          });
          // this.triggerEvent("change", 13888888888);
        })
        .finally(() => {
          // console.error("complete");
        });
    },
    async getPhoneNumber(e) {
      if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
        wx.showModal({
          content: "不能获取手机号码",
          showCancel: false
        });
        return;
      }
      let { fedToken } = app.globalData;
      const sessionState = await checkSessionKey();
      console.log("点击获取手机号按钮，session状态是", sessionState);
      if (!sessionState) {
        console.log("sessionKey无效重新获取sessionKey");
        fedToken = await getOpenId();
        app.globalData.fedToken = fedToken;
      }
      // 此处没有判断token的有效状态
      let requestData = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionKey: fedToken.sessionKey
      };
      this.getPhoneNumberFromServer(requestData);
    }
  }
});
