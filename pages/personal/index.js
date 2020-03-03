// pages/enteringInfo/index.js

const chooseLocation = requirePlugin("chooseLocation");
const app = getApp();

// import Notify from "vant-weapp/dist/notify/notify";
import { saveOrUpdateUserInfo } from "../../api/api.js";
const idNumberReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
const huzhao = /^([a-zA-z]|[0-9]){5,17}$/;
const junguan = /^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/;
const idRegs = [idNumberReg, huzhao, junguan];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userRegisted: app.globalData.userFilledInfo.userRegisted,
    edit: false,
    fields: [
      {
        title: "姓名",
        type: "input",
        prop: "name",
        props: {
          placeholder: "请输入姓名"
        }
      },
      {
        title: "手机号码",
        type: "phone",
        prop: "phone",
        props: {
          placeholder: "请输入手机号码",
          // validate(value) {
          //   return /^1[3456789]\d{9}$/.test(value);
          // }
          validate(value) {
            return /^1[3456789]\d{9}$/.test(value);
          }
        }
      },
      {
        title: "证件类型",
        type: "select",
        prop: "idType",
        props: {
          placeholder: "证件类型",
          itemKey: "id",
          itemLabelKey: "name",
          options: [
            { id: 1, name: "大陆身份证" },
            { id: 2, name: "护照" },
            { id: 3, name: "军官证" }
          ]
        }
      },
      {
        title: "证件号码",
        type: "input",
        prop: "idNumber",
        props: {
          placeholder: "请输入证件号码",
          idType: 1,
          validate(value) {
            return idNumberReg.test(value);
          }
        }
      },
      {
        title: "家庭所在城市及区",
        type: "area",
        prop: "homeAddress",
        require: false,
        props: {
          placeholder: "请选择家庭所在区及街道、社区"
        }
      },
      {
        title: "家庭详细地址",
        type: "map",
        prop: "detailAddress",
        require: false,
        props: {
          placeholder: "请输入家庭详细地址",
          addressKey: ""
        }
      }
    ],
    data: {},
    userFilledInfo: {},
    globalData: app.globalData
  },
  // 设置可编辑状态
  setEditState() {
    this.setData(
      {
        edit: !this.data.edit
      },
      this.setFieldsEditable
    );
  },
  onFormChange(e) {
    let itemData = {};
    const { prop, value } = e.detail;
    itemData[prop] = value;
    // let data = Object.assign(this.data.data, itemData);
    let data = {
      ...this.data.data,
      ...itemData
    };
    let { fields } = this.data;
    // 修改身份类型的时候，动态修改验证规则
    if (prop == "idType") {
      fields.forEach(item => {
        if (item.prop == "idNumber") {
          // console.log(value);
          // console.log(typeof value);
          // console.log(idRegs[value.id - 1]);
          item.props.validate = function(val) {
            return idRegs[value.id - 1].test(val);
          };
        }
      });
    }
    this.setData({
      data,
      fields
    });
    // this.data.data = data;
    // this.data.fields = fields;
  },
  // 提交/更新
  async formSubmit() {
    const validate = this.selectComponent("#form").validate();
    if (validate) {
      let formData = this.data.data;
      formData.idType =
        typeof formData.idType == "object"
          ? formData.idType.id
          : formData.idType;
      formData.homeAddress = Array.isArray(formData)
        ? formData.homeAddress.join("-")
        : "";
      formData = {
        ...formData,
        ...app.globalData.userInfo
      };
      // console.log(formData);
      if (!this.data.userFilledInfo.userRegisted) {
        saveOrUpdateUserInfo(formData).then(async data => {
          await app.refreshUserInfo();
          wx.navigateTo({
            url: "/pages/status/index?msg=注册成功"
          });
        });
      } else {
        formData["id"] = formData.id;
        saveOrUpdateUserInfo(formData).then(async data => {
          await app.refreshUserInfo();
          wx.navigateTo({
            url: "/pages/status/index?msg=更新成功"
          });
        });
      }
    }
  },
  // 重置
  formCancel() {
    let { data } = this.data;
    // data.phone = null;
    data.homeAddress = null;
    data.detailAddress = null;
    this.setData({
      data
    });
  },

  // 已填写设置禁用字段
  setFieldsDisable(resData = {}) {
    let fields = this.data.fields;
    // let edit = this.data.edit;
    let userRegisted = resData.userRegisted;

    fields.forEach(item => {
      return (item["props"]["disable"] = userRegisted);
    });

    if (resData && typeof resData.homeAddress === "string") {
      resData.homeAddress = resData.homeAddress.split("-");
    }
    if (userRegisted) {
      this.setData({
        fields: fields,
        data: resData
      });
    } else {
      let data = {};
      this.data.fields.forEach(item => {
        data[item.prop] = null;
      });
      this.setData({
        fields: fields,
        data
      });
    }
  },
  setFieldsEditable() {
    let fields = this.data.fields;

    fields.forEach(item => {
      if (item.prop == "homeAddress" || item.prop == "detailAddress") {
        return (item["props"]["disable"] = !this.data.edit);
      }
    });

    this.setData({
      fields: fields
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    console.log(this.data.fields[3].props.validate);
    const { globalData } = app;
    if (!globalData.appInit) {
      // await app.init();
      app.init(globalData => {
        this.setData({
          globalData: globalData,
          userFilledInfo: globalData.userFilledInfo
        });
        this.setFieldsDisable(globalData.userFilledInfo);
      });
    } else {
      this.setData({
        globalData: globalData,
        userFilledInfo: globalData.userFilledInfo
      });
      this.setFieldsDisable(globalData.userFilledInfo);
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
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    if (location) {
      debugger;
      this.setData({
        data: {
          ...this.data.data,
          detailAddress: location.address
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

  createGroup: function (e) {
      wx.navigateTo({
        url: '/pages/group/createGroup/createGroup'
      })
  },
});
