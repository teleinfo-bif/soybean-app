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
    loginUserInfo: "用户注册",
    department: '',//所在部门
    todayClickFlag: "0",
    groupType: '1',
    swiperPages: [
      "../epidemiNews/epidemiNews",
      "../epidemiMap/epidemicMap"
    /*   "../journeyCheck/journeyCheck" */
    ],
    indicatorDots: false,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 500,
    imgQR:'',

    userInfoFlagYes: true,
    userInfoFlagNo: false,
  },
  testQR: function () {
    var that = this
    wx.request({
      url: "https://www.guokezhixing.com/secHealth/version1/healthRecord/miniSubmitRecord",
      data: {

      },
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      success(res) {
        // console.log(res.data); 
        console.log('=====请求sucessTESTQR=====', res);
        that.setData({
          imgQR: res.data.data.qrcodeUrl
        })

      },
      fail() {
        console.log('====请求失败=====');
      }
    })
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

              console.log("------------- res.userInfo.avatarUr", res.userInfo.avatarUrl)

              console.log("app.globalData.avatarUrl = res.userInfo.avatarUrl, ", app.globalData.avatarUrl)
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName,
              })
            }
          })
        } else {
          this.setData({
            userInfoFlagYes: false,
            userInfoFlagNo: true
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
    console.log("查询健康打卡日期的值为：" + Y + M + D);
    db.collection('user_healthy').where({
      _openid: app.globalData.openid,
      date: Y + M + D
    }).get({
      success: res => {
        console.log(res)
        //今日已打卡
        if (res.data.length > 0) {
          that.data.todayClickFlag = '1'
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
      // usertype: '1'
    }).get({
      success: res => {
        console.log("管理员信息返回结果：", res.data);
        if (res.data[0].usertype == '1') {
          this.setData({
            isManagerFlag: '1'
          })
        }else if (res.data[0].usertype == '2'){
          this.setData({
            isManagerFlag: '2'            
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

        var department = res.data[0].company_department
        var infoes = department.split(' ')
        var regInfo = ""
        var groupType = "1"
        var title = "众志成城，抗击疫情" 
        var superuser = res.data[0].superuser
        var userType = res.data[0].usertype
        
        if (superuser != null && superuser == "1") {
          title = "中国信息通信技术研究院"
          groupType = "2"
        }else if (userType == '1'){
          title = infoes[0]
          // level = 2
          if (infoes[0] == '院属公司及协会') {
            regInfo = '.*' + infoes[1]
            title = infoes[1]
          } else {
            regInfo = infoes[0] + ".*"
            title = infoes[0]
            groupType = "2"
          }
        }else if (userType == '2'){
          regInfo = "",
          title = infoes[1]
        } else {
          regInfo = "",
          title = infoes[1]
        }


        that.setData({
          name: res.data[0].name,
          phone: res.data[0].phone,
          userinfo: res.data,
          // loginUserInfo: "您好， " + res.data[0].name + '!',
          loginUserInfo: res.data[0].name,
          department: title
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
    if (this.data.todayClickFlag == '1') {
      wx.navigateTo({
        url: '../healthyClocked/healthyClocked'
      })
    } else {
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
            // url: '../totaluserdetail/totaluserdetail?companyinfo=' + res.data[0].company_department + '&superuser=' + this.data.isSuperUserFlag

            url: '../totaluserdetail/totaluserdetail'
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
      data: {},
      success: res => {
        // 成功拿到手机号，跳转首页
        console.log("获取超级管理员", JSON.stringify(res.result, null, 2));
        if (res.result.total > 0) {
          this.setData({
            isSuperUserFlag: '1'
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


  onGetUserInfo: function (e) {
    let that = this;
    // 获取用户信息
    wx.getSetting({
      success(res) {
        console.log("------------- res", res)
        if (res.authSetting['scope.userInfo']) {
          console.log("已授权=====")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {

              console.log("------------- res1", res)

              console.log("获取用户信息成功", res)
              app.globalData.nickName = res.userInfo.nickName
              app.globalData.avatarUrl = res.userInfo.avatarUrl
              that.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                userInfoFlagYes: true,
                userInfoFlagNo: false
              })
              wx.reLaunch({
                url: 'index',
              })
            },
            fail(res) {
              console.log("获取用户信息失败", res)
            }
          })
        } else {
          console.log("未授权=====")
        }
      }
    })

    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function () {
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
  },

  onShareAppMessage: function (options) {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "愿亲人平安 春暖艳阳天 一起健康打卡！", // "泰尔通邀请你来打卡啦！",    // 默认是小程序的名称(可以写slogan等)
      path: '/pages/index/index',    // 默认是当前页面，必须是以‘/'开头的完整路径
      imageUrl: '../../images/zongzhichengchengshare.jpg',
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
        }
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
      complete: function () {
        // 转发结束之后的回调（转发成不成功都会执行）
      }
    }
    // // 来自页面内的按钮的转发
    // if (options.from == 'button') {
    //   var eData = options.target.dataset;
    //   console.log(eData.name);   // shareBtn
    //   // 此处可以修改 shareObj 中的内容
    //   shareObj.path = '/pages/btnname/btnname?btn_name=' + eData.name;
    // }
    
    console.log("shareObj, ", shareObj)
    return shareObj;
  },

  gotoStatistics: function() {
    wx.navigateTo({
      url: '../statistics/statistics'
    })
  },
  gotoDetailClick: function() {
    if(this.data.groupType == '2' ){
      wx.navigateTo({
        url: '../departmentDetail/departmentDetail?department='+ this.data.department + "&isSuperUserFlag=" + this.data.isSuperUserFlag
      })
    } else {
      wx.navigateTo({
        url: '../totaluserdetail2/totaluserdetail2'
      })
    }
  }
  

})
