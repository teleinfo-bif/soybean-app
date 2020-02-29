// pages/block/index.js
// 如果当前位置在北京，询问是否从外地返京，如果是，从哪里返回
// 如果当前不在北京，询问未返京原因，返京日期
import { getTodayClock, saveClock } from "../../api/api.js";
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
  {
    title: "离京日期",
    type: "date",
    prop: "leavetime",
    hide: true,
    props: {
      placeholder: "请输入返京日期"
    }
  },
  {
    title: "返京(计划)日期",
    type: "date",
    prop: "gobacktime",
    hide: true,
    props: {
      placeholder: "请输入计划返京日期",
      end: ""
    }
  },
  {
    title: "返京所乘车次/航班/车牌",
    type: "input",
    prop: "flight",
    hide: true,
    props: {
      placeholder: "请输入返京日期"
    }
  },
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
    title: "体温",
    type: "input",
    prop: "temperature",
    props: {
      placeholder: "请输入体温"
    }
  },
  {
    title: "目前健康状况",
    type: "radio",
    prop: "healthy",
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 1, name: "健康" },
        { id: 2, name: "有发烧、咳嗽等症状" },
        { id: 0, name: "其他症状" }
      ]
    }
  },
  {
    title: "其他症状",
    type: "input",
    prop: "otherhealthy",
    hide: true,
    props: {
      placeholder: "请输入其他症状"
    }
  },
  {
    title: "是否确诊",
    type: "radio",
    prop: "comfirmed",
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
    title: "是否就诊住院",
    type: "radio",
    prop: "admitting",
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
    title: "其他备注信息",
    type: "input",
    prop: "remarks",
    require: false,
    props: {
      placeholder: "请输入备注信息"
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
    clocked: false,
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
    // console.log("onFormChange", e);
    const { prop, value } = e.detail;
    let { data } = this.data;

    // 根据填选是否离开，显示返回日期
    if (prop === "otherCity") {
      this.setFields(this.data.atBeijing, value.toString() === "1");
    } else if (prop === "temperature") {
      // 判断 > 37.2摄氏度，默认发烧状态
      if (Number(value) > 37.2) {
        this.setHealthyDisabled(true);
      } else {
        this.setHealthyDisabled(false);
      }
    } else if (prop === "comfirmed") {
      // 判断 确诊不能选择健康
      if (value === "1") {
        this.setHealthyDisabled(true);
      } else if(data['temperature'] > 37.2) {
        this.setHealthyDisabled(true);
      } else {
        this.setHealthyDisabled(false);
      }
      
    } else if (prop === "healthy") {
      // 判断 健康状况选其它
      if (value === "0") {
        this.setOtherHealthyHide(false);
      } else {
        this.setOtherHealthyHide(true);
      }
    }

    let itemData = {};
    itemData[e.detail.prop] = e.detail.value;
    data = Object.assign({}, data, itemData);
    // this.data.data = data;

    this.setData({
      data
    });
  },
  // 温度大于37.2设置健康是禁选中
  setHealthyDisabled(disable) {
    let { fields, data } = this.data;
    // data["healthy"] = disable ? null : data["otherhealthy"];
    if (disable && data["healthy"] === "1") {
      data["healthy"] = null;
    }
    this.setData({
      data
    });
    fields.forEach((item, index) => {
      if (item.prop === "healthy") {
        for (let i = 0; i < item.props.options.length; i++) {
          if (item.props.options[i].id === 1) {
            fields[index].props.options[i]["disabled"] = disable;
            break;
          }
        }
      }
    });
    this.setData({ fields, data });
  },
  setOtherHealthyHide(hide) {
    let { fields, data } = this.data;
    data["otherhealthy"] = null;
    this.setData({
      data
    });
    fields.forEach((item, index) => {
      if (item.prop === "otherhealthy") {
        item.hide = hide;
      }
    });
    this.setData({ fields, data });
  },
  // 重置按钮
  formCancel() {
    let { data } = this.data;
    for (let prop in data) {
      if (prop != "userName" && prop != "phone") {
        data[prop] = null;
      }
    }
    this.setData({
      data
    });
  },
  // 提交按钮
  formSubmit() {
    const validate = this.selectComponent("#form").validate();
    if (validate) {
      const formData = this.data.data;
      formData.userId = this.data.userFilledInfo.id;
      // console.log("formData", formData);
      saveClock(formData).then(res => {
        // console.log(res);
        wx.navigateTo({
          url: "/pages/clock/status/index"
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
// 设置部分选项隐藏
  setFieldsHide(hideList = [], showOtherCity = true, otherCith = 0) {
    // let fields = fields;
    fields.forEach(item => {
      if (showOtherCity && item.prop == "otherCity") {
        item.hide = false;
        item.value = otherCith;
      }
      if (item.prop == "otherCity") {
        // debugger;
      }
      if (hideList.indexOf(item.prop) > -1) {
        item.hide = true;
      } else {
        if (item.prop == "otherhealthy") {
          item.hide = item.hide || true;
        } else {
          item.hide = false;
        }
      }
    });
    this.setData({
      fields
    });
  },
  // 根据是否在北京设置需要显示的字段，在北京显示是否离开北京，返回日期，不在北京显示原因日期
  setFields(atBeijing = false, leaved = false) {
    // console.log("atBeijing:", atBeijing, " leaved:", leaved);
    let fields = fields;
    if (atBeijing) {
      // 在北京 & 非从其它地方返回 隐藏离京leavetime, 返程日期gobacktime，未返程原因reason
      // 在北京 & 从其它地方返回  显示离京时间leavetime 返程日期gobacktime，隐藏未返程原因，reason
      // 不在北京 隐藏从其它城市返回otherCity

      // 在北京，离开且已经返回
      // if (otherCity) {
      // }
      // this.setFieldsHide(["reason"]);
      if (leaved) {
        this.setFieldsHide(["reason"]);
      } else {
        // 在北京且未离开
        this.setFieldsHide(["reason", "leavetime", "gobacktime", "flight"]);
        // this.setFieldsHide(["reason", "gobacktime", "reason"]);
      }
    } else {
      // 不在北京切且返回
      // this.setFieldsHide(["otherCity", "gobacktime2"], true);
      this.setFieldsHide(["otherCity"], false);
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
              console.log(location);
              this.setData({ location });
              reverseAddressFromLocation(location).then(res => {
                this.onAddressChange(res);
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
  // 地址选项变化
  onAddressChange(location, chooseLocation) {
    var currentCity = chooseLocation ?   location.city : location.result.ad_info.city;
    // console.log(res.result.ad_info.city);
    let atBeijing = currentCity == "北京市";

    this.setData({
      atBeijing,
      leaved: !atBeijing,
      goBack: !atBeijing,
      address: chooseLocation ? location : location.result,
      data: {
        ...this.data.data,
        address: chooseLocation ? location.address : location.result.address
      }
    });
    this.setFields(atBeijing, false);
  },

  // 设置用户填入信息
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
  async initUserInfo() {
    let { globalData } = app;
    if (!app.globalData.userFilledInfo.userRegisted) {
      globalData = await app.init(true);
    }

    this.setUserFilledInfo(globalData.userFilledInfo);
  },

  // 获取用户今日打卡信息
  getUserTodyClockData() {
    // console.log("====getUserTodyClockData====");
    getTodayClock({
      userId: 60
    }).then(data => {
      // console.log("today data", data);
      let formData = Object.assign({}, this.data.data, data.records[0]);
      let atBeijing =
        (formData.address && formData.address.indexOf("北京市") > -1) || false;
      // 服务端没有其它城市返回字段，根据返京日期判断
      formData["otherCity"] = formData.gobacktime ? 1 : 0;

      if (data.total > 0) {
        this.setData({
          atBeijing,
          clocked: true,
          leaved: !atBeijing,
          goBack: !atBeijing,
          data: formData
        });
      } else {
        this.initAddress();
        this.setData({
          clocked: false,
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
  onLoad: async function (options) {
    const userId = options.id

    this.initFormData();
    this.initUserInfo();
    this.getUserTodyClockData();
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
    console.log(location);
    if (location) {
      // this.setData({
      //   data: {
      //     ...this.data.data,
      //     address: location.address
      //   }
      // });
      this.onAddressChange(location,true);
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
