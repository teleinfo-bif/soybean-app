// pages/company/companySelect/index.js
import { getUserTreeGroup} from "../../../api/api";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  selThis(e) {
    var that = this
    console.log('=====chooseItem===',e.detail);
    this.setData({
      chooseItem: e.detail
    })
    if (this.data.pageType != 'managerPage' && e.detail.children.length != 0 ){
        wx.showToast({
          title: '创建机构需选择到末级，请重新选择',
          icon: 'none',
          duration: 2000
        })
    }else{
      wx.showToast({
        title: "选择成功",
        icon: 'success',
        duration: 2000,
        success: function () {
          console.log('haha');
          setTimeout(function () {
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2];
            prevPage.setData({
              groupId: e.detail.id,
              groupName: e.detail.name
            })
            wx.navigateBack({
              delta: 1,
            })
          }, 1000) //延迟时间
        }
      });

    }
  },
  //权限管理页面
  treeUserArray: function (groupId,groupName) {
    getUserTreeGroup({
      groupId: groupId
    }).then(data => {
      var obj={
        "name":groupName,
        'id': groupId,
        "children":data
      }
      console.log('===res====',obj)
      this.setData({
          companyArray:[obj]
        })
    })
  },
  onLoad(options) {
/*     options.groupId = 1
    options.type = 'managerPage'
    options.groupName = '信通院' */
    this.setData({
      groupId: options.groupId,
      pageType: options.type
    })
    this.treeUserArray(options.groupId, options.groupName)
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