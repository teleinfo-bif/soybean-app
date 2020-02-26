// pages/index/FuncBtn/FuncBtn.js
//获取应用实例
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    btnData: {
      type: Object,
      default: () => {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toNextPage(event) {
      // 如果已经关闭了权限，或者录入过个人信息
      if (!app.globalData.auth || Object.keys(app.globalData.userFilledInfo).length > 0) {
        var $this = this;
        console.log('已录个人信息')
        wx.navigateTo({
          url: event.currentTarget.dataset.path
        })
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '请您先录入个人信息',
          showCancel: false,
          confirmText: '去录入',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/enteringInfo/index',
              })
            } 
          }
        })
      }
    }
  }
})