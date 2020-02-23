
Page({


  data: {
    todayClickFlag: '0' //今日是否打卡标志，默认未打卡
  },

  onLoad: function (options) {
    let that = this;
    this.onQuery();
  },

  //返京日期
  setManager: function (e) {
    var value = e.currentTarget.dataset.id
    /**
 * 通过云函数调用可以获取全部45条的数据
 */
    wx.cloud.callFunction({
      name: "setUsetManager",
      data: {
          usertype:'1',
          applyid: value
      },
      success: res => {
        this.onQuery();
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  cancelManager: function (e) {
    var value = e.currentTarget.dataset.id
    /**
 * 通过云函数调用可以获取全部45条的数据
 */
    wx.cloud.callFunction({
      name: "setUsetManager",
      data: {
        usertype: '0',
        applyid: value
      },
      success: res => {
        console.log("查询用户信息表数据" + JSON.stringify(res, null, 2))
        this.setData({
          userData: res.result
        })
        this.onQuery();
      },
      fail: err => {
        console.log(err)
      }
    })

  },

  onQuery: function () {
    /**
     * 通过云函数调用可以获取全部45条的数据
     */
    wx.cloud.callFunction({
      name: "getUserInfo",
      data: {

      },
      success: res => {
        console.log("查询用户信息表数据" + JSON.stringify(res, null, 2))
        this.setData({
          userData: res.result
        })
      },
      fail: err => {
        console.log(err)
      }
    })

  },










});