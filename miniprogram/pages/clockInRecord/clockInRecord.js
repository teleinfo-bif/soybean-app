// pages/clockInRecord/clockInRecord.js
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

let emptyData = {
  temperature: "--",
  date: getCurrentDay(),
  bodyStatusFlag: "--"
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    user_id: app.globalData.openid,
    datas:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.user_id != undefined && options.user_id != "") {
      this.setData({
        user_id: options.user_id
      })
    }

    this.onQuery();
  },

  onQuery: function () {
    const db = wx.cloud.database();
    var that = this;
    // 获取总数

    let user_id = that.data.user_id
    if(user_id == null || user_id == '' || user_id.length < 20){
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


  onPullDownRefresh: function () {
    if (this.data.isRefreshing || this.data.isLoadingMoreData) {
      return
    }
    this.setData({
      isRefreshing: true,
      hasMoreData: true
    })
    this.onQuery(this.data.user_id);
  },

  /**
 * 分页处理函数
 */
  onReachBottom: function () {
    console.log("调用分页处理函数")
    var that = this;
    var temp = [];
    // 获取后面十条
    if (that.data.datas.length < that.data.totalCount) {
      console.log("分页查询，当前skip的值为：" + that.data.datas.length);
      try {
        const db = wx.cloud.database();
        db.collection('user_healthy').where({
          _openid: that.data.user_id
        }).skip(this.data.datas.length)
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
                totalactivies = that.data.datas.concat(temp);
                that.setData({
                  datas: totalactivies,
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
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})