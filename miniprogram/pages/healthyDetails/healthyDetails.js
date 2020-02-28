// pages/healthyDetails/healthyDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate: "",
    authorityLevel: 0,
    companyReg: "",
    healthyDatas: [],
    serverDatas: [],
    otherDatas: [],
    goodDatas: [],

  },

  setQuezhenFirst: function(datas) {

    let res = []

    for (var i = 0; i < datas.length; i++) {
      if (datas[i].quezhen == '0'){
        res.push(datas[i])
      }
    }

    for (var i = 0; i < datas.length; i++) {
      if (datas[i].quezhen == '1') {
        res.push(datas[i])
      }
    }

    return res

  },

  analysisDatas: function(datas) {

    var goods = []
    var servers = []
    var others = []

    var healthyDatas = datas
    for (var i = 0; i < healthyDatas.length; i++) {
      if (healthyDatas[i].bodyStatusFlag == '0'){
        var good = {}
        good['id'] = healthyDatas[i]._id
        good['openid'] = healthyDatas[i]._openid
        good['name'] = healthyDatas[i].name

        goods.push(good)
      }else if (healthyDatas[i].bodyStatusFlag == '1'){
        var server = {}
        server['id'] = healthyDatas[i]._id
        server['openid'] = healthyDatas[i]._openid
        server['name'] = healthyDatas[i].name
        server['quezhen'] = healthyDatas[i].isQueZhenFlag
        servers.push(server)
      }else if (healthyDatas[i].bodyStatusFlag == '2'){
        var other = {}
        other['id'] = healthyDatas[i]._id
        other['openid'] = healthyDatas[i]._openid
        other['name'] = healthyDatas[i].name
        other['quezhen'] = healthyDatas[i].isQueZhenFlag
        others.push(other)
      }
    }

    servers = this.setQuezhenFirst(servers)
    others = this.setQuezhenFirst(others)

    this.setData({
      goodDatas: goods,
      serverDatas: servers,
      otherDatas: others
    })

  },

  healthyAuthorityDatas: function(e) {

    var datas = []
    var reg = new RegExp(this.data.companyReg)
    var healthyDatas = this.data.healthyDatas
    for (var i = 0; i < healthyDatas.length; i++) {
      if (reg.test(healthyDatas[i].company_department)){
        datas.push(healthyDatas[i])
      }
    }

    return datas
  },

  initDatas: function() {

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

        if (this.data.authorityLevel == 0){
          this.analysisDatas(this.data.healthyDatas)
        }else {
          var datas = this.healthyAuthorityDatas()
          this.analysisDatas(datas)
        }

        wx.hideLoading()
        console.log("good datas: ", this.data.goodDatas)
        console.log("server datas: ", this.data.serverDatas)
        console.log("other datas: ", this.data.otherDatas)

        console.log("healthy datas: ", this.data.healthyDatas)
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
    // this.analysisDatas()

    
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