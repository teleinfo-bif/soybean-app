// pages/organizationCode/index.js
import { fromGroupCodetoId, getUserCurrentGroup, quitGroup, joinGroup } from "../../../api/api";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    userId: '',
  },

  onChange: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  joinCodeReturn(){
    wx.navigateBack({
      delta: 1
    })

  },
  //根据唯一码判断，查看群信息，跳转
  joinCodeGroup: function () {
    // wx.showLoading({
    //   title: '加载中',
    // })
    const { code } = this.data
    if (code) {
      console.log('code', code);
      fromGroupCodetoId({
        groupCode: code
      }).then(data => {
        // wx.hideLoading()   
        console.log('根据唯一码查看群信息', data);
        if (JSON.stringify(data) == "{}") {
          wx.showToast({
            title: `输入的机构唯一码有误，请和邀请人确认！`,
            icon: 'none',
          })
          return
        } else {
          let groupName = data.name
          let groupId = data.id
          let groupType = data.groupType
          this.setData({
            joinId: groupId, 
            joinName: groupName,
            joinType: groupType
          })
          this.isCanJoinGroup()

          //！！！直接处理，不向加群页面跳转了
          // let timeStamp = new Date().getTime();
          // wx.navigateTo({
          //   url: `/pages/group/shareJoin/index?zc=1&groupName=${groupName}&groupId=${groupId}&timeStamp=${timeStamp}`,
          // });
        }
      })
    } else {
      wx.showToast({
        title: `请输入您的机构唯一码！`,
        icon: 'none',
      })
    }
  },

  //查询是否已经加过群
  isCanJoinGroup: function () {
    const { joinId, userId, joinName, joinType } = this.data
    getUserCurrentGroup({
      groupId: userId
    }).then(data => {
      console.log('查询用户已加入的群接口', data)
      if (JSON.stringify(data) == "{}") {
        this.joinDifferentGroup()
      } else {
        let quitId = data.id
        let quitName = data.name
        if(quitId == joinId) {
          wx.showToast({
            title: "您已经加入该群！",
            duration: 2000,
            icon: "none",
          });
          return
        }
        this.setData({
          alreadJoinName: quitName,
          alreadJoinId: quitId,
          alreadJoin: true,
        })
        this.joinDifferentGroup()
      }
    })
  },

  joinDifferentGroup: function () {
    const { joinType } = this.data
      if (joinType == 1) {
          this.joinGroupLowFromRegister()      
      } else {
          this.joinGroupHighFromRegister()
      }
  },

  shareJoniGroup(
    params = {
      groupId: "",
      userId: ""
    }
  ) {
    console.log("发起请求", params);
    const { userId, alreadJoin, alreadJoinId } = this.data
    if (alreadJoin) {
      quitGroup({
        userId: userId,
        groupId: alreadJoinId,
      }).then(data => {
        console.log('退群', data)
        joinGroup(params)
          .then(data => {
            console.log("=====joinGroup-data====", data);
            wx.showToast({
              title: "加入部门成功",
              duration: 1500,
              mask: false,
              success: result => {
                wx.reLaunch({
                  url: "/pages/index/index",
                })
              },
              fail: () => { },
              complete: () => { }
            });
          })
          .catch(e => { });
      })
    } else {
      joinGroup(params)
        .then(data => {
          console.log("=====joinGroup-data====", data);
          wx.showToast({
            title: "加入部门成功",
            duration: 1500,
            mask: false,
            success: result => {
            },
            fail: () => { },
            complete: () => { }
          });
        })
        .catch(e => { });
      setTimeout(function () {
        wx.reLaunch({
          url: "/pages/index/index",
        })
      }, 2000)
    }
  },

  joinGroupLowFromRegister: function () {
    const _this = this;
    const { joinId, joinName, userFilledInfo, alreadJoin, alreadJoinName } = this.data
    if (alreadJoin) {
      wx.showModal({
        title: "提示",
        content: `您已经加入了${alreadJoinName}，确定要切换加入${joinName}？`,
        showCancel: true,
        cancelText: "取消",
        cancelColor: "#000000",
        confirmText: "确定",
        confirmColor: "#3CC51F",
        success(res) {
          if (res.confirm) {
            console.log("执行this.joinGroup");
            _this.shareJoniGroup({
              groupId: joinId,
              userId: userFilledInfo.id
            });
          } else if (res.cancel) {
            wx.redirectTo({
              url: "/pages/index/index",
              success: result => { },
              fail: () => { },
              complete: () => { }
            });
          }
        }
      })
    } else {
      this.shareJoniGroup({
        groupId: joinId,
        userId: this.data.userFilledInfo.id
      });
    }
  },

  joinGroupHighFromRegister: function () {
    const _this = this;
    const { joinId, joinName, alreadJoinId, alreadJoin, alreadJoinName } = this.data
    if (alreadJoin) {
      wx.showModal({
        title: "提示",
        content: `您已经加入了${alreadJoinName}，确定要切换加入 ${joinName} 下属部门吗？`,
        showCancel: true,
        cancelText: "取消",
        cancelColor: "#000000",
        confirmText: "确认",
        confirmColor: "#3CC51F",
        success(res) {
          if (res.confirm) {
            console.log("跳转");
            wx.showLoading({
              title: "加载中..."
            });
            wx.navigateTo({
              url: `/pages/group/shareJoinChoice/index?groupName=${joinName}&groupId=${joinId}&alreadJoin=${alreadJoin}&alreadJoinId=${alreadJoinId}`,
              success: result => { wx.hideLoading(); },
              fail: () => { },
              complete: () => { }
            });
          } else if (res.cancel) {
            wx.redirectTo({
              url: "/pages/index/index",
              success: result => { },
              fail: () => { },
              complete: () => { }
            });
          }
        }
      })
    } else {
      wx.navigateTo({
        url: `/pages/group/shareJoinChoice/index?groupName=${this.data.joinName}&groupId=${joinId}`,
      });
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!app.globalData.appInit) {
      app.init(globalData => {
        this.setData({
          globalData: globalData,
          userFilledInfo: globalData.userFilledInfo,
          userId: app.globalData.userFilledInfo.id
        });
      });
    } else {
      this.setData({
        globalData: app.globalData,
        userFilledInfo: app.globalData.userFilledInfo,
        userId: app.globalData.userFilledInfo.id
      });
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
})