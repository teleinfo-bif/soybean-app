
const app = getApp()

Page({


  data: {
    todayClickFlag: '0',              // 今日是否打卡标志，默认未打卡
    departmentLevel2Name: "",         // 二级部门名称
    titleInfo: "",
    authorityLevel: 0,                // 权限级别: 0 院级管理者，可查看全部；
                                      //          1 二级管理者，可查看二级部门的数据;
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

  showAllDetailsList: function(currentDate) {
    /**
     * 通过云函数调用可以获取全部45条的数据
     */

    wx.showLoading({
      title: '数据加载中',
    })

    let that = this
    let temp = [];

    wx.cloud.callFunction({
      name: "getUserInfo",
      data: {

      },
      success: res => {
        console.log("查询用户信息表数据" + JSON.stringify(res, null, 2))
        that.data.userinfodata = res.result
        res.result = null;
        wx.cloud.callFunction({
          name: "getUserClickListBydate",
          data: {
            date: currentDate,
          },
          success: res => {

            console.log("result datas: ", res)
            console.log("查询用户指定日期的打卡记录数据" + JSON.stringify(res, null, 2))
            for (var i = 0; i < that.data.userinfodata.length; i++) {
              var tempTopic = that.data.userinfodata[i];
              for (var j = 0; j < res.result.length; j++) {
                if (that.data.userinfodata[i]._openid == res.result[j]._openid) {
                  console.log("循环打印打卡记录内容" + JSON.stringify(res.result[j], null, 2));
                  tempTopic['temperature'] = res.result[j].temperature
                  tempTopic['goHospitalFlag'] = res.result[j].goHospitalFlag
                  tempTopic['bodyStatusFlag'] = res.result[j].bodyStatusFlag
                }
              }
              temp.push(tempTopic);
            }
            console.log("打卡详情数据结构：", temp);
            this.setData({
              clickdetail: temp
            })
            wx.hideLoading()
          },
          fail: err => {
            console.log(err)
            wx.hideLoading()
          }
        })
      },
      fail: err => {
        console.log(err)
        wx.hideLoading()
      }
    })
  },

  showDetailsList: function(currentDate, company){


    wx.showLoading({
      title: '数据加载中',
    })

    let temp = [];

    wx.cloud.callFunction({
      name: "getUserClickByAuthority",
      data: {
        // date: that.data.date,
        date: currentDate,
        company_department: company
      },

      success: res => {
        console.log("result data: ", res)

        var userInfoDatas = res.result[0]
        var userHealthyDatas = res.result[1]

        for (var i = 0; i < userInfoDatas.length; i++) {
          var tempTopic = userInfoDatas[i]
          for (var j = 0; j < userHealthyDatas.length; j++) {
            if (userInfoDatas[i]._openid == userHealthyDatas[j]._openid) {
              tempTopic['temperature'] = userHealthyDatas[j].temperature
              tempTopic['goHospitalFlag'] = userHealthyDatas[j].goHospitalFlag
              tempTopic['bodyStatusFlag'] = userHealthyDatas[j].bodyStatusFlag
            }
          }
          temp.push(tempTopic)
        }

        this.setData({
          clickdetail: temp
        })
        wx.hideLoading()
      },

      fail: err => {
        console.error("result error: ", err)
        wx.hideLoading()
      }
    })
  },


  showDetails: function(e) {
    switch(this.data.authorityLevel) {
      case 0:
      this.showAllDetailsList(this.data.date)
      break
      case 1:
        this.showDetailsList(this.data.date, this.data.departmentLevel2Name)
      break
    }
  },

  initDatas: function (companyinfo, superuser) {

    console.log()

    var cur = this.getCurrentDay()

    // 对传进来的公司部门名称进行处理
    console.log("user info: ", companyinfo.trim())
    var infoes = companyinfo.trim().split(' ')
    console.log("infos: ", infoes)
    var regInfo = ""
    var title = ""

    if (infoes[0] == '院属公司及协会'){
      regInfo = '.*' + infoes[1]
      title = infoes[1]
    }else {
      regInfo = infoes[0] + ".*"
      title = infoes[0]
    }

    console.log("reg info: ", regInfo)

    var level = 1

    if (superuser != null && superuser == "1"){
      level = 0
      title = "中国信息通信技术研究院"
    }
    
    this.setData({
      date: cur, 
      currentdate: cur,
      titleInfo: title,
      departmentLevel2Name: regInfo,
      authorityLevel: level
    })

  },

  onLoad: function (options) {
    console.log("options: ", options)
    this.initDatas(options.companyinfo, options.superuser)
    this.showDetails()
  },

  qryClickInfoByDate: function (e) {

    console.log('日期选择改变，需要查询的日期为', e.detail.value)
    this.setData({
      date: e.detail.value
    })


   this.showDetails()
  
  },

  onQuery: function () {
    const db = wx.cloud.database();
    var that = this;
    // 获取总数

    let user_id = that.data.user_id
    if (user_id == null || user_id == '' || user_id.length < 20) {
      user_id = app.globalData.openid
    }
    console.log("user_id" + user_id);
    db.collection('user_healthy').where({
      _openid: that.data.user_id
    }).count({
      success: function (res) {
        console.log("群组分页查询记录数为：" + res.total)
        that.data.totalCount = res.total;
      }
    })

    db.collection('user_healthy').where({
      _openid: that.data.user_id
    }).limit(10) // 限制返回数量为 10 条
      .orderBy('addtime', 'desc').get({
        success: res => {
          that.data.datas = res.data;
          this.setData({
            datas: that.data.datas
          })
          wx.hideLoading();
          wx.hideNavigationBarLoading();//隐藏加载
          wx.stopPullDownRefresh();
          console.log('[数据库] [查询记录] 成功: ', res)
        },
        fail: err => {
          wx.hideLoading();
          wx.stopPullDownRefresh();
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
  },

  //返京日期
  dateChange: function (e) {
    console.log('日期选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  exportExcel: function () {
    // console.log("get date is ", date)
    wx.cloud.callFunction({
      name: "export",
      data: {
        data: "houfa"
      },
      success: res => {
        console.log("export", res)

        wx.cloud.getTempFileURL({
          fileList: [res.result.fileID],
          success: res => {
            console.log("res.fileList ", res.fileList)

            this.sendEmail({
              fromAddress: "774392980@qq.com",
              toAddress: "774392980@qq.com",
              subject: "打卡记录",
              content: res.fileList[0].tempFileURL,
            })
          }
        })
        wx.hideLoading()
      },
      fail: err => {
        console.log(err)
        wx.hideLoading()
      }
    })
  },

  sendEmail: function (email) {
    console.log("email ", email)
    wx.cloud.callFunction({
      name: "sendEmail",
      data: {
        fromAddress: email.fromAddress,
        toAddress: email.toAddress,
        subject: email.subject,
        content: email.content,
      },
      success: res => {
        console.log("sendEmail", res)
        wx.showToast({
          icon: 'none',
          title: `已发送到${email.toAddress}邮箱`
        });
      },
      fail: err => {
        console.log(err)
      }
    })
  },
});