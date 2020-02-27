import { getUserFilledInfo } from "../api/api.js";

const app = getApp();
module.exports = Behavior({
  properties: {},
  data: {
    openid: null, // openid
    sessionKey: null, // sessionKey
    userId: null,
    userRegisted: false, // 用户是否填写了个人信息
    userFilledInfo: null
  },
  lifetimes: {
    attached() {
      // const openid = app.globalData.openid || wx.getStorageSync("openid");
      // if (openid) {
      //   app.globalData.openid = openid;
      //   this.getUserFilledInfo(openid);
      // } else {
      //   getOpenId().then(({ openid, sessionKey }) => {
      //     app.globalData.openid = openid;
      //     app.globalData.sessionKey = openid;
      //     this.setData({
      //       openid,
      //       sessionKey: sessionKey
      //     });
      //     this.getUserFilledInfo(openid);
      //   });
      // }
    }
  },
  methods: {
    getUserFilledInfo(openid) {
      getUserFilledInfo({ openid: openid }).then(data => {
        const userRegisted = Object.keys(data).length > 0;
        app.globalData.userFilledInfo = data;
        app.globalData.userRegisted = userRegisted;
        try {
          this.setData(
            {
              userId: data.id,
              userRegisted,
              userFilledInfo: data
            },
            this.behaviorCallback
          );
        } catch (e) {
          console.error("userInfo behavior error:", e);
        }
      });
    }
  }
});
