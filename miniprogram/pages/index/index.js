//index.js
const app = getApp()
var QQMapWX = require('qqmap-wx-jssdk.js');
var qqmapsdk;

Page({
  data: {
    avatarUrl: '',
    userInfo: {},
    logged: false,
    takeSession: false,
    address: '',
    // 展示列表
    locationList: [],
    // 默认当前坐标附近的列表
    poiList: [],
  },

  onLoad: function () {
    qqmapsdk = new QQMapWX({
      key: 'xxxxxxxxxxxxxx'
    });
    var that = this;
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              console.info("用户信息为：" + JSON.stringify(res.userInfo, null, 2));
              app.globalData.nickName = res.userInfo.nickName
              app.globalData.avatarUrl = res.userInfo.avatarUrl
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName,
              })
              that.getSessionCode();
            }
          })
        }
      }
    })
  },

  /**获取sessionCode和openid */
  getSessionCode: function (e) {
    let that = this;
    wx.login({
      success(res) {
        if (res.code) {
          console.log(res)
          //发起网络请求
          app.globalData.sessionCode = res.code
          that.onGetOpenid();
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },



  onShow: function () {
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
            var address = res.result.address;
            var poiList = res.result.pois;
            that.setData({
              address: address,
              poiList: poiList,
              locationList: poiList
            })
          }
        })
      }
    });
  },


  onReady: function () {
    const _this = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        console.log("当前用户位置信息为：" + JSON.stringify(res, null, 2));
      }
    })
  },

  /**用户信息提交 */
  userInfoPut: function (e) {
    if (app.globalData.nickName == null) {
      wx.navigateTo({
        url: '../login/login',
      })
      return;
    }
    wx.navigateTo({
      url: '../personalInfo/personalInfo',
    })
  },

  getPhoneNumber: function (e) {
    var that = this;
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        content: '不能获取手机号码',
        showCancel: false
      })
      return;
    }
    wx.showLoading({
      title: '获取手机号中...',
    })

    wx.cloud.callFunction({
      name: 'getToken',  // 对应云函数名
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionCode: app.globalData.sessionCode    // 这个通过wx.login获取，去了解一下就知道。这不多描述
      },
      success: res => {
        wx.hideLoading()
        // 成功拿到手机号，跳转首页
        console.log(res.result.data);
        app.globalData.phoneNumber = res.result.data.phoneNumber
      },
      fail: err => {
        console.error(err);
        wx.showToast({
          title: '获取手机号失败',
          icon: 'none'
        })
      }
    })

  },


  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.showToast({
          icon: 'none',
          title: '登录失败',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
