// pages/detail/detail.js
var treeData = {
  text: 'teleinfo研发部门',
  id: 0,
  date: "2019-05-01",
  nodes: [
    {
      id: 1,
      text: "周厚发",
      clockin: "已打卡",
      status: "发烧",
    },
    {
      id: 2,
      text: "郑鹏",
      clockin: "已打卡",
      status: "正常",
    },
    {
      id: 3,
      text: "李腾",
      clockin: "未打卡",
      status: "--",
    },
    {
      id: 1,
      text: "周厚发",
      clockin: "已打卡",
      status: "发烧",
    },
    {
      id: 2,
      text: "郑鹏",
      clockin: "已打卡",
      status: "正常",
    },
    {
      id: 3,
      text: "李腾",
      clockin: "未打卡",
      status: "--",
    },
    {
      id: 1,
      text: "周厚发",
      clockin: "已打卡",
      status: "发烧",
    },
    {
      id: 2,
      text: "郑鹏",
      clockin: "已打卡",
      status: "正常",
    },
    {
      id: 3,
      text: "李腾",
      clockin: "未打卡",
      status: "--",
    },
  ]
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    treeData: treeData,
  },

  //事件处理函数
  tapItem: function (e) {
    console.log('index接收到的itemid: ' + e.detail.itemid);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})