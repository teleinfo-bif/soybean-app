import { getNotice } from "../../api/request";
import { getUserNotices, readNotice } from "../../api/api"
import Notify from '../../vant-weapp/notify/notify';
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
    notification: "",
    canIUse: wx.canIUse("button.open-type.getUserInfo"),
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
    getNotice()
      .then(data => {
        this.setData({
          notification: data.title
        });
      })
      .catch(error => {
        console.log("错误提醒：首页footer-getNotice()错误", error);
      });

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

    // getUserNotices({
    //   userId: app.globalData.userFilledInfo.id,
    //   status: 0,
    //   category: 0,
    //   size: 10,
    // }).then(data => {
    //   const records = data.records.slice(0, 2);
    //   console.log('records', data, app.globalData.userFilledInfo.id)
    //   if (records.length > 0) {
    //     const text = records.map(obj => obj.content).join("\r\n")
    //     const ids = records.map(obj => obj.id).join(",")
    //     this.notifyUser(text)
    //     console.log(text, ids)
    //     readNotice({
    //       noticeIds: ids
    //     }).then(res => {
    //       console.log(res)
    //     })
    //   }

    // })
    
  },
  getUserInfo: function(e) {
    // console.log(e);
    app.globalData.userInfo = e.detail.userInfo;
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
  },
  onShow() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options) {
    // var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    return {
      title: "复工复产通行证", // "泰尔通邀请你来打卡啦！",    // 默认是小程序的名称(可以写slogan等)
      path: "/pages/index/index", // 默认是当前页面，必须是以‘/'开头的完整路径
      imageUrl: "../../static/images/share.jpg",
      success: function(res) {
        // 转发成功之后的回调
        if (res.errMsg == "shareAppMessage:ok") {
        }
      },
      fail: function() {
        // 转发失败之后的回调
        if (res.errMsg == "shareAppMessage:fail cancel") {
          // 用户取消转发
        } else if (res.errMsg == "shareAppMessage:fail") {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
      complete: function() {
        // 转发结束之后的回调（转发成不成功都会执行）
      }
    };
  },

  toHelp: function() {
    wx.navigateTo({
      url: "/pages/help/service/index"
    });
  },
  notifyUser(text) {
    // Notify({
    //   backgroundColor: '#07c160',
    //   // backgroundColor: '#f5f5f5',
    //   text: text,
    //   duration: 3000,
    //   selector: '#van-notify',
    //   safeAreaInsetTop: true
    // })
    wx.showToast({
      title: text,
      icon: "none",
      duration: 3000,
      mask: true
    });
  },
});
