// pages/code/code.js
const app = getApp()
const healthQrCodeUrl = '';
import { getUserHealthyQR } from "../../api/api.js";


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

  queryUserQR:function(){
    var that = this
    getUserHealthyQR({
      userId: that.data.userId
    }).then(res => {
      wx.hideLoading()
      console.log('=====healthyQR===', res)
      var array = wx.base64ToArrayBuffer(res.base64)
      var base64 = wx.arrayBufferToBase64(array)
      that.setData({ qrcodeUrl: 'data:image/jpeg;base64,' + base64, });
      console.log('=====请求sucessTESTQR=====', res);
      that.setData({
        updateTime: "更新于：" + res.updateTime,
        title: res.title,
        description: res.description
      })        
    }).catch(e => {
      console.log(e)
      wx.showToast({
        title: '健康码加载失败',
        icon: 'none',
        duration: 2000
      })
      wx.hideLoading()
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
    this.queryUserQR ()
    //wx.hideLoading()
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
  onShareAppMessage: function (options) {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "愿亲人平安 春暖艳阳天 一起健康打卡！", // "泰尔通邀请你来打卡啦！",    // 默认是小程序的名称(可以写slogan等)
      path: '/pages/index/index',    // 默认是当前页面，必须是以‘/'开头的完整路径
      imageUrl: '',
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
        }
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
      complete: function () {
        // 转发结束之后的回调（转发成不成功都会执行）
      }
    }
    // // 来自页面内的按钮的转发
    // if (options.from == 'button') {
    //   var eData = options.target.dataset;
    //   console.log(eData.name);   // shareBtn
    //   // 此处可以修改 shareObj 中的内容
    //   shareObj.path = '/pages/btnname/btnname?btn_name=' + eData.name;
    // }

    console.log("shareObj, ", shareObj)
    return shareObj;
  }
})