// pages/Sign/index.js
// 如果当前位置在北京，询问是否从外地返京，如果是，从哪里返回
// 如果当前不在北京，询问未返京原因，返京日期
import {
  getTodayClock,
  getUserClockList,
  getUserFilledInfo,
  saveClock
} from "../../api/api.js";
import { reverseAddressFromLocation } from "../../utils/qqmap-wx-jssdk/map";
const chooseLocation = requirePlugin("chooseLocation");
const app = getApp();
let fields = [
  {
    title: "姓名",
    type: "input",
    prop: "name",
    props: {
      placeholder: "请输入姓名",
      disable: true
    }
  },
  {
    title: "手机号码",
    type: "input",
    prop: "phone",
    props: {
      placeholder: "请输入手机号码",
      disable: true
    }
  },
  {
    title: "打卡地点",
    type: "map",
    prop: "address",
    props: {
      placeholder: "请输入打卡地点"
    }
  },

  {
    title: "是否从其他城市返回",
    type: "radio",
    prop: "otherCity",
    hide: false,
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 0, name: "否" },
        { id: 1, name: "是" }
      ]
    }
  },
  // {
  //   title: "返京日期",
  //   type: "date",
  //   prop: "gobacktime2",
  //   hide: false,
  //   props: {
  //     placeholder: "请输入返京日期"
  //   }
  // },
  {
    title: "未返京原因 ",
    type: "input",
    prop: "reason",
    hide: true,
    props: {
      placeholder: "请输入未返京原因"
    }
  },
  {
    title: "计划返京日期",
    type: "date",
    prop: "gobacktime",
    hide: true,
    props: {
      placeholder: "请输入计划返京日期"
    }
  },
  {
    title: "开始观察时间",
    type: "date",
    prop: "startTime",
    props: {
      placeholder: "请输入开始观察时间"
    }
  },
  {
    title: "体温",
    type: "input",
    prop: "temperature",
    props: {
      placeholder: "请输入体温"
    }
  },
  {
    title: "目前健康状态健康状态",
    type: "radio",
    prop: "healthy",
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 1, name: "健康" },
        { id: 2, name: "有发烧、咳嗽等症状" },
        { id: 0, name: "其他" }
      ]
    }
  },
  {
    title: "是否就诊住院",
    type: "radio",
    prop: "hospital",
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 0, name: "无" },
        { id: 1, name: "门诊" },
        { id: 2, name: "住院" },
        { id: 3, name: "其他" }
      ]
    }
  },
  {
    title: "是否有接触过疑似病患、接待过来自湖北的亲戚朋友、或者经过武汉",
    type: "radio",
    prop: "wuhan",
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 0, name: "否" },
        { id: 1, name: "是" }
      ]
    }
  },
  {
    title: "是否在隔离",
    type: "radio",
    prop: "quarantine",
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 0, name: "否" },
        { id: 1, name: "是" }
      ]
    }
  },
  {
    title: "是否发热",
    type: "radio",
    prop: "fever",
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 0, name: "否" },
        { id: 1, name: "是" }
      ]
    }
  },
  {
    title: "是否咳嗽",
    type: "radio",
    prop: "hoose",
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 0, name: "否" },
        { id: 1, name: "是" }
      ]
    }
  },
  {
    title: "是否乏力",
    type: "radio",
    prop: "fatigue",
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 0, name: "否" },
        { id: 1, name: "是" }
      ]
    }
  },
  {
    title: "是否呼吸困难",
    type: "radio",
    prop: "dyspnea",
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 0, name: "否" },
        { id: 1, name: "是" }
      ]
    }
  },
  {
    title: "是否腹泻",
    type: "radio",
    prop: "diarrhea",
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 0, name: "否" },
        { id: 1, name: "是" }
      ]
    }
  },
  {
    title: "是否肌肉酸痛",
    type: "radio",
    prop: "muscle",
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 0, name: "否" },
        { id: 1, name: "是" }
      ]
    }
  },
  {
    title: "其他不适症状",
    type: "radio",
    prop: "other",
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 0, name: "否" },
        { id: 1, name: "是" }
      ]
    }
  }
];
let transport = [
  {
    title: "是否从其他城市返回",
    type: "radio",
    prop: "otherCity",
    hide: false,
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 1, name: "飞机" },
        { id: 2, name: "火车" },
        { id: 3, name: "自驾" },
        { id: 4, name: "地铁" },
        { id: 5, name: "客车" },
        { id: 6, name: "公交" },
        { id: 7, name: "出租车" },
        { id: 8, name: "轮船" },
        { id: 9, name: "其他" }
      ]
    }
  }
];

