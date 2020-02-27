// pages/enteringInfo/index.js

const chooseLocation = requirePlugin("chooseLocation");
const app = getApp();

// import Notify from "vant-weapp/dist/notify/notify";
import { delUserInfo, saveUserInfo, updateUserInfo } from "../../api/api.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userRegisted: app.globalData.userRegisted,
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
          placeholder: "请输入手机号码"
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
          type: "number",
          placeholder: "请输入证件号码"
        }
      },
      {
        title: "家庭所在区及街道、社区",
        type: "area",
        prop: "homeAddress",
        props: {
          placeholder: "请选择家庭所在区及街道、社区"
        }
      },
      {
        title: "家庭详细地址",
        type: "map",
        prop: "detailAddress",
        props: {
          placeholder: "请输入家庭详细地址",
          addressKey: ""
        }
      }
    ],
    data: app.globalData.userFilledInfo,
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
    let data = Object.assign(this.data.data, itemData);
    this.setData({
      data
    });
    // this.data.data = data;
  },
  // 提交/更新
  formSubmit() {
    const validate = this.selectComponent("#form").validate();
    if (validate) {
      const formData = this.data.data;
      formData.idType = formData.idType.id;
      formData.homeAddress = formData.homeAddress.join("-");
      // console.log(formData);
      if (!this.data.userRegisted) {
        saveUserInfo(formData).then(data => {
          wx.navigateTo({
            url: "/pages/status/index"
          });
        });
      } else {
        formData["id"] = formData.id;
        updateUserInfo(formData).then(data => {
          wx.navigateTo({
            url: "/pages/status/index"
          });
        });
      }
    }
  },
  // 删除
  del() {
    delUserInfo({ ids: [app.globalData.userFilledInfo.id].join(",") }).then(
      res => {
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
        this.onLoad();
      }
    );
  },
  // 重置
  formCancel() {
    let { data } = this.data;
    data.phone = null;
    data.homeAddress = null;
    data.detailAddress = null;
    this.setData({
      data
    });
  },

  // 已填写设置禁用字段
  setFieldsDisable(resData) {
    let fields = this.data.fields;
    // let edit = this.data.edit;
    let userRegisted = Object.keys(resData).length > 0;

    fields.forEach(item => {
      return (item["props"]["disable"] = userRegisted);
    });

    if (typeof resData.homeAddress === "string") {
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
    if (!this.data.globalData.userId) {
      await app.init();
    }
    this.setFieldsDisable(app.globalData.userFilledInfo);
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
      this.setData({
        data: Object.assign({}, this.data.data, {
          detailAddress: location.address
        })
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
