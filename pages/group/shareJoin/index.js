// pages/group/shareJoin/index.js
// import { encode } from "../../../utils/code";
import { joinGroup } from "../../../api/api";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    groupId: "",
    userId: ""
  },

  shareJoniGroup(
    params = {
      groupId: "",
      userId: ""
    }
  ) {
    console.log("发起请求", params);
    joinGroup(params)
      .then(data => {
        console.log("=====joinGroup-data====", data);
        wx.showToast({
          title: "加入群组成功",
          duration: 1500,
          mask: false,
          success: result => {
            wx.navigateTo({
              url: "/pages/index/index",
              success: result => {},
              fail: () => {},
              complete: () => {}
            });
          },
          fail: () => {},
          complete: () => {}
        });
        // wx.showToast
        // wx.showToast({
        //   title: "加入成功",
        //   duration: 3000,
        //   success:
        // })
      })
      .catch(e => {});
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    /**
     * 判断传入参数的有效性，时间有效性
     * 判断用户是否注册 未注册 存参数在storage，引导注册后重新加入
     * 调用接口加群 返回首页
     */
    // console.log()
    const { groupId, timeStamp } = options;
    // 这里需要先判断再调用
    // 这里需要先判断再调用
    // 这里需要先判断再调用
    // 这里需要先判断再调用
    // 这里需要先判断再调用app.init 如果有状态就直接用
    app.init(globalData => {
      const { userFilledInfo } = globalData;
      console.log("======options=====", options);
      console.log("======options=====", userFilledInfo);
      const userful = timeStamp - Date.now() < 24 * 60 * 60 * 1000;
      const _this = this;
      wx.showModal({
        title: "",
        content: `groupId:${groupId} \n timeStamp: ${timeStamp}\n有效状态是: ${userful},`,
        showCancel: true,
        cancelText: "取消",
        cancelColor: "#000000",
        confirmText: "确定",
        confirmColor: "#3CC51F",
        success() {
          if (userFilledInfo.userRegisted) {
            console.log("用户已经注册，准备执行this.joinGroup");
            _this.shareJoniGroup({
              groupId,
              userId: userFilledInfo.id
            });
          } else {
            wx.showModal({
              title: "",
              content: `您还没有注册，去注册。`,
              showCancel: true,
              cancelColor: "#000000",
              confirmText: "去注册",
              confirmColor: "#3CC51F"
            });
          }
        }
      });
    });
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
  onShareAppMessage: function() {}
});
