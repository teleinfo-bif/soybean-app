// pages/threeDepartments/threeDepartments.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleInfo: "",
    currentDate: "",
    departmentName: "",
    clickdetail: [],
  },

  qryClickInfoByDate: function(e) {
    this.setData({
      currentDate: e.detail.value
    })
    this.initDatas(this.data.department, e.detail.value)
  }, 

  gotoStatistics: function (e) {
    console.log(e.currentTarget.dataset.name)
    var name = e.currentTarget.dataset.name;
    var departName = this.data.department + ' ' + name
    wx.navigateTo({
      url: '../statistics/statistics?name=' + departName + '&&date=' + this.data.currentDate + '&&level=3'
    })
  },

  gotoDetails: function (e) {
    console.log("data set name: ", e.currentTarget.dataset.name)
    var name = e.currentTarget.dataset.name
    var departName = this.data.department + ' ' + name
    wx.navigateTo({
      url: '../totaluserdetail/totaluserdetail?name=' + departName + '&&date=' + this.data.currentDate + '&&level=3'
    })
  },

  initDatas: function(name, date) {
   
   wx.cloud.callFunction({
     name: "threeDepartmentsNumber",
     data: {
       name: name
     }, 

     success: res => {
      console.log("res: ", res.result)

      var departmentNames = res.result[0]
      var nums = res.result[1]

      var temp = []
      for (var i = 0; i < nums.length; i++) {
        var con = {}
        con['name'] = departmentNames[i]
        con['num'] = nums[i]
        temp.push(con)
      }

      this.setData({
        titleInfo: name,
        department: name,
        currentDate: date,
        clickdetail: temp,
      })
     },

     fail: err => {
       console.log("error: ", err)
     }
   })

    



     
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let name = options.name
    var date = options.date 
    console.log('name: ', name)
    console.log("date: ", date)
    this.initDatas(name, date)

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