// pages/enteringInfo/index.js

const chooseLocation = requirePlugin("chooseLocation");
const app = getApp();
console.log("app", app);
console.log("app", app.globalData.userRegisted);
// import Notify from "vant-weapp/dist/notify/notify";
import {
  delUserInfo,
  getUserFilledInfo,
  saveUserInfo,
  updateUserInfo
} from "../../api/api.js";

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
          type: "number",
          itemLabelKey: "name",
          options: [
            { id: 1, name: "身份证" },
            { id: 2, name: "军官证" },
            { id: 3, name: "护照" },
            { id: 4, name: "港澳居民来往内地通行证" },
            { id: 5, name: "台湾居民来往内地通行证" },
            { id: 6, name: "港澳居民居住证" },
            { id: 7, name: "台湾居民居住证" },
            { id: 8, name: "出入境通行证" }
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
      // {
      //   title: '测试 radio',
      //   type: 'radio',
      //   prop: 'radio',
      //   props: {
      //     itemKey: 'id',
      //     itemLabelKey: 'name',
      //     options: [
      //       { id: 1, name: '是' },
      //       { id: 2, name: '否' }
      //     ]
      //   }
      // },
      // {
      //   title: '测试 area',
      //   type: 'area',
      //   prop: 'area'
      // },
      // {
      //   title: '测试 date',
      //   type: 'date',
      //   prop: 'date'
      // },
      // {
      //   title: '测试 time',
      //   type: 'time',
      //   prop: 'time'
      // }
    ],
    data: {}
  },
  setEditState() {
    this.setData({
      edit: !this.data.edit
    });
  },
  onFormChange(e) {
    console.log("onFormChange", e);
    let itemData = {};
    itemData[e.detail.prop] = e.detail.value;
    let data = Object.assign(this.data.data, itemData);
    // this.setData({
    //   data
    // });
    this.data.data = data;
  },
  click(data) {},
  getFormItemLabel(prop) {
    return this.data.fields.filter(item => {
      console.log(item.prop, prop);
      return item.prop == prop;
    });
  },
  formSubmit() {
    const validate = this.selectComponent("#form").validate();
    if (validate) {
      const formData = this.data.data;
      formData.idType = formData.idType.name;
      formData.homeAddress = formData.homeAddress.join("-");
      console.log(formData);
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
  del() {
    delUserInfo({ ids: [app.globalData.userFilledInfo.id].join(",") }).then(
      res => {
        console.log(this.data.data);
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
  formCancel() {
    let { data } = this.data;
    data.phone = null;
    data.homeAddress = null;
    data.detailAddress = null;
    this.setData({
      data
    });
  },

  setFieldsDisable(resData) {
    let fields = this.data.fields;
    let edit = this.data.edit;
    let userRegisted = Object.keys(resData).length > 0;

    fields.forEach(item => {
      if (
        item.prop == "name" ||
        item.prop == "phone" ||
        item.prop == "idType" ||
        item.prop == "idNumber"
      ) {
        return (item["props"]["disable"] = userRegisted && !edit);
      } else {
        return (item["props"]["disable"] = false);
      }
    });

    console.log("userRegisted", userRegisted);
    resData.homeAddress = resData.homeAddress.split("-");
    if (userRegisted) {
      this.setData({
        userRegisted,
        fields: fields,
        data: resData
      });
    } else {
      let data = {};
      this.data.fields.forEach(item => {
        data[item.prop] = null;
      });
      this.setData({
        userRegisted,
        fields: fields,
        data
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.userRegisted) {
      this.setFieldsDisable(app.globalData.userFilledInfo);
    } else {
      getUserFilledInfo({ openid: app.globalData.openid }).then(data => {
        this.setFieldsDisable(data);
      });
    }
    // Notify("通知内容");

    // this.setData({ data: data });
    // this.setData({
    //   data: {
    //     detailAddress: "北京市海淀区长春桥路17号",
    //     homeAddress: ["北京市", "北京市", "东城区"],
    //     idNumber: "123",
    //     idType: "港澳居民居住证",
    //     name: "测试",
    //     openid: "oqME_5blDi4SI5XvPO6hRrc7926A",
    //     phone: "13312345678"
    //   }
    // });
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
