// pages/statistics/status/index.js
const app = getApp();
import { baseURLDownload } from "../../../config/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    msg: "导出成功",
    groupId: "",
    clockInTime: "",
  },

  redirectTo(e) {
    wx.reLaunch({
      url: "/pages/index/index"
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const { groupId, clockInTime } = options;
    this.setData({
      groupId,
      clockInTime
    })
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


  exportExcel: function() {
    const { groupId, clockInTime } = this.data;
    console.log("导出数据", clockInTime, groupId);
    let url = `${baseURLDownload}/download/annex.xlsx?groupid=${groupId}&from=${clockInTime}`;
    wx.setClipboardData({
      data: url,
      success: function(res) {
        wx.showToast({
          icon: "none",
          title: "导出文件下载链接已复制到您的剪贴板，请到浏览器中粘贴下载",
          duration: 3000
        });
      }
    });
  },
});
