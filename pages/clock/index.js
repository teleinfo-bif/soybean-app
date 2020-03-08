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

import { getTodayClock, getUserClockList, saveClock } from "../../api/api.js";
import { reverseAddressFromLocation } from "../../utils/qqmap-wx-jssdk/map";
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
      placeholder: "请输入打卡地点",
      maxlength: "15",
      // validate(value) {
      //   return value.length >= 5 && value.length <= 15;
      // },
      // errorMsg: "请输入5-15个字的地址"
    }
  },
  {
    title: "是否14天内到达工作地",
    type: "radio",
    prop: "leave",
    hide: true,
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
    title: "是否14天内到达打卡城市",
    type: "radio",
    prop: "leaveCity",
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
    title: "到达日期",
    type: "date",
    prop: "leavetime",
    hide: true,
    props: {
      placeholder: "请输入到达日期",
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
        // { id: 3, name: "自驾" },
        // { id: 4, name: "地铁" },
        // { id: 5, name: "客车" },
        { id: 5, name: "汽车" },
        // { id: 6, name: "公交" },
        // { id: 7, name: "出租车" },
        { id: 8, name: "轮船" },
        { id: 0, name: "其他" }
      ]
    }
  },
  {
    title: "返回所乘车次/航班/车牌",
    type: "input",
    prop: "flight",
    hide: true,
    props: {
      placeholder: "请输入所乘车次/航班/车牌"
    }
  },
  {
    title: "未返回工作地原因 ",
    type: "radio",
    prop: "nobackreason",
    hide: true,
    // require: false,
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
    title: "计划返回工作地日期",
    type: "date",
    prop: "gobacktime",
    hide: true,
    props: {
      placeholder: "请输入返京日期",
      end: ""
    }
  },
  {
    title: "当天体温",
    type: "radio",
    prop: "temperatureRadio",
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 1, name: "正常(37.3以下)" },
        { id: 2, name: "37.3及以上" }
      ]
    }
  },
  {
    title: "具体温度",
    type: "input",
    prop: "temperature",
    hide: true,
    props: {
      // placeholder: "温度超过37.3度不能视为健康，请重新选择健康状况!",
      placeholder: "请输入数字和小数点",
      validate(value) {
        return /^\d+(\.\d+)?$/.test(value) && value > 37.3;
      },
      errorMsg: "请输入大于37.3的数字和小数点"
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
    title: "共同居住人员亲属（含合租人员）健康状况",
    type: "radio",
    prop: "roomPerson",
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 1, name: "健康" },
        { id: 2, name: "有发热、咳嗽等" },
        { id: 0, name: "其他症状" }
      ]
    }
  },
  {
    title: "共同居住人员亲属（含合租人员）健康状况为其他的原因",
    type: "input",
    prop: "roomPersonOther",
    hide: true,
    props: {
      placeholder: "请输入其他"
    }
  },
  {
    title:
      "共同居住人员亲属（含合租人员）所在单位/公司是否有疑似病例、确诊病例",
    type: "radio",
    prop: "roomCompany",
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 1, name: "有确诊病例" },
        { id: 2, name: "有疑似病例" },
        { id: 3, name: "都无" },
        { id: 0, name: "其他" }
      ]
    }
  },
  {
    title:
      "共同居住人员亲属（含合租人员）所在单位/公司是否有疑似病例、确诊病例为其他的原因",
    type: "input",
    prop: "roomCompanyOther",
    hide: true,
    props: {
      placeholder: "请输入其他"
    }
  },
  {
    title: "近14天是否有接触过疑似病患、接待过来自湖北的亲戚朋友、或途径湖北",
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
    title: "个人状态 ",
    type: "radio",
    prop: "jobstatus",
    hide: false,
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 1, name: "在岗办公" },
        { id: 2, name: "居家办公" },
        { id: 3, name: "居家隔离" },
        { id: 4, name: "监督隔离" }
      ]
    }
  },
  {
    title: "其他",
    type: "input",
    prop: "remarks",
    require: false,
    props: {
      placeholder: "请输入其他"
    }
  },
  {
    type: "agreement",
    prop: "agreement",
    require: false,
    props: {
      needCheck: false
    }
  }
];

