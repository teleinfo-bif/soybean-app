// pages/group/shareJoin/index.js
// import { encode } from "../../../utils/code";
import { joinGroup, getUserTreeGroup } from "../../../api/api";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    groupId: "",
    joinGroupId: "",
    userId: "",
    timeStamp: "",
    groupName: "",
    multiArray: [["工业互联网与物联网研究所","安全研究所", "泰尔系统实验室"], ["技术研究部", "系统开发部","综合管理部"]],
    multiIndex: [0, 0],
    array: [],
    index: 0,
    lastClass: true,
    lowestClass: false
  },

  shareJoniGroup(
    params = {
      groupId: "",
      userId: ""
    }
  ) {
    console.log("发起请求", params);
    joinGroup(params)
      .then(data => {
        console.log("=====joinGroup-data====", data);
        wx.showToast({
          title: "加入群组成功",
          duration: 1500,
          mask: false,
          success: result => {
            // wx.navigateTo({
            //   url: "/pages/index/index",
            //   success: result => {},
            //   fail: () => {},
            //   complete: () => {}
            // });
          },
          fail: () => {},
          complete: () => {}
        });
        // wx.showToast
        // wx.showToast({
        //   title: "加入成功",
        //   duration: 3000,
        //   success:
        // })
      })
      .catch(e => { });
      setTimeout(function () {
        wx.reLaunch({
          url: "/pages/index/index",
        })
      }, 2000)
  },
  
  //判断是否是最低级的部门
  isLowestDepartment: function(groupId) {
    getUserTreeGroup({
      groupId: groupId
    }).then(data => {
      console.log('data', data)
      if (data.length == 0) {
        //最底层群组
        this.setData({
          lowestClass: true
        })
        this.joinGroupModal()
      } else {
        this.setData({
          lowestClass: false
        })
        this.joinGroupChoiceModal()       
      }
    })
  },

  //弹窗加群
  joinGroupModal: function() {
    const _this = this;
    const { groupId, groupName, userFilledInfo } = this.data
    wx.showModal({
        title: "提示",
        content: `确定要加入 ${groupName} 组织吗？`,
        showCancel: true,
        cancelText: "取消",
        cancelColor: "#000000",
        confirmText: "确定",
        confirmColor: "#3CC51F",
        success(res) {
          if (res.confirm) {
            console.log("用户已经注册，准备执行this.joinGroup");
            // lowestClass
            _this.shareJoniGroup({
              groupId,
              userId: userFilledInfo.id
            });
          } else if (res.cancel) {
            wx.navigateTo({
              url: "/pages/index/index",
              success: result => {},
              fail: () => {},
              complete: () => {}
            });
          }
        }
      })
  },
  //弹窗跳转
  joinGroupChoiceModal: function() {
    const _this = this;
    const { groupId, groupName, userFilledInfo } = this.data
    wx.showModal({
        title: "提示",
        content: `点击确定选择需要加入的机构`,
        showCancel: true,
        cancelText: "取消",
        cancelColor: "#000000",
        confirmText: "确定",
        confirmColor: "#3CC51F",
        success(res) {
          if (res.confirm) {
            console.log("跳转");
            wx.navigateTo({
              url: `/pages/group/shareJoinChoice/index?groupName=${groupName}&groupId=${groupId}`,
              success: result => {},
              fail: () => {},
              complete: () => {}
            });
          } else if (res.cancel) {
            wx.navigateTo({
              url: "/pages/index/index",
              success: result => {},
              fail: () => {},
              complete: () => {}
            });
          }
        }
      })
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    /**
     * 判断传入参数的有效性，时间有效性
     * 判断用户是否注册 未注册 存参数在storage，引导注册后重新加入
     * 调用接口加群 返回首页
     */
    // console.log()
    const { groupId, timeStamp, groupName } = options;
    console.log("======options=====", options);
    // 这里需要先判断再调用
    // 这里需要先判断再调用
    // 这里需要先判断再调用
    // 这里需要先判断再调用
    // 这里需要先判断再调用app.init 如果有状态就直接用
    if (!app.globalData.appInit) {
      app.init(globalData => {
        this.setData({
          globalData: globalData,
          userFilledInfo: globalData.userFilledInfo,
          groupId: groupId,
          timeStamp: timeStamp,
          groupName: groupName,
        });
        this.userPrompt()
      });
    } else {
      this.setData({
        globalData: app.globalData,
        userFilledInfo: app.globalData.userFilledInfo,
        groupId: groupId,
        timeStamp: timeStamp,
        groupName: groupName,
      });
      this.userPrompt()
    }


    // app.init(globalData => {
    //   const { userFilledInfo } = globalData;
    //   console.log("======options=====", options);
    //   console.log("======options=====", userFilledInfo);
    //   const userful = timeStamp - Date.now() < 24 * 60 * 60 * 1000;
    //   const _this = this;
    //   wx.showModal({
    //     title: "",
    //     content: `groupId:${groupId} \n timeStamp: ${timeStamp}\n有效状态是: ${userful},`,
    //     showCancel: true,
    //     cancelText: "取消",
    //     cancelColor: "#000000",
    //     confirmText: "确定",
    //     confirmColor: "#3CC51F",
    //     success() {
    //       if (userFilledInfo.userRegisted) {
    //         console.log("用户已经注册，准备执行this.joinGroup");
    //         _this.shareJoniGroup({
    //           groupId,
    //           userId: userFilledInfo.id
    //         });
    //       } else {
    //         wx.showModal({
    //           title: "",
    //           content: `您还没有注册，去注册。`,
    //           showCancel: true,
    //           cancelColor: "#000000",
    //           confirmText: "去注册",
    //           confirmColor: "#3CC51F"
    //         });
    //       }
    //     }
    //   });
    // });
  },

  userPrompt: function () {
    const { groupId, timeStamp, groupName, userFilledInfo } = this.data
    const userful = timeStamp - Date.now() < 24 * 60 * 60 * 1000;
    const _this = this;
    if(!userful){
      wx.navigateTo({
        url: "/pages/index/index",
        success: result => {},
        fail: () => {},
        complete: () => {}
      });
      return
    }
    
    if (userFilledInfo.userRegisted) {
      // this.tree2array(groupId)
      this.isLowestDepartment(groupId)
    } else {
      wx.showModal({
        title: "",
        content: `您还没有注册，去注册。`,
        showCancel: false,
        cancelColor: "#000000",
        confirmText: "去注册",
        confirmColor: "#3CC51F",
        success(res) { 
          if (res.confirm) {
            wx.navigateTo({
              url: "/pages/index/index",
              success: result => {},
              fail: () => {},
              complete: () => {}
            });
          } else if (res.cancel) {
            wx.navigateTo({
              url: "/pages/index/index",
              success: result => {},
              fail: () => {},
              complete: () => {}
            });
          }
        }
      });
    }
  },

  // join: function() {
  //   const { joinGroupId, userFilledInfo } = this.data
  //   let groupId = joinGroupId
  //   this.shareJoniGroup({
  //     groupId,
  //     userId: userFilledInfo.id
  //   });
  // },
  join_0: function() {
    const { groupId, userFilledInfo } = this.data
    this.shareJoniGroup({
      groupId,
      userId: userFilledInfo.id
    });
  },
  quit: function() {
    wx.navigateTo({
      url: "/pages/index/index",
      success: result => {},
      fail: () => {},
      complete: () => {}
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
});