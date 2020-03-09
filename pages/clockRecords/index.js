// pages/SignRecords/index.js
import { getUserClockList } from "../../api/api";
const app = getApp();
// const beahavior_userInfo = require("../../behavior/userInfo");
Page({
  /**
   * 页面的初始数据
   */
  // behaviors: [beahavior_userInfo],
  data: {
    otherUserId: "",
    currentDate: new Date().getTime(),
    showDateText: "",
    clockData: {},
    // minDate: ,
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      }
      return value;
    },
    requestStutus: false
  },

  // behaviorCallback() {
  //   // this.getData();
  // },

  upper(e) {
    // console.log(e);
  },

  lower(e) {
    this.getData();
  },

  scroll(e) {},

  scrollToTop() {
    this.setAction({
      scrollTop: 0
    });
  },

  tap() {
    for (let i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1],
          scrollTop: (i + 1) * 200
        });
        break;
      }
    }
  },

  tapMove() {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    });
  },

  onInput(event) {
    this.setData({
      currentDate: event.detail
    });
  },

  // 请求scrow-view 列表方法
  getData() {
    const { requestStutus, clockData } = this.data;
    let { current = 0, pages = 0 } = clockData;
    if (!requestStutus && (current == 0 || pages > current)) {
      // debugger;
      this.setData({ requestStutus: true }, () => {
        getUserClockList({
          current: ++current,
          size: 20,
          userId: this.data.otherUserId || app.globalData.userFilledInfo.id
        }).then(data => {
          // 判断是不是第一次请求,current已经加一，处理iOS滑到底部可以频繁请求多次出发的问题
          if (
            clockData.total != undefined &&
            clockData.current == data.current
          ) {
            let clockData = clockData.records.concat(data.records);
            this.setData({
              requestStutus: false,
              clockData: {
                ...data,
                records: clockData
              }
            });
          } else {
            this.setData({
              requestStutus: false,
              clockData: data
            });
          }
        });
      });
    } else {
      console.log("group user has nomore data");
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const { userId } = options;
    // debugger;
    this.setData(
      {
        otherUserId: userId
      },
      this.getData
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
