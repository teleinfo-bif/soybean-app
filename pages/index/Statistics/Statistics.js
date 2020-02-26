// pages/index/Statistics/Statistics.js
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
    head: '我管理的部门',
    stastic: {
      text: '统计信息',
      img: '../../../static/images/stastic@3x.png',
      path: '/pages/Statistics/index',
    }, 
    detail: {
      text: '详细信息',
      img: '../../../static/images/deatil_data@3x.png',
    path: '/pages/Detail/index',
      disable: true
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
