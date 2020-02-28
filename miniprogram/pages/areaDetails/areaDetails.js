// pages/areaDetails/areaDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate: "",
    authorityLevel: 0,
    companyReg: "",

    wuhanDatas: [],
    hubeiDatas: [],
    otherDatas: [],
    beijingDatas: []

  },

  analysisDatas: function (datas) {

    var wuhans = []
    var hubeis = []
    var others = []
    var beijings = []

    var healthyDatas = datas
    for (var i = 0; i < healthyDatas.length; i++) {
      if (healthyDatas[i].isGoBackFlag == '0') {
        var beijing = {}
        beijing['id'] = healthyDatas[i]._id
        beijing['openid'] = healthyDatas[i]._openid
        beijing['name'] = healthyDatas[i].name

        beijings.push(beijing)
      } else if (/.*武汉/.test(healthyDatas[i].place)) {
        var wuhan = {}
        wuhan['id'] = healthyDatas[i]._id
        wuhan['openid'] = healthyDatas[i]._openid
        wuhan['name'] = healthyDatas[i].name
        wuhans.push(wuhan)
      } else if (/.*湖北/.test(healthyDatas[i].place)) {
        var hubei = {}
        hubei['id'] = healthyDatas[i]._id
        hubei['openid'] = healthyDatas[i]._openid
        hubei['name'] = healthyDatas[i].name
       
        hubeis.push(hubei)
      }else {
        var other = {}
        other['id'] = healthyDatas[i]._id
        other['openid'] = healthyDatas[i]._openid
        other['name'] = healthyDatas[i].name
        others.push(other)
      }
    }

    this.setData({
      wuhanDatas: wuhans,
      hubeiDatas: hubeis,
      otherDatas: others,
      beijingDatas: beijings
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

  printDatas: function(e) {
    console.log("wuhan datas: ", this.data.wuhanDatas)
    console.log("hubei datas: ", this.data.hubeiDatas)
    console.log("other datas: ", this.data.otherDatas)
    console.log("beijing datas: ", this.data.beijingDatas)
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