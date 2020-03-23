import { getUserTreeGroup, delCompanyStructAct } from "../../../api/api";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    op_needed:[],
    arrayMenu: [{
      topcent: '菜单一',
      botcent: 'caidanyi',
      menu: [
        {
          cent: '菜单1-1'
        },
        {
          cent: '菜单1-2'
        },
        {
          cent: '菜单1-3'
        }
      ],
      hideHidden: true
    },
    {
      topcent: '菜单二',
      botcent: 'caidaner',
      menu: [
        {
          cent: '菜单2-1'
        },
        {
          cent: '菜单2-2'
        },
        {
          cent: '菜单2-3'
        }
      ],
      hideHidden: true
    }
    ],
    arrayMenu:[],
    hideId:'',
  },
  //查询机构树
  treeArray: function (groupId, groupName, hideId) {
    getUserTreeGroup({
      groupId: groupId
    }).then(data => {
      var obj = {
        "name": groupName,
        'id': groupId,
        "children": data
      }
      console.log('===res====', obj)
      var tmpMenu = [obj]
      if(hideId != ''){
        tmpMenu[0].hidden = true
        console.log('===treehideId====', hideId)
        let parse = arr => {
          arr.forEach(item => {
            // do some ...
            if (item.id == hideId) {
              item.hidden = true
            }
            //console.log('item: ', item)
            if (Array.isArray(item.children)) {
              parse(item.children)
            }
          })
        }
        parse(tmpMenu)
      } 
      this.setData({
        arrayMenu: tmpMenu
      })
    })
  }, 
  // 添加机构
  toAddPage(e) {
    wx.navigateTo({
      url: `../companyStructureManage/companyStructAdd/index?groupId=${this.data.groupId}&groupName=${this.data.groupName}&parentId=${e.currentTarget.dataset.id}&parentName=${e.currentTarget.dataset.name}`,
    }); 
  },
  delDepartConfirm(e){
    var delId = e.currentTarget.dataset.id
    var hideId = e.currentTarget.dataset.hideid
    console.log("======del====", delId)
    console.log("======hideId====", hideId)
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          that.delStructDepart(delId,hideId)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  delStructDepart(delId, hideId){
    var that = this
    delCompanyStructAct({
      groupId: delId,
      userId: app.globalData.userFilledInfo.id,
      loading: true
    }).then(data => {
      console.log('====delRes=====', data)
      this.treeArray(this.data.groupId, this.data.groupName, hideId)
      wx.showToast({
        title: '已删除',
        icon: 'none',
        duration: 2000
      })
    }) .catch(e => {
        console.log(e)
        wx.showToast({
          title: '网络异常，请重新操作',
          icon: 'none',
          duration: 2000
        })
      })
  },
  hiddenDepartChild(e){
    var hideId = e.currentTarget.dataset.id
    //console.log("=====hideId====",hideId)
    this.hiddenDepart(hideId)
  },
  hiddenDepart(hideId){
    console.log("=====hideIdDepart====", hideId)
    if(hideId == ''){
      return
    }
    let parse = arr => {
      arr.forEach(item => {
        // do some ...
        if (item.id == hideId) {
          item.hidden = !item.hidden
          return
        }
        //console.log('item: ', item)
        if (Array.isArray(item.children)) {
          parse(item.children)
        }
      })
    }
    parse(this.data.arrayMenu)
    //console.log("====res====", this.data.arrayMenu)
    this.setData({
      arrayMenu: this.data.arrayMenu
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
/*     options.groupId = 1
    options.type = 'managerPage'
    options.groupName = '信通院'  */
    this.setData({
      groupId: options.groupId,
      groupName: options.groupName
    })
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
    this.treeArray(this.data.groupId,this.data.groupName,this.data.hideId)
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
