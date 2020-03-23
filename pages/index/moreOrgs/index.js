// pages/index/moreOrgs/index.js
import { getUserGroupTree } from "../../../api/api";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userFilledInfo.userRegisted == null) {
      app.init(globalData => {
        this.setData({
          globalData,
          userFilledInfo: globalData.userFilledInfo
        });
        this.getData();
      });
    } else {
      this.getData();
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
  getData() {
  getUserGroupTree({}).then(data => {
    console.log(
      "===============用户管理部门：===============\n",
      data.length,
      data
    );
    let temp = data.filter(obj => obj.name !== "变动人员")
    this.setData({
      groupList: temp
    });
  });

},

navigateToGroupIndex(e) {
  console.log(e.currentTarget.dataset.groupname);
  const { data } = e.currentTarget.dataset;
  if (data.permission) {
    wx.navigateTo({
      url: `/pages/group/groupIndex/index?data=${JSON.stringify(data)}`
    });
  }
  if (data.dataPermission) {
    wx.navigateTo({
      url: `/pages/group/groupIndex/index?data=${JSON.stringify(data)}`
    });
  }
},
})