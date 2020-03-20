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
  },
  //查询机构树
  treeArray: function (groupId, groupName) {
    getUserTreeGroup({
      groupId: groupId
    }).then(data => {
      var obj = {
        "name": groupName,
        'id': groupId,
        "children": data
      }
      console.log('===res====', obj)
      this.setData({
        arrayMenu: [obj]
      })
    })
  }, 
  // 添加机构
  toAddPage(e) {
    wx.navigateTo({
      url: `../companyStructureManage/companyStructAdd/index?groupId=${this.data.groupId}&groupName=${this.data.groupName}&parentId=${e.currentTarget.dataset.id}`,
    }); 
  },
  delDepartConfirm(e){
    console.log("======del====", e.currentTarget.dataset.id)
    var delId = e.currentTarget.dataset.id
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          that.delStructDepart(delId)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  delStructDepart(delId){
    delCompanyStructAct({
      groupId: delId,
      userId: app.globalData.userFilledInfo.id,
      loading: true
    }).then(data => {
      console.log('====delRes=====', data)
      this.treeArray(this.data.groupId, this.data.groupName)
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
  clickMenu: function (e) {
    var that = this;
    console.log("打印索引值", e.currentTarget.dataset.index);
    // 获取索引值
    var index = e.currentTarget.dataset.index;
    // 获取当前的状态，是否隐藏的值
    var staues = that.data.arrayMenu[index].hideHidden;
    console.log("111", staues);
    // 第几个状态
    var stauesval = "arrayMenu[" + index + "].hideHidden";
    if (staues == true) {
      that.setData({
        [stauesval]: false
      })
    } else {
      that.setData({
        [stauesval]: true
      })
    }
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
    this.treeArray(this.data.groupId,this.data.groupName)
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

  callback_func(val) {
    var i, j, len;
    var results = [];
    for (j = 0, len = val.length; j < len; j++) {
      i = val[j];
      if (i['children'].length !== 0) {
        this.callback_func(i['children']);
      } else {
        this.data.op_needed.push(i['id']);
      }
    }
    console.log('===tmp===', this.data.op_needed)
  },
  callback_func2(val, delId) {
    var i, j, len
    var flag = false
    for (i = 0, len = val.length; i < len; i++) {
      var tmp = val[i]
      if (val[i].id == delId) {
        val[i].children = []
        flag = true
      }
    }

  },
  delDepartObj(delId) {
    var _this = this;
    var _menu = _this.data.arrayMenu;
    var menuId = [];
    var len = _menu.length;
    console.log("===getMenuBefore====", _menu)
    for (var i = 0; i < len; i++) {
      var item = _menu[i];
      if (item.children && item.children.length != 0) {
        var children = item.children;
        for (var j = 0; j < children.length; j++) {
          _menu[len + j] = children[j];
        }
        len = _menu.length;
      }
    }
    console.log("===getAllId====", menuId)
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
