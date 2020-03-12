// pages/company/companyAuth/index.js
import { getUserTreeGroup, getGroupManager, addManager,deleteDataManager, deleteManager } from "../../../api/api";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [["工业互联网与物联网研究所", "安全研究所", "泰尔系统实验室"], ["技术研究部", "系统开发部", "综合管理部"]],
    multiIndex: [0, 0],
    array: ["技术研究部"],
    index: 0,
    lastClass: true,
  },
  bindCertificatePickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      singleIndex: parseInt(e.detail.value),
      value_single_type: this.data.singleArray[e.detail.value],
    })
  },
  //删除管理员按钮
  delManagerBtn(){
    var kvArray = this.data.managers
    var reformattedArray2 = kvArray.map(function (obj, index) {
      obj.hide = !obj.hide;//添加id属性
      return obj;//如果不返回则输出： Array [undefined, undefined, undefined]
    });
    this.setData({
      managers: reformattedArray2
    })
  },
  //删除数据库管理员按钮
  delDataManagerBtn() {
    var kvArray = this.data.dataManagers
    var reformattedArray2 = kvArray.map(function (obj, index) {
      obj.hide = !obj.hide;//添加id属性
      return obj;//如果不返回则输出： Array [undefined, undefined, undefined]
    });
    this.setData({
      dataManagers: reformattedArray2
    })
  },
  //删除管理权限
  deleteManage(e){
    console.log("======del====", e.currentTarget.dataset.id)
    deleteManager({
      groupId: this.data.joinGroupId,
      managerId: e.currentTarget.dataset.id,
      userId: app.globalData.userFilledInfo.id
    }).then(data => {
      console.log('====delRes=====', data)   
      //数组删除元素
      var profiles = this.data.managers
      console.log('===deleteBefore==', profiles);
      var currentProfileIndex = (profiles || []).findIndex((profile) => profile.id === e.currentTarget.dataset.id);
      console.log('===curIndex==',currentProfileIndex);
      profiles.splice(currentProfileIndex, 1);
      this.setData({
        managers: profiles
      })
      console.log('===deleteAfter==', profiles);
    })
  },
  //删除统计权限
  deleteDataManage(e) {
    console.log("======del====", e.currentTarget.dataset.id)
    deleteDataManager({
      groupId: this.data.joinGroupId,
      managerId: e.currentTarget.dataset.id,
      userId: app.globalData.userFilledInfo.id
    }).then(data => {
      console.log('====delRes=====', data)
      //数组删除元素
      var profiles = this.data.dataManagers
      console.log('===deleteBefore==', profiles);
      var currentProfileIndex = (profiles || []).findIndex((profile) => profile.id === e.currentTarget.dataset.id);
      console.log('===curIndex==', currentProfileIndex);
      profiles.splice(currentProfileIndex, 1);
      this.setData({
        dataManagers: profiles
      })
    })
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
          lowestClass: true,
          array: [{ 'name': this.data.groupName, 'id': this.data.groupId }],
          joinGroupId: this.data.groupId
        })
      } else {
        let a = [{ name: '请选择单位/机构', id: this.data.groupId }]
        let b = []
        data.map((val, index) => {
          a.push({ name: val.name, id: val.id })
          val.children.unshift({ name: val.name, id: val.id })
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
          b.unshift([])
          let multiArray = [a, b[0]]
          console.log(multiArray, b)
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
    console.log('=======1=======picker发送选择改变，携带值为', e, e.detail.value, e.target.dataset.id)
    let index = e.detail.value
    // let id = e.target.dataset.id //这个值有问题
    let id = array[index].id
    this.setData({
      index: e.detail.value,
      joinGroupId: id
    })
    this.queryGroupManager(this.data.joinGroupId)
  },
  bindMultiPickerChange: function (e) {
    console.log('=======2--1=======picker发送选择改变，携带值为', e.detail.value, e.target.dataset.id)
    let id = e.target.dataset.id
    this.setData({
      multiIndex: e.detail.value,
      joinGroupId: id
    })
    this.queryGroupManager(this.data.joinGroupId)
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('=======2--2=======修改的列为', e.detail.column, '，值为', e.detail.value);
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
    //this.queryGroupManager(this.data.joinGroupId)
  },
  //获取管理员
  queryGroupManager: function (groupId) {
    getGroupManager({
      groupId: groupId
    }).then(data => {
      console.log('====Manager=====', data)
      var kvArray = data.managers
      var reformattedArray2 = kvArray.map(function (obj, index) {
        obj.hide = !obj.hide;//添加id属性
        return obj;//如果不返回则输出： Array [undefined, undefined, undefined]
      });
      this.setData({
        managers: reformattedArray2
      })
      var kvArray = data.dataManagers
      var reformattedArray2 = kvArray.map(function (obj, index) {
        obj.hide = !obj.hide;//添加id属性
        return obj;//如果不返回则输出： Array [undefined, undefined, undefined]
      });
      this.setData({
        dataManagers: reformattedArray2
      })
    })
  },
  addManager(e){ 
    
    wx.navigateTo({
        url: '/pages/company/companyAuth/companyAuthAdd/index?groupId=' + this.data.joinGroupId + '&type=' + e.target.dataset.type,
    })
  },
  addDataManager(e) {
    
    wx.navigateTo({
      url: '/pages/company/companyAuth/companyAuthAdd/index?groupId=' + this.data.joinGroupId + '&type=' + e.target.dataset.type,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //ptions.groupId = 1
    console.log("options.groupName===", options.groupName)
    this.setData({
      groupId: options.groupId,
      joinGroupId: options.groupId,
      groupName:options.groupName
    })
    this.tree2array(this.data.joinGroupId)
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
    let pages = getCurrentPages();

    let currPage = pages[pages.length - 1];

    if (currPage.data.addresschose) {

      this.setData({

        //将携带的参数赋值

        address: currPage.data.addresschose,

        addressBack: true

      });
      console.log("======firsttPage=====")
      console.log(this.data.address, '地址')
    }

    
    this.queryGroupManager(this.data.joinGroupId)
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