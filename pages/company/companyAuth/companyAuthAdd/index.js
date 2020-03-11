// pages/company/companyAuth/companyAuthAdd/index.js
const app = getApp();
// import { getGroupAddManager, addDataManager, addManager } from "../../../../api/api";
import { getGroupAddManager } from "../../../../api/api";
import { baseURL } from "../../../../config/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    groupId: "",
    managerId:''
  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },
  addManager(managerId, type) {
    var that = this;
    console.log("=====groupId", this.data.groupId);
    console.log("=====managerId", managerId);
    console.log("=====userId", app.globalData.userFilledInfo.id);
    if (type == "0") {
      wx.request({
        url:
          baseURL +
          "/wx/group/manager?groupId=" +
          that.data.groupId +
          "&userId=" +
          app.globalData.userFilledInfo.id +
          "&managerId=" +
          managerId,
        data: {},
        method: "POST",
        header: {
          "content-type": ""
        },
        success: function(res) {
          /*           console.log('data:' + res.data);
          console.log('header:' + res.header);
          console.log('statusCode:' + res.statusCode); */
          if (res.data.success == false) {
            wx.showToast({
              title: res.data.msg,
              icon: "none",
              duration: 2000
            });
          } else {
            wx.showToast({
              title: "添加成功",
              icon: "none",
              duration: 2000
            });
            wx.navigateTo({
              url: `/pages/company/companyAuth/index?groupId=${that.data.groupId}`
            });
          }
        },
        fail(res) {
          wx.showModal({
            title: "添加失败",
            content:
              "如需帮助，发送邮件到service@teleinfo.cn，我们会尽快与您联系！"
          });
        }
      });
    } else if (type == 1) {
      wx.request({
        url:
          baseURL +
          "/wx/group/dataManager?groupId=" +
          that.data.groupId +
          "&userId=" +
          app.globalData.userFilledInfo.id +
          "&managerId=" +
          managerId,
        data: {},
        method: "POST",
        header: {
          "content-type": ""
        },
        success: function(res) {
          if (res.data.success == false) {
            wx.showToast({
              title: res.data.msg,
              icon: "none",
              duration: 2000
            });
          } else {
            wx.showToast({
              title: "添加成功",
              icon: "none",
              duration: 2000
            });
            wx.navigateTo({
              url: `/pages/company/companyAuth/index?groupId=${that.data.groupId}`
            });
          }
        },
        fail(res) {
          wx.showModal({
            title: "添加失败",
            content:
              "如需帮助，发送邮件到service@teleinfo.cn，我们会尽快与您联系！"
          });
        }
      });
    }
  },

  join() {
    //this.data.inputValue = '13552157026'
    if (this.data.inputValue == "") {
      wx.showToast({
        title: "请填写手机号!",
        icon: "none",
        duration: 2000
      });
      return;
    } else if (!/^1(3|4|5|7|8)\d{9}$/.test(this.data.inputValue)) {
      wx.showToast({
        title: "填写的手机号码格式不正确!",
        icon: "none",
        duration: 2000
      });
      return;
    }
    console.log(
      "app.globalData.userFilledInfo.id",
      app.globalData.userFilledInfo.id
    );
    getGroupAddManager({
      groupId: this.data.groupId,
      phone: this.data.inputValue
    }).then(data => {
      console.log("====dataMana=====", data);
      if (Object.keys(data).length === 0) {
        console.log("======sisisissi====")
        wx.showToast({
          title: "不存在此用户",
          icon: "none",
          duration: 2000
        });
        return
      }else {
        this.setData({
          managerId: data.id
        });
        this.addManager(this.data.managerId, this.data.type);
      } 
    });
  },
  quit() {
    var that = this
    this.setData({
      inputValue:''
    })
    wx.navigateTo({
      url: `/pages/company/companyAuth/index?groupId=${that.data.groupId}`
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      type: options.type,
      groupId: options.groupId
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
