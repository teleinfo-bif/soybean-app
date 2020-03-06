// pages/code/code.js
const app = getApp()
const healthQrCodeUrl = '';
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
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrcodeUrl: "",
    name: "",
    jobNumber: '',
    updateTime: '',
    description: '',
  },

  testQR: function () {
    var that = this
    wx.request({
      url: "https://www.guokezhixing.com/secHealth/version1/healthRecord/miniSubmitRecord",
      data: {
        realName: that.data.name,
        idCard: that.data.idCard,
        phone: that.data.phone,
        unit: that.data.unit,
        unitAddress: that.data.unitAddress,
        isLeave: that.data.isLeave,
        returnDate: that.data.returnDate,
        currentAddress: that.data.currentAddress,
        isTouchCase: that.data.isTouchCase,
        currentHealth: that.data.currentHealth,
        userId: that.data.userId,
        openId: that.data.openId
      },
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      success(res) {
        // console.log(res.data); 
        console.log('=====请求sucessTESTQR=====', res);
        that.setData({
          qrcodeUrl: res.data.data.qrcodeUrl,
          updateTime: "更新于："+res.data.data.updateTime,
          realName:res.data.data.title,
          description: res.data.data.description
        })

      },
      fail() {
        console.log('====请求失败=====');
      }
    })
  },

  recent14dayHB() {
    var that = this
    const db = wx.cloud.database()
    db.collection('user_healthy').where({
      _openid: app.globalData.openid,
    }).orderBy('date', 'desc')
    .limit(14)
    .get({
      success: res => {
        //今日已打卡
        if (res.data.length > 0) {
          var resItems = res.data
          let ids = []
          resItems.forEach(item => {
            if (item.goHBFlag == '0') {
              ids.push(item.date)
              that.setData({
                isTouchCase:true
              })
            }
          })
          if(ids.length == 0){
            that.setData({
              isTouchCase: false
            })
          }
          console.log("&&&&&&&res&&&", ids)
          that.testQR()
        }
      },
      fail: err => {
        console.log(err)
      }
    })


  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    let openid = app.globalData.openid
    let date = getCurrentDay()

    this.setData({
      openId: openid,
      date: date
    })

    console.log("current openid: ", this.data.user_id)
    console.log("current date: ", this.data.date)
    this.qryHealthyTodayInfo()
    wx.hideLoading()
  },

  qryHealthyTodayInfo: function () {
    let that = this;
    // var date = new Date();
    // var Y = date.getFullYear() + '-';
    // var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    // var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    console.log("查询当天打卡记录当前时间：", this.data.date);
    const db = wx.cloud.database()
    db.collection('user_healthy').where({
      _openid: app.globalData.openid,
      date: this.data.date,
    }).get({
      success: res => {
        console.log(res)
        //今日已打卡
        if (res.data.length > 0) {
          this.setData({
            clickdata: res.data[0],
            currentAddress: res.data[0].place,
            returnDate: res.data[0].suregobackdate
          });
          if (res.data[0].isGoBackFlag == 0  && res.data[0].isLeaveBjFlag == 0){
            this.setData({
              isLeave:true
            })
          } 
          if (res.data[0].isGoBackFlag == 0 && res.data[0].isLeaveBjFlag == 1) {
            this.setData({
              isLeave: false
            })
          }
          if (res.data[0].isGoBackFlag == 1 ) {
            this.setData({
              isLeave: true
            })
          }
          if (res.data[0].bodyStatusFlag == 0){
            this.setData({
              currentHealth: '健康'
            })
          } else if (res.data[0].bodyStatusFlag == 1){
             this.setData({
              currentHealth: '感冒发烧'
            })
          }else{
            this.setData({
              currentHealth: '其他'
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

  //查询用户基本信息
  qryUserInfo: function () {
    let that = this
    const db = wx.cloud.database()
    db.collection('user_info').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        console.log(res)
        that.userinfo = res.data;
        that.setData({
          name: res.data[0].name,
          phone: res.data[0].phone,
          idCard: res.data[0].certificate_number,
          unit: res.data[0].company_department,
          unitAddress: res.data[0].company_district,
          userId: res.data[0]._id
        })
        that.recent14dayHB()
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
  /**
   * 生命周期函数--监听页面加载
   */
/*   onLoad: function (options) {
    var that = this
    wx.request({
      url: healthQrCodeUrl,
      data: {
      },
      method: "POST",
      header: {
        "Content-Type": "application/json",
        'Authorization': "Bearer " + wx.getStorageSync("token") //读取cookie
      },
      success(res) {
        if (res.data.status == '0') {
          console.log("aaaa", res.data.data)
          that.setData({
            qrcodeUrl: res.data.data.qrcodeUrl,
            realName: res.data.data.realName,
            jobNumber: res.data.data.jobNumber,
            updateTime: res.data.data.updateTime,
            color: res.data.data.color,
            title: res.data.data.title,
            description: res.data.data.description,
            isSubmitToday: res.data.data.isSubmitToday
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000
          })
        }
        console.log('请求成功');
      },
      fail() {
        console.log('请求失败');
      }
    })
  }, */

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
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
})