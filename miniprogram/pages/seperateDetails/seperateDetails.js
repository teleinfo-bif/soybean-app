// pages/seperateDetails/seperateDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate: "",
    authorityLevel: 0,
    companyReg: "",
    department: "",

    quezhenDatas:[],
    geliDatas: [],
    outGeliDatas: [],
    otherDatas: []

  },

  isInSeperation: function(date) {
    var days14Diffms = 1209600000

    var currentData = new Date(this.data.currentDate)
    var thenDate = new Date(date)

    if (currentData.getTime() - thenDate.getTime() < days14Diffms) {
      return true
    } 

    return false

  },

  analysisDatas: function (datas) {

    var quezhens = []
    var gelies = []
    var ugelies = []
    var others = []

    var healthyDatas = datas
    for (var i = 0; i < healthyDatas.length; i++) {
      if (healthyDatas[i].isQueZhenFlag == '0') {
        var quezhen = {}
        quezhen['id'] = healthyDatas[i]._id
        quezhen['openid'] = healthyDatas[i]._openid
        quezhen['name'] = healthyDatas[i].name

        quezhens.push(quezhen)
      } else if (healthyDatas[i].isLeaveBjFlag == '0' &&healthyDatas[i].isQueZhenFlag == '1' ) {
        var geli = {}
        geli['id'] = healthyDatas[i]._id
        geli['openid'] = healthyDatas[i]._openid
        geli['name'] = healthyDatas[i].name
        gelies.push(geli)
      } else if (healthyDatas[i].isLeaveBjFlag == '1' &&  healthyDatas[i].isQueZhenFlag == '1' ) {
        var ugeli = {}
        ugeli['id'] = healthyDatas[i]._id
        ugeli['openid'] = healthyDatas[i]._openid
        ugeli['name'] = healthyDatas[i].name

        ugelies.push(ugeli)
      } 
      
      // else {
      //   var other = {}
      //   other['id'] = healthyDatas[i]._id
      //   other['openid'] = healthyDatas[i]._openid
      //   other['name'] = healthyDatas[i].name
      //   others.push(other)
      // }
    }

    this.setData({
      quezhenDatas: quezhens,
      geliDatas: gelies,
      outGeliDatas: ugelies,
      // otherDatas: others
    })

  },

  healthyAuthorityDatas: function (e) {

    var datas = []
    var reg = new RegExp(this.data.companyReg)
    var healthyDatas = this.data.healthyDatas
    for (var i = 0; i < healthyDatas.length; i++) {
      if (reg.test(healthyDatas[i].company_department)) {
        datas.push(healthyDatas[i])
      }
    }

    return datas
  },

  printDatas: function (e) {
    console.log("quezhen datas: ", this.data.quezhenDatas)
    console.log("geli datas: ", this.data.geliDatas)
    console.log("out geli datas: ", this.data.outGeliDatas)
    console.log("other datas: ", this.data.otherDatas)
  },


  initDatas: function () {

    wx.showLoading({
      title: '加载中...',
    })

    console.log("authorith level: ", this.data.authorityLevel)

    switch (this.data.authorityLevel) {
      case 1:
        wx.cloud.callFunction({
          name: "oneLevelDatas",
          data: {
            date: this.data.currentDate
          },

          success: res => {
            console.log("res result: ", res.result)
            var healthyDatas = res.result[1]
            this.analysisDatas(healthyDatas)
            wx.hideLoading()
          },

          fail: err => {
            console.log("error: ", err)
            wx.hideLoading()
          }
        })
        break;

      case 2:
        wx.cloud.callFunction({
          name: "twoLevelDatas",
          data: {
            date: this.data.currentDate,
            company_department: this.data.companyReg
          },

          success: res => {
            console.log("res result: ", res.result)
            var healthyDatas = res.result[1]
            this.analysisDatas(healthyDatas)
            wx.hideLoading()
          },

          fail: err => {
            console.log("error: ", err)
            wx.hideLoading()
          }
        })
        break;

      case 3:
        wx.cloud.callFunction({
          name: "twoLevelDatas",
          data: {
            date: this.data.currentDate,
            company_department: this.data.department
            
          },

          success: res => {
            console.log("res result: ", res.result)
            var healthyDatas = res.result[1]
            this.analysisDatas(healthyDatas)
            wx.hideLoading()
          },

          fail: err => {
            console.log("error: ", err)
            wx.hideLoading()
          }
        })
        break;
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log("options: ", options)

    this.setData({
      currentDate: options.date,
      authorityLevel: parseInt(options.level),
      companyReg: options.companyReg,
      department: options.department
    })

    this.initDatas()

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
  // onShareAppMessage: function () {

  // }
})