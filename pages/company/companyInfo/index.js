// pages/company/companyInfo/index.js
import { getGroup, quitGroup} from "../../../api/api";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logoSrc:'../../../static/images/group_name.png',
    groupId:''
  },
  //根据ID获取部门信息
  getGroupDetail(groupId) {
    getGroup({
      id: groupId,
    }).then((data) => {
      this.setData({
        data: data
      })
    })
  },
  toSetManage(){
    console.log('====tonextPage=====',this.data.groupId)
    wx.navigateTo({
      url: `/pages/company/companyAuth/index?groupId=${this.data.groupId}&groupName=${this.data.data.name}`,
    }); 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("======groupId==", options.groupId)
    console.log("======permision==", options.permision)
    this.setData({
      groupId: options.groupId,
      permision: options.permision
    })
    this.getGroupDetail(options.groupId)
  },
  quitCompany(){
    var tmp = this.data.groupId
    quitGroup({
      userId: app.globalData.userFilledInfo.id,
      groupId: tmp,
    }).then(data => {
      console.log('退群', data)
      wx.showToast({
        title: '退出成功',
        icon: 'success',
        duration: 2000
      })
      wx.navigateTo({
        url: '/pages/index/index',
      })
    })     
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