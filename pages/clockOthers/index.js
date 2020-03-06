// pages/clock/index.js
// 不直接使用打卡的页面因为，前面返回的打卡数据中不包括用户信息，需要根据URL中参数做拼接
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
import { getTodayClock } from "../../api/api.js";

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
    title: "14天内是否离开过工作地",
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
    title: "近14天是否离过打卡城市",
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
    title: "体温（℃）",
    type: "input",
    prop: "temperature",
    props: {
      placeholder: "温度超过37.3度不能视为健康，请重新选择健康状况!",
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
    require: false,
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
    title: "共同居住人员亲属（含合租人员）健康状况",
    type: "radio",
    prop: "roomPerson",
    props: {
      itemKey: "id",
      itemLabelKey: "name",
      options: [
        { id: 1, name: "健康" },
        { id: 2, name: "有发热、咳嗽等症状" },
        { id: 0, name: "其他症状" }
      ]
    }
  },
  {
    title: "其他",
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
    title: "其他",
    type: "input",
    prop: "roomCompanyOther",
    hide: true,
    props: {
      placeholder: "请输入其他"
    }
  },
  {
    title: "居住小区是否有疑似病例、确诊病例",
    type: "radio",
    prop: "neighbor",
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
    title: "其他",
    type: "input",
    prop: "neighborOther",
    hide: true,
    props: {
      placeholder: "请输入其他"
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
    title: "您的在岗状态 ",
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
    title: "其他备注信息",
    type: "input",
    prop: "remarks",
    require: false,
    props: {
      placeholder: "请输入备注信息"
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
    userFilledInfo: {},
    location: "",
    address: {},
    fields: fields,
    data: {
      address: ""
    }
  },
  onFormChange(e) {
    console.log("onFormChange", e);
    const { prop, value } = e.detail;
    let { data, otherFieldsList } = this.data;

    let itemData = {};
    itemData[e.detail.prop] = e.detail.value;
    data = Object.assign({}, data, itemData);

    // 根据填选是否离开，显示返回日期
    if (prop === "leave") {
      this.setFieldsFromLeave(data);
    } else if (prop === "leaveCity") {
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
    let disable = false;
    let { fields, data } = this.data;
    // 体温高于37.3 或者 选择确诊 或者 选择就诊 这三种情况都不允许选择健康
    const { temperature, comfirmed, admitting } = this.data.data;
    // data["healthy"] = disable ? null : data["otherhealthy"];
    if (
      (temperature && Number(temperature) > 37.3) ||
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
  setOtherFieldsHide(prop, status = true) {
    let { fields, data } = this.data;
    data[prop] = null;
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
  setFieldsHide(hideList = [], showList = []) {
    // debugger;
    // let fields = fields;
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
    this.setData({
      fields
    });
  },

  setFieldsFromAddress(formData) {
    // 先判断用户位置信息和填写的信息是否一致

    let { fields } = this.data;

    // 是否在工作地
    let { atWorkPlace, companyCity, locationCity } = this.getAtWorkPlaceState(
      formData
    );

    fields.forEach(item => {
      // 是否离开公司所在地
      if (item.prop === "leave") {
        // item.hide = !atWorkPlace;
        item.title = "14天内是否离开过" + companyCity;
      }
      // 是否离开定位所在地
      if (item.prop === "leaveCity") {
        // item.hide = atWorkPlace;
        item.title = "14天内是否离开过" + locationCity;
      }

      if (item.prop === "leavetime") {
        item.title = `到达${locationCity}日期`;
        item.props.placeholder = `请输入到达${locationCity}日期`;
      }

      if (item.prop === "nobackreason") {
        item.title = `未返回${companyCity}原因`;
        item.props.placeholder = `请输入未返回${companyCity}原因`;
      }

      // 如果在工作地，返回时间最大是今天
      if (item.prop === "gobacktime") {
        item.props.end = atWorkPlace ? getyyyyMMdd() : "";
        if (atWorkPlace) {
          // item.title = `返回${companyCity}日期`;
          // item.props.placeholder = `请输入返回${companyCity}日期`;
          item.hide = true;
        } else {
          item.title = `计划返回${companyCity}日期`;
          item.props.placeholder = `请输入计划返回${companyCity}日期`;
        }
      }
    });

    this.setData({
      fields
    });
    // debugger;
    // 在工作地隐藏是否离开打卡地，返回时间，显示是否离开工作地
    if (atWorkPlace) {
      if (formData["leave"] == "2") {
        this.setFieldsHide(["leaveCity", "gobacktime"], ["leave", "leavetime"]);
      } else {
        this.setFieldsHide(["leavetime", "leaveCity", "gobacktime"], ["leave"]);
      }
    } else {
      // 不在工作地隐藏是否离开工作地，未返回原因，显示是否离开打卡地
      if (formData["leaveCity"] == "2") {
        this.setFieldsHide(
          ["leave"],
          ["leavetime", "leaveCity", "gobacktime", "nobackreason"]
        );
      } else {
        this.setFieldsHide(
          ["leave", "leavetime"],
          ["leaveCity", "gobacktime", "nobackreason"]
        );
      }
    }
  },

  // 根据是否离开控制表单显示隐藏字段
  setFieldsFromLeave(formData) {
    // leavetime nobackreason gobacktime  flight transport(只要离开过，不区分工作地打卡地，就显示transport，flight)
    /* 
      在工作地
        离开： 显示(leavetime flight transport) 隐藏(nobackreason gobacktime )
        未离开：显示() 隐藏(leavetime nobackreason gobacktime flight transport)
      不在工作地
        离开： 显示(nobackreason gobacktime leavetime flight transport ) 隐藏()
        未离开：显示(nobackreason gobacktime) 隐藏(leavetime flight transport)
      */
    const { atWorkPlace } = this.getAtWorkPlaceState(formData);
    let hideList = [];
    let showList = [];
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
    this.setFieldsHide(hideList, showList);
  },

  // 初始化用户信息
  async initUserInfo() {
    let { globalData } = app;
    if (!app.globalData.userFilledInfo.appInit) {
      app.init(globalData => {});
    } else {
    }
  },

  getAtWorkPlaceState(formData = this.data.data) {
    let { clocked, address, userFilledInfo } = this.data;
    /**
     * 这里和前面有差异
     */

    const { companyAddress } = formData || userFilledInfo;

    // 已打卡从返回数据中分离省市信息，未打卡从定位信息中分离数据
    let [companyProvince, companyCity] = companyAddress.split("-");
    let locationProvince, locationCity;
    // 是否在工作地
    let atWorkPlace;
    // 判断省份和城市相同，则位置在工作地
    if (clocked) {
      [locationProvince, locationCity] = formData.companyAddress.split("-");
      atWorkPlace =
        companyProvince == locationProvince && companyCity == locationCity;
    } else {
      let locationed = Object.keys(address).length > 0;
      locationProvince = locationed ? address.address_component.province : "";
      locationCity = locationed ? address.address_component.city : "";
      atWorkPlace =
        companyProvince == locationProvince && companyCity == locationCity;
    }
    return {
      atWorkPlace,
      companyProvince,
      companyCity,
      locationProvince,
      locationCity
    };
  },

  // 获取用户今日打卡信息
  getUserTodyClockData(userId, time) {
    getTodayClock({
      userId: userId,
      time: time
    }).then(data => {
      const resData = data;
      const clockData = data.records[0];
      // 打卡数据合并到data中，今日未打卡返回的数据在是{}
      let formData = {
        ...this.data.data,
        ...clockData,
        name: clockData.userName
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
      this.setFieldsFromLeave(formData);
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    const { userId, clockInTime = getTodayClock() } = options;
    this.setData(
      {
        clockInTime: clockInTime,
        otherUserId: userId
      },
      this.getUserTodyClockData(userId, clockInTime)
    );

    this.initFormData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

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
