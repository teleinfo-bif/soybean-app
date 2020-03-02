
const app = getApp()

Page({


  data: {
    serialNumber: '0', //数据库user_info表中company_department1 company_department2 字段最后的数字 0表示没有
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

  
  parseDatas: function(infoDatas, healthyDatas) {
    
    var temp = []

    for (var i = 0; i < infoDatas.length; i++) {
      var tempTopic = infoDatas[i]
      for (var j = 0; j < healthyDatas.length; j++) {
        if (infoDatas[i]._openid == healthyDatas[j]._openid){
        tempTopic['temperature'] = healthyDatas[j].temperature
        tempTopic['goHospitalFlag'] = healthyDatas[j].goHospitalFlag
        tempTopic['bodyStatusFlag'] = healthyDatas[j].bodyStatusFlag
        tempTopic['isQueZhenFlag'] = healthyDatas[j].isQueZhenFlag
        }
      }
      temp.push(tempTopic)
    }   
    // console.log("temp datas: ", temp)
    this.setData({
      clickdetail: temp
    })

  },


  analysisLevel: function(level) {

    wx.showLoading({
      title: '加载中...',
    })

    // console.log("authority level: ", level)

    switch(level) {
      case 1:

        wx.cloud.callFunction({
          name: "oneLevelDatas",
          data: {
            date: this.data.currentDate
          },

          success: res => {
            console.log("res result: ", res.result)
            var infoDatas = res.result[0]
            var healthyDatas = res.result[1]
            this.parseDatas(infoDatas, healthyDatas)
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
            var infoDatas = res.result[0]
            var healthyDatas = res.result[1]
            this.parseDatas(infoDatas, healthyDatas)
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
            var healthyDatas = res.result[1]
            this.parseDatas(infoDatas, healthyDatas)
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

  
  initDatas: function (e) {

    var cur = this.getCurrentDay()
    const db = wx.cloud.database()
    db.collection('user_info').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        var serialNumber = this.data.serialNumber
        var department = ""
        var userType = ""
        if(serialNumber == '0') {
          department = res.data[0].company_department
          userType = res.data[0].usertype
        }else {
          department = res.data[0][`company_department${serialNumber}`]
          userType = res.data[0][`usertype${serialNumber}`]
        }
      
        // console.log('department', department)
        var infoes = department.split(' ')
        var regInfo = ""
        var title = ""   
        var superuser = res.data[0].superuser
  
        var level = 1

        if (superuser != null && superuser == "1") {
          level = 1
          title = "中国信息通信研究院"
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
    let serialNumber = options.serialNumber
    this.setData({
      serialNumber: serialNumber
    })
    this.initDatas()
   
  },

  qryClickInfoByDate: function (e) {

    console.log('日期选择改变，需要查询的日期为', e.detail.value)
    this.setData({
      currentDate: e.detail.value
    })

   this.analysisLevel(this.data.authorityLevel)
  
  },


});