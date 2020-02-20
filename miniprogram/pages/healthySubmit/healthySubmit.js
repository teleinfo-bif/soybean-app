// miniprogram/pages/healthySubmit/healthySubmit.js

const db = wx.cloud.database({
  env: "soybean-uat"
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: [
        {"id": 0, "content": "是"},
        {"id": 1, "content": "否"}
    ],

    coughStatus: false,
    weakStatus: false,
    diarrheaStatus: false,
    muscleSoreStatus: false,
    name: "默认充值",
    phone: ""

  },

  coughChange: function(res) {
    this.setData({
      coughStatus: res.detail.value == 0
    })

    console.log(this.data.coughStatus)
  },

  weakChange: function(res) {
    console.log(res)
    this.setData({
      weakStatus: res.detail.value == 0
    })
    console.log(this.data.weakStatus)
  },

  diarrheaChange: function(res) {
    this.setData({
      diarrheaStatus: res.detail.value == 0
    })

    console.log(this.data.diarrheaStatus)
  },

  muscleSoreChange: function(res) {
    this.setData({
      muscleSoreStatus: res.detail.value == 0
    })

    console.log(this.data.muscleSoreStatus)
  },

  healthySubmit: function(res) {
    console.log(res)
    db.collection("user_healthy").add({
      data: {
        name: res.detail.value.name,
        phone: res.detail.value.phone,
        location: res.detail.value.location,
        temperature: res.detail.value.temperature,
        is_cough: this.data.coughStatus,
        is_weak:  this.data.weakStatus,
        is_diarrhea: this.data.diarrheaStatus,
        is_muscle_sore: this.data.muscleSoreStatus
      },

      success: res => {
        console.log(res)
        wx.navigateTo({
          url: '/pages/submitSuccess/submitSuccess',
        })
      },

      fail: err => {
        console.error(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad")
    db.collection('user_info').where({
      _openid: "oqME_5djdr0nIcjsu6Wzq_yK1PBQ"
    }).get({
      success: res => {
        console.log(res)
        this.setData({
          name: res.data[0].name,
          phone: res.data[0].phone
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.log(err)
      }
    })
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