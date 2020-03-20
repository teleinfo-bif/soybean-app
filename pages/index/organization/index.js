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
        getUserGroupTree({}).then(data => {
          console.log(
            "===============用户管理部门：===============\n",
            data.length,
            data
          );
          // var dataNew=[] //保存过滤之后的二级部门
          // var ids = '';//既有一级又有二级部门的id
          //重组data,去除二级部门的权限
          // data.map((val,index)=>{
          //   if(val.children.length > 0){
          //     val.children.map((value,index)=>{
          //       if (value.managers.indexOf(app.globalData.userFilledInfo.id>-1))
          //       {
          //         ids+=value.id+","
          //       }
          //     })
          //   }
          // })
          // data.map((val,index)=>{
          //   if (val.children.length == 0 && ids.indexOf(val.id) ==-1){
          //     dataNew.push(val)
          //   }
          //   if (val.children.length> 0){
          //     dataNew.push(val)
          //   }
          // })

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
      if (data.permission) {
        wx.navigateTo({
          url: `/pages/group/groupIndex/index?data=${JSON.stringify(data)}`
        });
      }
      if (data.dataPermission) {
        wx.navigateTo({
          url: `/pages/group/groupIndex/index?data=${JSON.stringify(data)}`
        });
      }
    }
  }
});
