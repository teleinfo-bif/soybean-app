// pages/Detail/index.js
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
import { getGroupBlockList, sendSingleUserMsg, sendGroupUserMsg } from "../../api/api.js";
// const beahavior_userInfo = require("../../behavior/userInfo");
Page({
  // behaviors: [beahavior_userInfo],
  /**
   * 页面的初始数据
   */
  data: {
    unClockInCount: 0,//未打卡人数
    now: "",
    value: "",
    groupId: "",
    groupName: "",
    permission: "",
    clockInTime: "",
    clockData: {},
    clockList: [],
    show: false,
    currentDate: new Date().getTime(),
    showDateText: "",
    requestStutus: false,
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      } else if (type === "month") {
        return `${value}月`;
      }
      return value;
    },

    list: [
      {
        name: "测试1",
        sign: true,
        status: 0
      }
    ]
  },
  getData() {
    let { requestStutus, clockData, clockInTime, groupId } = this.data;
    console.log('clockData',clockData)
    let { pages = 0, current = 0 } = clockData;
    if (!requestStutus && (current == 0 || pages > current)) {
      this.setData(
        {
          requestStutus: true
        },
        () => {
          // 写在回调中保证生效
          getGroupBlockList({
            current: ++current,
            groupId,
            clockInTime: clockInTime
          }).then(res => {
            console.log(res)
            if (clockData.total != undefined && current == res.data.current) {
              let clockList = clockData.records.concat(res.data.records);
              this.setData({
                requestStutus: false,
                clockData: {
                  ...res.data,
                  records: clockList,
                  unClockInCount: res.unClockInCount,
                }
              });
            } else {
              this.setData({
                requestStutus: false,
                clockData: res.data,
                unClockInCount: res.unClockInCount,
              });
            }
          });
        }
      );
    }
  },
  onChange(e) {
    // console.log(e);
    const { value } = e.detail;
    this.data.clockData.current = 0;
    this.data.clockData.records=[]
    this.setData(
      {
        clockInTime: value,
        clockData: this.data.clockData,
        clockList: []
      },
      this.getData
    );
  },
  // behaviorCallback() {
  //   this.getData();
  // },

  upper(e) {
    // console.log(e);
  },

  lower(e) {
    // console.log(e);
    // console.log("到底了");
    this.getData();
  },

  scroll(e) {
    // console.log(e);
  },

  scrollToTop() {
    this.setAction({
      scrollTop: 0
    });
  },

  tap() {
    for (let i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1],
          scrollTop: (i + 1) * 200
        });
        break;
      }
    }
  },

  tapMove() {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    });
  },

  onInput(event) {
    this.setData({
      currentDate: event.detail
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    let { groupId, groupName, permission } = options;
    let now = getyyyyMMdd(new Date());
    this.setData(
      {
        groupId,
        groupName,
        permission,
        clockInTime: getyyyyMMdd(new Date()),
        now
      },
      this.getData
    );
    // this.setData({

    // });
    // console.log("option", options);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
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
      imageUrl: "../../static/images/share.jpg",
      success: res => {
        console.log("转发成功", res);
      },
      fail: res => {
        console.log("转发失败", res);
      }
    };
  },

  // 发送提醒
  sendSingleUserMsg: function(e) {
    const openId = e.currentTarget.dataset.gid
    sendSingleUserMsg({
      openId: openId
    }).then(data => {
      console.log('ok', data,data.length==0,typeof data)
      if(JSON.stringify(data) != "{}") {
        wx.showToast({
          title: '用户未开启提醒！',
          icon: 'none',
        })
        return
      }
      wx.showToast({
        title: '健康打卡提醒成功！',
        icon: 'none',
      })
    })
  },

  sendGroupUserMsg: function() {
    const { groupId, unClockInCount, total } = this.data;
    console.log(groupId)
    sendGroupUserMsg({
      groupId: groupId
    }).then(data => {
      // console.log('ok',data, typeof data, data.split(','),JSON.stringify(data) != "{}" )
      let noSubscribeNum = JSON.stringify(data) != "{}"?data.split(',').length:0
      if(noSubscribeNum < total) {
        wx.showToast({
          title: '提醒成功，但部分人员未开启接收提醒！',
          icon: 'none',
        })
      } else {
        wx.showToast({
          title: '健康打卡提醒成功！',
          icon: 'none',
        })
      }     
    })
  },
});
