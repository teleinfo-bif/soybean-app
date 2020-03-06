const app = getApp()
var utils = require('../../utils/utils.js')
var QQMapWX = require('qqmap-wx-jssdk.js');
var qqmapsdk;

Page({

  data: {
    radioItems: [
      { name: '否', value: '1' },
      { name: '是', value: '0' },
    ],
    leaveBeijingItems: [
      { name: '否', value: '1' },
      { name: '是', value: '0' },
    ],
    radioHealthyStatusItems: [
      { name: '健康', value: '0' },
      { name: '有发烧、咳嗽等症状', value: '1' },
      { name: '其他', value: '2' }
    ],
    radioNoGoBackItems: [
      { name: '身体不适', value: '0' },
      { name: '当地未放行', value: '1' }
    ],

    index: 0,
    place: "",
    todayClickFlag: '0', //今日是否打卡标志，默认未打卡
    healthyFlag: false,
    tempera: 0,
    confirmed: '1',
    hospital: '1',
    traffic:'',
    isInBeijing: -1,
    whetherLeaveBeijing: -1,
    outBejingReason: -1,
    planReturnBejingDate: "",
    leaveBeijingDate: "",
    returnBeijingDate: "",

    userLatestInfo: [],
    disableAtHospital:false,
    disableDiagnosis: false, 
    if_checked: false,

    trafficToolItems: [
      { name: '飞机', value: '0' },
      { name: '火车', value: '1' },
      { name: '汽车', value: '2' },
      { name: '轮船', value: '3' },
      { name: '其他', value: '4' }
    ],
    trafficToolStatusFlag:'',
    workStatusItems: [
      { name: '在岗办公', value: '0' },
      { name: '居家办公', value: '1' },
      { name: '居家隔离', value: '2' },
      { name: '监督隔离', value: '3' }
    ],
    workStatusFlag:'',
    workPlace: '',
    //共同居住人员亲属（含合租人员）健康状况
    roommateHealthyItems:[
      { name: '健康', value: '0' },
      { name: '有发热、咳嗽等症状', value: '1' },
      { name: '其他', value: '2' }
    ],
    roommateHealthyStatusFlag: '',
    //共同居住人员亲属（含合租人员）所在单位/公司是否有疑似病例、确诊病例
    roommateCompanyDiagItems: [
      { name: '有确诊病例', value: '0' },
      { name: '有疑似病例', value: '1' },
      { name: '都无', value: '2' },
      { name: '其他', value: '3' }
    ],
    roommateCompanyDiagStatusFlag: '',
    //居住小区是否有疑似病例、确诊病例
    residentAreaItems: [
      { name: '有确诊病例', value: '0' },
      { name: '有疑似病例', value: '1' },
      { name: '都无', value: '2' },
      { name: '其他', value: '3' }
    ],
    residentAreaStatusFlag: '',
    //体温
    temperItems:[
      { name: '正常（37.3以下）', value: '0'},
      { name: '37.3及以上', value: '1'}
    ],
    temperStatusFlag: '',
    phoneShow: "",

    disableDakaInput:false,

  },

  currentDate: function (e) {
    var date = new Date();
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    console.log("当前时间：" + Y + M + D);
    return Y + M + D
  },

  dateJudge: function (e) {
    var otherDate = new Date(e)
    var currentDate = new Date(this.currentDate())

    if (otherDate.getTime() < currentDate.getTime()) {
      return false
    }
    return true
  },

  isIn14Days: function(back) {
    var days14Diffms = 1209600000
    var backDate = new Date(back)
    var current = this.currentDate()
    var currentDate = new Date(current)

    if (currentDate.getTime() - backDate.getTime() < days14Diffms ){
      return true
    }
    return false
  },

  boxcheck: function (e) {
    console.log("box change: ", e.detail.value)
    var flag = false
    if (e.detail.value.length != 0) {
      flag = true
    }
    this.setData({
      if_checked: flag
    })

    console.log("if check: ", this.data.if_checked)
  },

  initDatas: function (e) {

    if (this.data.userLatestInfo.length > 0) {
      var radioNoGoBackItems = this.data.radioNoGoBackItems
      var latestInfo = this.data.userLatestInfo
      for (var i = 0; i < radioNoGoBackItems.length; i++) {
        console.log("item value: ", radioNoGoBackItems[i].value)
        console.log("latest out reason: ", latestInfo[0].out_reason)
        radioNoGoBackItems[i].checked = parseInt(radioNoGoBackItems[i].value) == latestInfo[0].out_reason
      }

      var leaveBeijingItems = this.data.leaveBeijingItems

      for (var i = 0; i < leaveBeijingItems.length; i++) {
        console.log("leave value: ", leaveBeijingItems[i].value)
        console.log("latest leave : ", latestInfo[0].ever_leave_beijing)
        leaveBeijingItems[i].checked = parseInt(leaveBeijingItems[i].value) == latestInfo[0].ever_leave_beijing
      }

      this.noGoBackFlag = latestInfo[0].out_reason.toString()
      this.isLeaveBjFlag = latestInfo[0].ever_leave_beijing.toString()
      if (this.isLeaveBjFlag == "-1") {
        this.isLeaveBjFlag = "1"
      }

      //交通工具
      var trafficToolItems = this.data.trafficToolItems;
      console.log("trafficToolItems的内容为：" + trafficToolItems);
      for (var i = 0, len = 5; i < 5; ++i) {
        trafficToolItems[i].checked = trafficToolItems[i].value == latestInfo[0].trafficToolStatusFlag;
      }
      this.setData({
        trafficToolItems: trafficToolItems
      });

      this.leavedate = latestInfo[0].leave_date
      this.suregobackdate = latestInfo[0].suregobackdate

      this.setData({
        radioNoGoBackItems: radioNoGoBackItems,
        leaveBeijingItems: leaveBeijingItems,

        noGoBackFlag: latestInfo[0].out_reason.toString(),
        gobackdate: latestInfo[0].plan_beijing,
        leavedate: latestInfo[0].leave_date,
        isLeaveBjFlag: this.isLeaveBjFlag,
        suregobackdate: latestInfo[0].return_date,
        trainnumber: latestInfo[0].traffic,
        
        isInBeijing: latestInfo[0].is_in_beijing,
        whetherLeaveBeijing: latestInfo[0].ever_leave_beijing,
        outBejingReason: latestInfo[0].out_reason,
        planReturnBejingDate: latestInfo[0].plan_beijing,
        leaveBeijingDate: latestInfo[0].leave_date,
        returnBeijingDate: latestInfo[0].return_date,
        traffic: latestInfo[0].traffic,
        trafficToolStatusFlag: latestInfo[0].trafficToolStatusFlag
        
      })

      console.log("### noGoBackFlag: ", this.noGoBackFlag)
    }
  },

  onLoad: function (options) {

    let that = this;
    qqmapsdk = new QQMapWX({
      key: 'UY2BZ-MLI6O-V2CWK-SERF5-ZNSI2-XRFOJ'
    });

    this.setData({
      workPlace: app.globalData.workPlace
    })

    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    //获取当天日期
    var date = new Date();
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    console.log("当前时间：" + Y + M + D);
    this.setData({
      date: Y + M + D,
    })
    this.qryHealthyTodayInfo()
    this.qryUserLatestInfo()


  },

  //查询当前打卡信息
  qryHealthyTodayInfo: function () {
    let that = this;
    var date = new Date();
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());

    const db = wx.cloud.database()
    console.log("查询当前打卡记录日期为：" + Y + M + D);
    db.collection('user_healthy').where({
      _openid: app.globalData.openid,
      date: Y + M + D
    }).get({
      success: res => {
        console.log(res)
        //今日已打卡
        if (res.data.length > 0) {
          console.log("filled users number: ", res.data.length)

          that.setData({
            todayClickFlag: '1',
          })

        }

        that.qryUserInfo();
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

        console.log(res)
        var hide = utils.toHide(res.data[0].phone)
        that.userinfo = res.data;
        that.setData({
          name: res.data[0].name,
          phone: hide,
          phoneShow: res.data[0].phone,
          userinfo: res.data
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

  //查询用户历史最近信息
  qryUserLatestInfo: function () {
    console.log("user open id: ", app.globalData.openid)
    let that = this
    const db = wx.cloud.database()
    db.collection('user_latest').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        console.log(res)
        this.setData({
          userLatestInfo: res.data
        })
        this.initDatas()
        console.log("user latest info: ", this.data.userLatestInfo)
      },
      fail: err => {

        console.log(err)
      }
    })


  },

  //跳转打卡记录页面
  clickRecord: function (e) {
    console.log("跳转到打卡记录页面appid内容为：" + app.globalData.openid)
    wx.navigateTo({
      url: '../clockInRecord/clockInRecord'
    })
  },

  gotoUserSecret: function(e) {
    wx.navigateTo({
      url: '../about/about'
    })
  },

  //获取用户位置信息
  onShow: function () {
    console.log("进入点击事件，获取用户位置信息");
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      altitude: 'true',
      success: function (res) {
        console.log(res)
        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          }, //坐标
          get_poi: 1, //是否获取坐标对应附近列表
          poi_options: 'policy=2;radius=3000;page_size=10;page_index=1', //poi 参数
          success: function (res) {
            console.log(res)
            console.log(res.result.ad_info.name);
            var address = res.result.address;
            var poiList = res.result.pois;
            that.setData({
              address: address,
              poiList: poiList,
              locationList: poiList,
              place: address
            });
            var currentCity = res.result.ad_info.city;
/*             console.log('=========打卡地点省=======', res.result.ad_info.province)
            console.log('=========打卡地点市=======', res.result.ad_info.city) */
            var str_before = that.data.place.split('市')[0]
            var str_after = that.data.place.split('市')[1]
            console.log("========= current city =========", currentCity)
            console.log('=========打卡地点省=======', str_before)
            console.log('=========打卡地点市=======', str_after)
            that.setData({
              str_before: str_before+'市',
              str_after: str_after
            })

            //是否在京   1-未返京   0-已返京
            console.log("work place: ", app.globalData.workPlace)
            var reg = new RegExp('.*' + app.globalData.workPlace)
            var currentPlace = str_before + '市'

            app.globalData.localPlace = currentPlace

            console.log("reg = ", reg)
            console.log("current place: ", currentPlace)
          
            var flag = reg.test(currentPlace)

            console.log("@@@@@@@@@@@@@ flag = ", flag)
            if (flag ){
              that.setData({
                isGoBackFlag: '0',
                isInBeijing: 0,
              });
              app.globalData.isGoBackFlag = '0'

            } else {
              that.setData({
                isGoBackFlag: '1',
                isInBeijing: 1,
              });
              app.globalData.isGoBackFlag = '1'
            }
            if (that.data.isInBeijing == '1') { 
              that.setData({
                
              })
            }

          }
          
        })
      },
      fail: function () {
        wx.hideLoading()
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权,将无法正常获取地理位置,点击确定重新获取授权。',
          success: function (res) {
            if (res.cancel) {
              //点击取消按钮
              that.setData({
                disableDakaInput: true
              })
            }
            if (res.confirm) {
              //重点:从这里开始就是重新授权调取
              wx.openSetting({
                success: (res) => {
                  //如果用户重新同意了授权登录scope.userLocation是表示位置授权 true/false
                  if (res.authSetting["scope.userLocation"]) { 
                    wx.showToast({
                      //弹窗提示
                      title: "授权成功",
                      icon: "success",
                      duration: 1000
                    });
                    that.setData({
                      disableDakaInput: false
                    })
                  }else{
                    that.setData({
                      disableDakaInput:true
                    })
                  }
                }, fail: function (res) {
                  that.setData({
                    disableDakaInput: true
                  })
                }
              })
              //重点:调取结束
            }
          }
        })
      },

