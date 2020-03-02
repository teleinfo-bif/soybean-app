// pages/enteringInfo/index.js

const chooseLocation = requirePlugin("chooseLocation");
const app = getApp();

// import Notify from "vant-weapp/dist/notify/notify";
import { delUserInfo, saveOrUpdateUserInfo } from "../../api/api.js";
const idNumberReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
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
    itemData[e.detail.prop] = e.detail.value;
    // let data = Object.assign(this.data.data, itemData);
    let data = {
      ...this.data.data,
      ...itemData
    };
    // this.setData({});
    this.data.data = data;
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
      formData.homeAddress = formData.homeAddress.join("-");
      formData = {
        ...formData,
        ...app.globalData.userInfo
      };
      // console.log(formData);
      if (!this.data.userFilledInfo.userRegisted) {
        saveOrUpdateUserInfo(formData).then(async data => {
          await app.init(true);
          wx.navigateTo({
            url: "/pages/status/index?msg=注册成功"
          });
        });
      } else {
        formData["id"] = formData.id;
        saveOrUpdateUserInfo(formData).then(async data => {
          await app.init(true);
          wx.navigateTo({
            url: "/pages/status/index?msg=更新成功"
          });
        });
      }
    }
  },
  // 删除
  del() {
    delUserInfo({ ids: [app.globalData.userFilledInfo.id].join(",") }).then(
      async res => {
        // console.log(this.data.data);
        let { data } = this.data;
        Object.keys(data).forEach(key => {
          data[key] = null;
        });
        app.globalData.userFilledInfo = {};
        app.globalData.userRegisted = false;
        this.setData({
          userRegisted: false,
          data
        });
        wx.clearStorageSync();
        await app.init(true);
        wx.navigateTo({
          url: "/pages/index/index"
        });
      }
    );
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
    if (!app.globalData.userFilledInfo) {
      // await app.init();
    }
    const globalData = await app.init();
    this.setData({
      globalData: globalData,
      userFilledInfo: globalData.userFilledInfo
    });
    this.setFieldsDisable(globalData.userFilledInfo);
    // this.setData({
    //   edit: app.globalData.userFilledInfo.userRegisted
    // })
    // if () {

    // }
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
