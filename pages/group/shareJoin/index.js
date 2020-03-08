// pages/group/shareJoin/index.js
// import { encode } from "../../../utils/code";
import { joinGroup, getUserTreeGroup, getUserCurrentGroup, quitGroup } from "../../../api/api";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    groupId: "", //要加入的群组id
    userId: "",  
    timeStamp: "",
    groupName: "", //要加入的群组名
    // multiArray: [["安全研究所", "泰尔系统实验室"], ["技术研究部", "系统开发部"]],
    // multiIndex: [0, 0],
    array: [],
    index: 0,
    lastClass: true,  //最底层部门
    lowestClass: false,  //倒数第二级部们
    alreadJoinName: "", //以加入群的名字
    alreadJoin: false, // 是否已加入其他群组
    alreadJoinId: "",
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
              title: "加入群组成功",
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
            fail: () => { },
            complete: () => { }
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
    }
  },
  
  //判断是否是最低级的部门,调用不同函数
  joinDifferentGroup: function(groupId) {
    console.log('是否注册页过来的，1就是注册页过来的：zc=', this.data.zc)
    getUserTreeGroup({
      groupId: groupId
    }).then(data => {
      console.log('data', data)
      //根据返回值判断是否是最底层群组，分别做不同处理
      if (data.length == 0) {
        //最底层群组
        this.setData({
          lowestClass: true
        })
        if(this.data.zc=='1') {
          // this.shareJoniGroup({
          //   groupId,
          //   userId: this.data.userFilledInfo.id
          // });
          this.joinGroupLowFromRegister()
        }else {
          this.joinGroupModal()
        }       
      } else {
        this.setData({
          lowestClass: false
        })
        if(this.data.zc=='1') {
          // wx.navigateTo({
          //   url: `/pages/group/shareJoinChoice/index?groupName=${this.data.groupName}&groupId=${groupId}`,
          // });
          this.joinGroupHighFromRegister()
        }else {
          this.joinGroupChoiceModal()       
        }      
      }
    })
  },

  //弹窗加群 加入三级群
  joinGroupModal: function () {
    const _this = this;
    const { groupId, groupName, userFilledInfo, alreadJoin, alreadJoinName } = this.data
    if (alreadJoin) {
      wx.showModal({
        title: "提示",
        content: `您已经加入了${alreadJoinName}组织，确定要切换加入 ${groupName} 组织吗？`,
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
              success: result => { },
              fail: () => { },
              complete: () => { }
            });
          }
        }
      })
    } else {
      wx.showModal({
        title: "提示",
        content: `确认要加入 ${groupName} 吗？`,
        showCancel: true,
        cancelText: "取消",
        cancelColor: "#000000",
        confirmText: "确认",
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
              success: result => { },
              fail: () => { },
              complete: () => { }
            });
          }
        }
      })
    }
  },
  //弹窗跳转 加入一、二级群
  joinGroupChoiceModal: function () {
    const _this = this;
    const { groupId, groupName, alreadJoinId, alreadJoin, alreadJoinName } = this.data
    if (alreadJoin) {
      wx.showModal({
        title: "提示",
        content: `您已经加入了${alreadJoinName}，确定要切换加入 ${groupName} 下属部门吗？`,
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
              url: `/pages/group/shareJoinChoice/index?groupName=${groupName}&groupId=${groupId}&alreadJoin=${alreadJoin}&alreadJoinId=${alreadJoinId}`,
              success: result => { wx.hideLoading();},
              fail: () => { },
              complete: () => { }
            });
          } else if (res.cancel) {
            wx.navigateTo({
              url: "/pages/index/index",
              success: result => { },
              fail: () => { },
              complete: () => { }
            });
          }
        }
      })
    } else {
      wx.showModal({
        title: "提示",
        content: `确认加入${groupName}？`,
        showCancel: true,
        cancelText: "取消",
        cancelColor: "#000000",
        confirmText: "确认",
        confirmColor: "#3CC51F",
        success(res) {
          if (res.confirm) {
            console.log("跳转");
            wx.navigateTo({
              url: `/pages/group/shareJoinChoice/index?groupName=${groupName}&groupId=${groupId}`,
              success: result => { },
              fail: () => { },
              complete: () => { }
            });
          } else if (res.cancel) {
            wx.navigateTo({
              url: "/pages/index/index",
              success: result => { },
              fail: () => { },
              complete: () => { }
            });
          }
        }
      })
    }
  },


  joinGroupLowFromRegister: function () {
    const _this = this;
    const { groupId, groupName, userFilledInfo, alreadJoin, alreadJoinName } = this.data
    if (alreadJoin) {
      wx.showModal({
        title: "提示",
        content: `您已经加入了${alreadJoinName}组织，确定要切换加入 ${groupName} 组织吗？`,
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
              success: result => { },
              fail: () => { },
              complete: () => { }
            });
          }
        }
      })
    } else {
      this.shareJoniGroup({
        groupId,
        userId: this.data.userFilledInfo.id
      });
    }
  },

  joinGroupHighFromRegister: function () {
    const _this = this;
    const { groupId, groupName, alreadJoinId, alreadJoin, alreadJoinName } = this.data
    if (alreadJoin) {
      wx.showModal({
        title: "提示",
        content: `您已经加入了${alreadJoinName}，确定要切换加入 ${groupName} 下属部门吗？`,
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
              url: `/pages/group/shareJoinChoice/index?groupName=${groupName}&groupId=${groupId}&alreadJoin=${alreadJoin}&alreadJoinId=${alreadJoinId}`,
              success: result => { wx.hideLoading();},
              fail: () => { },
              complete: () => { }
            });
          } else if (res.cancel) {
            wx.navigateTo({
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
        url: `/pages/group/shareJoinChoice/index?groupName=${this.data.groupName}&groupId=${groupId}`,
      });
    }
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
    const { groupId, timeStamp, groupName, zc } = options;
    console.log("======options=====", options);
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
          zc: zc
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
        zc: zc
      });
      this.userPrompt()
    }
  },

  userPrompt: function () {
    console.log('prompt' )
    const { groupId, timeStamp, groupName, userFilledInfo, zc } = this.data
    const userful =  Date.now() - timeStamp * 1 < 24 * 60 * 60 * 1000;
    // console.log(groupId, timeStamp, groupName, userFilledInfo, zc, userful)
    const _this = this;
    //注册过来的不判断时间有效性
    if(!zc && !userful){
      wx.showModal({
        title: "提示",
        content: `您的加群链接已失效，请联系邀请人重新邀请！`,
        showCancel: false,
        cancelColor: "#000000",
        confirmText: "确定",
        confirmColor: "#3CC51F",
        success(res) { 
          if (res.confirm) {
            wx.reLaunch({
              url: "/pages/index/index",
              success: result => {},
              fail: () => {},
              complete: () => {}
            });
          } 
        }
      })
      return
    }
    //链接有效，注册用户可以加群，开始加群
    if (userFilledInfo.userRegisted) {
      console.log('groupId', groupId)
      // this.tree2array(groupId)
      // 注册过来的  也要判断是否加过去其他群
      // if(zc=='1') {
      //   this.joinDifferentGroup(groupId)
      // } else {
      //   this.isCanJoinGroup()
      // }   
      this.isCanJoinGroup()   
    } else {
      console.log('没有注册')
      wx.showModal({
        title: "",
        content: `您还没有注册，确认加入该机构吗？`,
        showCancel: true,
        cancelColor: "#000000",
        confirmText: "确认注册",
        confirmColor: "#3CC51F",
        success(res) { 
          if (res.confirm) {
            wx.navigateTo({
              url: `/pages/personal/index?groupId=${groupId}&groupName=${groupName}`,
              success: result => {               
              },
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
  //查询是否已经加过群
  isCanJoinGroup: function() {   
    const { groupId, userId } = this.data 
    getUserCurrentGroup({
      groupId: userId
    }).then(data => {
      console.log('查询用户已加入的群接口', data)
      if(JSON.stringify(data) == "{}"){
        this.joinDifferentGroup(groupId)
      }else {
        let quitId = data.id
        let quitName = data.name
        this.setData({
          alreadJoinName: quitName,
          alreadJoinId: quitId,
          alreadJoin: true,
        })
        this.joinDifferentGroup(groupId)
        // this.quitGroupTest(quitId) 
      }   
    })   
  },
  //退群 测试
  quitGroupTest: function(quitId) {
    const { userId } = this.data 
    quitGroup({
      userId: userId,
      groupId: quitId,
    }).then(data => {
      console.log('退群', data)
    })
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