/*       fail: err => {
        wx.hideLoading()
        console.error('用户当前位置信息获取失败', err)
        
      } */
    });
  },

  //输入信息验证，敏感字符检测
  onAdd: function (e) {
    wx.showLoading({
      title: '信息提交中',
    })
    console.log("姓名:" + e.detail.value.name);
    console.log("手机号" + e.detail.value.phone);
    console.log("打卡地点" + e.detail.value.place);
    console.log("打卡地点固定" + e.detail.value.place_before);
    console.log("是否在京:" + this.workPlaceFlag);
    console.log("未返京原因:" + this.noGoBackFlag);
    console.log("计划返京日期:" + e.detail.value.gobackdate);
    console.log("14天内是否离京:" + this.isLeaveBjFlag);
    console.log("离京日期:" + e.detail.value.leavedate);
    console.log("返京日期:" + e.detail.value.suregobackdate);
    console.log("返京车次/航班/车牌 :" + e.detail.value.trainnumber);
    //console.log("体温 :" + e.detail.value.temperature);
    console.log("目前健康状况:" + this.bodyStatusFlag);
    console.log("健康状况为其他的原因:" + e.detail.value.bodystatusotherremark);
    console.log("是否确诊:" + this.isQueZhenFlag);
    console.log("是否就诊住院:" + this.goHospitalFlag);
    console.log("是否有接触过疑似病患、接待过来自湖北的亲戚朋友、或者经过武汉:" + this.goHBFlag);
    console.log("其他备注信息:" + e.detail.value.remark);
    console.log("=====乘坐交通工具====:" + this.trafficToolStatusFlag);
    console.log("====在岗状态====:" + this.data.workStatusFlag);
    var name = e.detail.value.name
    //var temperature = e.detail.value.temperature
    var bodyStatusFlag = this.bodyStatusFlag
    var isQueZhenFlag = this.isQueZhenFlag
    var goHospitalFlag = this.goHospitalFlag
    var goHBFlag = this.goHBFlag
    var place = e.detail.value.place_before + e.detail.value.place 
    var trafficToolStatusFlag = this.trafficToolStatusFlag
    var workStatusFlag = this.data.workStatusFlag
    var roommateHealthyStatusFlag = this.data.roommateHealthyStatusFlag
    var roommateCompanyDiagStatusFlag = this.data.roommateCompanyDiagStatusFlag
    var residentAreaStatusFlag = this.data.residentAreaStatusFlag
    var temperStatusFlag = this.data.temperStatusFlag

    console.log('=====地址====',place)
    if (name == null || name == '') {
      wx.showToast({
        icon: 'none',
        title: '姓名不能为空'
      });
      return;
    }

    if (place == null || place == '') {
      wx.showToast({
        icon: 'none',
        title: '打卡地点不能为空'
      });
      return;
    }



     if (this.data.temperStatusFlag == 1 && bodyStatusFlag == '0'){
       wx.showToast({
         icon: 'none',
        title: '温度超过37.3度不能视为健康，请重新选择健康状况!',
        duration: 3000,
      });
       return;
     }

    if (bodyStatusFlag == null || bodyStatusFlag == '') {
      wx.showToast({
        icon: 'none',
        title: '目前健康状态不能为空'
      });
      return;
    }


    if (bodyStatusFlag == '2') {
      var bodystatusotherremark = e.detail.value.bodystatusotherremark
      if (bodystatusotherremark == null || bodystatusotherremark == '') {
        wx.showToast({
          icon: 'none',
          title: '身体健康状态为其他原因不能为空'
        });
        return;
      }
    }

    if (bodyStatusFlag == 0) {
      if (this.data.temperStatusFlag == 1) {
        wx.showToast({
          icon: 'none',
          title: '体温与健康状况发生冲突，请重新填写',
          duration: 3000,

        });
        return;
      }

      if (this.data.confirmed == 0) {
        wx.showToast({
          icon: 'none',
          title: '是否确诊与健康状况发生冲突，请重新填写',
          duration: 3000,

        });
        return;
      }

      if (this.data.hospital == 0) {
        wx.showToast({
          icon: 'none',
          title: '是否就诊住院与健康状况发生冲突，请重新填写',
          duration: 3000

        });
        return;
      }
    }

    if (this.data.temperStatusFlag == 1 || this.data.confirmed == 0 || this.data.hospital == 0) {
      if (bodyStatusFlag == 0) {
        wx.showToast({
          icon: 'none',
          title: '健康状况与实际情况不符合，请重新填写'
        });
        return;
      }
    }


    if (app.globalData.isGoBackFlag == '1') {//未返京
      var noGoBackFlag = this.noGoBackFlag
      var gobackdate = e.detail.value.gobackdate
      var leaveDate = ""

      if (noGoBackFlag == null || noGoBackFlag == '') {
        wx.showToast({
          icon: 'none',
          title: '请选择未返工作地点原因'
        });
        return;
      }

      // if (leaveDate == null || leaveDate == '') {
      //   wx.showToast({
      //     icon: 'none',
      //     title: '请选择离京日期'
      //   });
      //   return;
      // }

      if (gobackdate == null || gobackdate == '') {
        wx.showToast({
          icon: 'none',
          title: '请选择计划返回工作地点日期'
        });
        return;
      }


      if (!this.dateJudge(gobackdate)) {
        wx.showToast({
          icon: 'none',
          title: '返回工作地点日期应不小于当天',
          duration: 2500,
        });
        return;
      }

      this.setData({
        outBejingReason: parseInt(noGoBackFlag),
        planReturnBejingDate: gobackdate,
        leaveBeijingDate: leaveDate
      })

    }

    console.log("this.app.globalData.isGoBackFlag" + app.globalData.isGoBackFlag);
    console.log("this.isLeaveBjFlag" + this.isLeaveBjFlag);

    // if (app.globalData.isGoBackFlag == '0') {//已返京
      var isLeaveBjFlag = this.isLeaveBjFlag

      if (isLeaveBjFlag == null || isLeaveBjFlag == '') {
        wx.showToast({
          icon: 'none',
          title: '请选择14天内是否离开过当前所在地'
        });
        return;
      }

      if (isLeaveBjFlag == '0') {
        // var current = new Date('2020-01-10')
        // var ldate = new Date(leavedate)
        // console.log(ldate);
        // console.log(ldate.getTime());
        // console.log(current.getTime());
        // console.log(ldate.getTime() - current.getTime())
        // var ms = current.getTime() - ldate.getTime()
        // if (ms > 0) {
        //   wx.showToast({
        //     icon: 'none',
        //     title: '离京日期选择2020年1月10日以后的日期',
        //     duration: 3000,
        //   });
        //   return;
        // }

        // var leavedate = e.detail.value.leavedate
        // if (leavedate == null || leavedate == '') {
        //   wx.showToast({
        //     icon: 'none',
        //     title: '请选择离京日期'
        //   });
        //   return;
        // }

        var suregobackdate = e.detail.value.suregobackdate
        if (suregobackdate == null || suregobackdate == '') {
          wx.showToast({
            icon: 'none',
            title: '请选择返回日期'
          });
          return;
        }

        if (!this.isIn14Days(suregobackdate)) {
          wx.showToast({
            icon: 'none',
            title: '返回日期请选择14天以内的!'
          });
          return;
        }

        // var bdate = new Date(suregobackdate)
        // var msback = current.getTime() - bdate.getTime()
        // if (msback > 0) {
        //   wx.showToast({
        //     icon: 'none',
        //     title: '返京日期选择2020年1月10日以后的日期',
        //     duration: 3000,
        //   });
        //   return;
        // }

        // if (ldate.getTime() > bdate.getTime()) {
        //   wx.showToast({
        //     icon: 'none',
        //     title: '返京日期应大于离京日期',
        //     duration: 3000,
        //   });
        //   return;
        // }

        var trafficToolStatusFlag = this.data.trafficToolStatusFlag
        if (trafficToolStatusFlag == null || trafficToolStatusFlag == '') {
          wx.showToast({
            icon: 'none',
            title: '请选择交通工具'
          });
          return;
        }

        var trainnumber = e.detail.value.trainnumber
        if (trainnumber == null || trainnumber == '') {
          wx.showToast({
            icon: 'none',
            title: '请输入所乘车次航班'
          });
          return;
        }
      }

      this.setData({
        leaveBeijingDate: leaveDate,
        returnBeijingDate: suregobackdate,
        traffic: trainnumber,
        

      })
    // }
    if (isQueZhenFlag == null || isQueZhenFlag == '') {
      if (this.data.bodyStatusFlag != 0){
        wx.showToast({
          icon: 'none',
          title: '是否确诊不能为空'
        });
        return;
      }
    }

    if (roommateHealthyStatusFlag == null || roommateHealthyStatusFlag == '') {
      wx.showToast({
        icon: 'none',
        title: '共同居住人员亲属（含合租人员）健康状况不能为空'
      });
      return;
    }
    if (roommateHealthyStatusFlag == '2') {
      var roHealthystatusotherremark = e.detail.value.roHealthystatusotherremark
      if (roHealthystatusotherremark == null || roHealthystatusotherremark == '') {
        wx.showToast({
          icon: 'none',
          title: '共同居住人员亲属（含合租人员）健康状况其他原因不能为空'
        });
        return;
      }
    }
    if (roommateCompanyDiagStatusFlag == null || roommateCompanyDiagStatusFlag == '') {
      wx.showToast({
        icon: 'none',
        title: '共同居住人员亲属（含合租人员）所在单位/公司是否有疑似病例、确诊病例不能为空'
      });
      return;
    }
    if (roommateCompanyDiagStatusFlag == '3') {
      var roMaCoDistatusotherremark = e.detail.value.roMaCoDistatusotherremark
      if (roMaCoDistatusotherremark == null || roMaCoDistatusotherremark == '') {
        wx.showToast({
          icon: 'none',
          title: '共同居住人员亲属（含合租人员）所在单位/公司是否有疑似病例、确诊病例其他原因不能为空'
        });
        return;
      }
    }
/*     if (residentAreaStatusFlag == null || residentAreaStatusFlag == '') {
      wx.showToast({
        icon: 'none',
        title: '居住小区是否有疑似病例、确诊病例不能为空'
      });
      return;
    }
    if (residentAreaStatusFlag == '3') {
      var reArstatusotherremark = e.detail.value.reArstatusotherremark
      if (reArstatusotherremark == null || reArstatusotherremark == '') {
        wx.showToast({
          icon: 'none',
          title: '居住小区是否有疑似病例、确诊病例其他原因不能为空'
        });
        return;
      }
    } */
    if (temperStatusFlag == null || temperStatusFlag == '') {
      wx.showToast({
        icon: 'none',
        title: '当日体温不能为空'
      });
      return;
    }
    if (temperStatusFlag == '1') {
      var temperotherremark = e.detail.value.temperotherremark
      if (temperotherremark == null || temperotherremark == '') {
        wx.showToast({
          icon: 'none',
          title: '当日体温在37.3及以上，具体温度不能为空'
        });
        return;
      }
      var temperotherremark = e.detail.value.temperotherremark
      if (!(/^\d+(\.\d+)?$/.test(temperotherremark))) {
        wx.showToast({
          icon: 'none',
          title: '体温格式错误!',

        });
        return;
      }
      if (temperotherremark <= 37.3) {
        wx.showToast({
          icon: 'none',
          title: '所填温度在37.3°以下，与所选不符，重新填写!',

        });
        return;
      }
    }
    if (goHospitalFlag == null || goHospitalFlag == '') {
      if (this.data.bodyStatusFlag != 0) {
        wx.showToast({
          icon: 'none',
          title: '是否就诊住院不能为空'
        });
        return;
      }
    }

    if (goHBFlag == null || goHBFlag == '') {
      wx.showToast({
        icon: 'none',
        title: '是否有武汉相关接触史不能为空'
      });
      return;
    }

    if (workStatusFlag == null || workStatusFlag == '') {
      wx.showToast({
        icon: 'none',
        title: '目前在岗状态不能为空'
      });
      return;
    }

    // if (!this.data.if_checked) {
    //   wx.showToast({
    //     icon: 'none',
    //     title: '请选择同意用户服务条款与隐私协议',
    //     duration: 3000,
    //   });
    //   return;
    // }

    var text = e.detail.value.name + e.detail.value.place + e.detail.value.trainnumber + e.detail.value.remark + e.detail.value.phone
    console.log("敏感字符检测内容：" + text)
    //敏感字符检测
    wx.cloud.init();
    wx.cloud.callFunction({
      name: 'msgSC',
      data: {
        text: text
      }
    }).then((res) => {
      console.log("敏感信息检测结果：" + res.result.code);
      if (res.result.code == "200") {
        //检测通过,新增信息到数据库
        this.onAddSec(e)
      } else {
        //执行不通过
        wx.showToast({
          title: '输入内容包含敏感信息,请重新输入',
          icon: 'none',
          duration: 3000
        })
      }
    })
  },

  //返程信息提交
  onAddSec: function (e) {
    let that = this;
    console.log("姓名:" + e.detail.value.name);
    console.log("手机号" + e.detail.value.phone);
    console.log("打卡地点" + e.detail.value.place);
    console.log("是否在京:" + this.workPlaceFlag);
    console.log("未返京原因:" + this.noGoBackFlag);
    console.log("计划返京日期:" + e.detail.value.gobackdate);
    console.log("14天内是否离京:" + this.isLeaveBjFlag);
    console.log("离京日期:" + e.detail.value.leavedate);
    console.log("返京日期:" + e.detail.value.suregobackdate);
    console.log("返京车次/航班/车牌 :" + e.detail.value.trainnumber);
    //console.log("体温 :" + e.detail.value.temperature);
    console.log("目前健康状况:" + this.bodyStatusFlag);
    console.log("健康状况为其他的原因:" + e.detail.value.bodystatusotherremark);
    console.log("是否确诊:" + this.isQueZhenFlag);
    console.log("是否就诊住院:" + this.goHospitalFlag);
    console.log("是否有接触过疑似病患、接待过来自湖北的亲戚朋友、或者经过武汉:" + this.goHBFlag);
    console.log("其他备注信息:" + e.detail.value.remark);
    console.log("=====乘坐交通工具====:" + this.trafficToolStatusFlag);
    console.log("=====在岗状态====:" + this.data.workStatusFlag);

    var name = e.detail.value.name
    var phone = e.detail.value.phone
    var phoneShow = ""
    if (phone != undefined || phone != "" ){
      phoneShow = this.data.phoneShow
    }
    var place = e.detail.value.place_before + e.detail.value.place
    var gobackdate = e.detail.value.gobackdate
    var trainnumber = e.detail.value.trainnumber
    var leavedate = e.detail.value.leavedate
    var suregobackdate = e.detail.value.suregobackdate
    if (suregobackdate == null) {
      suregobackdate = ""
    }
    //var temperature = e.detail.value.temperature
    var bodystatusotherremark = e.detail.value.bodystatusotherremark
    var remark = e.detail.value.remark
    var goHBFlag = this.goHBFlag
    var workPlaceFlag = this.workPlaceFlag
    var noGoBackFlag = this.noGoBackFlag
    var isLeaveBjFlag = this.isLeaveBjFlag
    var bodyStatusFlag = this.bodyStatusFlag
    var isQueZhenFlag = this.isQueZhenFlag
    var goHospitalFlag = this.goHospitalFlag
    var trafficToolStatusFlag = this.trafficToolStatusFlag
    var workStatusFlag =  this.data.workStatusFlag
    var roommateHealthyStatusFlag  = this.data.roommateHealthyStatusFlag
    var roommateCompanyDiagStatusFlag  = this.data.roommateCompanyDiagStatusFlag
    var residentAreaStatusFlag  = this.data.residentAreaStatusFlag
    var roHealthystatusotherremark = e.detail.value.roHealthystatusotherremark
    var roMaCoDistatusotherremark = e.detail.value.roMaCoDistatusotherremark
    var reArstatusotherremark = e.detail.value.reArstatusotherremark
    var temperStatusFlag   = this.data.temperStatusFlag
    var temperotherremark = e.detail.value.temperotherremark
    console.log("******temper*****", e.detail.value.temperotherremark)

    var date = new Date();
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '  ';
    var DD = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());

    const db = wx.cloud.database()

    if (this.data.userLatestInfo.length == 0) {
      console.log("add user latest info:")
      db.collection('user_latest').add({
        data: {
          name: name,
          phone: phoneShow,
          place: place,
          is_in_beijing: this.data.isInBeijing,
          out_reason: this.data.outBejingReason,
          plan_beijing: this.data.planReturnBejingDate,
          ever_leave_beijing: this.data.whetherLeaveBeijing,
          leave_date: this.data.leaveBeijingDate,
          return_date: this.data.returnBeijingDate,
          traffic: this.data.traffic,
          trafficToolStatusFlag: this.trafficToolStatusFlag,
          workStatusFlag: this.data.workStatusFlag,
          roommateHealthyStatusFlag :this.data.roommateHealthyStatusFlag,
          roommateCompanyDiagStatusFlag: this.data.roommateCompanyDiagStatusFlag,
          residentAreaStatusFlag :this.data.residentAreaStatusFlag
        }
      })

    } else {
      console.log("update user latest info:")
      db.collection('user_latest').doc(this.data.userLatestInfo[0]._id).update({
        data: {
          name: name,
          phone: phoneShow,
          place: place,
          is_in_beijing: this.data.isInBeijing,
          out_reason: this.data.outBejingReason,
          plan_beijing: this.data.planReturnBejingDate,
          ever_leave_beijing: this.data.whetherLeaveBeijing,
          leave_date: this.data.leaveBeijingDate,
          return_date: this.data.returnBeijingDate,
          traffic: this.data.traffic,
          trafficToolStatusFlag: this.data.trafficToolStatusFlag,
          workStatusFlag: this.data.workStatusFlag,
          roommateHealthyStatusFlag: this.data.roommateHealthyStatusFlag,
          roommateCompanyDiagStatusFlag: this.data.roommateCompanyDiagStatusFlag,
          residentAreaStatusFlag: this.data.residentAreaStatusFlag,
          temperStatusFlag: this.data.temperStatusFlag
        }
      })
    }
    if (temperStatusFlag == 0){
      var temperotherremark ='正常'
    }
    db.collection('user_healthy').add({
      data: {
        name: name,
        place: place,
        phone: phoneShow,
        gobackdate: gobackdate,
        trainnumber: trainnumber,
        leavedate: leavedate,
        suregobackdate: suregobackdate,
        bodystatusotherremark: bodystatusotherremark,
        noGoBackFlag: noGoBackFlag,
        goHBFlag: goHBFlag,
        workPlaceFlag: workPlaceFlag,
        isLeaveBjFlag: isLeaveBjFlag,
        bodyStatusFlag: bodyStatusFlag,
        isQueZhenFlag: isQueZhenFlag,
        goHospitalFlag: goHospitalFlag,
        isGoBackFlag: app.globalData.isGoBackFlag,
        remark: remark,
        date: Y + M + DD,
        addtime: Y + M + D + h + m + s,
        trafficToolStatusFlag: this.data.trafficToolStatusFlag,
        workStatusFlag: this.data.workStatusFlag,
        roommateHealthyStatusFlag: this.data.roommateHealthyStatusFlag,
        roommateCompanyDiagStatusFlag :this.data.roommateCompanyDiagStatusFlag,
        residentAreaStatusFlag : this.data.residentAreaStatusFlag,
        roHealthystatusotherremark:roHealthystatusotherremark,
        roMaCoDistatusotherremark:roMaCoDistatusotherremark,
        reArstatusotherremark:reArstatusotherremark,
        temperStatusFlag: this.data.temperStatusFlag,
        temperotherremark: temperotherremark
        // userinfo: that.userinfo
      },
      success: res => {
        wx.hideLoading()
        console.log('返程信息登记成功，记录 _id: ', res._id)
        wx.reLaunch({
          url: '../submitSuccess/submitSuccess',
        })
        console.log('返程信息登记成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.hideLoading()
        console.error('返程信息登记失败：', err)
        wx.reLaunch({
          url: '../msg/msg_fail',
        })
      }
    })
  },

  radioChange: function (e) {
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems
    });
  },

  healthShowHide: function (value) {
    if (value == 0) {
      this.setData({
        healthyFlag: true
      })
    } else {
      this.setData({
        healthyFlag: false
      })
    }
  },

  // 是否有接触过疑似病患、接待过来自湖北的亲戚朋友、或者经过武汉
  goHBRadioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.goHBFlag = e.detail.value
    // this.radioChange(e)
  },
  // 在岗状态
  workStatusChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.workStatusFlag = e.detail.value
    this.setData({
      workStatusFlag: e.detail.value
    });
  },
  //共同居住人员亲属（含合租人员）健康状况
  roHealthyStatusChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.roommateHealthyStatusFlag = e.detail.value
    this.setData({
      roommateHealthyStatusFlag: e.detail.value
    })
  },

  //共同居住人员亲属（含合租人员）所在单位/公司是否有疑似病例、确诊病例
  roMaCoDiStatusChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.roommateCompanyDiagStatusFlag = e.detail.value
    this.setData({
      roommateCompanyDiagStatusFlag: e.detail.value
    });
  },
  //居住小区是否有疑似病例、确诊病例
  reArStatusChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.residentAreaStatusFlag = e.detail.value
    this.setData({
      residentAreaStatusFlag: e.detail.value
    });
  },
  // 2020-02-10 后是否离开北京
  LeaveBjChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.isLeaveBjFlag = e.detail.value
    this.setData({
      isLeaveBjFlag: e.detail.value,
      whetherLeaveBeijing: e.detail.value
    });
    //  this.radioChange(e)
  },

  //未返京原因
  noGoBackRadioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.noGoBackFlag = e.detail.value
    //this.radioChange(e)
  },

  judgeTemperature: function (e) {
    console.log("value: ", e.detail.value)
    if (this.data.confirmed == '1' && this.data.hospital == '1') {
      var flag = 0
      if (e.detail.value < 37.3) {
        flag = 1
      }
      this.setData({
        tempera: e.detail.value
      })
      this.healthShowHide(flag)
    }
  },

  //目前健康状况
  bodyStatusRadioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.bodyStatusFlag = e.detail.value
    this.setData({
      bodyStatusFlag: e.detail.value
    })
    //  this.radioChange(e)
    if (e.detail.value == 0){
      this.setData({
        disableAtHospital:true,
        disableDiagnosis:true
      })
    }else{
      this.setData({
        disableAtHospital: false,
        disableDiagnosis: false
      })
    }
  },
  //当前体温
  temperStatusRadioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.temperStatusFlag = e.detail.value
    this.setData({
      temperStatusFlag: e.detail.value
    })
    //  this.radioChange(e)
    if (e.detail.value == 1) {
      this.setData({
        healthyFlag: true
      })
    } else {
      this.setData({
        healthyFlag: false
      })
    }
  },
  //是否确诊
  isQueZhenRadioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    this.isQueZhenFlag = e.detail.value
    this.setData({
      confirmed: e.detail.value
    })
    if (this.data.tempera < 37.3 && this.data.hospital == 1) {
      this.healthShowHide(e.detail.value)
    }
    //  this.radioChange(e)
  },

  //是否就诊住院
  goHospitalRadioChange: function (e) {

    console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.goHospitalFlag = e.detail.value
    this.setData({
      hospital: e.detail.value
    })
    if (!this.data.tempera < 37.3 && this.data.confirmed == 1) {
      this.healthShowHide(e.detail.value)
    }
    //  this.radioChange(e)
  },

  // leaveDateChange: function(e) {
  //   this.setData({
  //     leavedate: e.detail.value
  //   })
  // },

  //计划返京日期
  gobackDateChange: function (e) {
    console.log('日期选择改变，携带值为', e.detail.value)
    this.setData({
      gobackdate: e.detail.value
    })
  },

  //离京日期
  leaveDateChange: function (e) {
    console.log('日期选择改变，携带值为', e.detail.value)
    this.setData({
      leavedate: e.detail.value
    })
  },

  //返京日期
  suregobackDateChange: function (e) {
    console.log('日期选择改变，携带值为', e.detail.value)
    this.setData({
      suregobackdate: e.detail.value
    })
  },

  // 选择省市区函数
  changeReginChange(e) {
    console.log("省市区选择发生变化,携带的值为：" + e.detail.value);
    this.gobackwhere = e.detail.value
    this.setData({
      region: e.detail.value
    });
  },

  goHome: function () {
    const pages = getCurrentPages()
    if (pages.length === 2) {
      wx.navigateBack()
    } else if (pages.length === 1) {
      wx.redirectTo({
        url: '../index/index',
      })
    } else {
      wx.reLaunch({
        url: '../index/index',
      })
    }
  },

  //交通工具
  trafficToolChange: function (e) {
  console.log('radio发生change事件，携带value值为：', e.detail.value);
    this.trafficToolStatusFlag = e.detail.value
    this.setData({
       trafficToolStatusFlag: e.detail.value
    })
  }

})