// pages/group/groupIndex/index.js
// import { decode } from "../../../utils/code";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    groupId: "",
    children: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const { groupName, children, groupId } = options;
    console.log(options);
    wx.setNavigationBarTitle({
      title: groupName
    });
    this.setData({
      children: JSON.parse(children),
      groupId
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
  onShareAppMessage: function() {
    // 考虑用对称加密签个时间
    const timeStamp = new Date().getTime();
    // const decodeTimeStamp = decode(timeStamp);
    // const decodeGroupId = decode(this.data.groupId);
    return {
      title: "弹出分享时显示的分享标题",

      desc: "分享页面的内容",

      path: `/pages/group/shareJoin/index?groupId=${timeStamp}&timeStamp=${this.data.groupId}`,
      imageUrl: "../../../static/images/fenxiang.png",
      success: res => {
        console.log("转发成功", res);
      },
      fail: res => {
        console.log("转发失败", res);
      }
    };
  }
});
