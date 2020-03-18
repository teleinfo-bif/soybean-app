// pages/company/companyTransfer/index.js
const app = getApp();
import { findUserByPhoneAct, transferCompanyAct } from "../../../api/api";
var pages = getCurrentPages();   //当前页面

console.log("======currentPage=====")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    groupId: "",
    transferId: '',
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    });
  },
  bindNameInput: function (e) {
    this.setData({
      inputNameValue: e.detail.value
    });
  },
  pageBack() {
    let that = this
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      groupId: that.data.groupId,
      fromTransferPage:true
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  transferAct(transferId) {
    var that = this
    transferCompanyAct({
      groupId: this.data.groupId,
      transferId: transferId,
      userId: app.globalData.userFilledInfo.id
    }).then(data => {
      console.log('====delRes=====', data)
      wx.showToast({
        title: "转让成功",
        icon: 'success',
        duration: 2000,
        success: function () {
          console.log('haha');
          setTimeout(function () {
            if (that.data.isJoin == true){
              that.pageBack()
            } else {
              wx.reLaunch({
                url: '/pages/index/index'
              })
            }
           
          }, 1000) //延迟时间
        }
      });
      this.setData({
        inputValue: ''
      })
    })
  },
  join() {
    //this.data.inputValue = '13552157026'
    var that = this
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
    findUserByPhoneAct({
      phone: this.data.inputValue
    }).then(data => {
      console.log("====dataMana=====", data);
      if (Object.keys(data).length === 0) {
        console.log("======sisisissi====")
        wx.showToast({
          title: "此用户不存在，请先邀请该用户注册",
          icon: "none",
          duration: 2000
        });
        return
      } 
      else {
        this.setData({
          transferId: data.id
        });
        if (data.name != this.data.inputNameValue){
            wx.showToast({
              title: "姓名和电话不一致,请重新输入",
              icon: "none",
              duration: 2000
            });
            return
          }
        if (data.id == app.globalData.userFilledInfo.id){
          wx.showToast({
            title: "您已是创建者",
            icon: "none",
            duration: 2000
          });
          return
        }else{
          wx.showModal({
            title: '提示',
            content: "确定要转让给" + data.name + "吗？",
            success(res) {
              if (res.confirm) {
               that.transferAct(that.data.transferId);
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }

      }
    });
  },
  quit() {
    var that = this
    this.setData({
      inputValue: ''
    })
    wx.showToast({
      title: "退出创建者转让",
      icon: "none",
      duration: 2000,
      success: function () {
        console.log('haha');
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
      isJoin: options.isJoin
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
