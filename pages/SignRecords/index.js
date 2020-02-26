// pages/SignRecords/index.js
import { getUserClockList } from "../../api/api";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    currentDate: new Date().getTime(),
    showDateText: "",
    blockData: {
      current: 0,
      pages: 0,
      searchCount: true,
      size: 0,
      total: 0,
      records: [
        {
          address: "",
          admitting: 0,
          avatarUrl: "",
          comfirmed: 0,
          createTime: "",
          gobacktime: "",
          healthy: 0,
          hospital: 0,
          id: 0,
          nobackreason: 0,
          quarantine: 0,
          reason: "",
          remarks: "",
          temperature: 0,
          userId: 0,
          userName: "",
          wuhan: 0
        }
      ]
    },
    blockList: [],
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

  test2(a) {
    console.log(a);
    this.setData({
      show: false
    });
  },

  upper(e) {
    console.log(e);
  },

  lower(e) {
    console.log(e);
    console.log("到底了");
    this.getData();
  },

  scroll(e) {
    console.log(e);
  },

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

  test() {
    console.log("123");
    this.setData({
      show: true
    });
  },
  formatDate(date) {
    console.log(typeof date);
    return 1;
  },

  getData() {
    getUserClockList({
      userId: 60
    }).then(res => {
      this.setData({
        blockData: res,
        blockList: this.data.blockList.concat(res.records)
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getData();
    const now = new Date();
    this.setData({
      showDateText:
        now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDay()
    });
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
