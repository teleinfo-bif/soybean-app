// pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({

  data: {

  },
  goHome: function () {
    wx.reLaunch({
      url: '../index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date()
    console.log(date)
    // console.log(date.getDate())
    // console.log(date.getDay())
    // console.log(date.getFullYear())
    // console.log(date.getHours())
    // console.log(date.getMonth())
    // console.log(date.getMinutes())
    // console.log(date.getSeconds())

    // console.log(date.getFullYear())
    // console.log(date.getUTCFullYear())
    // console.log(date.getUTCMonth())
    // console.log(date.getMonth())

    console.log(date.getDay())
    console.log(date.getUTCDay())
  },

})