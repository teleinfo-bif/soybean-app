// pages/company/companyAuth/index.js
import { getUserTreeGroup, getGroupManager } from "../../../api/api";
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
  //只适合三级架构模型
  tree2array: function (groupId) {
    getUserTreeGroup({
      groupId: groupId
    }).then(data => {
      console.log('====dataAll=====', data)
      if (data.length == 0) {
        //最底层部门
        this.setData({
          lowestClass: true
        })
      } else {
        let a = [{name:'请选择',id:this.data.groupId}]
        let b = [[]]
        data.map((val, index) => {
          a.push({ name: val.name, id: val.id })
          if (val.children.length == 0){
            b.push([])
          }else {
            console.log("======val.children====", val.children)
            val.children.unshift({ name: '请选择', id: val.id })
            console.log("======val.childrenAfter====", val.children)
            console.log("======b====",b)
            b.push(val.children.map((val) => Object.assign({}, { name: val.name, id: val.id })))
            console.log("======bAfter====", b)
          }
        })
        console.log('=====temp====',a, b)
        let lastClass = b.every((val, index) => val.length == 0) //是否倒数第二级
        this.setData({
          lastClass: lastClass
        })
        if (lastClass) {
          let array = a
          console.log('====lastClass=====', array)
          this.setData({
            array: array,
            joinGroupId: array.id
          })
        } else {
          let multiArray = [a, b]
          console.log('=====muliti====',multiArray)
          this.setData({
            first: a,
            second: b,
            multiArray: multiArray,
            joinGroupId: b[0].length == 0 ? a[0].id : b[0][0].id
            //joinGroupId: b[0].length == 0 ? a[0].id : b[0][0].id
          })
          //this.queryGroupManager(this.data.joinGroupId)
        }

      }
      
    })
  },
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
        let a = [{ name: "请选择", id: this.data.groupId }]
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
      this.setData({
        dataManagers: data.dataManagers,
        managers: data.managers
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
    
    console.log("options.groupId===")
    this.setData({
      groupId: options.groupId,
      joinGroupId: options.groupId
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