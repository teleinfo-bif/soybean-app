//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: '',
    userInfo: {},
    logged: false,
    takeSession: false,
    address: '',
    // 展示列表
    locationList: [],
    // 默认当前坐标附近的列表
    poiList: [],
    isManagerFlag: '0',
    isSuperUserFlag: '0', 
    loginUserInfo: "录入用户信息"
  },

  onLoad: function () {
    var that = this;
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    that.getSessionCode();
    // this.onGetOpenid()

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              console.info("用户信息为：" + JSON.stringify(res.userInfo, null, 2));
              app.globalData.nickName = res.userInfo.nickName
              app.globalData.avatarUrl = res.userInfo.avatarUrl
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName,
              })
            }
          })
        }
      }
    })
    this.onGetOpenid()
   
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
     
  },


  //查询当前打卡信息
  qryHealthyTodayInfo: function () {
    let that = this;
    //获取当天日期
    var date = new Date();
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    const db = wx.cloud.database()
    console.log("查询健康打卡日期的值为：" + Y+M+D);
    db.collection('user_healthy').where({
      _openid: app.globalData.openid,
      date: Y + M + D
    }).get({
      success: res => {
        console.log(res)
        //今日已打卡
        if (res.data.length > 0) {
          app.globalData.todayClickFlag = '1'
        }
        that.getUserManagerFlag();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.log(err)
      }
    })
  },


  /**获取sessionCode和openid */
  getSessionCode: function (e) {
    let that = this;
    wx.login({
      success(res) {
        if (res.code) {
          console.log(res)
          //发起网络请求
          app.globalData.sessionCode = res.code
        //  that.getUserManagerFlag();
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  /**获取管理员标志 */
  getUserManagerFlag: function () {
    let that = this
    const db = wx.cloud.database()
    console.log("查询当前用户是否为管理员：" + app.globalData.openid);
    db.collection('user_info').where({
      _openid: app.globalData.openid,
      usertype : '1'
    }).get({
      success: res => {
        console.log("管理员信息返回结果：", res.data);
        if (res.data.length > 0) {
          this.setData({
            isManagerFlag: '1'
          })
        }
        this.getSuperUser();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.log(err)
      }
    })
  },

  
  //查询用户基本信息
  qryUserInfo: function () {
    let that = this
    const db = wx.cloud.database()
    db.collection('user_info').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        console.log("datas: ", res)
        that.userinfo = res.data;
        that.setData({
          name: res.data[0].name,
          phone: res.data[0].phone,
          userinfo: res.data,
          loginUserInfo: "你好！ " + res.data[0].name
        })

        // app.globalData.userBaseInfo = res.data[0]
        // console.log("base info index:", app.gloabalData.userBaseInfo)

      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.log(err)
      }
    })
  },

  //跳转打卡记录页面
  gotoHealthyClick: function (e) {
    if (app.globalData.todayClickFlag == '1'){
      wx.navigateTo({
        url: '../healthyClocked/healthyClocked'
      })
    }else{
      console.log("跳转到健康打卡页面")
      const db = wx.cloud.database()
      db.collection('user_info').where({
        _openid: app.globalData.openid
      }).get({
        success: res => {
          console.log(res)
          if (res.data.length > 0) {
            wx.navigateTo({
              url: '../healthyClock/healthyClock'
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '请先录入用户信息'
            })
          }
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.log(err)
        }
      })
    }
  },

  

  //跳转打卡记录页面
  gotomemberDetailClick: function (e) {
    console.log("跳转详细信息页面")
    const db = wx.cloud.database()
    db.collection('user_info').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        console.log(res)
        if (res.data.length > 0) {
          wx.navigateTo({
            url: '../totaluserdetail/totaluserdetail?companyinfo=' + res.data[0].company_department + '&superuser=' + this.data.isSuperUserFlag
         //    url: '../memberDetail/memberDetail'
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '请先录入用户信息'
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.log(err)
      }
    })
  },
  

  /**用户信息提交 */
  userInfoPut: function (e) {
    wx.navigateTo({
      url: '../personalInfo/personalInfo',
    })
  },


  getSuperUser: function () {
    var that = this;
    wx.cloud.callFunction({
      name: 'superUser',  // 对应云函数名
      data: { },
      success: res => {
        // 成功拿到手机号，跳转首页
        console.log("获取超级管理员", JSON.stringify(res.result, null, 2));
        if(res.result.total > 0){
            this.setData({
              isSuperUserFlag:'1'
            })
        }
      },
      fail: err => {
        console.error(err);
      }
    })
  },


  getPhoneNumber: function (e) {
    var that = this;
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        content: '不能获取手机号码',
        showCancel: false
      })
      return;
    }
    wx.showLoading({
      title: '获取手机号中...',
    })

    wx.cloud.callFunction({
      name: 'getToken',  // 对应云函数名
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionCode: app.globalData.sessionCode    // 这个通过wx.login获取，去了解一下就知道。这不多描述
      },
      success: res => {
        wx.hideLoading()
        // 成功拿到手机号，跳转首页
        console.log(res.result.data);
        app.globalData.phoneNumber = res.result.data.phoneNumber
      },
      fail: err => {
        console.error(err);
        wx.showToast({
          title: '获取手机号失败',
          icon: 'none'
        })
      }
    })

  },


  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        console.log("###### openid: ", res.result.openid)
        this.qryUserInfo()
        this.qryHealthyTodayInfo();
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.showToast({
          icon: 'none',
          title: '登录失败',
        })
      }
    })
  }

})
