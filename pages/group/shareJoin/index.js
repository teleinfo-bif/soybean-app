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

  //只适合三级
  tree2array: function (groupId) {
    getUserTreeGroup({
      groupId: groupId
    }).then(data => {
      console.log('dd', data)
      if (data.length == 0) {
        //最底层群组
        this.setData({
          lowestClass: true
        })
      } else {
        let a = []
        let b = []
        data.map((val, index) => {
          a.push({ name: val.name, id: val.id })
          b.push(val.children.length == 0 ? [] : val.children.map((val) => Object.assign({}, { name: val.name, id: val.id })))
        })
        // console.log(a, b)
        let lastClass = b.every((val, index) => val.length == 0) //是否倒数第二级
        this.setData({
          lastClass: lastClass
        })
        if (lastClass) {
          let array = a
          console.log(array)
          this.setData({
            array: array,
            joinGroupId: array[0].id
          })
        } else {
          let multiArray = [a, b[0]]
          console.log(multiArray)
          this.setData({
          first: a,
          second: b,
          multiArray: multiArray,
          joinGroupId: b[0].length==0?a[0].id:b[0][0].id
        })
        }
        
      }
    })
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value, e.target.dataset.id)
    let id = e.target.dataset.id
    this.setData({
      index: e.detail.value,
      joinGroupId: id
    })
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为',e.detail.value, e.target.dataset.id)
    let id = e.target.dataset.id
    this.setData({
      multiIndex: e.detail.value,
      joinGroupId: id
    })
 
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiArray[0] = this.data.first
    data.multiIndex[e.detail.column] = e.detail.value;
    switch(e.detail.column) {
      case 0:        
        data.multiArray[1] = this.data.second[data.multiIndex[0]]
        break
    }
    this.setData(data)
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
      this.tree2array(groupId)
      
      // wx.showModal({
      //   title: "",
      //   content: `确定要加入 ${groupName} 组织吗？`,
      //   showCancel: true,
      //   cancelText: "取消",
      //   cancelColor: "#000000",
      //   confirmText: "确定",
      //   confirmColor: "#3CC51F",
      //   success(res) {
      //     if (res.confirm) {
      //       console.log("用户已经注册，准备执行this.joinGroup");
      //       // lowestClass
      //       _this.shareJoniGroup({
      //         groupId,
      //         userId: userFilledInfo.id
      //       });
      //     } else if (res.cancel) {
      //       wx.navigateTo({
      //         url: "/pages/index/index",
      //         success: result => {},
      //         fail: () => {},
      //         complete: () => {}
      //       });
      //     }
      //   }
      // })
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

  join: function() {
    const { joinGroupId, userFilledInfo } = this.data
    let groupId = joinGroupId
    this.shareJoniGroup({
      groupId,
      userId: userFilledInfo.id
    });
  },
  join_0: function() {
    const { groupId, userFilledInfo } = this.data
    this.shareJoniGroup({
      groupId,
      userId: userFilledInfo.id
    });
  },
  quit: function() {
    wx.reLaunch({
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
