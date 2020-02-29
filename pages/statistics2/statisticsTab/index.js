// pages/statistics/statisticsTab/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: ["北京", "武汉", "湖北其他", "全国其他"],
    // currentTab: ['健康', '发烧、咳嗽', '其他'],
    currentTab3: ["北京", "武汉", "湖北其他", "全国其他"],
    currentTab2: ["确诊", "隔离期", "出隔离期", "其他"],
    currentData: [],
    tabs: [
      {
        name: "",
        tabNames: ["北京", "武汉", "湖北其他", "全国其他"]
      }
    ]
  },
  onClick(event) {
    console.log(event);
    wx.showToast({
      title: `点击标签 ${event.detail.name}`,
      icon: "none"
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

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
