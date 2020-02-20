// pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({

  data: {

  },



  onGetUserInfo: function (e) {
    let that = this;
    // 获取用户信息
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          console.log("已授权=====")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {
              console.log("获取用户信息成功", res)
              wx.reLaunch({
                url: '../index/index',
              })
            },
            fail(res) {
              console.log("获取用户信息失败", res)
            }
          })
        } else {
          console.log("未授权=====")
        }
      }
    })
  },




  goHome: function () {
    wx.reLaunch({
      url: '../index/index',
    })
  }

})