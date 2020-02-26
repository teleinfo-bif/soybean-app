// pages/index/FuncModule/FuncModule.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    head: {
      type: String,
      default: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    healthSign:{
      text: '健康打卡',
      img: '../../../static/images/health_sign@3x.png',
      path: '',
    },
    healthCode:{
      text: '健康打卡',
      img: '../../../static/images/health_code@3x.png',
      path: '',
      disable: true
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