Page({
  /**
   * 页面的初始数据
   */
  data: {
    locked: true,
    userRegisted: app.globalData.userRegisted,
    userFilledInfo: app.globalData.userFilledInfo,
    location: "",
    address: {},
    atBeijing: false,
    leaved: false,
    goBack: false,
    fields: fields,
    data: {
      address: ""
    }
  },
  onFormChange(e) {
    console.log("onFormChange", e);
    const { prop, value } = e.detail;

    // 根据填选是否离开，显示返回日期
    if (prop === "otherCity") {
      this.setFields(this.data.atBeijing, value.toString() === "1");
    }

    let itemData = {};
    itemData[e.detail.prop] = e.detail.value;
    let data = Object.assign(this.data.data, itemData);
    // this.setData({
    //   data
    // });
    this.data.data = data;
  },

  formSubmit() {
    const validate = this.selectComponent("#form").validate();
    if (validate) {
      const formData = this.data.data;
      formData.userId = this.data.userFilledInfo.id;
      console.log("formData", formData);
      saveClock(formData).then(res => {
        console.log(res);
        wx.wx.navigateTo({
          url: "/pages/Sign/status/index"
        });
      });
    }
  },

  // 初始化this.data.data
  initFormData() {
    let data = {};
    this.data.fields.forEach(item => {
      data[item.prop] = null;
    });
    this.setData({
      data
    });
  },

  setFieldsHide(hideList = [], setOtherCith = false) {
    // let fields = fields;
    fields.forEach(item => {
      if (setOtherCith && item.prop == "otherCith") {
        item.hide = false;
        item.value = 1;
      }
      if (hideList.indexOf(item.prop) > -1) {
        item.hide = true;
      } else {
        item.hide = false;
      }
    });
    this.setData({
      fields
    });
  },
  // 根据是否在北京设置需要显示的字段，在北京显示是否离开北京，返回日期，不在北京显示原因日期
  setFields(atBeijing = false, leaved = false, otherCity = false) {
    console.log("atBeijing:", atBeijing, " leaved:", leaved);
    let fields = fields;
    if (atBeijing) {
      // 在北京，隐藏返回时间，未返回原因

      // 在北京，离开且已经返回
      // if (otherCity) {
      // }
      this.setFieldsHide(["reason", "gobacktime", "reason"]);
      if (leaved) {
        // this.setFieldsHide(["reason", "gobacktime", "reason"]);
      } else {
        // 在北京且未离开
        // this.setFieldsHide(["reason", "gobacktime", "gobacktime2"]);
        // this.setFieldsHide(["reason", "gobacktime", "reason"]);
      }
    } else {
      // 不在北京切且返回
      // this.setFieldsHide(["otherCity", "gobacktime2"], true);
      this.setFieldsHide(["otherCity"], true);
    }
  },
  // 根据是否离开北京

  // 初始化位置信息
  initAddress() {
    wx.getSetting({
      success: res => {
        // 判断用户是否授权了位置信息
        if (res.authSetting["scope.userLocation"]) {
          console.log("已授权位置信息");
          wx.getLocation({
            altitude: true,
            success: location => {
              this.setData({ location });
              reverseAddressFromLocation(location).then(res => {
                var currentCity = res.result.ad_info.city;
                console.log(res.result.ad_info.city);
                let atBeijing = currentCity == "北京市";

                let { data } = this.data;
                data.address = res.result.address;
                this.setData({
                  atBeijing,
                  leaved: !atBeijing,
                  goBack: !atBeijing,
                  address: res.result,
                  data
                });
                this.setFields(atBeijing, false);
              });
              // wx.navigateTo({ url: getLocationPluginMapUrl(res2) });
            }
          });
        } else {
          console.log("未授权位置信息");
        }
      }
    });
  },

  setUserFilledInfo(userFilledInfo) {
    let { data } = this.data;
    data["name"] = userFilledInfo.name || "";
    data["phone"] = userFilledInfo.phone || "";
    this.setData({
      userFilledInfo,
      userRegisted: Object.keys(userFilledInfo).length > 0,
      data
    });
  },

  // 初始化用户信息
  initUserInfo() {
    let { userRegisted, openid, userFilledInfo } = app.globalData;
    if (userRegisted) {
      this.setUserFilledInfo(userFilledInfo);
    } else {
      getUserFilledInfo({ openid: openid }).then(data => {
        this.setUserFilledInfo(data);
      });
    }
  },

  // 获取用户今日打卡信息
  getUserTodyClockData() {
    this.initFormData();
    console.log("====getUserTodyClockData====");
    getTodayClock({
      userId: 60
    }).then(data => {
      let formData = Object.assign({}, this.data.data, data.records[0]);
      let atBeijing = formData.address.indexOf("北京市") > -1;

      // ============================

      console.log("data-formformData", formData);
      if (data.total > 0) {
        this.setData({
          atBeijing,
          locked: true,
          leaved: !atBeijing,
          goBack: !atBeijing,
          data: formData
        });
      } else {
        this.initAddress();
        this.setData({
          locked: false,
          atBeijing,
          leaved: !atBeijing,
          goBack: !atBeijing
        });
      }
      this.setFields(atBeijing, false);
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.initFormData();
    // this.initAddress();
    this.initUserInfo();
    this.getUserTodyClockData();
    // this.setData({
    //   data: {
    //     address: "北京市海淀区长春桥路17号",
    //     diarrhea: "0",
    //     dyspnea: "0",
    //     fatigue: "0",
    //     fever: "0",
    //     gobacktime: null,
    //     healthy: "1",
    //     hoose: "0",
    //     hospital: "0",
    //     muscle: "0",
    //     name: "1",
    //     other: "0",
    //     otherCity: "0",
    //     phone: "1",
    //     quarantine: "0",
    //     reason: null,
    //     startTime: "2020-02-25",
    //     temperature: "33",
    //     wuhan: "0"
    //   }
    // });
    getUserClockList({
      userId: 60
    }).then(res => {
      console.log(res);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    const location = chooseLocation.getLocation();
    if (location) {
      this.setData({
        data: {
          address: location.address
        }
      });
    }
  },

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
  onShareAppMessage: function() {}
});
