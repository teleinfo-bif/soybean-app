// pages/clock/index.js
// 不直接使用打卡的页面因为，前面返回的打卡数据中不包括用户信息，需要根据URL中参数做拼接
import { getTodayClock } from "../../api/api.js";
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
    type: "geo",
    prop: "address",
    props: {
      placeholder: "请输入打卡地点"
    }
  },
  {
    title: "是否离开过北京（2020年1月10日以后）",
    type: "radio",
    prop: "leave",
    hide: false,
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 1, name: "否" },
        { id: 2, name: "是" }
      ]
    }
  },
  {
    title: "离京日期",
    type: "date",
    prop: "leavetime",
    hide: true,
    props: {
      placeholder: "请输入离京日期"
    }
  },
  {
    title: "返京日期",
    type: "date",
    prop: "gobacktime",
    hide: true,
    props: {
      placeholder: "请输入返京日期",
      end: ""
    }
  },
  {
    title: "交通工具",
    type: "radio",
    prop: "transport",
    hide: true,
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 1, name: "飞机" },
        { id: 2, name: "火车" },
        { id: 5, name: "汽车" },
        { id: 8, name: "轮船" },
        { id: 0, name: "其他" }
      ]
    }
  },
  {
    title: "返京所乘车次/航班/车牌",
    type: "input",
    prop: "flight",
    hide: true,
    props: {
      placeholder: "请输入所乘车次/航班/车牌"
    }
  },
  {
    title: "未返京原因 ",
    type: "radio",
    prop: "nobackreason",
    hide: true,
    require: false,
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 1, name: "身体原因" },
        { id: 2, name: "当地未放行" }
      ]
    }
  },

  {
    title: "体温（℃）",
    type: "input",
    prop: "temperature",
    props: {
      placeholder: "温度超过37.2度不能视为健康，请重新选择健康状况!",
      validate(value) {
        return /^\d+(\.\d+)?$/.test(value);
      },
      errorMsg: "体温请输入数字和小数点"
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
        { id: 1, name: "否" },
        { id: 2, name: "是" }
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
        { id: 1, name: "否" },
        { id: 2, name: "是" }
      ]
    }
  },
  {
    title: "是否有接触过疑似病患、接待过来自湖北的亲戚朋友、或者经过湖北",
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
    title: "您的在岗状态 ",
    type: "radio",
    prop: "jobstatus",
    hide: false,
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 1, name: "在岗" },
        { id: 2, name: "在家办公" },
        { id: 3, name: "未复工" }
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
    otherUserId: null,
    clocked: true,
    userRegisted: app.globalData.userRegisted,
    userFilledInfo: {},
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
    if (prop === "leave") {
      this.setFields(data);
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
      } else if (data["temperature"] > 37.2) {
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
      if (showOtherCity && item.prop == "leave") {
        item.hide = false;
        item.value = otherCith;
      }
      if (item.prop == "leave") {
        // debugger;
      }
      if (hideList.indexOf(item.prop) > -1) {
        item.hide = true;
      } else {
        // 如果otherhealthy health等于0其他，设置健康其他显示
        if (item.prop == "otherhealthy") {
          item.hide = this.data.data.healthy == "0" ? false : true;
        } else {
          item.hide = false;
        }
      }
    });
    this.setData({
      fields
    });
  },
  /**
   *设置表单隐藏
   *
   * @param {*} data userfilledData
   */
  setFields(data) {
    // console.log("atBeijing:", atBeijing, " leaved:", leaved);
    const { fields, baseAddress, clocked } = this.data;

    // 返回字段直接根据leave判断
    const leave = data["leave"] == "2";
    // debugger;
    const atBeijing = clocked
      ? data.address.startsWith("北京市")
      : (typeof baseAddress == "string" && baseAddress.startsWith("北京市")) ||
        false;
    fields.forEach(item => {
      // 如果再北京，返回时间最大是今天
      // 在北京显示返京日期，否则显示计划返京日期
      if (item.prop === "gobacktime") {
        item.title = atBeijing ? "返京日期" : "计划返京日期";
        item.props.placeholder = atBeijing
          ? "请输入返京日期"
          : "请输入计划返京日期";
      }
    });
    this.setData(
      {
        fields
      },
      () => {
        // 在北京 & 非从其它地方返回 隐藏离京leavetime, 返程日期gobacktime，未返程原因reason
        // 在北京 & 从其它地方返回  显示离京时间leavetime 返程日期gobacktime，隐藏未返程原因，reason
        // 不在北京 隐藏从其它城市返回otherCity

        this.setFieldsHide(["leave"], !atBeijing);
        if (leave) {
          this.setFieldsHide(["nobackreason"]);
        } else {
          // 在北京且未离开
          this.setFieldsHide([
            "nobackreason",
            "leavetime",
            "gobacktime",
            "flight",
            "transport"
          ]);
        }
      }
    );
  },
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
    var currentCity = chooseLocation
      ? location.city
      : location.result.ad_info.city;
    // console.log(res.result.ad_info.city);
    let atBeijing = currentCity == "北京市";
    const formData = {
      ...this.data.data,
      address: chooseLocation ? location.address : location.result.address
    };
    this.setData({
      atBeijing,
      leaved: !atBeijing,
      goBack: !atBeijing,
      address: chooseLocation ? location : location.result,
      data: formData
    });
    this.setFields(formData);
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
    if (!app.globalData.userFilledInfo.appInit) {
      app.init(globalData => {
        this.setUserFilledInfo(globalData.userFilledInfo);
      });
    } else {
      this.setUserFilledInfo(globalData.userFilledInfo);
    }
  },

  // 获取用户今日打卡信息
  getUserTodyClockData(userId, time) {
    getTodayClock({
      userId: userId,
      time: time
    }).then(data => {
      const resData = data;
      // 打卡数据合并到data中，今日未打卡返回的数据在是{}
      let formData = {
        ...this.data.data,
        ...resData.records[0]
      };
      // 判断打过卡
      if (resData.total > 0) {
        this.setData({
          clocked: true,
          data: formData
        });
      } else {
        this.initAddress();
        this.setData({
          clocked: false
        });
      }
      // 设置表单显示的字段
      this.setFields(formData);
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    const { userId, clockInTime, name = "", phone = "" } = options;
    console.log(name, phone, clockInTime);
    this.setData(
      { 
        clockInTime: clockInTime,
        otherUserId: userId,
        userFilledInfo: {
          name,
          phone
        }
      },
      this.getUserTodyClockData(userId, clockInTime)
    );

    this.initFormData();
    // this.initUserInfo();
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
    // console.log(location);
    if (location) {
      this.onAddressChange(location, true);
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
