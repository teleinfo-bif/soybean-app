// pages/code/code.js
const app = getApp()
const healthQrCodeUrl = '';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcodeUrl: "/images/QRGreen.png",
    realName: "",
    jobNumber: '',
    updateTime: '',
    description: '',
  },

  testQR: function () {
    var that = this
    wx.request({
      url: "https://www.guokezhixing.com/secHealth/version1/healthRecord/miniSubmitRecord",
      data: {
        realName: that.data.realName,
        idCard: that.data.idCard,
        phone: that.data.phone,
        unit: that.data.unit,
        unitAddress: that.data.unitAddress,
        isLeave: that.data.isLeave,
        returnDate: that.data.returnDate,
        currentAddress: that.data.currentAddress,
        isTouchCase: that.data.isTouchCase,
        currentHealth: that.data.currentHealth,
        userId: that.data.userId,
        openId: that.data.openId
      },
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      success(res) {
        // console.log(res.data); 
        console.log('=====请求sucessTESTQR=====', res);
        that.setData({
          qrcodeUrl: res.data.data.qrcodeUrl,
          updateTime: res.data.data.updateTime,
          realName:res.data.data.title,
          description: res.data.data.description
        })

      },
      fail() {
        console.log('====请求失败=====');
      }
    })
  },

  //后端数据获取
  queryUserData (){
    var that = this

    wx.request({
      url: 'https://admin.bidspace.cn/bid-soybean/wx/interaction/show/user',
      data: { 
        userId: that.data.userId 
      },
      method: 'GET', 
      header: { 'content-type': 'application/json' }, 
      success: function (res) {
        // success
        if(res.data.code == '200'){
          console.log("========res=====", res.data.data.id)
          that.setData({
            realName: res.data.data.name,
            idCard: res.data.data.idNumber,
            phone: res.data.data.phone,
            unit: res.data.data.companyName,
            unitAddress: res.data.data.companyDetailAddress,
            returnDate: res.data.data.gobacktime,
            currentAddress: res.data.data.address,
            currentHealth: res.data.data.healthyString,
            openId: res.data.data.wechatId
          })
          if (res.data.data.hubeiString == '是') {
            that.setData({
              isTouchCase: true
            })
          } else if (res.data.data.hubeiString == '否') {
            that.setData({
              isTouchCase: false
            })
          }
          if (res.data.data.leaveString == '是') {
            that.setData({
              isLeave: true
            })
          } else if (res.data.data.leaveString == '否') {
            that.setData({
              isLeave: false
            })
          }
          that.testQR()
        }

      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    let userId = app.globalData.userFilledInfo.id

    this.setData({
      userId: userId
    })

    console.log("current userId: ", this.data.userId)
    this.queryUserData ()
    wx.hideLoading()
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