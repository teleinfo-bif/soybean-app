// pages/clockInRecord/clockInRecord.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas:[
      {
        temperature: 37,
        date: "2020-02-01",
        status: "无异常症状"
      },
      {
        temperature: 37.2,
        date: "2020-02-02",
        status: "腹泻、肌肉酸痛"
      },
      {
        temperature: 37.4,
        date: "2020-02-03",
        status: "乏力"
      },
      {
        temperature: 37.1,
        date: "2020-01-30",
        status: "无异常症状"
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onQuery(this.data.page);
  },



  onQuery: function () {
    const db = wx.cloud.database();
    var that = this;
    // 获取总数
    db.collection('user_healthy').where({
      _openid: app.globalData.openid
    }).count({
      success: function (res) {
        console.log("群组分页查询记录数为：" + res.total)
        that.data.totalCount = res.total;
      }
    })

    db.collection('user_healthy').where({
      _openid: app.globalData.openid
    }).limit(10) // 限制返回数量为 10 条
      .orderBy('addtime', 'desc').get({
        success: res => {
          console.log("群组列表查询成功：" + res.data);
          console.log("群组列表查询成功：" + JSON.stringify(res.data));
          that.data.orglistdata = res.data;
          this.setData({
            orglistdata: that.data.orglistdata
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


  /**
 * 分页处理函数
 */
  onReachBottom: function () {
    var that = this;
    var temp = [];
    // 获取后面十条
    if (this.data.orglistdata.length < this.data.totalCount) {
      console.log("分页查询，当前skip的值为：" + this.data.orglistdata.length);
      try {
        const db = wx.cloud.database();
        db.collection('user_healthy').where({
          _openid: app.globalData.openid
        }).skip(this.data.orglistdata.length)
          .limit(10) // 限制返回数量为 10 条
          .orderBy('addtime', 'desc') // 排序
          .get({
            success: function (res) {
              // res.data 是包含以上定义的两条记录的数组
              console.log(res.data);
              if (res.data.length > 0) {
                for (var i = 0; i < res.data.length; i++) {
                  var tempTopic = res.data[i];
                  temp.push(tempTopic);
                }
                var totalactivies = {};
                totalactivies = that.data.orglistdata.concat(temp);
                that.setData({
                  orglistdata: totalactivies,
                })
              } else {
                wx.showToast({
                  title: '没有更多数据了',
                })
              }
            },
            fail: function (event) {
              console.log("======" + event);
            }
          })
      } catch (e) {
        console.error(e);
      }
    } else {
      wx.showToast({
        title: '没有更多数据了',
      })
    }
  },






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
  onShareAppMessage: function () {

  }
})