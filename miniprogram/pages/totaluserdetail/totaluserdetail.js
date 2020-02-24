
Page({


  data: {
    todayClickFlag: '0' //今日是否打卡标志，默认未打卡
  },

  onLoad: function (options) {
    let that = this;

    //获取当天日期
    var date = new Date();
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    console.log("当前时间：" + Y + M + D);
    this.setData({
      date: Y + M + D,
      currentdate: Y + M + D,
    })

    let temp = [];

    wx.showLoading({
      title: '数据加载中',
    })

    /**
     * 通过云函数调用可以获取全部45条的数据
     */
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
            date: that.data.date
          },
          success: res => {
            console.log("查询用户指定日期的打卡记录数据", res)
            for (var i = 0; i < that.data.userinfodata.length; i++) {
              var tempTopic = that.data.userinfodata[i];
              for (var j = 0; j < res.result.length; j++) {
                if (that.data.userinfodata[i]._openid == res.result[j]._openid) {
                  console.log("循环打印打卡记录内容 ", res.result[j]);
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
            wx.hideLoading()
            console.log(err)
          }
        })
      },
      fail: err => {
        wx.hideLoading()
        console.log(err)
      }
    })

  },

  qryClickInfoByDate: function (e) {

    console.log('日期选择改变，需要查询的日期为', e.detail.value)
    this.setData({
      date: e.detail.value
    })

    wx.showLoading({
      title: '数据加载中',
    })

    let that = this;
    let temp = [];
    /**
     * 通过云函数调用可以获取全部45条的数据
     */
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
            date: that.data.date
          },
          success: res => {
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
    wx.getSavedFileList({
      success: function (res) {
        console.log("es.fileList", res.fileList)
      }
    })
    wx.cloud.callFunction({
      name: "export",
      // name: "sum",
      data: {
        data: "houfa"
      },
      success: res => {
        console.log("exportExcel", res)

        wx.downloadFile({
          url: "https://736f-soybean-uat-1301333180.tcb.qcloud.la/download/sheetwx981c51592be1d70c.xlsx?sign=22929a097d27331b648f98a2efa06192&t=1582532741",
          success: function (res) {
            const filePath = res.tempFilePath
            wx.openDocument({
              filePath: filePath,
              success: function (res) {
                console.log('打开文档成功: ', filePath)
              }
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
});