// pages/group/shareJoinChoice/index.js
import { joinGroup, getUserTreeGroup, quitGroup } from "../../../api/api";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: '',
    userFilledInfo: '',
    groupId: '',
    groupName: '',
    multiArray: [["工业互联网与物联网研究所", "安全研究所", "泰尔系统实验室"], ["技术研究部", "系统开发部", "综合管理部"]],
    multiIndex: [0, 0],
    array: ["技术研究部"],
    index: 0,
    lastClass: true,
    alreadJoin: false, //是否已加过群
    alreadJoinId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { groupId, groupName, alreadJoin, alreadJoinId } = options;
    app.globalData.groupName = ''
    app.globalData.groupId = ''
    if (!app.globalData.appInit) {
      app.init(globalData => {
        this.setData({
          globalData: globalData,
          userFilledInfo: globalData.userFilledInfo,
          groupId: groupId,
          groupName: groupName,
          alreadJoin: alreadJoin,
          alreadJoinId: alreadJoinId,
        });
        this.userPrompt()
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
      this.userPrompt()
    }
  },
  userPrompt: function () {
    const { groupId, userFilledInfo } = this.data
    if (userFilledInfo.userRegisted) {
      this.tree2array(groupId)
    } else {
      wx.navigateTo({
        url: "/pages/index/index",
        success: result => { },
        fail: () => { },
        complete: () => { }
      });
    }
  },
  //只适合三级架构模型
  tree2array: function (groupId) {
    getUserTreeGroup({
      groupId: groupId
    }).then(data => {
      // console.log('dd', data)
      if (data.length == 0) {
        //最底层部门
        this.setData({
          lowestClass: true
        })
      } else {
        let a = [{ name: "请选择", id: 0 }]
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
          console.log('lastClass', array)
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
            joinGroupId: b[0].length == 0 ? a[0].id : b[0][0].id
          })
        }

      }
    })
  },
  bindPickerChange: function (e) {
    const { array } = this.data
    console.log('picker发送选择改变，携带值为', e, e.detail.value, e.target.dataset.id)
    let index = e.detail.value
    // let id = e.target.dataset.id //这个值有问题
    let id = array[index].id
    this.setData({
      index: e.detail.value,
      joinGroupId: id
    })
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value, e.target.dataset.id)
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
    switch (e.detail.column) {
      case 0:
        data.multiArray[1] = this.data.second[data.multiIndex[0]]
        break
    }
    this.setData(data)
  },
  join: function () {
    const { joinGroupId, userFilledInfo } = this.data
    let groupId = joinGroupId
    if(joinGroupId==0){
      wx.showToast({
        title: `请选择您要加入的部门！`,
        icon: 'none',
      })
      return
    }
    this.shareJoniGroup({
      groupId,
      userId: userFilledInfo.id
    });
  },
  quit: function () {
    wx.reLaunch({
      url: "/pages/index/index",
      success: result => { },
      fail: () => { },
      complete: () => { }
    });
  },
  shareJoniGroup(
    params = {
      groupId: "",
      userId: ""
    }
  ) {
    console.log("发起请求", params);
    const { userId, alreadJoin, alreadJoinId } = this.data;
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
              },
              fail: () => { },
              complete: () => {
                wx.reLaunch({
                  url: "/pages/index/index",
                })
              }
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
              wx.reLaunch({
                url: "/pages/index/index",
              })
            },
          });
        })
        .catch(e => { });
      // setTimeout(function () {
      //   wx.reLaunch({
      //     url: "/pages/index/index",
      //   })
      // }, 2000)
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