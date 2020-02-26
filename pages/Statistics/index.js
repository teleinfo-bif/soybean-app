// pages/Statistics/index.js
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
import { getGroupStatistic } from "../../api/api";

Page({
  onShareAppMessage: function(res) {
    return {
      title: "ECharts 可以在微信小程序中使用啦！",
      path: "/pages/index/index",
      success: function() {},
      fail: function() {}
    };
  },

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    value: "",
    ecHealth: {
      lazyLoad: true
    },
    ecArea: {
      lazyLoad: true
    },
    ecHospital: {
      lazyLoad: true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    getGroupStatistic({
      groupId: 1,
      clockInTime: ""
    }).then(data => {
      try {
        console.log("JSON.parse: ", JSON.parse(data));
      } catch (e) {
        // console.error(e);
      }
      this.setData({
        data: {
          totality: {
            total: 0,
            clockIn: 10,
            unClockIn: -10,
            notInbeijing: 10,
            goBackBeijing: 0,
            abnormalbody: 5,
            diagnosis: 0
          },
          healthy: [
            { name: "健康", value: 5, percent: 50.0 },
            { name: "发烧，咳嗽", value: 5, percent: 50.0 },
            { name: "其他症状", value: 0, percent: 0.0 }
          ],
          region: [
            { name: "北京", value: 0, percent: 0.0 },
            { name: "湖北", value: 0, percent: 0.0 },
            { name: "武汉", value: 0, percent: 0.0 },
            { name: "其他地区", value: 10, percent: 100.0 }
          ],
          hospitalization: [
            { name: "确诊", value: 0, percent: 0.0 },
            { name: "隔离期", value: 10, percent: 100.0 },
            { name: "出隔离期", value: 0, percent: 0.0 },
            { name: "其他", value: 0, percent: 0.0 }
          ]
        }
      });
    });
    this.setData({
      value: getyyyyMMdd(new Date())
    });
  },
  onChange(e) {
    const { value } = e.detail;
    this.setData({
      value
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
