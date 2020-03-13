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
      var items = data.addressName.split("，")
      var address = ''
      console.log('===items===',items)
      if (items.length == 3){
          if (items[0] == items[1]) {
            address = items[1] + items[2] + data.detailAddress
          } else {
            address = items[0] + items[1] + items[2] + data.detailAddress
          }
      }
      this.setData({
        data: data,
        address: address
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
    options.groupId = 1
    console.log("======groupId==", options.groupId)
    console.log("======permision==", options.permision)
    this.setData({
      groupId: options.groupId,
      permision: options.permision
    })
    this.getGroupDetail(options.groupId)
  },
/*   pageBack() {
    let that = this
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      groupId: that.data.groupId,
      joinGroupId: that.data.groupId
    })
    wx.navigateBack({
      delta: 1,
    })
  }, */
  quitCompany(){
    var tmp = this.data.groupId
    var that = this
    quitGroup({
      userId: app.globalData.userFilledInfo.id,
      groupId: tmp,
    }).then(data => {
      console.log('退群', data)
      wx.showToast({
        title: '已退出'+that.data.data.name,
        icon: 'success',
        duration: 2000,
        successfunction() {  
          setTimeout(function () {
            wx.switchTab({
              url: '/page/index/index'
            })
          }, 1500) //延迟时间
        }
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