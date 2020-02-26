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
      img: "../../../static/images/health_sign@3x.png",
      path: "/pages/block/index"
    },
    healthCode: {
      text: "健康码",
      img: "../../../static/images/health_code@3x.png",
      path: "",
      disable: true
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {}
});
