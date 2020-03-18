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
import { getGroupBlockList, sendSingleUserMsg, sendGroupUserMsg, getServerTime } from "../../api/api.js";
// const beahavior_userInfo = require("../../behavior/userInfo");
Page({
  // behaviors: [beahavior_userInfo],
  /**
   * 页面的初始数据
   */
  data: {
    unClockInCount: 0,//未打卡人数
    isYiJianTiXing: 0, //是否一键提醒 是1 否0
    isClickYijian: false, //为了控制一件提醒后分页的显示
    noSubPeople:[],//没有订阅消息的人列表
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
    let { requestStutus, clockData, clockInTime, groupId, isClickYijian, noSubPeople } = this.data;
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
            console.log('res',res)
            if (clockData.total != undefined && current == res.data.current) {
            let newData = isClickYijian?
                        res.data.records.map((obj)=>Object.assign({},obj,{isSendSubscribeMsg:noSubPeople.indexOf(obj.wechatId) == -1 ? 1 : 0})):
                        res.data.records
            let clockList = clockData.records.concat(newData);
              // let clockList = clockData.records.concat(res.data.records);
              this.setData({
                requestStutus: false,
                clockData: {
                  ...res.data,
                  records: clockList,
                  unClockInCount: res.unClockInCount,
                  isYiJianTiXing: res.isSendSubscribeMsg
                }
              });
            } else {
              this.setData({
                requestStutus: false,
                clockData: res.data,
                unClockInCount: res.unClockInCount,
                isYiJianTiXing: res.isSendSubscribeMsg
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
    getServerTime()
    .then(data=>{
      let now = typeof data=="string"?data.split(' ')[0]: getyyyyMMdd(new Date());
      let clockInTime = typeof data=="string"?data.split(' ')[0]: getyyyyMMdd(new Date());
      this.setData(
        {
          groupId,
          groupName,
          permission,
          clockInTime,
          now
        },
        this.getData
      );
    })
    // this.setData(
    //   {
    //     groupId,
    //     groupName,
    //     permission,
    //     clockInTime: getyyyyMMdd(new Date()),
    //     now
    //   },
    //   this.getData
    // );
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
  sendSingleUserMsg: function (e) {
    const openId = e.currentTarget.dataset.oid
    const index = e.currentTarget.dataset.gid
    const { clockData } = this.data
    console.log(openId, index, clockData)
    if (clockData.records[index].isSendSubscribeMsg == 1) {
      // wx.showToast({
      //   title: '已提醒过该用户！',
      //   icon: 'none',
      // })
      return
    }
    sendSingleUserMsg({
      openId: openId,
      loading: true
    }).then(data => {
      // console.log('ok', data, data.length == 0, typeof data)
      if (JSON.stringify(data) != "{}") {
        wx.showToast({
          title: '用户未开启提醒！',
          icon: 'none',
        })
      } else {
        // console.log('ee', clockData.records)
        var data = 'clockData.records[' + index + '].isSendSubscribeMsg';
        this.setData({
          [data]: 1,
        });
        wx.showToast({
          title: '健康打卡提醒成功！',
          icon: 'none',
        })
      }
    })
  },

  sendGroupUserMsg: function () {
    const { groupId, unClockInCount, clockData, isYiJianTiXing } = this.data;
    let total = clockData.total
    if (isYiJianTiXing == 1) {
      return
    };
    console.log(groupId)
    sendGroupUserMsg({
      groupId: groupId,
      loading: true
    }).then(data => {
      console.log('ok', data, typeof data)
      if (JSON.stringify(data) == "{}") {
        wx.showToast({
          title: '健康打卡提醒成功！',
          icon: 'none',
        })
        let newData = clockData.records.map((obj) =>
          Object.assign({}, obj, { isSendSubscribeMsg: 1 })
        )
        this.setData({
          'clockData.records': newData,
          isYiJianTiXing: 1,
          isClickYijian: true
        });

      } else {
        let stringData = data.toString()
        let noSubPeople = stringData.split(',')
        let noSubscribeNum = noSubPeople.length//提醒失败人数
        console.log(noSubscribeNum, unClockInCount, total)        
        let newData = clockData.records.map((obj) =>
          Object.assign({}, obj, { isSendSubscribeMsg: noSubPeople.indexOf(obj.wechatId) == -1 ? 1 : 0 })
        )
        this.setData({
          'clockData.records': newData,
          isYiJianTiXing: 1,
          isClickYijian:true,
          noSubPeople: noSubPeople
        });
        // console.log(clockData)
        if (noSubscribeNum == unClockInCount) {
          wx.showToast({
            title: '群组内未打卡人员没有开启接收提醒！',
            icon: 'none',
          })
        } else {
          wx.showToast({
            title: '提醒成功，但部分人员未开启接收提醒！',
            icon: 'none',
          })
        }
      }
    })
  },
});
