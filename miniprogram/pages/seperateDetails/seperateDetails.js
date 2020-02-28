// pages/seperateDetails/seperateDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate: "",
    authorityLevel: 0,
    companyReg: "",

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
      } else if (healthyDatas[i].isGoBackFlag == '0' && healthyDatas[i].isLeaveBjFlag == '0' && this.isInSeperation(healthyDatas[i].suregobackdate)) {
        var geli = {}
        geli['id'] = healthyDatas[i]._id
        geli['openid'] = healthyDatas[i]._openid
        geli['name'] = healthyDatas[i].name
        gelies.push(geli)
      } else if (healthyDatas[i].isGoBackFlag == '0' && healthyDatas[i].isLeaveBjFlag == '0' && !this.isInSeperation(healthyDatas[i].suregobackdate)) {
        var ugeli = {}
        ugeli['id'] = healthyDatas[i]._id
        ugeli['openid'] = healthyDatas[i]._openid
        ugeli['name'] = healthyDatas[i].name

        ugelies.push(ugeli)
      } else {
        var other = {}
        other['id'] = healthyDatas[i]._id
        other['openid'] = healthyDatas[i]._openid
        other['name'] = healthyDatas[i].name
        others.push(other)
      }
    }

    this.setData({
      quezhenDatas: quezhens,
      geliDatas: gelies,
      outGeliDatas: ugelies,
      otherDatas: others
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

    wx.cloud.callFunction({
      name: "healthyDatas",
      data: {
        date: this.data.currentDate
      },

      success: res => {
        this.setData({
          healthyDatas: res.result
        })

        if (this.data.authorityLevel == 0) {
          console.log("super level")
          this.analysisDatas(this.data.healthyDatas)
        } else {
          console.log("two level")
          var datas = this.healthyAuthorityDatas()
          this.analysisDatas(datas)
        }

        this.printDatas()
        wx.hideLoading()

      },

      fail: err => {
        console.error(err)
        wx.hideLoading()
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log("options: ", options)

    this.setData({
      currentDate: options.date,
      authorityLevel: parseInt(options.level),
      companyReg: options.companyReg
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
  onShareAppMessage: function () {

  }
})