
const app = getApp()

Page({


  data: {
    todayClickFlag: '0', //今日是否打卡标志，默认未打卡
    authorityLevel: 0,
    companyReg: "",
    titleText: ""
  },

  analysisLevel: function(level) {

    switch(level) {
      case 1:
      this.onQuery()

      break;

      case 2:
      this.onSecondQuery()

      break;
    }

  },

  

  onLoad: function (options) {

    const db = wx.cloud.database()

    db.collection('user_info').where({
      _openid: app.globalData.openid
    }).get({

      success: res => {
        console.log("res data: ", res.data)
        
        var superUser = res.data[0].superuser
        var userType = res.data[0].usertype
        var company = res.data[0].company_department

        console.log("company: ", company)

        var infoes = company.split(' ')
        var reg = ""
        var title = ""

        var level = 0
        if (superUser != null && superUser == '1'){
          level = 1
          reg = ".*"
          title = "中国信息通信研究院"

        }else if (userType == '1') {
          level = 2
          if (infoes[0] == '院属公司及协会'){
            reg = '.*' + infoes[1]
            title = infoes[1]
          }else {
            reg = infoes[0] + '.*'
            title = infoes[0]
          }
        }

        this.setData({
          authorityLevel: level,
          companyReg: reg,
          titleText: title
        })

        console.log("reg: ", reg)
        console.log("company reg: ", this.data.companyReg)

        this.analysisLevel(level)

      },

      fail: err => {
        console.log("error: ", err)
      }
    })

    // let that = this;
    // this.onQuery();
  },

  //返京日期
  setManager: function (e) {
    var value = e.currentTarget.dataset.id
    console.log("set manager...")
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

  //返京日期
  setSecondManager: function (e) {
    var value = e.currentTarget.dataset.id
    /**
 * 通过云函数调用可以获取全部45条的数据
 * 
 */
    console.log("set second manager...")
    wx.cloud.callFunction({
      name: "setUsetManager",
      data: {
        usertype: '2',
        applyid: value
      },
      success: res => {
        
        this.onSecondQuery();
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  cancelManager: function (e) {
    var value = e.currentTarget.dataset.id
    console.log("cancel manager...")
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
        // this.setData({
        //   userData: res.result
        // })
        this.onQuery();
      },
      fail: err => {
        console.log(err)
      }
    })

  },

  cancelSecondManager: function (e) {
    var value = e.currentTarget.dataset.id
    console.log("cancel second manager...")
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
        this.onSecondQuery();
      },
      fail: err => {
        console.log(err)
      }
    })

  },

  removeSecondManager: function(datas) {
    var temp = []
    for (var i = 0; i < datas.length; i++) {
      var superUser = datas[i].superuser
      if (datas[i].usertype != '1' && (superUser == null || superUser == undefined || superUser != '1')) {
        temp.push(datas[i])
      }
    }

    return temp 
  },

  removeSuperManager: function(datas) {
    var temp = []
    for (var i = 0; i < datas.length; i++) {
      var superUser = datas[i].superuser
      if ((superUser == null || superUser == undefined ||  superUser != '1') && datas[i].usertype != '2'){
        temp.push(datas[i])
      }
    }

    return temp

  },

  onQuery: function () {

    wx.showLoading({
      title: '数据加载中',
    })

    /**
     * 通过云函数调用可以获取全部45条的数据
     */
    wx.cloud.callFunction({
      name: "userInfoDatas",
      data: {
        company_department: this.data.companyReg
      },
      success: res => {
        console.log("查询用户信息表数据" + JSON.stringify(res, null, 2))
        var datas = this.removeSuperManager(res.result)
        this.setData({
          userData: datas
        })
        wx.hideLoading()
      },
      fail: err => {
        console.log(err)
        wx.hideLoading()
      }
      
    })
  },

    onSecondQuery: function () {

      wx.showLoading({
        title: '数据加载中',
      })

      /**
       * 通过云函数调用可以获取全部45条的数据
       */
      wx.cloud.callFunction({
        name: "userInfoDatas",
        data: {
          company_department: this.data.companyReg
        },
        success: res => {
          console.log("查询用户信息表数据" + JSON.stringify(res, null, 2))
          var datas = this.removeSecondManager(res.result)
          this.setData({
            userData: datas
          })
          wx.hideLoading()
        },
        fail: err => {
          console.log(err)
          wx.hideLoading()
        }

      })

    

  },










});