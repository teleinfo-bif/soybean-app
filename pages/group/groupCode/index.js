// pages/organizationCode/index.js
import { fromGroupCodetoId } from "../../../api/api";
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
  //根据唯一码判断，查看群信息，跳转
  joinCodeGroup: function () {
    const { code } = this.data
    if (code) {
      console.log('code', code);
      fromGroupCodetoId({
        groupCode: code
      }).then(data => {
        console.log('根据唯一码查看群信息', data)
        if (JSON.stringify(data) == "{}") {
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
        } else {
          let groupName = data.name
          let groupId = data.id
          wx.navigateTo({
            url: `/pages/group/shareJoin/index?zc=1&groupName=${groupName}&groupId=${groupId}`,
          });
        }
      })
    }
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
  // onShareAppMessage: function () {

  // }
})