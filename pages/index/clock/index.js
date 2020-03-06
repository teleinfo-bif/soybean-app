// pages/index/Sign/Sign.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    head: "我所在的部门",
    healthSign: {
      text: "健康打卡",
      img: "../../../static/images/jiankangdaka3x.png",
      path: "/pages/clock/index"
    },
    healthCode: {
      text: "健康码",
      img: "../../../static/images/jjiankangmaactive3x.png",
      path: "/pages/healthQR/healthQR",
      disable: true,
      permission: true
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {}
});