const app = getApp()

function getCurrentDay() {
  let date = new Date();
  let seperator1 = "-";
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  let currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}

Page({

  data: {
    radioItems: [
      { name: '否', value: '1' },
      { name: '是', value: '0' },
      
    ],
    goHospitalRadioItems: [
      { name: '否', value: '1' },
      { name: '是', value: '0' },
    ],
    isQueZhenRadioItems: [
      { name: '否', value: '1' },
      { name: '是', value: '0' },
    ],
    goHBradioItems: [
      { name: '否', value: '1' },
      { name: '是', value: '0' },
    ],

    isLeaveBjRadioItems: [
      { name: '否', value: '1' },
      { name: '是', value: '0' },
    ],
    
    radioHealthyStatusItems: [
      { name: '健康', value: '0' },
      { name: '有发烧、咳嗽等症状', value: '1' },
      { name: '其他', value: '2'}
    ],
    trafficToolItems: [
      { name: '飞机', value: '0' },
      { name: '火车', value: '1' },
      { name: '汽车', value: '2' },
      { name: '轮船', value: '3' },
      { name: '其他', value: '4' }
    ],
    radioNoGoBackItems: [
      { name: '身体不适', value: '0' },
      { name: '当地未放行', value: '1' }
    ],
    index: 0,
    user_id: app.globalData.openid,
    date: getCurrentDay(),
    workStatusItems: [
      { name: '在岗', value: '0' },
      { name: '远程办公', value: '1' },
      { name: '未复工', value: '2' }
    ],
  },

  onLoad: function (options) {
    let user_id = app.globalData.openid
    let date = getCurrentDay()

    if (options.user_id != undefined && options.user_id != "") {
      user_id = options.user_id
    }

    if (options.date != undefined && options.date != "") {
        date= options.date
    }
    
    this.setData({
      user_id: user_id,
      date: date
    })


    console.log("current user_id: ", this.data.user_id)
    console.log("current date: ", this.data.date)
    this.qryHealthyTodayInfo()
  },

  //查询当天打卡信息
  qryHealthyTodayInfo: function () {
    let that = this;
    // var date = new Date();
    // var Y = date.getFullYear() + '-';
    // var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    // var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    console.log("查询当天打卡记录当前时间：", this.data.date);
    const db = wx.cloud.database()
    db.collection('user_healthy').where({
      _openid: this.data.user_id,
      date: this.data.date,
    }).get({
      success: res => {
        console.log(res)
        //今日已打卡
        if(res.data.length > 0){
          console.log("@@@@@@@@@@@@@@ clickdata.isGoBackFlag: ", res.data[0])
          this.setData({
            clickdata:res.data[0]
          });

          var radioHealthyStatusItems = this.data.radioHealthyStatusItems;
          console.log("radioHealthyStatusItems的内容为：" + radioHealthyStatusItems);
          for (var i = 0, len = 3; i < 3; ++i) {
            radioHealthyStatusItems[i].checked = radioHealthyStatusItems[i].value == res.data[0].bodyStatusFlag;
          }
          this.setData({
            radioHealthyStatusItems: radioHealthyStatusItems
          });

          //交通工具
          var trafficToolItems = this.data.trafficToolItems;
          console.log("trafficToolItems的内容为：" + trafficToolItems);
          for (var i = 0, len = 5; i < 5; ++i) {
            trafficToolItems[i].checked = trafficToolItems[i].value == res.data[0].trafficToolStatusFlag;
          }
          this.setData({
            trafficToolItems: trafficToolItems
          });

          //在岗状态
          var workStatusItems = this.data.workStatusItems;
          console.log("workStatusItems的内容为：" + workStatusItems);
          for (var i = 0; i < workStatusItems.length; ++i) {
            workStatusItems[i].checked = workStatusItems[i].value == res.data[0].workStatusFlag;
          }
          this.setData({
            workStatusItems: workStatusItems
          });
          
          var radioNoGoBackItems = this.data.radioNoGoBackItems;
          console.log("radioHealthyStatusItems的内容为：" + radioNoGoBackItems);
          for (var i = 0, len = 2; i < 2; ++i) {
            radioNoGoBackItems[i].checked = radioNoGoBackItems[i].value == res.data[0].noGoBackFlag;
          }
          this.setData({
            radioNoGoBackItems: radioNoGoBackItems
          });


          
          var goHospitalRadioItems = this.data.goHospitalRadioItems;
          console.log("goHospitalRadioItems的内容为：" + goHospitalRadioItems);
          for (var i = 0, len = 2; i < 2; ++i) {
            goHospitalRadioItems[i].checked = goHospitalRadioItems[i].value == res.data[0].goHospitalFlag;
          }
          this.setData({
            goHospitalRadioItems: goHospitalRadioItems
          });

          var isQueZhenRadioItems = this.data.isQueZhenRadioItems;
          console.log("isQueZhenRadioItems的内容为：" + isQueZhenRadioItems);
          for (var i = 0, len = 2; i < 2; ++i) {
            isQueZhenRadioItems[i].checked = isQueZhenRadioItems[i].value == res.data[0].isQueZhenFlag;
          }
          this.setData({
            isQueZhenRadioItems: isQueZhenRadioItems
          });

          var goHBradioItems = this.data.goHBradioItems;
          console.log("goHBradioItems的内容为：" + goHBradioItems);
          for (var i = 0, len = 2; i < 2; ++i) {
            goHBradioItems[i].checked = goHBradioItems[i].value == res.data[0].goHBFlag;
          }
          this.setData({
            goHBradioItems: goHBradioItems
          });
          

          var isLeaveBjRadioItems = this.data.isLeaveBjRadioItems;
          console.log("isLeaveBjRadioItems的内容为：" + isLeaveBjRadioItems);
          for (var i = 0, len = 2; i < 2; ++i) {
            isLeaveBjRadioItems[i].checked = isLeaveBjRadioItems[i].value == res.data[0].isLeaveBjFlag;
          }
          this.setData({
            isLeaveBjRadioItems: isLeaveBjRadioItems
          });
        }else{
          if (this.data.user_id == app.globalData.openid) {
            wx.navigateTo({
              url: '../healthyClock/healthyClock'
            })
          }
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

  //跳转打卡记录页面
  clickRecord: function (e) {
    console.log("跳转到打卡记录页面")
    wx.navigateTo({
      url: '../clockInRecord/clockInRecord?user_id=' + this.data.user_id
    })
  },

  goHome: function() {
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
  }

})