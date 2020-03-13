// pages/company/companyAuth/companyAuthAdd/index.js
const app = getApp();
// import { getGroupAddManager, addDataManager, addManager } from "../../../../api/api";
import { getGroupAddManager, addManager, addDataManager, } from "../../../../api/api";
import { baseURL } from "../../../../config/index";
var pages = getCurrentPages();   //当前页面

console.log("======currentPage=====")
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
  pageBack(){
    let  that  = this
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      groupId: that.data.groupId,
      joinGroupId: that.data.groupId
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  addManager(managerId, type) {
    var that = this
    if (type == "0") {  
      addManager({
        groupId: this.data.groupId,
        managerId: managerId,
        userId: app.globalData.userFilledInfo.id
      }).then(data => {
        console.log('====delRes=====', data)
        wx.showToast({
          title: "添加成功",
          icon: 'success',
          duration: 2000,
          success: function () {
            console.log('haha');
            setTimeout(function () {
              that.pageBack()
            } , 1000) //延迟时间
          }
        });
        this.setData({
          inputValue: ''
        })
        })/* .catch(e => {
          console.log(e)
          wx.showToast({
            title: '您没有权限，请联系创建者或上级管理员',
            icon: 'none',
            duration: 2000
          })
        }) */
    } else if (type == 1) {
      
      addDataManager({
        groupId: this.data.groupId,
        managerId: managerId,
        userId: app.globalData.userFilledInfo.id
      }).then(data => {
        console.log('====delRes=====', data)
        wx.showToast({
          title: "添加成功",
          icon: "none",
          duration: 2000,
          success: function () {
            console.log('haha');
            setTimeout(function () {
              that.pageBack()
            }, 1000) //延迟时间
          }
        });
        this.setData({
          inputValue: ''
        })
        
        })
    }
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
    getGroupAddManager({
      groupId: this.data.groupId,
      phone: this.data.inputValue
    }).then(data => {
      console.log("====dataMana=====", data);
      if (Object.keys(data).length === 0) {
        console.log("======sisisissi====")
        wx.showToast({
          title: "此用户不存在，请先邀请该用户加入您的机构",
          icon: "none",
          duration: 2000
        });
        return
      }else {
        this.setData({
          managerId: data.id
        });
        wx.showModal({
          title: '提示',
          content: "确定要添加" + data.name+"为管理员吗？",
          success(res) {
            if (res.confirm) {
              that.addManager(that.data.managerId, that.data.type);
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        
      } 
    });
  },
  quit() {
    var that = this
    this.setData({
      inputValue:''
    })
    wx.showToast({
      title: "退出添加管理员",
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
  onHide: function() {

  },

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
