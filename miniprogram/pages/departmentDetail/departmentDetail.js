
const app = getApp()

Page({


  data: {
    department: '',
    clickdetail: [],
    subsidiaryCompany: ['通信网络安全专业委员会', '迪瑞克通信工程咨询有限责任公司', '华瑞赛维通信技术有限公司', '华瑞网研科技有限公司', '金元宾馆', '瑞特电信技术公司', '思维力咨询有限责任公司', '泰尔赛科科技有限公司', '五龙电信技术公司', '海淀亚信技术公司', '增值服务专业委员会', '通信标准化协会', '北京泰尔信科物业管理有限公司', '北京泰尔英福网络科技有限责任公司', '重庆电子信息中小企业公共服务有限公司', '南方分院派遣', '中国通信企业协会信息通信服务工作委员会', '部科技委办公室','信通院（武汉）科技创新中心有限公司'],

    noThreeDepartments: ['院领导', '办公室（保密办公室）', '党群工作部（离退休干部办公室）', '纪检监察审计部', '科技发展部', '业务发展部', '人力资源部', '财务部', '国际合作部', '资产管理部', '实验室质量管理部', '互联网行业促进中心', '雄安研究院保定分院工作筹备组', '政务专项办'],
    prefix: '0',
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

  
  isInSubsidiaryCompanies: function(name) {
    var datas = this.data.subsidiaryCompany
    for (var i = 0; i < datas.length; i++) {
      if (name == datas[i]) {
        return true 
      }
    }
    return false
  },

  isInSingleTwoDeparments: function(name) {
    var datas = this.data.noThreeDepartments
    for (var i = 0; i < datas.length; i++) {
      if (name == datas[i]) {
        return true
      }
    }
    return false
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
          wx.hideLoading()
          // this.analysisLevel(level)
        },
        fail: err => {
          console.log("error: ", err)
          wx.hideLoading()
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
          wx.hideLoading()
          // this.analysisLevel(level)
        },
        fail: err => {
          console.log("error: ", err)
          wx.hideLoading()
        }
      })

    }
    

  },
 
  initDatas2: function (e) {
    const that = this;
    var cur = this.getCurrentDay()
    const db = wx.cloud.database()
    // this.getCompanyDepartments()
    this.getDepartmentsAndUsers(this.data.department)
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
        console.log('cur',cur,title);
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

    console.log("--------" + '../statistics/statistics?name=' + name + '&&date=' + this.data.currentDate + '&&level=2&&title=' + name)
    wx.navigateTo({
      url: '../statistics/statistics?name=' + name + '&&date=' + this.data.currentDate + '&&level=2&&title=' + name
    })
  },

  gotoDetails: function(e) {

    console.log(e.currentTarget.dataset.name)
    var name = e.currentTarget.dataset.name;
    console.log("name: ", name)

    var flag = this.isInSubsidiaryCompanies(name)
    var flag2 = this.isInSingleTwoDeparments(name)
    var pre = '0'


    if (flag || flag2) {
      // var regName = ".*" + name
      if (flag) {
        pre = '0'
      }
      if (flag2) {
        pre = '1'
      }
      wx.navigateTo({
        url: '../totaluserdetail/totaluserdetail?name=' + name + '&&date=' + this.data.currentDate + '&&level=2&&prefix=' + pre,
      })
    }else {
      pre = '1'
      wx.navigateTo({
        url: '../threeDepartments/threeDepartments?name=' + name + '&&date=' + this.data.currentDate
      })
    }
    
    // console.log("data set name: ", e.currentTarget.dataset.name)
    // var name = e.currentTarget.dataset.name
    // wx.navigateTo({
    //   url: '../totaluserdetail/totaluserdetail?name='+ name + '&&date=' + this.data.currentDate + '&&level=2'
    // })
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
      this.initDatas2()  //信通院一级权限
    }else if(isXintongyuan=="true" && isSuperUserFlag!='1') {
      this.initDatas()  //信通院非一级权限
    } else if(isXintongyuan=="false" && userType!='1') {
      this.initDatas()  //非信通院非一级权限
    } else if(isXintongyuan=="false" && userType=='1') {
      this.initDatas3()   //非信通院一级权限
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
  gotoUsers: function(e) {

    console.log(e.currentTarget.dataset.name)
    var name = e.currentTarget.dataset.name; 
    console.log("name: ", name)

    wx.navigateTo({
      url: '../threeDepartments/threeDepartments?name=' + name + '&&date=' + this.data.currentDate
    })
  },


  onPullDownRefresh: function () {
    console.log('onPullDownRefresh')
    // this.queryData(id)
    
    
    // let department = options.department
    // let serialNumber = options.serialNumber
    // let isXintongyuan = options.isXintongyuan
    // let userType = options.userType
    // // this.getDepartmentsAndUsers(options.department)
    // let isSuperUserFlag = options.isSuperUserFlag
    // this.setData({
    //   department: department,
    //   serialNumber: serialNumber,
    //   isXintongyuan: isXintongyuan,
    //   userType: userType,
    //   isSuperUserFlag: isSuperUserFlag
    // })   
    if(this.data.isXintongyuan=="true" && this.data.isSuperUserFlag=='1'){
      this.initDatas2()
    }else if(this.data.isXintongyuan=="true" && this.data.isSuperUserFlag!='1') {
      this.initDatas()
    } else if(this.data.isXintongyuan=="false" && this.data.userType!='1') {
      this.initDatas()
    } else if(this.data.isXintongyuan=="false" && this.data.userType=='1') {
      this.initDatas3()
    }


    },



});