// pages/group/shareJoin/index.js
// import { encode } from "../../../utils/code";

Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log()
    const { groupId, timeStamp } = options;
    // let a = encode(timeStamp);
    const userful = timeStamp - Date.now() < 24 * 60 * 60 * 1000;
    wx.showModal({
      title: "",
      content: `groupId:${groupId} - timeStamp: ${timeStamp},解谜后：groupId:${groupId} - timeStamp:${timeStamp},有效状态是 ${userful},`,
      showCancel: true,
      cancelText: "取消",
      cancelColor: "#000000",
      confirmText: "确定",
      confirmColor: "#3CC51F"
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
