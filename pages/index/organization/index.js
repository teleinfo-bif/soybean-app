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
    groupData: {},
    show: false, //弹窗是否显示
    radio: '1',
    changeGroups: [],
    preparedGroup: '', //准备加入的机构唯一码
    moreShow: false //是否显示更多按钮
  },
  lifetimes: {
    // async attached() {
    //   let { globalData } = app;
    //   if (app.globalData.userFilledInfo.userRegisted == null) {
    //     app.init(globalData => {
    //       this.setData({
    //         globalData,
    //         userFilledInfo: globalData.userFilledInfo
    //       });
    //       this.getData();
    //     });
    //   } else {
    //     this.getData();
    //   }
    // }
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示
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
        const changeGroupList = []
        getUserCurrentGroup({
          groupId: app.globalData.userFilledInfo.userId
        }).then(data => {
          console.log('查询用户已加入的群', data)
          data.forEach((item, index) => {
            let groupCode = item.groupCode
            if (groupCode && groupCode.substring(groupCode.length - 8) == "_NO_DEPT") {
              this.setData({
                show: true
              })
              let temp = {
                ...item,
                topName: item.fullName.split('_')[0]
              }
              changeGroupList.push(temp)
            } else {
              console.log("用户所没加群或者所在群没有变动");
            }
          });
          this.setData({
            changeGroups: changeGroupList
          })
          // console.log('变动部门', this.data.changeGroups)        
        });
      };

      getUserGroupTree({}).then(data => {
        console.log(
          "===============用户管理部门：===============\n",
          data.length,
          data
        );
        let temp = data.filter(obj => obj.name !== "变动人员").slice(0,2)
        let moreShow = temp.length>=2?true:false
        this.setData({
          groupList: temp,
          moreShow: moreShow
        });
      });

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
    },

    onChange(event) {
      // console.log('radio onchange', event.detail)
      this.setData({
        radio: event.detail
      });
    },
  
    onClick(event) {
      // console.log('radio onClick', event.currentTarget.dataset)
      const { name, id } = event.currentTarget.dataset;
      this.setData({
        radio: name,
        preparedGroup: name,
        alreadJoinId: id
      });
    },
    goToChoiceGroup() {
      const { preparedGroup, alreadJoinId } = this.data
      // console.log('goToChoiceGroup', preparedGroup)
      if (!preparedGroup) {
        this.setData({
          show: true
        })
        return
      }
      fromGroupCodetoId({
        groupCode: preparedGroup,
        loading: true
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
          wx.navigateTo({
            url: `/pages/group/shareJoinChoice/index?groupName=${groupName}&groupId=${groupId}&alreadJoin=${alreadJoinId}&alreadJoinId=${alreadJoinId}`,
          });
        }
      })
    },
    onClose: function () {
      console.log('onClose')
      this.setData({
        show: false
      })
    },
    moreShow: function() {
      wx.navigateTo({
        url: `/pages/index/moreOrgs/index`
      });
    }

  }
});
