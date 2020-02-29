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
      await this.getData();
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async getData() {
      // const { userRegisted } = this.data.globalData;
      let { globalData } = app;
      if (app.globalData.userFilledInfo.userRegisted == null) {
        globalData = await app.init();
        this.setData({
          globalData,
          userFilledInfo: globalData.userFilledInfo
        });
      }
      console.log(
        "------------群组中用户注册状态",
        globalData.userFilledInfo.userRegisted
      );

      if (globalData.userFilledInfo.userRegisted) {
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
    }
  }
});
