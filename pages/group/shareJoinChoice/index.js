// pages/group/shareJoinChoice/index.js
import { getUserTreeGroup, joinGroup, quitGroup } from "../../../api/api";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    globalData: "",
    userFilledInfo: "",
    groupId: "",
    groupName: "",
    joinGroupId: 0,  //要加入的部门ID，后台数据id没有0
    alreadJoin: false, //是否已加过群
    alreadJoinId: "",
    canJoin:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const { groupId, groupName, alreadJoin, alreadJoinId } = options;
    console.log(wx.getSystemInfoSync())
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth
    this.setData({
      scroll_height: windowHeight * 750 / windowWidth - 188
    })
    app.globalData.join = null;
    if (!app.globalData.appInit) {
      app.init(globalData => {
        this.setData({
          globalData: globalData,
          userFilledInfo: globalData.userFilledInfo,
          groupId: groupId,
          groupName: groupName,
          alreadJoin: alreadJoin,
          alreadJoinId: alreadJoinId
        });
        this.userPrompt();
      });
    } else {
      this.setData({
        globalData: app.globalData,
        userFilledInfo: app.globalData.userFilledInfo,
        groupId: groupId,
        groupName: groupName,
        alreadJoin: alreadJoin,
        alreadJoinId: alreadJoinId
      });
      this.userPrompt();
    }
  },
  userPrompt: function() {
    const { groupId, userFilledInfo } = this.data;
    if (userFilledInfo.userRegisted) {
      this.treeUserArray(groupId);
    } else {
      wx.navigateTo({
        url: "/pages/index/index",
        success: result => {},
        fail: () => {},
        complete: () => {}
      });
    }
  },
 
  join: function() {
    const { joinGroupId, userFilledInfo } = this.data;
    console.log("要加入的部门id：", joinGroupId)
    let groupId = joinGroupId;
    if (joinGroupId == 0) {
      wx.showToast({
        title: `请选择您要加入的部门！`,
        icon: "none"
      });
      return;
    }
    this.shareJoniGroup({
      groupId,
      userId: userFilledInfo.id
    });
  },
  quit: function() {
    wx.navigateTo({//不用reLanch
      url: "/pages/index/index",
      success: result => {},
      fail: () => {},
      complete: () => {}
    });
  },
  shareJoniGroup(
    params = {
      groupId: "",
      userId: ""
    }
  ) {
    console.log("发起请求", params);
    const { userId, alreadJoin, alreadJoinId, canJoin } = this.data;
    if(!canJoin) {
      wx.showToast({
        title: "请选择末级部门！",
        duration: 1500,
        icon: "none"
      });
      return;
    }
    if (alreadJoin) {
      if (alreadJoinId == params.groupId) {
        wx.showToast({
          title: "您已经加入了该部门！",
          duration: 1500,
          icon: "none"
        });
        return;
      }
      quitGroup({
        userId: userId,
        groupId: alreadJoinId
      }).then(data => {
        console.log("退群", data);
        joinGroup(params)
          .then(data => {
            console.log("=====joinGroup-data====", data);
            wx.showToast({
              title: "加入部门成功",
              duration: 1500,
              mask: false,
              success: result => {},
              fail: () => {},
              complete: () => {//此处不要用reLanch，防止页面闪动
                setTimeout(function () {
                  wx.navigateTo({
                    url: "/pages/index/index"
                  });
                }, 1500)                
              }
            });
          })
          .catch(e => {});
      });
    } else {
      joinGroup(params)
        .then(data => {
          console.log("=====joinGroup-data====", data);
          wx.showToast({
            title: "加入部门成功",
            duration: 1500,
            mask: false,
            success: result => {//此处不要用reLanch，防止页面闪动
              setTimeout(function () {
                wx.navigateTo({
                  url: "/pages/index/index"
                });
              }, 1500)
            }
          });
        })
        .catch(e => {});
      // setTimeout(function () {
      //   wx.reLaunch({
      //     url: "/pages/index/index",
      //   })
      // }, 2000)
    }
  },

  //获取数据
  treeUserArray: function (groupId) {
    getUserTreeGroup({
      groupId: groupId
    }).then(data => {
      this.setData({
          companyArray:data
        })
    })
  },
  selThis(e) {
    console.log('=====chooseItem===',e.detail);
    let canJoin = e.detail.groupType==1?true:false
    this.setData({
      chooseItem: e.detail,
      joinGroupId: e.detail.id,
      canJoin
    })
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
  onUnload: function() {
    // console.log('333')
    wx.reLaunch({
      url: "/pages/index/index"
    });
  }
});
