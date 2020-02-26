// pages/index/EnteringInfo/EnteringInfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    toNextPage() {
      console.log('123')
      wx.navigateTo({
        url: '/pages/enteringInfo/index',
      })
    }
  }
})
