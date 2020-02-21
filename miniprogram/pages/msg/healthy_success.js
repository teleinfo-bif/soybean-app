// pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({

  data: {

  },
  goHome: function () {
    wx.reLaunch({
      url: '../index/index',
    })
  }

})