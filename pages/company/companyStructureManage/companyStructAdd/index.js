// pages/company/companyStructureManage/companyStructAdd/index.js
import { addCompanyStructAct } from "../.././../../api/api";
const app = getApp();
var pages = getCurrentPages();   //当前页面

Page({
  /**
   * 页面的初始数据
   */
  data: {
    groupId: "",
    inputValue:'',
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    });
  },
  pageBack() {
    let that = this
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      groupId: that.data.groupId,
      groupName:that.data.groupName
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  addCompanyDepart() {
    var that = this
    addCompanyStructAct({
      name: this.data.inputValue,
      parentId: this.data.parentId,
      userId: app.globalData.userFilledInfo.id,
      loading:true
    }).then(data => {
      wx.showToast({
        title: "添加成功",
        icon: 'success',
        duration: 2000,
        success: function () {
          setTimeout(function () {
            that.pageBack()
          }, 1000) //延迟时间
        }
      });
      this.setData({
        inputValue: ''
      })
    })
  },
  join() {
    var that = this
    if (this.data.inputValue == "") {
      wx.showToast({
        title: "请填写架构名称!",
        icon: "none",
        duration: 2000
      });
      return;
    } 
    wx.showModal({
      title: '提示',
      content: "确定要添加" + this.data.inputValue + "吗？",
      success(res) {
        if (res.confirm) {
          that.addCompanyDepart();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  quit() {
    var that = this
    this.setData({
      inputValue: ''
    })
    wx.showToast({
      title: "退出添加机构",
      icon: "none",
      duration: 2000,
      success: function () {
        setTimeout(function () {
          that.pageBack()
        }, 1000) //延迟时间
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      groupId: options.groupId,
      groupName:options.groupName,
      parentId: options.parentId
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { }
});
