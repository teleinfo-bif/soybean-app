
const app = getApp()

Page({


  data: {
    department: '',
    clickdetail: [],

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

  

  // parseDatas: function(datas) {
  //   // console.log("datas temp datas: ", datas)
  //   var temp = []
   

  //   for (var i = 0; i < datas.length; i++) {
  //     var tempTopic = {}
  //     tempTopic['name'] = datas[0]
  //     tempTopic['num'] = datas[1].length
  //     // tempTopic['_openid'] = datas[i]._openid
  //     // tempTopic['temperature'] = datas[i].temperature
  //     // tempTopic['goHospitalFlag'] = datas[i].goHospitalFlag
  //     // tempTopic['bodyStatusFlag'] = datas[i].bodyStatusFlag
  //     // tempTopic['isQueZhenFlag'] = datas[i].isQueZhenFlag

  //     temp.push(tempTopic)
  //   }

  //   console.log("temp datas: ", temp)

  //   this.setData({
  //     clickdetail: this.data.clickdetail.concat(temp)
  //   })

  // },

  //非一级部门
  initDatas: function (e) {
    const that = this;
    wx.showLoading({
      title: '加载中...',
    })
    var cur = this.getCurrentDay()
    const db = wx.cloud.database()
    if (this.data.isXintongyuan=="true" && this.data.isSuperUserFlag!=="1") {
      db.collection('company_info').where({
        name: this.data.department
      }).get({
        success: res => {
          console.log('company_info', res)
          var clickdetail = res.data[0].departments
          clickdetail.forEach(function (val, idx, arr) {
            that.getInfoDatas(val);
          }, 0);
          this.setData({
            currentDate: cur,
          })
          wx.hideLoading()
        },
        fail: err => {
          console.log("error: ", err)
          wx.hideLoading()
        }
      })

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
              title = "中国信息通信研究院"
            } else if (userType == '1') {
              level = 2
              if (infoes[0] == '院属公司及协会') {
                regInfo = '.*' + infoes[1]
                title = infoes[1]
              } else {
                regInfo = infoes[0] + ".*"
                title = infoes[0]
              }
            } else if (userType == '2') {
              level = 3
              regInfo = "",
                title = infoes[1]
            }
          
          
          console.log('0cur',cur,title);
          this.setData({
            currentDate: cur,
            titleInfo: title,
            companyReg: regInfo,
            department: department,
            authorityLevel: level
          })
  
          // this.analysisLevel(level)
        },
        fail: err => {
          console.log("error: ", err)
        }
      })

    }else if (this.data.isXintongyuan=="false" && this.data.userType !== "1"){
      console.log('userType', this.data.userType)
      db.collection('company_info').where({
        name: this.data.department
      }).get({
        success: res => {
          console.log('company_info', res)
          var clickdetail = res.data[0].departments
          clickdetail.forEach(function (val, idx, arr) {
            that.getInfoDatas(val);
          }, 0);
          this.setData({
            currentDate: cur,
          })
          wx.hideLoading()
        },
        fail: err => {
          console.log("error: ", err)
          wx.hideLoading()
        }
      })

      db.collection('user_info').where({
        _openid: app.globalData.openid
      }).get({
        success: res => {
          let serialNumber = this.data.serialNumber
          var department = ""
          var userType = "" 
          var regInfo = ""
          var title = ""  
          var infoes = ""  
          // var superuser = ""
          if(serialNumber=="0") {
            var department = res.data[0].company_department
            var userType = res.data[0].usertype  
            var infoes = department.split(' ')            
            // var superuser = res.data[0].superuser            
          }else {
            var department = res.data[0][`company_department${serialNumber}`]
            var userType = res.data[0][`usertype${serialNumber}`]  
            var infoes = department.split(' ')
            // var superuser = res.data[0].superuser
          }

          var level = 1          
            if (userType == '1') {
              level = 1
                regInfo = infoes[0] + ".*"
                title = infoes[0]           
            } else if (userType == '2') {
              level = 2
              regInfo = "",
                title = infoes[1]
            }
                    
          console.log('0cur',cur,title);
          this.setData({
            currentDate: cur,
            titleInfo: title,
            companyReg: regInfo,
            department: department,
            authorityLevel: level
          })
  
          // this.analysisLevel(level)
        },
        fail: err => {
          console.log("error: ", err)
        }
      })

    }
    

  },
 
  initDatas2: function (e) {
    const that = this;
    var cur = this.getCurrentDay()
    const db = wx.cloud.database()
    this.getCompanyDepartments()

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
        }
        console.log('0cur',cur,title);
        this.setData({
          currentDate: cur,
          titleInfo: title,
          companyReg: regInfo,
          department: department,
          authorityLevel: level
        })

        // this.analysisLevel(level)
      },
      fail: err => {
        console.log("error: ", err)
      }
    })

  },

  getInfoDatas: function (data) {
    // console.log("userInfoDatas: ", data)
    wx.cloud.callFunction({
      name: "qunzuUserInfoDatas",
      data: {
        serial_number: this.data.serialNumber,
        company_department: data
      },
      success: res => {
        let temp = [{ name: data, num: res.result.length }]
        this.setData({
          clickdetail: this.data.clickdetail.concat(temp)
        })
      },

      fail: err => {
        console.log("error: ", err)
      }
    })
  },
  gotoStatistics: function(e) {
    console.log(e.currentTarget.dataset.name)
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../statistics/statistics?name=' + name
    })
  },



  onLoad: function (options) {    
    console.log("options: ", options)
    let department = options.department
    let serialNumber = options.serialNumber
    let isXintongyuan = options.isXintongyuan
    let userType = options.userType
    // this.getDepartmentsAndUsers(options.department)
    let isSuperUserFlag = options.isSuperUserFlag
    this.setData({
      department: department,
      serialNumber: serialNumber,
      isXintongyuan: isXintongyuan,
      userType: userType,
      isSuperUserFlag: isSuperUserFlag
    })   
    if(isXintongyuan=="true" && isSuperUserFlag=='1'){
      this.initDatas2()
    }else if(isXintongyuan=="true" && isSuperUserFlag!='1') {
      this.initDatas()
    } else if(isXintongyuan=="false" && userType!='1') {
      this.initDatas()
    } else if(isXintongyuan=="false" && userType=='1') {
      this.initDatas3()
    }
  
   
  },

  qryClickInfoByDate: function (e) {

    console.log('日期选择改变，需要查询的日期为', e.detail.value)
    this.setData({
      currentDate: e.detail.value
    })

  //  this.analysisLevel(this.data.authorityLevel)
  
  },

  getCompanyDepartments: function(e) {
    const that = this;
    /**
     * 通过云函数调用可以获取全部45条的数据
     */
    wx.showLoading({
      title: '加载中...',
    })

    wx.cloud.callFunction({
      name: "getCompany",
      success: res => {
        console.log(res)
        var first = []
        var second = []

        for (var i = 0; i < res.result.length; i++) {
          var item = res.result[i]
          that.getInfoDatas(item.name)
          
          // if (item.name !=="院属公司及协会") {
          //   that.getInfoDatas(item.name)
          // } else {
          //   item.departments.forEach(function(val, idx, arr) {         
          //     that.getInfoDatas(val)
          // }, 0);            
          // }
          
        }
 
        // this.setData({
        //   companies: first,
        //   departments: second,
        // })
        wx.hideLoading()
      },

      fail: err => {
        console.log(err)
        wx.hideLoading()
      }
    })
  },


  getDepartmentsAndUsers: function(data) {
    const that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name: "getDepartmentsAndUsers",
      data: {
        company_department: data,
        level: "1"
      },
      success: res => {
        console.log(res)

        for (var i = 0; i < res.result.result.length; i++) {
          var item = res.result.result[i]
          that.getInfoDatas(item)
          
        }
        wx.hideLoading()
      },

      fail: err => {
        console.log(err)
        wx.hideLoading()
      }
    })
  },


  initDatas3: function (e) {
    const that = this;
    var cur = this.getCurrentDay()
    const db = wx.cloud.database()
    this.getDepartmentsAndUsers(this.data.department)

    db.collection('user_info').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        // var department = res.data[0].company_department
        // var infoes = department.split(' ')

        // var regInfo = ""
        // var title = ""   
        // var superuser = res.data[0].superuser
        // var userType = res.data[0].usertype

        // var level = 1

        // if (superuser != null && superuser == "1") {
        //   level = 1
        //   title = "中国信息通信研究院"
        // }else if (userType == '1'){
        //   level = 2
        //   if (infoes[0] == '院属公司及协会') {
        //     regInfo = '.*' + infoes[1]
        //     title = infoes[1]
        //   } else {
        //     regInfo = infoes[0] + ".*"
        //     title = infoes[0]
        //   }
        // }else if (userType == '2'){
        //   level = 3
        //   regInfo = "",
        //   title = infoes[1]
        // }


        let serialNumber = this.data.serialNumber
          var department = ""
          var userType = "" 
          var regInfo = ""
          var title = ""  
          var infoes = ""  
          // var superuser = ""
          if(serialNumber=="0") {
            var department = res.data[0].company_department
            var userType = res.data[0].usertype  
            var infoes = department.split(' ')            
            // var superuser = res.data[0].superuser            
          }else {
            var department = res.data[0][`company_department${serialNumber}`]
            var userType = res.data[0][`usertype${serialNumber}`]  
            var infoes = department.split(' ')
            // var superuser = res.data[0].superuser
          }

          var level = 1          
            if (userType == '1') {
              level = 1
                regInfo = infoes[0] + ".*"
                title = infoes[0]           
            } else if (userType == '2') {
              level = 2
              regInfo = "",
                title = infoes[1]
            }

        console.log('0cur',cur,title);
        this.setData({
          currentDate: cur,
          titleInfo: title,
          companyReg: regInfo,
          department: department,
          authorityLevel: level
        })

        // this.analysisLevel(level)
      },
      fail: err => {
        console.log("error: ", err)
      }
    })

  },

});