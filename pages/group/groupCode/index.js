// pages/organizationCode/index.js
import { getUserCurrentGroup } from "../../../api/api";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
  },

  onChange: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  //
  joinCodeGroup: function() {
    const { code } = this.data
    if(code) {
      console.log('code',code);
      let groupName = "大数据与区块链部"
      let groupId = "67"
      getUserCurrentGroup({
        groupId: groupId
      }).then(data => {
        console.log('查找群', data)
        if(code=="123456"){
          wx.navigateTo({
            url: `/pages/group/shareJoin/index?zc=1&groupName=${groupName}&groupId=${groupId}`,
          }); 
        } else {
          wx.showModal({
            title: "提示",
            content: `您输入的机构唯一码有误，请和邀请人确认！`,
            showCancel: false,
            cancelColor: "#000000",
            confirmText: "确认",
            confirmColor: "#3CC51F",
            success(res) {
              if (res.confirm) {
                console.log("ok");
              } 
            }
          })
        }        
      }) 
    }
  },
  
  //查询是否已经加过群
  isCanJoinGroup: function() {   
    const { groupId, userId } = this.data 
    getUserCurrentGroup({
      groupId: userId
    }).then(data => {
      console.log('查询用户已加入的群接口', data)
      if(JSON.stringify(data) == "{}"){
        this.joinDifferentGroup(groupId)
      }else {
        let quitId = data.id
        let quitName = data.name
        this.setData({
          alreadJoinName: quitName,
          alreadJoinId: quitId,
          alreadJoin: true,
        })
        this.joinDifferentGroup(groupId)
        // this.quitGroupTest(quitId) 
      }   
    })   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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