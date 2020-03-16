// pages/status/index.js
const app = getApp();
import { userSubscribe, userUnSubscribe } from "../../../api/api.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    app,
    data: {},
    tmplId: "xX28cEcVGBT_VQYUpsZastZFrfbC3YGBWYcCC9_mKRE",
    clockReminder: true
  },

  redirectTo(e) {
    wx.reLaunch({
      url: "/pages/index/index"
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const { data = "" } = options;
    this.setData({
      data: JSON.parse(data)
    });
  },
  reminder: function() {
    const { tmplId } = this.data
    console.log(this.data)
    return new Promise((resolve, reject) => {
      wx.requestSubscribeMessage({
        tmplIds: [tmplId],
        success: (res) => {
          console.log(res)
          if (res[tmplId] === 'accept') {
            userSubscribe({
              id: this.data.data.userId
            }).then(result=>{
              console.log('订阅数据写入数据库',result)
              wx.showToast({
                title: '开启打卡提醒成功!',
                icon: 'none',
              })
            })            
          }
          if(res[tmplId] === 'reject') {
            userUnSubscribe({
              id: this.data.data.userId
            }).then(result=>{
              console.log('取消订阅数据写入数据库',result)
            }) 
          }
        },
        fail(err) {
          console.error(err);
          reject()
        },
        complete: ()=> {
          this.setData({
            clockReminder: false
          });
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {}
});
