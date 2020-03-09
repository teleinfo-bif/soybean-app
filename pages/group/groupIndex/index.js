// pages/group/groupIndex/index.js
import { getGroupCurrentUserList } from "../../../api/api";
const app = getApp();
function getyyyyMMdd(date) {
  var d = date || new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth() + 1;
  var curr_year = d.getFullYear();
  String(curr_month).length < 2 ? (curr_month = "0" + curr_month) : curr_month;
  String(curr_date).length < 2 ? (curr_date = "0" + curr_date) : curr_date;
  var yyyyMMdd = curr_year + "-" + curr_month + "-" + curr_date;
  return yyyyMMdd;
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    activeTab: 0,
    groupId: "",
    children: {},
    groupName: "",
    isGroup: true,
    memberData: {},
    clockInTime: ''
  },

  // tab点击事件
  onTabClick(e) {
    console.log(e.detail);
    this.setData({
      activeTab: e.detail.index
    });
  },

  // 滚动到底部
  lower(e) {
    // console.log(e);
    // console.log("到底了");
    this.getData();
  },
  // 跳转到下一级组织
  nextLevelGroup(e) {
    // console.log();
    const { data } = e.currentTarget.dataset;
    if (data.children && data.children.length > 0) {
      wx.navigateTo({
        url: `/pages/group/groupIndex/index?data=${JSON.stringify(data)}`
      });
    } else {
      wx.navigateTo({
        url: `/pages/group/groupIndex/index?data=${JSON.stringify(
          data
        )}&isGroup=false`
      });
    }
  },
  // 获取当前部门的用户信息
  getData() {
    const { groupId, memberData } = this.data;
    let { current = 0, pages = 0 } = memberData;
    if (current == 0 || current < pages) {
      getGroupCurrentUserList({
        current: ++current,
        groupId,
        size: 20
      }).then(data => {
        // 判断是不是第一次请求,current已经加一，处理iOS滑到底部可以频繁请求多次出发的问题
        if (memberData.total != undefined && current == data.current) {
          let memerList = memberData.records.concat(data.records);
          this.setData({
            memberData: {
              ...data,
              records: memerList
            }
          });
        } else {
          this.setData({
            memberData: data
          });
        }
      });
    } else {
      console.log("group user has nomore data");
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);

    const data = JSON.parse(options.data);
    const { isGroup = true } = options;
    const { id, name, children, managers = "" } = data;
    // wx.setNavigationBarTitle({
    //   title: data.name
    // });
    this.setData(
      {
        children: children,
        groupId: id,
        groupName: name,
        managers: "" ? "" : managers.split(","),
        data,
        isGroup,
        clockInTime: getyyyyMMdd(new Date())
      },
      this.getData
    );
  },
  onChange(e) {
    // console.log(e);
    const { value } = e.detail;
    this.setData(
      {
        clockInTime: value,
      },
    );
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // 考虑用对称加密签个时间
    const timeStamp = new Date().getTime();
    const { name } = app.globalData.userFilledInfo;
    // const decodeTimeStamp = decode(timeStamp);
    // const decodeGroupId = decode(this.data.groupId);
    const tilte = `${name}邀请您加入${this.data.groupName}`;
    return {
      title: tilte,

      desc: "分享页面的内容",

      path: `/pages/group/shareJoin/index?groupId=${this.data.groupId}&timeStamp=${timeStamp}&groupName=${this.data.groupName}`,
      imageUrl: "../../../static/images/share.jpg",
      success: res => {
        console.log("转发成功", res);
      },
      fail: res => {
        console.log("转发失败", res);
      }
    };
  },
  navigateToGroupIndex(e) {
    console.log(e.currentTarget.dataset.groupname);
    const { data } = e.currentTarget.dataset;
    if (data.permission) {
      wx.navigateTo({
        url: `/pages/group/groupIndex/index?data=${JSON.stringify(data)}`
      });
    }
  }
});
