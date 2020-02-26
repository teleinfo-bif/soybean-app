// pages/Detail/index.js
function getyyyyMMdd(date) {
  var d = date || new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth() + 1;
  var curr_year = d.getFullYear();
  String(curr_month).length < 2 ? (curr_month = "0" + curr_month) : curr_month;
  String(curr_date).length < 2 ? (curr_date = "0" + curr_date) : curr_date;
  var yyyyMMdd = curr_year + "-" + curr_month + "-" + curr_date;
  return yyyyMMdd;
}
import { getUserClockList } from "../../api/api.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    now: "",
    value: "",
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
    show: false,
    currentDate: new Date().getTime(),
    showDateText: "",
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

  onChange(e) {
    const { value } = e.detail;
    this.setData({
      value
    });
  },
  setLabel(val = "") {
    this.setData({
      label: val
    });
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

  getData() {
    let temp = [];
    for (let i = 0; i < 10; i++) {
      temp.push({
        name: "测试" + (i + 1),
        sign: i % 3 != 1 ? true : false,
        status: i % 3
      });
    }
    console.log(temp);
    this.setData({
      list: this.data.list.concat(temp)
    });
    getUserClockList({
      userId: 60
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getData();
    this.setData({
      value: getyyyyMMdd(new Date())
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
