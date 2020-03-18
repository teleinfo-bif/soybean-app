// pages/company/companyInfo/index.js
import { getGroup, quitGroup, existCompany, delFirstCompanyAct} from "../../../api/api";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupId:'',
    quitbtn:true,
    delFirstComapnyBtn:true,
    transferComapnyBtn:false,
    fromTransferPage: false
  },
  pasteCode: function () {
    const { groupCode } = this.data.data
    wx.setClipboardData({
      data: groupCode,
      success: function (res) {
        wx.showToast({
          icon: 'none',
          title: "机构唯一码已保存到您的剪贴板"
        });
      }
    })
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
      if (data.createUser == app.globalData.userFilledInfo.id){
        this.setData({
          transferComapnyBtn: true
        })
      }else{
        this.setData({
          transferComapnyBtn: false
        })
      }
      if (data.createUser == app.globalData.userFilledInfo.id && data.groupIdentify === data.groupCode){
        this.setData({
          delFirstComapnyBtn: false
        })
      }else{
        this.setData({
          delFirstComapnyBtn: true
        })
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
  toTransferPage(){
    wx.navigateTo({
      url: `/pages/company/companyTransfer/index?groupId=${this.data.groupId}&isJoin=${!this.data.quitbtn}`,
    }); 
  },
  existCompanyAct(groupId){
    existCompany({
      groupId: groupId,
      userId: app.globalData.userFilledInfo.id
    }).then((data) => {
     if(data == false){
       this.setData({
         quitbtn: true
       })
      
     }else{
       this.setData({
         quitbtn: false
       })
     }
    })
  },
  delFirstComany(){
    var that = this
    wx.showModal({
      title: '提示',
      content: '移除机构会将机构下的人员移除，是否继续',
      confirmText: '继续',
      success(res) {
        if (res.confirm) {
          delFirstCompanyAct({
            groupId: that.data.groupId,
            creatorId: app.globalData.userFilledInfo.id
          }).then((data) => {
            wx.showToast({
              title: '移除成功',
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  wx.reLaunch({
                    url: '/pages/index/index'
                  })
                }, 1000) //延迟时间
              }
            })
            }).catch(error => {
              console.error("错误提醒", error);
              wx.showToast({
                title: "网络异常，请重新操作",
                icon: "none",
                duration: 2000
              });
            });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //options.groupId = 1
    console.log("======groupId==", options.groupId)
    console.log("======permision==", options.permision)
    this.setData({
      groupId: options.groupId,
      permision: options.permision
    })

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
    wx.showModal({
      title: '提示',
      content: '确定要退出该机构吗？',
      success(res) {
        if (res.confirm) {
          quitGroup({
            userId: app.globalData.userFilledInfo.id,
            groupId: tmp,
          }).then(data => {
            console.log('退群', data)
            wx.showToast({
              title: '已退出' + that.data.data.name,
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  wx.reLaunch({
                    url: '/pages/index/index'
                  })
                }, 1000) //延迟时间
              }
            })

          }) 
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
    this.getGroupDetail(this.data.groupId)
    this.existCompanyAct(this.data.groupId)
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
    if (this.data.fromTransferPage){
      this.setData({
        fromTransferPage:false
      })
      wx.reLaunch({
        url: '/pages/index/index',
      })

    }
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