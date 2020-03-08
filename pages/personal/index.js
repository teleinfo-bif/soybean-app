// pages/enteringInfo/index.js

const chooseLocation = requirePlugin("chooseLocation");
const app = getApp();

// import Notify from "vant-weapp/dist/notify/notify";
import { saveOrUpdateUserInfo } from "../../api/api.js";
const idNumberReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/;
const huzhao = /^([a-zA-z]|[0-9]){5,17}$/;
const junguan = /^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/;
const yuangongka = /^[A-Za-z0-9]{4,18}$/;
const idRegs = [idNumberReg, huzhao, junguan, yuangongka];
Page({
  /**
   * 页面的初始数据
   */
  data: {
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
            { id: 4, name: "单位工卡" },
            { id: 1, name: "身份证" },
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
        title: "永久数字ID",
        type: "input",
        prop: "bidAddress",
        hide: true,
        props: {
          placeholder: "永久数字ID",
          require: false
        }
      },
      {
        title: "单位名称",
        type: "input",
        prop: "companyName",
        props: {
          placeholder: "请输入单位名称"
        }
      },
      {
        title: "单位所在城市及区",
        type: "area",
        prop: "companyAddress",
        props: {
          placeholder: "请选择单位所在城市及区"
        }
      },
      {
        title: "单位详细地址",
        type: "input",
        prop: "companyDetailAddress",
        props: {
          placeholder: "请输入单位详细地址",
          addressKey: ""
        }
      },
      {
        title: "家庭所在城市及区（可选）",
        type: "area",
        prop: "homeAddress",
        require: false,
        props: {
          placeholder: "请选择家庭所在城市及区"
        }
      },
      {
        title: "家庭详细地址（可选）",
        type: "map",
        prop: "detailAddress",
        require: false,
        props: {
          placeholder: "请输入家庭详细地址",
          addressKey: ""
        }
      },
      {
        type: "agreement",
        prop: "agreement",
        require: true,
        props: {
          itemKey: "id",
          itemLabelKey: "name",
          needCheck: true,
          validate(value) {
            return value;
          },
          errorMsg: "请选择同意用户服务条款及隐私协议"
        }
      }
    ],
    data: { agreement: true },
    userFilledInfo: {},
    globalData: app.globalData
  },
  // 设置可编辑状态
  setEditState() {
    this.setData(
      {
        edit: !this.data.edit,
        data: this.data.edit?this.data.asteriskData:this.data.realData
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
          item.props.validate = function(val) {
            return idRegs[value.id - 1].test(val);
          };
          this.setData({
            'fields[3].props.placeholder': value.id==1?`请输入${value.name}号`:`请输入员工号`
          })         
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
  bindGetUserInfo(e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      // wx.navigateTo({
      //   url: "/pages/personal/index"
      // });
      this.formSubmit();
    } else {
      wx.showToast({
        title: "授权失败，无法注册用户",
        icon: "none"
      });
    }
  },
  // 提交/更新
  async formSubmit() {
    const validate = this.selectComponent("#form").validate();
    const { edit } = this.data;
    const { userRegisted } = this.data.userFilledInfo;
    if ((!userRegisted || (userRegisted && edit)) && validate) {
      let formData = this.data.data;
      formData.idType =
        typeof formData.idType == "object"
          ? formData.idType.id
          : formData.idType;
      formData.homeAddress = Array.isArray(formData.homeAddress)
        ? formData.homeAddress.join("-")
        : "";
      formData.companyAddress = Array.isArray(formData.companyAddress)
        ? formData.companyAddress.join("-")
        : "";
      formData = {
        ...formData,
        ...app.globalData.userInfo
      };
      // console.log(formData);
      if (!this.data.userFilledInfo.userRegisted) {
        saveOrUpdateUserInfo(formData).then(async data => {
          await app.refreshUserInfo();
          if(this.data.groupId && this.data.groupName) {
            wx.navigateTo({
              url: `/pages/group/shareJoin/index?zc=1&groupName=${this.data.groupName}&groupId=${this.data.groupId}`,
            });
          }else {
            wx.navigateTo({
              url: "/pages/status/index?msg=注册成功"
            });
          }          
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
    let tempData =  Object.assign({},data,{homeAddress:null,detailAddress:null,companyName:null,companyAddress:null,companyDetailAddress:null})
    // data.homeAddress = null;
    // data.detailAddress = null;
    // data.companyName = null;
    // data.companyAddress = null;
    // data.companyDetailAddress = null;
    this.setData({
      data: tempData,

    });
  },
  // 已填写设置禁用字段
  setFieldsDisable(resData = {}) {
    let fields = this.data.fields;
    // let edit = this.data.edit;
    //初始化数据后，根据idType修改正则的函数
    fields[3].props.validate = function(val) {
      return idRegs[resData.idType - 1].test(val);
    }
    let userRegisted = resData.userRegisted;
    fields.forEach(item => {
      // 控制bid显示隐藏
      if (item.prop == "bidAddress") {
        item.hide = !userRegisted;
      }
      if(item.prop=='agreement'){
        item.hide=!this.data.edit;
      }
      return (item["props"]["disable"] = userRegisted);
    });
    // 需要把服务端存的province-city-district字符串拆分成picker显示的数组
    if (resData && typeof resData.homeAddress === "string") {
      resData.homeAddress = resData.homeAddress.split("-");
      resData.companyAddress = resData.companyAddress.split("-");
    }
    
    if (userRegisted) {
      //拼接***** 表单填入新的数据
      let tempData = resData.idType==1?
      {phone: resData.phone.substr(0,3)+'****'+resData.phone.substr(7,11),idNumber: resData.idNumber.substr(0,4)+'************'+resData.idNumber.substr(16,18)}
      :{phone: resData.phone.substr(0,3)+'****'+resData.phone.substr(7,11)}
      let asteriskData =  Object.assign({},resData,tempData)
      this.setData({
        fields: fields,
        data: asteriskData,
        realData: resData,//保存下来供修改时更新数据
        asteriskData: asteriskData //保存下来供取消时更新数据
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
  //
  setFieldsEditable() {
    let fields = this.data.fields;
    let { userRegisted } = app.globalData.userFilledInfo;

    fields.forEach(item => {
      if (item.prop == 'agreement') {
        item.hide = !this.data.edit;
      }
      if (
        item.prop == "homeAddress" ||
        item.prop == "detailAddress" ||
        item.prop == "companyAddress" ||
        item.prop == "companyDetailAddress" ||
        item.prop == "companyName"
      ) {
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
    const { groupId, groupName } = options
    console.log(this.data.fields[3].props.validate);
    const { globalData } = app;
    if (!globalData.appInit) {
      app.init(globalData => {
        this.setData({
          globalData: globalData,
          userFilledInfo: globalData.userFilledInfo,
          groupId: groupId,
          groupName: groupName
        });
        this.setFieldsDisable(globalData.userFilledInfo);
      });
    } else {
      this.setData({
        globalData: globalData,
        userFilledInfo: globalData.userFilledInfo,
        groupId: groupId,
        groupName: groupName
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

  createGroup: function(e) {
    wx.navigateTo({
      url: "/pages/group/createGroup/createGroup"
    });
  }
});
