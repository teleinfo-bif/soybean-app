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
    userFilledInfo: {},
    globalData: {},
    groupList: [],
    groupData: {}
  },
  lifetimes: {
    async attached() {
      // console.log("-----管理组织-----");
      let { globalData } = app;
      if (app.globalData.userFilledInfo.userRegisted == null) {
        app.init(globalData => {
          this.setData({
            globalData,
            userFilledInfo: globalData.userFilledInfo
          });
          this.getData();
        });
      } else {
        this.getData();
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getData() {
      const { userFilledInfo } = app.globalData;

      if (userFilledInfo.userRegisted) {
        // debugger
        getUserGroupTree({}).then(data => {
          console.log(
            "===============用户管理群组：===============\n",
            data.length,
            data
          );
          this.setData({
            groupList: data
          });
        });
      }
    },
    tap() {
      // console.log(this.data);
    },
    navigateToGroupIndex(e) {
      console.log(e.currentTarget.dataset.groupname);
      const { data } = e.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/group/groupIndex/index?data=${JSON.stringify(data)}`
      });
    }
  }
});
