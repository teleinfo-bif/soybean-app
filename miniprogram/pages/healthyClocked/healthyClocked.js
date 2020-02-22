const app = getApp()

Page({

  data: {
    radioItems: [
      { name: '是', value: '0' },
      { name: '否', value: '1'}
    ],
    goHospitalRadioItems: [
      { name: '是', value: '0' },
      { name: '否', value: '1' }
    ],
    goHBradioItems: [
      { name: '是', value: '0' },
      { name: '否', value: '1' }
    ],

    isLeaveBjRadioItems: [
      { name: '是', value: '0' },
      { name: '否', value: '1' }
    ],
    
    radioHealthyStatusItems: [
      { name: '健康', value: '0' },
      { name: '有发烧、咳嗽等症状', value: '1' },
      { name: '其他', value: '2'}
    ],
    radioNoGoBackItems: [
      { name: '身体不适', value: '0' },
      { name: '当地未放行', value: '1' }
    ],
    index: 0,
  },

  onLoad: function (options) {
    this.qryHealthyTodayInfo()
  },

  //查询当天打卡信息
  qryHealthyTodayInfo: function () {
    let that = this;
    var date = new Date();
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    console.log("查询当天打卡记录当前时间：" + Y + M + D);
    const db = wx.cloud.database()
    db.collection('user_healthy').where({
      _openid: app.globalData.openid,
      date: Y + M + D
    }).get({
      success: res => {
        console.log(res)
        //今日已打卡
        if(res.data.length > 0){
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
          wx.navigateTo({
            url: '../healthyClock/healthyClock'
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

  //跳转打卡记录页面
  clickRecord: function (e) {
    console.log("跳转到打卡记录页面")
    wx.navigateTo({
      url: '../clockInRecord/clockInRecord'
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