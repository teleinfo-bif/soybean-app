
const app = getApp()

Page({


  data: {
    todayClickFlag: '0',     // 今日是否打卡标志，默认未打卡
    currentDate: "",
    companyReg: "",
    department: "",
    titleInfo: "",
    authorityLevel: 0,       // 权限级别: 1 院级管理者，可查看全部；2 二级部门； 3 三级部门
    
  },

  getCurrentDay: function(e) {
    //获取当天日期
    var date = new Date();
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    console.log("当前时间：" + Y + M + D);

    return Y + M + D
  },

  // showAllDetailsList: function(currentDate) {
  //   /**
  //    * 通过云函数调用可以获取全部45条的数据
  //    */

  //   wx.showLoading({
  //     title: '数据加载中',
  //   })

  //   let that = this
  //   let temp = [];

  //   wx.cloud.callFunction({
  //     name: "getUserInfo",
  //     data: {

  //     },
  //     success: res => {
  //       console.log("查询用户信息表数据" + JSON.stringify(res, null, 2))
  //       that.data.userinfodata = res.result
  //       res.result = null;
  //       wx.cloud.callFunction({
  //         name: "getUserClickListBydate",
  //         data: {
  //           date: currentDate,
  //         },
  //         success: res => {

  //           console.log("result datas: ", res)
  //           console.log("查询用户指定日期的打卡记录数据" + JSON.stringify(res, null, 2))
  //           for (var i = 0; i < that.data.userinfodata.length; i++) {
  //             var tempTopic = that.data.userinfodata[i];
  //             for (var j = 0; j < res.result.length; j++) {
  //               if (that.data.userinfodata[i]._openid == res.result[j]._openid) {
  //                 console.log("循环打印打卡记录内容" + JSON.stringify(res.result[j], null, 2));
  //                 tempTopic['temperature'] = res.result[j].temperature
  //                 tempTopic['goHospitalFlag'] = res.result[j].goHospitalFlag
  //                 tempTopic['bodyStatusFlag'] = res.result[j].bodyStatusFlag
  //                 tempTopic['isQueZhenFlag'] = res.result[j].isQueZhenFlag
  //               }
  //             }
  //             temp.push(tempTopic);
  //           }
  //           console.log("打卡详情数据结构：", temp);
  //           this.setData({
  //             clickdetail: temp
  //           })
  //           wx.hideLoading()
  //         },
  //         fail: err => {
  //           console.log(err)
  //           wx.hideLoading()
  //         }
  //       })
  //     },
  //     fail: err => {
  //       console.log(err)
  //       wx.hideLoading()
  //     }
  //   })
  // },

  parseDatas: function(datas) {
    
    var temp = []
   

    for (var i = 0; i < datas.length; i++) {
      var tempTopic = {}
      tempTopic['name'] = datas[i].name
      tempTopic['_id'] = datas[i]._id
      tempTopic['_openid'] = datas[i]._openid
      tempTopic['temperature'] = datas[i].temperature
      tempTopic['goHospitalFlag'] = datas[i].goHospitalFlag
      tempTopic['bodyStatusFlag'] = datas[i].bodyStatusFlag
      tempTopic['isQueZhenFlag'] = datas[i].isQueZhenFlag

      temp.push(tempTopic)
    }

    console.log("temp datas: ", temp)

    this.setData({
      clickdetail: temp
    })

  },

  analysisLevel: function(level) {

    wx.showLoading({
      title: '加载中...',
    })

    console.log("authority level: ", level)

    switch(level) {
      case 1:

        wx.cloud.callFunction({
          name: "oneLevelDatas",
          data: {
            date: this.data.currentDate
          },

          success: res => {
            console.log("res result: ", res.result)
            var healthyDatas = res.result[1]
            this.parseDatas(healthyDatas)
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
            this.parseDatas(healthyDatas)
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
          name: "threeLevelDatas",
          data: {
            date: this.data.currentDate,
            company_department: this.data.department
          },

          success: res => {
            console.log("res result: ", res.result)
            var infoDatas = res.result[0]
            this.parseDatas(infoDatas)
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

  // showDetailsList: function(currentDate, company){


  //   wx.showLoading({
  //     title: '数据加载中',
  //   })

  //   let temp = [];

  //   wx.cloud.callFunction({
  //     name: "getUserClickByAuthority",
  //     data: {
  //       // date: that.data.date,
  //       date: currentDate,
  //       company_department: company
  //     },

  //     success: res => {
  //       console.log("result data: ", res)

  //       var userInfoDatas = res.result[0]
  //       var userHealthyDatas = res.result[1]

  //       for (var i = 0; i < userInfoDatas.length; i++) {
  //         var tempTopic = userInfoDatas[i]
  //         for (var j = 0; j < userHealthyDatas.length; j++) {
  //           if (userInfoDatas[i]._openid == userHealthyDatas[j]._openid) {
  //             tempTopic['temperature'] = userHealthyDatas[j].temperature
  //             tempTopic['goHospitalFlag'] = userHealthyDatas[j].goHospitalFlag
  //             tempTopic['bodyStatusFlag'] = userHealthyDatas[j].bodyStatusFlag
  //             tempTopic['isQueZhenFlag'] = userHealthyDatas[j].isQueZhenFlag
  //           }
  //         }
  //         temp.push(tempTopic)
  //       }

  //       this.setData({
  //         clickdetail: temp
  //       })
  //       wx.hideLoading()
  //     },

  //     fail: err => {
  //       console.error("result error: ", err)
  //       wx.hideLoading()
  //     }
  //   })
  // },



  initDatas: function (e) {

    console.log()

    var cur = this.getCurrentDay()
    const db = wx.cloud.database()
    db.collection('user_info').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        
        var department = res.data[0].company_department
        var infoes = department.split(' ')

        var regInfo = ""
        var title = ""   
        var superuser = res.data[0].superuser
        var userType = res.data[0].usertype

        var level = 1

        if (superuser != null && superuser == "1") {
          level = 1
          title = "中国信息通信技术研究院"
        }else if (userType == '1'){
          level = 2
          if (infoes[0] == '院属公司及协会') {
            regInfo = '.*' + infoes[1]
            title = infoes[1]
          } else {
            regInfo = infoes[0] + ".*"
            title = infoes[0]
          }
        }else if (userType == '2'){
          level = 3
          regInfo = "",
          title = infoes[1]
        } else {
          level = 3 //看到的数据跟3级管理员一样
          regInfo = "",
          title = infoes[1]
        }

        this.setData({
          currentDate: cur,
          titleInfo: title,
          companyReg: regInfo,
          department: department,
          authorityLevel: level
        })

        this.analysisLevel(level)
      },
      fail: err => {
        console.log("error: ", err)
      }
    })

  },

  onLoad: function (options) {
    console.log("options: ", options)
    this.initDatas()
   
  },

  qryClickInfoByDate: function (e) {

    console.log('日期选择改变，需要查询的日期为', e.detail.value)
    this.setData({
      currentDate: e.detail.value
    })

   this.analysisLevel(this.data.authorityLevel)
  
  },

  // onQuery: function () {
  //   const db = wx.cloud.database();
  //   var that = this;
  //   // 获取总数

  //   let user_id = that.data.user_id
  //   if (user_id == null || user_id == '' || user_id.length < 20) {
  //     user_id = app.globalData.openid
  //   }
  //   console.log("user_id" + user_id);
  //   db.collection('user_healthy').where({
  //     _openid: that.data.user_id
  //   }).count({
  //     success: function (res) {
  //       console.log("群组分页查询记录数为：" + res.total)
  //       that.data.totalCount = res.total;
  //     }
  //   })

  //   db.collection('user_healthy').where({
  //     _openid: that.data.user_id
  //   }).limit(10) // 限制返回数量为 10 条
  //     .orderBy('addtime', 'desc').get({
  //       success: res => {
  //         that.data.datas = res.data;
  //         this.setData({
  //           datas: that.data.datas
  //         })
  //         wx.hideLoading();
  //         wx.hideNavigationBarLoading();//隐藏加载
  //         wx.stopPullDownRefresh();
  //         console.log('[数据库] [查询记录] 成功: ', res)
  //       },
  //       fail: err => {
  //         wx.hideLoading();
  //         wx.stopPullDownRefresh();
  //         console.error('[数据库] [查询记录] 失败：', err)
  //       }
  //     })
  // },


});