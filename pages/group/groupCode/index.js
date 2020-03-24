// pages/organizationCode/index.js
import { fromGroupCodetoId, getUserCurrentGroup, quitGroup, joinGroup, isGroupExist, getUserTreeGroup, getGroup } from "../../../api/api";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    userId: '',
    userCurrentGroups: {},//用户当前所在群组
  },

  onChange: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  joinCodeReturn(){
    // wx.navigateBack({
    //   delta: 1
    // })
    wx.reLaunch({
      url: `/pages/index/index`,
    });

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
        groupCode: code,
        loading: true
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
          isGroupExist({
            groupId: data.id,
            loading: true
          }).then(res => {
            console.log('机构有效', res)
            let groupName = data.name
            let groupId = data.id
            let groupType = data.groupType
            let groupIdentify = data.groupIdentify
            this.setData({
              joinId: groupId,
              joinName: groupName,
              joinType: groupType,
              joinGroupIdentify: groupIdentify
            })
            this.isCanJoinGroup()
          }).catch(e => {
            console.log('机构不存在', e)
            wx.showToast({
              title: `机构不存在!`,
              icon: 'none',
            })
          })


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

  getUserCurrentGroup: function () {
    const { userId } = this.data
    getUserCurrentGroup({
      groupId: userId
    }).then(data => {
      console.log('用户加入的群组：', data)
      this.setData({
        userCurrentGroups: data
      })
    })
  },

  //查询是否已经加过群
  isCanJoinGroup: function () {
    const { joinId, userId, joinName, joinType, joinGroupIdentify, userCurrentGroups } = this.data
      if (JSON.stringify(userCurrentGroups) == "{}") {
        this.joinDifferentGroup()
      } else {
        //判断是否加过该机构
        let joined = userCurrentGroups.filter(obj=>obj.id.toString()==joinId).length
        if(joined != 0) {
          wx.showToast({
            title: "您已经在该机构中！",
            duration: 2000,
            icon: "none",
          });
          return
        }
        //判断用户是否已加入该一级机构,加入后需要先退出后加入
        let tempGroup = userCurrentGroups.filter(obj => obj.groupIdentify == joinGroupIdentify)
        // console.log('tempGroup',tempGroup)
        if (tempGroup.length !== 0) {
          let quitId = tempGroup[0].id
          let quitName = tempGroup[0].name
          this.setData({
            alreadJoinName: quitName,
            alreadJoinId: quitId,
            alreadJoin: true, //alreadJoin: true, 3月23日更改后，alreadJoin代表已加入同一一级机构中某个部门
          })
          this.joinDifferentGroup()
          return
        }         
        this.joinDifferentGroup()
      }
  
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
            });
          })
          .catch(e => { console.log(e); });
          setTimeout(function () {
            wx.reLaunch({
              url: "/pages/index/index",
            })
          }, 2000)
      })
    } else {
      joinGroup(params)
        .then(data => {
          console.log("=====joinGroup-data====", data);
          wx.showToast({
            title: "加入部门成功",
            duration: 1500,
            mask: false,
          });
        })
        .catch(e => { console.log(e); });
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
      if(alreadJoinName=="变动人员"){
        _this.shareJoniGroup({
          groupId: joinId,
          userId: userFilledInfo.id
        });
        return
      }        
      wx.showModal({
        title: "提示",
        content: `确认加入 ${joinName} 吗？`,
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
          }
        }
      })
    } else {
      wx.showModal({
        title: "提示",
        content: `确认加入 ${joinName} 吗？`,
        showCancel: true,
        cancelText: "取消",
        cancelColor: "#000000",
        confirmText: "确认",
        confirmColor: "#3CC51F",
        success(res) {
          if (res.confirm) {
            console.log("执行this.joinGroup");
            _this.shareJoniGroup({
              groupId: joinId,
              userId: userFilledInfo.id
            });
          }
        }
      })
    }
  },

  joinGroupHighFromRegister: function () {
    const _this = this;
    const { joinId, joinName, alreadJoinId, alreadJoin, alreadJoinName } = this.data
    if (alreadJoin) {
      if (alreadJoinName == "变动人员") {
        wx.navigateTo({
          url: `/pages/group/shareJoinChoice/index?groupName=${joinName}&groupId=${joinId}&alreadJoin=${alreadJoin}&alreadJoinId=${alreadJoinId}`,
        });
        return
      }
      //2020年3月24日加入
      getUserTreeGroup({
        groupId: joinId
      }).then(data => {
        console.log('data', data)
        //如果该一级机构只有一个部门，且用户已在末级部门,提示已加入. 3月24日加入该判断
        if (data.filter(obj => obj.name !== "变动人员").length == 1) {
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
        } else {

          wx.showModal({
            title: "提示",
            content: `您已经加入了${alreadJoinName}，确定要切换加入 ${joinName} 下属部门吗？`,
            showCancel: true,
            cancelText: "取消",
            cancelColor: "#000000",
            confirmText: "确定",
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
              }
            }
          })

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
        this.getUserCurrentGroup()
      });
    } else {
      this.setData({
        globalData: app.globalData,
        userFilledInfo: app.globalData.userFilledInfo,
        userId: app.globalData.userFilledInfo.id
      });
      this.getUserCurrentGroup()
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