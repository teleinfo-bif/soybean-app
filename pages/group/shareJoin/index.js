// pages/group/shareJoin/index.js
// import { encode } from "../../../utils/code";
import { joinGroup, getUserTreeGroup, getUserCurrentGroup, quitGroup, isGroupExist, getGroup, getFirstGroup } from "../../../api/api";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    groupId: "", //要加入的部门id
    userId: "",
    timeStamp: "",
    groupName: "", //要加入的部门名
    // multiArray: [["安全研究所", "泰尔系统实验室"], ["技术研究部", "系统开发部"]],
    // multiIndex: [0, 0],
    array: [],
    index: 0,
    lastClass: true,  //最底层部门
    
    alreadJoinName: "", //以加入群的名字
    alreadJoin: false, // 是否已加入其他部门
    alreadJoinId: "",
  },

  shareJoniGroup(
    params = {
      groupId: "",
      userId: "",
      loading: true
    }
  ) {
    console.log("发起请求", params);
    const { userId, alreadJoin, alreadJoinId } = this.data
    if (alreadJoin) {
      quitGroup({
        userId: userId,
        groupId: alreadJoinId,
        loading: true
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
  joinDifferentGroup: function (groupId) {
    console.log('是否注册页、输机构码、创建群过来的，1就是：zc=', this.data.zc)
    getUserTreeGroup({
      groupId: groupId
    }).then(data => {
      console.log('data', data)
      //根据返回值判断是否是最底层部门，分别做不同处理
      if (data.length == 0) {
        //最底层部门
        if (this.data.zc == '1') {
          this.joinGroupLowFromRegister()
        } else {
          this.joinGroupModal()
        }
      } else {
        if (this.data.zc == '1') {
          this.joinGroupHighFromRegister()
        } else {
          //如果该一级机构只有一个部门，且用户已在末级部门,提示已加入. 3月24日加入该判断
          if (this.data.alreadJoin && data.filter(obj => obj.name !== "变动人员").length == 1) {
            wx.showModal({
              title: "提示",
              content: `您已经加入${this.data.alreadJoinName}！`,
              showCancel: false,
              confirmText: "查看",
              success(res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: `/pages/index/index`,
                  });
                }
              }
            });
            return
          }

          this.joinGroupChoiceModal()
        }
      }
    })
  },

  //弹窗加群 加入末级群
  joinGroupModal: function () {
    const _this = this;
    const { groupId, groupName, userFilledInfo, alreadJoin, alreadJoinName } = this.data
    if (alreadJoin) {
      wx.showModal({
        title: "提示",
        content: `您已经加入了${alreadJoinName}机构，确定要切换加入 ${groupName} 机构吗？`,
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
      wx.showModal({
        title: "提示",
        content: `确认加入 ${groupName} 吗？`,
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
            wx.redirectTo({
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
  //弹窗跳转 加入非末级群
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
            console.log("跳转", groupId);
            wx.showLoading({
              title: "加载中..."
            });
            wx.navigateTo({
              url: `/pages/group/shareJoinChoice/index?groupName=${groupName}&groupId=${groupId}&alreadJoin=${alreadJoin}&alreadJoinId=${alreadJoinId}`,
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
            console.log("跳出一二级加群");
            wx.redirectTo({
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
        content: `您已经加入了${alreadJoinName}，确定要切换加入${groupName}？`,
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
        url: `/pages/group/shareJoinChoice/index?groupName=${this.data.groupName}&groupId=${groupId}`,
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    /**
     * 判断传入参数的有效性，时间有效性
     * 判断用户是否注册 未注册 存参数在storage，引导注册后重新加入
     * 调用接口加群 返回首页
     */
    // console.log()
    const { groupId, timeStamp, groupName, zc } = options;
    console.log("======share options=====", options,app.globalData, !app.globalData.appInit);
    // 这里需要先判断再调用app.init 如果有状态就直接用  //点击链接进来，开发过程中
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
        return
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
    console.log('prompt')
    const { groupId, timeStamp, groupName, userFilledInfo, zc } = this.data
    const userful = Date.now() - timeStamp * 1 < 24 * 60 * 60 * 1000;
    console.log(groupId, timeStamp, groupName, userFilledInfo, zc, userful)
    const _this = this;
    //注册过来的不判断时间有效性
    if (!zc && !userful) {
      wx.showModal({
        title: "提示",
        content: `您的加群链接已失效，请联系邀请人重新邀请！`,
        showCancel: false,
        cancelColor: "#000000",
        confirmText: "确定",
        confirmColor: "#3CC51F",
        success(res) {
          if (res.confirm) {
            wx.reLaunch({//这个用reLaunch还算合理
              url: "/pages/index/index",
              success: result => { },
              fail: () => { },
              complete: () => { }
            });
          }
        }
      })
      return
    }
    isGroupExist({
      groupId: groupId
    }).then(data => {
      console.log('群有效，可加',data)
      //链接有效，注册用户可以加群，开始加群
      if (userFilledInfo.userRegisted) {
        console.log('groupId', groupId)
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
              wx.reLaunch({
                url: `/pages/personal/index?groupId=${groupId}&groupName=${groupName}`,
                success: result => {
                },
                fail: () => { },
                complete: () => { }
              });
            } else if (res.cancel) {
              wx.reLaunch({//防止用户后退返回分享页
                url: "/pages/index/index",
                success: result => { },
                fail: () => { },
                complete: () => { }
              });
            }
          }
        });
      }
    }).catch(e => {
      console.log("群不存在 ", e)
      wx.showToast({
        title: `机构不存在!`,
        icon: 'none',
      })
      setTimeout(function () {
        wx.reLaunch({
          url: "/pages/index/index",
        })
      }, 1500)
    });
  },
  //查询是否已经加过群
  isCanJoinGroup: function () {
    const { groupId, userId } = this.data  //此处的groupId是用户要加入的群
    getUserCurrentGroup({
      groupId: userId
    }).then(data => {
      console.log('查询用户加入的群', data)
      //没有加过群，去加群
      if (JSON.stringify(data) == "{}") {
        this.joinDifferentGroup(groupId)
      } else {
        //加过群，判断一下群是否调整过,调整过跳到首页
        let temp = this.isGroupAdjust(data)
        if(temp.length!==0){          
          wx.redirectTo({
            url: "/pages/index/index",
          })
          return
        }
        //判断是否加过该群
        let joined = data.filter(obj => obj.id.toString() == groupId).length
        if (joined != 0) {
          wx.showToast({
            title: "您已经在该机构中！",
            duration: 2000,
            icon: "none",
            success: result => {
              setTimeout(function () {
                wx.reLaunch({
                  url: "/pages/index/index",
                })
              }, 1500)
            },
          });
          return
        }
        //判断用户是否已加入该一级机构,加入后需要先退出后加入
        getFirstGroup({
          groupId: groupId
        }).then(res => {
          console.log('group data', res);
          const groupIdentify = res.groupIdentify
          const tempGroup = data.filter(obj => obj.groupIdentify == groupIdentify)
          if (tempGroup.length !== 0) {
            let quitId = tempGroup[0].id
            let quitName = tempGroup[0].name
            this.setData({
              alreadJoinName: quitName,
              alreadJoinId: quitId,
              alreadJoin: true, //alreadJoin: true, 3月23日更改后，alreadJoin代表已加入同一一级机构中某个部门
            })
            this.joinDifferentGroup(groupId)
            return
          } else {
            //可以加入多个一级机构        
            this.joinDifferentGroup(groupId)
          }
        });
      }
    })
  },
  //退群 测试
  quitGroupTest: function (quitId) {
    const { userId } = this.data
    quitGroup({
      userId: userId,
      groupId: quitId,
    }).then(data => {
      console.log('退群', data)
    })
  },

  //判断机构调整
  isGroupAdjust: function (groups) {
    let changeGroupList = []
    groups.forEach((item, index) => {
      let groupCode = item.groupCode
      if (groupCode && groupCode.substring(groupCode.length - 8) == "_NO_DEPT") {
        let temp = {
          ...item,
          topName: item.fullName.split('_')[0]
        }
        changeGroupList.push(temp)  
      } else {
        console.log("用户所在群没有变动");
      }
    });
    return changeGroupList
  },



  // join: function() {
  //   const { joinGroupId, userFilledInfo } = this.data
  //   let groupId = joinGroupId
  //   this.shareJoniGroup({
  //     groupId,
  //     userId: userFilledInfo.id
  //   });
  // },
  join_0: function () {
    const { groupId, userFilledInfo } = this.data
    this.shareJoniGroup({
      groupId,
      userId: userFilledInfo.id
    });
  },
  quit: function () {
    wx.navigateTo({
      url: "/pages/index/index",
      success: result => { },
      fail: () => { },
      complete: () => { }
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
  onHide: function () { },
 
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('share join onUnload')
    //防止没执行完的回调 
    app.callbackList = []
   },

});
