// pages/SignRecords/index.js
import { getUserClockList } from "../../api/api";
// const beahavior_userInfo = require("../../behavior/userInfo");
Page({
  /**
   * 页面的初始数据
   */
  // behaviors: [beahavior_userInfo],
  data: {
    requestInit: false,
    currentDate: new Date().getTime(),
    showDateText: "",
    clockData: {
      current: 0,
      pages: 0,
      searchCount: true,
      size: 0,
      total: 0,
      records: []
    },
    clockList: [],
    // minDate: ,
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      }
      return value;
    },

    list: [
      {
        name: "测试1",
        sign: true,
        status: 0
      }
    ]
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

  getData() {
    let { requestInit } = this.data;
    let { pages, current } = this.data.clockData;
    if (!requestInit || pages > current) {
      getUserClockList({
        current: ++current
      }).then(res => {
        this.setData({
          clockData: res,
          clockList: this.data.clockList.concat(res.records)
        });
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const { userId } = options;
    console.log(userId);
    this.getData();
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