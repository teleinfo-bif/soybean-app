// pages/block/index.js
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
    prop: "flightType",
    hide: true,
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 1, name: "飞机" },
        { id: 2, name: "火车" },
        { id: 3, name: "汽车" },
        { id: 4, name: "轮船" },
        { id: 5, name: "其他" }
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
    title: "您的在岗状态 ",
    type: "radio",
    prop: "worktype",
    hide: false,
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 1, name: "已在岗" },
        { id: 2, name: "在家办公" },
        { id: 3, name: "未复工" }
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
    },
    baseAddress: ""
  },
  onFormChange(e) {
    console.log("onFormChange", e);
    const { prop, value } = e.detail;
    let { data } = this.data;

    let itemData = {};
    itemData[e.detail.prop] = e.detail.value;
    data = Object.assign({}, data, itemData);

    // 根据填选是否离开，显示返回日期
    if (prop === "leave") {
      this.setFields(this.data.atBeijing, value.toString() === "2");
    } else if (
      prop === "comfirmed" ||
      prop === "admitting" ||
      prop === "temperature"
    ) {
      this.setData(
        {
          data
        },
        this.setHealthyDisabled
      );
      // ();
    } else if (prop === "healthy") {
      // 判断 健康状况选其它
      if (value === "0") {
        this.setOtherHealthyHide(false);
      } else {
        this.setOtherHealthyHide(true);
      }
    }

    // this.data.data = data;

    this.setData({
      data
    });
  },
  // 温度大于37.2设置健康是禁选中
  setHealthyDisabled() {
    let disable = false;
    let { fields, data } = this.data;
    // 体温高于37.2 或者 选择确诊 或者 选择就诊 这三种情况都不允许选择健康
    const { temperature, comfirmed, admitting } = this.data.data;
    // data["healthy"] = disable ? null : data["otherhealthy"];
    if (
      (temperature && Number(temperature) > 37.2) ||
      (comfirmed != null && comfirmed == "2") ||
      (admitting != null && admitting == "2")
    ) {
      data["healthy"] = null;
      disable = true;
    }

    // this.setData({
    //   data
    // });
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
      formData.address = this.data.baseAddress + formData.address;
      // console.log("formData", formData);
      saveClock(formData).then(res => {
        // console.log(res);
        wx.navigateTo({
          url: "/pages/status/index?msg=打卡成功"
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
  // 根据是否在北京设置需要显示的字段，在北京显示是否离开北京，返回日期，不在北京显示原因日期
  setFields(atBeijing = false, leaved = false) {
    // console.log("atBeijing:", atBeijing, " leaved:", leaved);
    let { fields } = this.data;
    fields.forEach(item => {
      // 如果再北京，返回时间最大是今天
      if (item.prop === "gobacktime") {
        item.props.end = atBeijing ? getyyyyMMdd(new Date()) : "";
      }
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
        if (atBeijing) {
          // 在北京 & 非从其它地方返回 隐藏离京leavetime, 返程日期gobacktime，未返程原因reason
          // 在北京 & 从其它地方返回  显示离京时间leavetime 返程日期gobacktime，隐藏未返程原因，reason
          // 不在北京 隐藏从其它城市返回otherCity

          // 在北京设置返京最大限度为今天

          // 在北京，离开且已经返回
          if (leaved) {
            this.setFieldsHide(["nobackreason"]);
          } else {
            // 在北京且未离开
            this.setFieldsHide([
              "nobackreason",
              "leavetime",
              "gobacktime",
              "flight",
              "flightType"
            ]);
            // this.setFieldsHide(["reason", "gobacktime", "reason"]);
          }
        } else {
          // 不在北京切且返回
          // this.setFieldsHide(["otherCity", "gobacktime2"], true);
          this.setFieldsHide(["leave"], false);
        }
      }
    );
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
  onChangeBaseAddress(e) {
    this.setData({
      baseAddress: e.detail
    });
  },
  // 地址选项变化
  onAddressChange(location, chooseLocation) {
    var currentCity = chooseLocation
      ? location.city
      : location.result.ad_info.city;
    // console.log(res.result.ad_info.city);
    let atBeijing = currentCity == "北京市";
    const { fields } = this.data;
    let baseAddress = null;
    fields.forEach(item => {
      if (item.prop == "address") {
        // debugger;
        item.props["location"] = location;
        baseAddress =
          location.result.address_component.province +
          location.result.address_component.district;
        item.props["baseAddress"] = baseAddress;
      }
    });

    console.log(location);
    this.setData({
      atBeijing,
      leaved: !atBeijing,
      goBack: !atBeijing,
      address: chooseLocation ? location : location.result,
      baseAddress,
      fields,
      data: {
        ...this.data.data,
        // address: chooseLocation ? location.address : location.result.address,
        address: location.result.address_component.street_number
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
    if (!app.globalData.appInit) {
      app.init(globalData => {
        this.setUserFilledInfo(globalData.userFilledInfo);
      });
    } else {
      this.setUserFilledInfo(globalData.userFilledInfo);
    }
  },

  // 获取用户今日打卡信息
  getUserTodyClockData() {
    // console.log("====getUserTodyClockData====");
    getTodayClock({}).then(data => {
      // console.log("today data", data);
      let formData = Object.assign({}, this.data.data, data.records[0]);
      let atBeijing =
        (formData.address && formData.address.indexOf("北京市") > -1) || false;
      // 服务端没有其它城市返回字段，根据返京日期判断
      // formData["leave"] = formData.gobacktime ? 2 : 1;
      // formData["leave"] = formData.leave;
      formData["leave"] = atBeijing ? null : 2;

      // let formFields = this.data.fields;
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
      this.setFields(atBeijing, formData["leave"] == "2");
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    if (!app.globalData.appInit) {
      app.init(() => {
        console.log("进入回调");
        this.initFormData();
        this.initUserInfo();
        this.getUserTodyClockData();
      });
    } else {
      this.initFormData();
      this.initUserInfo();
      this.getUserTodyClockData();
    }
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
