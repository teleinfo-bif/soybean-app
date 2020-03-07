
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
    loginUserInfo: "",
    // department: '',//所在部门
    departments: [],//所在的部门群组s
    todayClickFlag: "0",
    isRegistered: false,
    groupType: '1',//2是管理员1非管理员
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
    useOnly: '',

    userInfoFlagYes: true,
    userInfoFlagNo: false,

    subsidiaryCompany: ['通信网络安全专业委员会', '迪瑞克通信工程咨询有限责任公司', '华瑞赛维通信技术有限公司', '华瑞网研科技有限公司', '金元宾馆', '瑞特电信技术公司', '思维力咨询有限责任公司', '泰尔赛科科技有限公司', '五龙电信技术公司', '海淀亚信技术公司', '增值服务专业委员会', '通信标准化协会', '北京泰尔信科物业管理有限公司', '北京泰尔英福网络科技有限责任公司', '重庆电子信息中小企业公共服务有限公司', '南方分院派遣', '中国通信企业协会信息通信服务工作委员会', '部科技委办公室', '信通院（武汉）科技创新中心有限公司'],

    noThreeDepartments: ['院领导', '办公室（保密办公室）', '党群工作部（离退休干部办公室）', '纪检监察审计部', '科技发展部', '业务发展部', '人力资源部', '财务部', '国际合作部', '资产管理部', '实验室质量管理部', '互联网行业促进中心', '雄安研究院保定分院工作筹备组', '政务专项办'],

  },

  isInSubsidiaryCompanies: function (name) {
    var datas = this.data.subsidiaryCompany
    for (var i = 0; i < datas.length; i++) {
      if (name == datas[i]) {
        return true
      }
    }
    return false
  },

  isInSingleTwoDeparments: function (name) {
    var datas = this.data.noThreeDepartments
    for (var i = 0; i < datas.length; i++) {
      if (name == datas[i]) {
        return true
      }
    }
    return false
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

    var data1 = "院属党总支部 科技发展部党支部"
    var flag = /^科技发展部.*/.test(data1)
    console.log("@@@@@@  flag: ", flag)

    // var address = '河北省张家口市桥西区温馨家园'
    // var infoes = address.split('市')
    // console.log("@@@@@@@@@@@ infoes: ", infoes)
    
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
    this.getAppContent()

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  getCurrenteDate: function() {
    let that = this;
    //获取当天日期
    var date = new Date();
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    
    console.log("查询健康打卡日期的值为：" + Y + M + D);
    return Y + M + D
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
        if (res.data.length == 0) {
          that.setData({
            loginUserInfo: "用户注册",
            isRegistered: false
          })

          return
        }

        that.userinfo = res.data;

        

        that.setData({
          name: res.data[0].name,
          phone: res.data[0].phone,
          userinfo: res.data,
          // loginUserInfo: "您好， " + res.data[0].name + '!',
          loginUserInfo: res.data[0].name,
          isRegistered: true
        })

        console.log("company: ", res.data[0].company_district)
        var infoes = res.data[0].company_district.split(' ')
        console.log("infoes: ", infoes)
        app.globalData.workPlace = infoes[1]

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
  
  //跳转健康码页面
  gotoHealthyQR: function (e) {
    if (this.data.todayClickFlag == '1') {
      wx.navigateTo({
        url: '../healthQR/healthQR'
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
            wx.showToast({
              icon: 'none',
              title: '请先健康打卡'
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
        if (res.authSetting['scope.userInfo']) {
          console.log("已授权=====")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success(res) {

              console.log("获取用户信息成功", res)
              app.globalData.nickName = res.userInfo.nickName
              app.globalData.avatarUrl = res.userInfo.avatarUrl
              that.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                userInfoFlagYes: true,
                userInfoFlagNo: false
              })
              // wx.reLaunch({
              //   url: 'index',
              // })
              wx.navigateTo({
                url: '../personalInfo/personalInfo',
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
        this.getUserGroupInfo()
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

  /**获取程序声明内容 */
  getAppContent: function () {
    let that = this
    const db = wx.cloud.database()
    db.collection('content').get({
      success: res => {
        let useOnly = "仅面向中国信通院用户使用"
        if (res.data.length == 1) {
          useOnly = res.data[0].useOnly
        }

        that.setData({
          useOnly: useOnly
        })

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

  gotoStatistics: function(e) {
    let department = e.currentTarget.dataset.name;
    if (this.data.isManagerFlag == '2') {
      console.log("111111")
      wx.navigateTo({
        url: '../statistics/statistics'
      })
    }else {
      console.log("2222222")
      wx.navigateTo({
        url: '../statistics/statistics?title='+department
      })
    }
  },

  gotoDetailClick: function(e) {
    let department = e.currentTarget.dataset.name;
    let type = e.currentTarget.dataset.type;
    let isXintongyuan = e.currentTarget.dataset.xty;
    let serialNumber = e.currentTarget.dataset.num;
    let userType = e.currentTarget.dataset.usertype
    // console.log(e.currentTarget.dataset)

    var name = decodeURIComponent(department)

    console.log("@@@@@ userType: ", userType)
    if (this.data.isSuperUserFlag == '1'){
      wx.navigateTo({
        url: '../departmentDetail/departmentDetail?department='+ department + "&serialNumber=" + serialNumber + "&isXintongyuan=" + isXintongyuan  + "&userType=" + userType + "&isSuperUserFlag=" + this.data.isSuperUserFlag
      })
    } else if (userType == '1'){
      // wx.navigateTo({
      //   url: "../totaluserdetail/totaluserdetail",
      // })
      console.log("enter to three ...")
      var flag = this.isInSubsidiaryCompanies(name)
      var flag2 = this.isInSingleTwoDeparments(name)
      var pre = ''

      if (flag || flag2) {
        // var regName = ".*" + name
        if (flag) {
          pre = '0'
        }
        if (flag2) {
          pre = '1'
        }
        wx.navigateTo({
          url: '../totaluserdetail/totaluserdetail?name=' + name + '&&date=' + this.getCurrenteDate() + '&&level=2&&prefix=' + pre,
        })
      } else {
        wx.navigateTo({
          url: '../threeDepartments/threeDepartments?name=' + name + '&&date=' + this.getCurrenteDate()
        })
      }

      // wx.navigateTo({
      //   url: "../threeDepartments/threeDepartments?name=" + name + '&&date=' + this.getCurrenteDate(), 
      // })
    } else if (userType == '2') {
      wx.navigateTo({
        url: "../totaluserdetail/totaluserdetail", 
      })
    }
    
    else {
      wx.navigateTo({
        url: '../totaluserdetail2/totaluserdetail2?serialNumber=' + serialNumber
      })
    }
  },

  //查询用户群组信息
  getUserGroupInfo: function () {
    let that = this
    const db = wx.cloud.database()
    db.collection('user_info').where({
      _openid: app.globalData.openid
      // _openid: "oqME_5ZzCkV38KfpLIRx3dRNMGr8"
    }).get({
      success: res => {
        // console.log("datas: ", res)
        let list = []
        let userinfo = res.data[0];
        let company_count = userinfo.company_count;
        let company_department = userinfo.company_department; //判断是否是信通院
        if(company_department.split(' ').length==3){
          if(company_count >= 2) {
            list.push({
              infoes:userinfo['company_department'].split(' '),
              userType:userinfo['usertype'],
              number: 0,
              isXintongyuan: false
            })
            for(let i=1;i<company_count;i++) {
              // console.log(userinfo['company_department'+i])
              list.push({
                infoes:userinfo['company_department'+i].split(' '),
                userType:userinfo['usertype'+i],
                number: i,
                isXintongyuan: false
              })
            }
          } else {
            list.push({
              infoes:userinfo['company_department'].split(' '),
              userType:userinfo['usertype'],
              number: 0,
              isXintongyuan: false
            })
          }
        } else {
          if(company_count >= 2) {
            list.push({
              infoes:userinfo['company_department'].split(' '),
              userType:userinfo['usertype'],
              number: 0,
              isXintongyuan: true
            })
            for(let i=1;i<company_count;i++) {
              list.push({
                infoes:userinfo['company_department'+i].split(' '),
                userType:userinfo['usertype'+i],
                number: i,
                isXintongyuan: false
              })
            }
          } else {
            list.push({
              infoes:userinfo['company_department'].split(' '),
              userType:userinfo['usertype'],
              number: 0,
              isXintongyuan: true
            })
          }
        }
        // console.log('list',list)
        let groupTypeList = []
        var superuser = res.data[0].superuser
        var title = "众志成城，抗击疫情"  
        var regInfo = ""
        var groupType = "1"
        // var infoes = department.split(' ')              
        // var userType = res.data[0].usertype
        list.forEach((item,index,array)=>{
          //执行代码
          if (superuser != null && superuser == "1" && item.isXintongyuan) {
            title = "中国信息通信研究院"
            groupType = "2"
          }else if (item.userType == '1'){
            title = item.infoes[0]
            // level = 2
            if (item.infoes[0] == '院属公司及协会') {
              regInfo = '.*' + item.infoes[1]
              title = item.infoes[1] 
            } else {
              regInfo = item.infoes[0] + ".*"
              title = item.infoes[0]
              groupType = "2"
            }
          }else if (item.userType == '2'){
            regInfo = ""
            console.log("item infoes length: ", item.infoes.length)
            console.log("item infoes: ", item.infoes)
            if (item.infoes[1] == "") {
              title = item.infoes[0]
            }else {
              title = item.infoes[1]
            }
            groupType = "2"
          } else {
            regInfo = ""
            if (this.isInSingleTwoDeparments(item.infoes[0])){
              title = item.infoes[0]
            }else {
              title = item.infoes[1]
            }

            console.log("infoes: ", item.infoes)
          }
          groupTypeList.push({
            department:title,
            groupType:groupType,
            number: item.number,
            isXintongyuan: item.isXintongyuan,
            userType: item.userType
          })
        })
        console.log('groupTypeList',groupTypeList)
        that.setData({
          departments: groupTypeList,
        })

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

  createGroup: function (e) {
    console.log("跳转创建组织页面")
    const db = wx.cloud.database()
    db.collection('user_info').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        console.log(res)
        if (res.data.length > 0) {
          db.collection('applications_info').where({
            _openid: app.globalData.openid,
            status: 'waiting'
          }).get({
            success: res => {
              console.log('application:',res)
              if (res.data.length > 0) {
                wx.showToast({
                  icon: 'none',
                  title: '您有待审核的创建群组申请'
                })           
              } else {
                wx.navigateTo({
                  url: '../createGroup/createGroup'
                })
              }
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '请稍后'
              })
              console.log(err)
            }
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
          title: '请稍后'
        })
        console.log(err)
      }
    })
  },
  

})
