// miniprogram/pages/personalInfo/personal.js
const db = wx.cloud.database({
  env: "soybean-uat"
})

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  chooseCertificate: function(e){
    console.log(e)
    console.log("hello choose certificate")
  },

  submitUserInfo: function(e) {
    console.log(e)
    db.collection("user_info").add({
      data: {
        name: e.detail.value.name,
        phone: e.detail.value.phone,
        certificate_type: e.detail.value.certificate_type,
        certificate_number: e.detail.value.certificate_number,
        company: e.detail.value.company,
        company_district: e.detail.value.company_district,
        company_detail: e.detail.value.company_detail,
        home_district: e.detail.value.home_district,
        home_detail: e.detail.value.home_detail
      },

      success: res=> {
        console.log(res)
        
        wx.navigateTo({
          url: '/pages/submitSuccess/submitSuccess',
        })
        

      },

      fail: err => {
        console.log(err)
      }      
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (!wx.cloud) {
    //   console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    // } else {
    //   wx.cloud.init({
    //     traceUser: true,
    //     env: 'soybean-uat'
    //   })
    // }
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