Page({
  /**
   * 页面的初始数据
   */
  data: {
    clocked: false,
    otherId: null,
    userFilledInfo: "",
    location: "",
    address: {},
    fields: fields,
    data: {
      address: ""
    },
    city: "",
    baseAddress: "",
    otherFieldsList: {
      healthy: "otherhealthy",
      roomPerson: "roomPersonOther",
      roomCompany: "roomCompanyOther"
    },
    atWorkPlace: true,
    companyProvince: "",
    companyCity: "",
    locationProvince: "",
    locationCity: ""
  },
  onFormChange(e) {
    console.log("onFormChange", e);
    const { prop, value } = e.detail;
    let { data, otherFieldsList } = this.data;

    let itemData = {};
    itemData[e.detail.prop] = e.detail.value;
    data = Object.assign({}, data, itemData);

    // 根据填选是否离开，显示返回日期
    if (prop === "leave" || prop === "leaveCity") {
      this.setFieldsFromLeave(data);
    } else if (
      prop === "comfirmed" ||
      prop === "admitting" ||
      prop === "temperature"
    ) {
      // 确诊、入院、温度修改健康项
      this.setData(
        {
          data
        },
        this.setHealthyDisabled
      );
      // ();
    } else if (prop === "temperatureRadio") {
      data["temperature"] = data["temperatureRadio"] == 1 ? 36.5 : "";
      this.setFieldsFromTemperature(data);
    } else if (otherFieldsList[prop]) {
      // 判断 健康状况选其它
      if (value === "0") {
        this.setOtherFieldsHide(otherFieldsList[prop], false);
      } else {
        this.setOtherFieldsHide(otherFieldsList[prop], true);
      }
    }

    // this.data.data = data;
    this.setData({
      data
    });
  },
  // 温度大于37.3设置健康是禁选中
  setHealthyDisabled() {
    // let disable = false;
    let { fields, data } = this.data;
    // 体温高于37.3 或者 选择确诊 或者 选择就诊 这三种情况都不允许选择健康
    const { temperature, comfirmed, admitting } = this.data.data;
    // data["healthy"] = disable ? null : data["otherhealthy"];
    if (
      (temperature && Number(temperature) > 37.3) ||
      (comfirmed != null && comfirmed == "2") ||
      (admitting != null && admitting == "2")
    ) {
      if (data["healthy"] == "1") {
        // data["healthy"] = null;
      }
      // disable = true;
    }

    // this.setData({
    //   data
    // });
    // fields.forEach((item, index) => {
    //   if (item.prop === "healthy") {
    //     for (let i = 0; i < item.props.options.length; i++) {
    //       if (item.props.options[i].id === 1) {
    //         // fields[index].props.options[i]["disabled"] = disable;
    //         break;
    //       }
    //     }
    //   }
    // });
    this.setData({ fields, data });
  },
  setOtherFieldsHide(prop, status = true) {
    let { fields, data } = this.data;
    // data[prop] = null;
    if (status) {
      data[prop] = null;
    }
    this.setData({
      data
    });
    fields.forEach((item, index) => {
      if (item.prop === prop) {
        item.hide = status;
      }
    });
    this.setData({ fields, data });
  },
  // 重置按钮
  formCancel() {
    let { data } = this.data;
    for (let prop in data) {
      if (prop != "name" && prop != "userName" && prop != "phone") {
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
      formData.city = this.data.city;
      formData.phoe = this.data.phoneComplete;
      const { temperature, comfirmed, admitting, healthy } = formData;
      if (healthy == "1") {
        if (temperature && Number(temperature) > 37.3) {
          wx.showToast({
            title: "体温高于37.3不能选择健康",
            icon: "none"
          });
          return;
        } else if (comfirmed != null && comfirmed == "2") {
          wx.showToast({
            title: "确诊不能选择健康",
            icon: "none"
          });
          return;
        } else if (admitting != null && admitting == "2") {
          wx.showToast({
            title: "就诊不能选择健康",
            icon: "none"
          });
          return;
        }
      }

      // const atBeijing = formData.address.startsWith("北京市");
      // 如果未打卡，不在北京，默认离开2,没离开不能默认离开，因为涉及自动填选的选中状态
      // if (!atBeijing && this.data.data["leave"] == null) {
      //   formData["leave"] = 2;
      // }
      saveClock(formData).then(res => {
        wx.navigateTo({
          url: `/pages/clock/status/index?data=${JSON.stringify(formData)}`
        });
      });
    }
  },
  // 初始化this.data.data,赋值
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
  async setFieldsHide(hideList = [], showList = []) {
    return new Promise((resolve, reject) => {
      let { fields } = this.data;
      fields.forEach(item => {
        // if (showOtherCity && item.prop == "leave") {
        //   item.hide = false;
        //   item.value = otherCith;
        // }
        if (hideList.includes(item.prop)) {
          item.hide = true;
        } else if (showList.includes(item.prop)) {
          item.hide = false;
        }
      });
      this.setData(
        {
          fields
        },
        resolve
      );
    });
  },
  async setFieldsFromAddress(formData) {
    // 先判断用户位置信息和填写的信息是否一致
    // debugger;
    console.log("==========修改城市名称==============");
    console.log("companyAddress", this.data.userFilledInfo.companyAddress);

    let { fields } = this.data;
    // 是否在工作地
    let {
      atWorkPlace,
      companyCity,
      locationCity
    } = await this.getAtWorkPlaceState(formData);
    // debugger;
    fields.forEach(item => {
      // 是否离开公司所在地
      if (item.prop === "leave") {
        // item.hide = !atWorkPlace;
        item.title = "是否14天内到达" + companyCity;
      }
      // 是否离开定位所在地
      if (item.prop === "leaveCity") {
        // item.hide = atWorkPlace;
        item.title = "是否14天内到达" + locationCity;
      }

      if (item.prop === "leavetime") {
        item.title = `到达${locationCity}日期`;
        item.props.placeholder = `请输入到达${locationCity}日期`;
        item.props.end = getyyyyMMdd();
      }

      if (item.prop === "nobackreason") {
        item.title = `未返回${companyCity}原因`;
        item.props.placeholder = `请输入未返回${companyCity}原因`;
      }

      // 如果在工作地，返回时间最大是今天
      if (item.prop === "gobacktime") {
        item.props.end = atWorkPlace ? getyyyyMMdd() : "";
        item.props.start = !atWorkPlace ? getyyyyMMdd() : "";
        if (atWorkPlace) {
        } else {
          item.title = `计划返回${companyCity}日期`;
          item.props.placeholder = `请输入计划返回${companyCity}日期`;
        }
      }
    });

    // debugger;
    this.setData({
      fields
    });
    // 在工作地隐藏是否离开打卡地，返回时间，显示是否离开工作地
    if (atWorkPlace) {
      console.log("=====");
      await this.setFieldsHide(
        [
          "leavetime",
          "gobacktime",
          "nobackreason",
          "leaveCity",
          "flight",
          "transport"
        ],
        ["leave"]
      );
    } else {
      console.log("=====");
      // 不在工作地隐藏是否离开工作地，未返回原因，显示是否离开打卡地
      await this.setFieldsHide(
        ["leavetime", "leave", "flight", "transport"],
        ["leaveCity", "gobacktime", "nobackreason"]
      );
    }
    console.log("address finish");
    return;
  },
  // 根据是否离开控制表单显示隐藏字段
  async setFieldsFromLeave(formData) {
    // leavetime nobackreason gobacktime  flight transport(只要离开过，不区分工作地打卡地，就显示transport，flight)
    /* 
      在工作地
        离开： 显示(leavetime flight transport) 隐藏(nobackreason gobacktime )
        未离开：显示() 隐藏(leavetime nobackreason gobacktime flight transport)
      不在工作地
        离开： 显示(nobackreason gobacktime leavetime flight transport ) 隐藏()
        未离开：显示(nobackreason gobacktime) 隐藏(leavetime flight transport)
      */
    // debugger;
    console.log("leavve start");
    const { atWorkPlace } = this.data;
    console.log("atWorkPlace", atWorkPlace);
    let hideList = [];
    let showList = [];
    // debugger;
    if (atWorkPlace) {
      if (formData["leave"] == "2") {
        showList = ["leavetime", "flight", "transport"];
        hideList = ["nobackreason", "gobacktime"];
      } else {
        showList = [];
        hideList = [
          "leavetime",
          "nobackreason",
          "gobacktime",
          "flight",
          "transport"
        ];
      }
    } else {
      if (formData["leaveCity"] == "2") {
        showList = [
          "leavetime",
          "nobackreason",
          "gobacktime",
          "flight",
          "transport"
        ];
        hideList = [];
      } else {
        showList = ["nobackreason", "gobacktime"];
        hideList = ["leavetime", "flight", "transport"];
      }
    }
    console.log("leave finish");
    return this.setFieldsHide(hideList, showList);
  },
  async setFieldsFromTemperature(formData) {
    // let disable;
    if (formData.temperatureRadio == 1) {
      // disable = false;
      this.setFieldsHide(["temperature"], []);
    } else {
      this.setFieldsHide([], ["temperature"]);

      // disable = true;
    }
    // const { fields } = this.data;
    // fields.forEach((item, index) => {
    //   if (item.prop === "healthy") {
    //     for (let i = 0; i < item.props.options.length; i++) {
    //       if (item.props.options[i].id === 1) {
    //         fields[index].props.options[i]["disabled"] = disable;
    //         break;
    //       }
    //     }
    //   }
    // });
    // this.setData({ fields });
  },
  async setFieldsFromPreviousLockData(formData) {},
  /**
   *设置表单隐藏
   *
   * @param {*} data userfilledData
   */
  setFields(formData) {
    // this.setFieldsFromAddress(formData);
    // this.setFieldsFromLeave(formData);
    this.setFieldsFromTemperature(formData);
  },
  // 修改打卡地点
  onChangeBaseAddress(e) {
    this.setData({
      baseAddress: e.detail.baseAddress,
      city: e.detail.city
    });
  },
  /**
   * 获取单位省市信息
   *
   * @param {*} [formData=this.data.data]
   * @returns {atWorkPlace, companyProvince, companyCity}
   */
  async getAtWorkPlaceState(formData) {
    console.log("getAtWorkPlaceState 开始执行");
    let { clocked, address, userFilledInfo } = this.data;
    const { companyAddress = "" } = clocked ? formData : userFilledInfo;

    if (!companyAddress || companyAddress.length == 0) {
      console.error("提醒：用户没有录入单位位置");
      return;
    }
    // debugger;
    // 已打卡从返回数据中分离省市信息，未打卡从定位信息中分离数据
    let [companyProvince, companyCity] = Array.isArray(companyAddress)
      ? companyAddress
      : companyAddress.split("-");
    console.log("获取的公司地址:", companyProvince, companyCity);
    let locationProvince, locationCity;
    // 是否在工作地
    let atWorkPlace;
    // 判断省份和城市相同，则位置在工作地
    console.log("今日打卡情况clocked:", clocked);
    if (clocked) {
      const result = formData.city.split("，");
      console.log("已打卡，根据使用city当做打卡地判断");
      locationProvince = result[0];
      locationCity = result[1];
      // [(locationProvince, locationCity)] = result;
      atWorkPlace =
        companyProvince == locationProvince && companyCity == locationCity;
    } else {
      console.log("已打卡，根据使用location当做打卡地判断");
      // debugger;
      let locationed = Object.keys(address).length > 0;
      console.log("判断是否已经定位成功：locationed", locationed);
      locationProvince = locationed ? address.address_component.province : "";
      locationCity = locationed ? address.address_component.city : "";
      atWorkPlace =
        companyProvince == locationProvince && companyCity == locationCity;
      console.log(
        "定位省市县：locationed",
        "locationProvince",
        locationProvince,
        "locationCity",
        locationCity
      );
    }
    const workData = {
      atWorkPlace,
      companyProvince,
      companyCity,
      locationProvince,
      locationCity
    };
    this.setData({
      ...workData
    });
    return workData;
  },
  // 初始化位置信息
  initAddress() {
    const _this = this;
    wx.getSetting({
      success: res => {
        // 判断用户是否授权了位置信息
        if (res.authSetting["scope.userLocation"]) {
          wx.getLocation({
            altitude: true,
            success: location => {
              this.setData({ location });
              reverseAddressFromLocation(location).then(res => {
                this.onAddressChange(res);
              });
            }
          });
        } else {
          console.log("未授权位置信息");
          wx.authorize({
            scope: "scope.userLocation",
            success() {
              _this.initAddress();
            },
            fail(e) {
              console.log("用户拒绝授权位置信息");
            }
          });
        }
      }
    });
  },
  // 地址选项变化
  onAddressChange(location) {
    const { fields } = this.data;

    const {
      province,
      district,
      city,
      street_number
    } = location.result.address_component;
    let baseAddress;
    // 打卡省市拼接给server
    const locationCity = province + "，" + city;
    if (province == city) {
      baseAddress = province;
    } else {
      baseAddress = province + city;
    }
    fields.forEach(item => {
      if (item.prop == "address") {
        item.props["location"] = location;
        item.props["baseAddress"] = baseAddress;
      }
    });

    const formData = {
      ...this.data.data,
      address: district + street_number,
      city: locationCity
    };
    this.setData(
      {
        fields,
        data: formData,
        address: location.result,
        baseAddress,
        city: locationCity
      },
      () => {
        this.setFieldsFromAddress(formData);
      }
    );
  },
  // 根据位置信息修改显示的表单field

  // 设置用户填入信息，用户没有打卡记录的时候还是需要个人填写上
  setUserFilledInfo() {
    const { userFilledInfo } = app.globalData;
    let { data } = this.data;
    debugger;
    data["name"] = userFilledInfo.name || "";
    data["phoneComplete"] = userFilledInfo.phone || "";
    data["phone"] = userFilledInfo.phone.replace(
      /^(\d{3})\d{4}(\d{4})$/,
      "$1****$2"
    );

    this.setData({
      userFilledInfo,
      data
    });
  },
  async setFieldsFromClockData(formData) {
    await this.setFieldsFromAddress(formData);
    this.setFieldsFromTemperature(formData);
    this.setFieldsFromLeave(formData);
    const { otherFieldsList } = this.data;
    for (let prop in otherFieldsList) {
      let value = formData[prop];
      this.setOtherFieldsHide(otherFieldsList[prop], +value != 0);
    }
  },
  // 获取用户今日打卡信息
  getUserTodyClockData(params = {}) {
    getTodayClock(params).then(data => {
      const resData = data;
      // 打卡数据合并到data中，今日未打卡返回的数据在是{}
      let formData = {
        ...this.data.data,
        ...resData.records[0]
      };
      // 判断打过卡
      if (resData.total > 0) {
        formData["name"] = formData.userName;
        formData["phoneComplete"] = formData.phoe;
        formData["temperatureRadio"] = formData.temperature > 37.3 ? 2 : 1;
        formData.phone = formData.phone.replace(
          /^(\d{3})\d{4}(\d{4})$/,
          "$1****$2"
        );
        this.setData({
          clocked: true,
          data: formData
        });
        // 设置表单显示的字段 -todo
        this.setFieldsFromClockData(formData);
      } else {
        // 未打卡开始获取位置信息，获取之前的打卡记录
        if (!params.userId) {
          this.initAddress();
          this.getUserClockListData();
          this.setData({
            clocked: false
          });
        }
      }
    });
  },
  // 获取用户打卡记录
  async getUserClockListData() {
    getUserClockList({}).then(resData => {
      // 需要自动填写的字段
      if (resData.total > 0) {
        const autoFilledProps = [
          "leave",
          "leavetime",
          "leaveCity",
          "gobacktime",
          "transport",
          "flight",
          "nobackreason"
        ];
        const previousLockData = resData.records[0];
        let { data } = this.data;
        autoFilledProps.forEach(prop => {
          data[prop] = previousLockData[prop];
        });
        data["phoneComplete"] = data.phoe;
        data.phone = data.phone.replace(/^(\d{3})\d{4}(\d{4})$/, "$1****$2");
        this.setData({
          data
        });
        previousLockData["temperatureRadio"] =
          previousLockData.temperature > 37.3 ? 2 : 1;
        this.setFieldsFromClockData(previousLockData);
        // this.setFieldsFromAddress()
      } else {
        console.log("提醒：没有打卡数据，无需自动填写");
      }
    });
  },

  setFieldsFromOtherClockData() {
    const { fields } = this.data;
    fields.pop();
    this.setData({ fields });
  },
  // 页面初始化
  initPage(params = {}) {
    this.setData(
      {
        userFilledInfo: app.globalData.userFilledInfo
      },
      () => {
        if (Object.keys(params).length > 0) {
          this.getUserTodyClockData(params);
          this.setFieldsFromOtherClockData();
        } else {
          debugger;
          this.initFormData();
          this.setUserFilledInfo();
          this.getUserTodyClockData();
        }
      }
    );
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    debugger;
    const { userId, clockInTime = getTodayClock() } = options;
    this.setData({
      otherId: userId
    });
    if (!app.globalData.appInit) {
      app.init(() => {
        if (userId) {
          this.initPage({
            clockInTime: clockInTime,
            userId
          });
        } else {
          this.initPage();
        }
      });
    } else {
      if (userId) {
        this.initPage({
          clockInTime: clockInTime,
          userId
        });
      } else {
        this.initPage();
      }
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
