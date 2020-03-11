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
      if(data.log != ''){
        this.setData({
          logoSrc: data.logo
        })
      }
      this.setData({
        data: data
      })
    })
  },
  toSetManage(){
    console.log('====tonextPage=====',this.data.groupId)
    wx.navigateTo({
      url: `/pages/company/companyAuth/index?groupId=${this.data.groupId}`,
    }); 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("======groupId==", options.groupId)
    this.setData({
      groupId: options.groupId
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