// pages/unhealthy/unhealthy.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleInfo: "非健康详情表",
    currentDate: "",
    authorityLevel: 0,
    companyReg: "",
  },

  analysisDatas: function(datas) {
    let temp = []
    for (var i = 0; i < datas.length; i++) {

      if (datas[i].isQueZhenFlag == '0') {
        temp.push(datas[i])
      }
    }

    for (var i = 0; i < datas.length; i++) {

      if (datas[i].isQueZhenFlag == '1') {
        temp.push(datas[i])
      }
    }

    console.log("temp: ", temp)

    this.setData({
      clickdetail: temp,
    })
  },

  showList: function(e) {
    
    wx.cloud.callFunction({
      name: "unHealthy",
      data: {
        "date": this.data.currentDate
      },

      success: res => {
        console.log("res data: ", res)

        var datas = []
        var regExp = new RegExp(this.data.companyReg)
        if (this.data.authorityLevel == 1) {
          for (var i = 0; i < res.result.length; i++ ){
            if (regExp.test(res.result[i].company_department)){
              console.log("push data: ", res.result[i])
              datas.push(res.result[i])
            }else {
              console.log("un match")
            }
          }

          this.analysisDatas(datas)
        }else {
          this.analysisDatas(res.result)
        }

      },
      fail: err => {
        console.log("err: ", err)
      }
    })
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    console.log("options", options)
    this.setData({
      currentDate: options.date,
      authorityLevel: parseInt(options.level),
      companyReg: options.company
    })

    console.log("authority level: ", this.data.authorityLevel)
    console.log("company reg info: ", this.data.companyReg)
    this.showList()

   
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