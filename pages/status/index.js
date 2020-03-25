// pages/status/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    app,
    msg: "提交成功",
    jigou: ''
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
    const { msg = "提交成功", jigou } = options;
    this.setData({
      msg,
      jigou
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

  toCode: function() {
    wx.navigateTo({
      url: `/pages/group/groupCode/index`,
    });
  },

  toCreateGroup: function() {
    wx.navigateTo({
      url: `/pages/group/createGroup/createGroup`,
    });
  },
});
