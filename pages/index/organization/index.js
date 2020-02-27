// pages/index/organization/index.js
import { getUserGroupTree } from "../../../api/api";
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    userFilledInfo: app.globalData.userFilledInfo,
    globalData: app.globalData,
    groupList: [],
    groupData: {}
  },
  lifetimes: {
    async attached() {
      if (!this.data.globalData.userId) {
        await app.init();
      }
      this.getData();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getData() {
      getUserGroupTree({
        userId: this.data.globalData.userId
      }).then(data => {
        this.setData({
          // groupData: data,
          groupList: data
        });
      });
    },
    tap() {
      // console.log(this.data);
    }
  }
});
