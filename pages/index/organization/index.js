// pages/index/organization/index.js
import { getUserGroupTree, getUserCurrentGroup, fromGroupCodetoId } from "../../../api/api";
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
        getUserCurrentGroup({
          groupId: app.globalData.userFilledInfo.userId
        }).then(data => {
          console.log('查询用户已加入的群', data)
          let groupCode = data.groupCode
          let groupIdentify = data.groupIdentify
          let alreadJoin = data.name
          let alreadJoinId = data.id
          if(groupCode && groupCode.substring(groupCode.length-8)=="_NO_DEPT") {
            fromGroupCodetoId({
              groupCode: groupIdentify,
            }).then(res => {
              console.log('根据唯一码查看群信息', res);
              if (JSON.stringify(res) == "{}") {
                wx.showToast({
                  title: `您所在的一级机构已经不存在！`,
                  icon: 'none',
                })
                return
              } else {
                let groupName = res.name
                let groupId = res.id
                wx.showModal({
                  title: "提示",
                  content: `您所在机构发生架构调整，请重新选择所在部门！`,
                  showCancel: true,
                  success(res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: `/pages/group/shareJoinChoice/index?groupName=${groupName}&groupId=${groupId}&alreadJoin=${alreadJoin}&alreadJoinId=${alreadJoinId}`,
                      });
                    } 
                  }
                });
              }
            })          
          } else {
            console.log("用户所没加群或者所在群没有变动");
          }
        }).catch(e=>{
          console.log('查询用户已加入的群出错', e)
        })
        getUserGroupTree({}).then(data => {
          console.log(
            "===============用户管理部门：===============\n",
            data.length,
            data
          );
          let temp = data.filter(obj=>obj.name!=="变动人员")
          this.setData({
            groupList: temp
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
