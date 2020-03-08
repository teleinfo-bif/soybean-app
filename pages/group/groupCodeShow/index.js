// pages/group/groupCodeShow/index.js
const app = getApp()
import { fromGroupCodetoId } from "../../../api/api";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupCode: '',
    groupName: '',
    groupId: '', 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { groupCode } = options;
    if (!app.globalData.appInit) {
      app.init(globalData => {
        this.setData({
          globalData: globalData,
          userFilledInfo: globalData.userFilledInfo,
          groupCode: groupCode,
        });
        fromGroupCodetoId({
          groupCode: groupCode
        }).then(data => {
          let groupName = data.name
          let groupId = data.id
          this.setData({
            groupName: groupName,
            groupId: groupId, 
          })
        })
      });
    } else {
      this.setData({
        globalData: app.globalData,
        userFilledInfo: app.globalData.userFilledInfo,
        groupCode: groupCode,
      });
      fromGroupCodetoId({
        groupCode: groupCode
      }).then(data => {
        let groupName = data.name
        let groupId = data.id
        this.setData({
          groupName: groupName,
          groupId: groupId, 
        })
      })
    }   
  },

  pasteCode: function () {
    const { groupCode } = this.data
    wx.setClipboardData({
      data: groupCode,
      success: function (res) {
        wx.showToast({
          icon: 'none',
          title: "机构唯一码已保存到您的剪贴板"
        });
      }
    })
  },

  joinCodeGroup: function (code) {
    const {groupName, groupId } = this.data
    wx.navigateTo({
      url: `/pages/group/shareJoin/index?zc=1&groupName=${groupName}&groupId=${groupId}`,
    });
  },

  onShareAppMessage: function() {
    // 考虑用对称加密签个时间
    const timeStamp = new Date().getTime();
    const { name } = app.globalData.userFilledInfo;
    const tilte = `${name}邀请您加入${this.data.groupName}`;
    return {
      title: tilte,

      desc: "分享页面的内容",

      path: `/pages/group/shareJoin/index?groupId=${this.data.groupId}&timeStamp=${timeStamp}&groupName=${this.data.groupName}`,
      imageUrl: "../../../static/images/share.jpg",
      success: res => {
        console.log("转发成功", res);
      },
      fail: res => {
        console.log("转发失败", res);
      }
    };
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
  // onShareAppMessage: function () {

  // }
})