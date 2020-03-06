// pages/code/code.js
const app = getApp()
const healthQrCodeUrl = '';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcodeUrl: "",
    name: "",
    jobNumber: '',
    updateTime: '',
    description: '',
  },

  testQR: function () {
    var that = this
    wx.request({
      url: "https://www.guokezhixing.com/secHealth/version1/healthRecord/miniSubmitRecord",
      data: {
        realName: that.data.name,
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
          updateTime: "更新于：" +res.data.data.updateTime,
          title:res.data.data.title,
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
      url: 'https://admin.bidspace.cn/bid-soybean/healthQrcode/createHealthQrcode',
      data: { 
        userId: that.data.userId 
      },
      method: 'GET', 
      header: { 'content-type': 'application/json' }, 
      success: function (res) {
        if(res.data.code == '200'){
          var array = wx.base64ToArrayBuffer(res.data.data.base64)
          var base64 = wx.arrayBufferToBase64(array)
          that.setData({ qrcodeUrl: 'data:image/jpeg;base64,' + base64, });
          console.log('=====请求sucessTESTQR=====', res);
          that.setData({
            updateTime: "更新于：" + res.data.data.updateTime,
            title: res.data.data.title,
            description: res.data.data.description
          }) 
        }else{
          wx.showToast({
            title: '健康码加载失败',
            icon: 'none',
            duration: 2000
          })
        } 

      },
      fail: function () {
        // fail
        wx.showToast({
          title: '健康码加载失败',
          icon: 'none',
          duration: 2000
        })
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