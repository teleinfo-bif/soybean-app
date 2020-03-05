// miniprogram/pages/personalInfo/personal.js
const app = getApp()

const db = wx.cloud.database({
  env: "xinertong-uat"
})

// const cloud = require('wx-server-sdk')
// cloud.init()

var utils = require('../../utils/utils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    company_region: ["", "", ""],
    home_region: ["", "", ""],

    certificate_type: ["员工号", "身份证号"],
    certificate_type_index: 0,
    certificate_number:"",
    bid_address: "",
    private_key: "",
    secretcheckbox: "",
    
    // multiArray: [["工业互联网与物联网研究所","安全研究所", "泰尔系统实验室"], ["技术研究部", "系统开发部", "运行维护部", "标识业务管理中心", "业务发展部", "国际拓展部", "品牌市场部", "互联网治理研究中心","综合管理部"]],
    multiArray: [["请选择", "院领导", "老领导", "办公室（保密办公室）"], [""]],
    multiIndex: [0, 0],
    companies: [],
    departments: [],

    personal_info_change: "personal-change-hide",
    user_info_data: {},
    disabled: false,
    forever_disabled: false,
    choice_color: "color: #1759EF",
    choice_color_1: "color: #1759EF",
    forever_choice_color: "color: #1759EF",
    record_id: "",
    placeholder_name: "请输入姓名",
    placeholder_phone: "请输入手机号码",
    placeholder_phone_show: "",
    placeholder_card_type: "选择证件类型",
    placeholder_card_number: "员工号",
    placeholder_card_number_show: "",
    placeholder_company_name: "请选择单位及部门",
    placeholder_company_district: "请选择单位所在城市及区",
    placeholder_company_detail: "请输入单位详细地址",
    placeholder_home_district: "请选择家庭所在城市及区",
    placeholder_home_detail: "请输入家庭详细地址",
    placeholder_company_name_0:"请选择公司名称",

    value_name: "",
    value_phone: "",
    value_card_type: "员工号",
    value_card_number: "",
    value_company_name: "",
    value_company_district: "",
    value_company_detail: "",
    value_home_district: "",
    value_home_detail: "",
    value_company_name_0:"",

    buttons_display: "display: flex",
    phone_display: "display: block",

    healthyDatas: [],
    company_name_items:['中国信息通信研究院'],
    isFisrtNoFlag:true,
    if_checked: false

  },

  resetBtn(){
    console.log('&&&reset***')
    this.setData({
      placeholder_company_name:'',
      placeholder_company_name_0: '',
      placeholder_company_district:'',
      placeholder_company_detail:'',
      placeholder_home_district:'',
      placeholder_home_detail:''
    })
  },

  gotoUserSecret: function (e) {
    wx.navigateTo({
      url: '../about/about'
    })
  },

  boxcheck: function(e) {
    console.log("box change: ", e.detail.value)
    var flag = false
    if (e.detail.value.length != 0) {
      flag = true
    }
    this.setData({
      if_checked: flag
    })

    console.log("if check: ", this.data.if_checked)
  },
  /** 
   * 身份验证相关
   */

  // 大陆身份证验证
  idCardValid: function(e) {

    console.log("验证身份证")
    var id = this.data.certificate_number
    // 1 "验证通过!", 0 //校验不通过
    var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
    //号码规则校验
    if (!format.test(id)) {
      return false
    }
    //区位码校验
    //出生年月日校验   前正则限制起始年份为1900;
    var year = id.substr(6, 4),//身份证年
      month = id.substr(10, 2),//身份证月
      date = id.substr(12, 2),//身份证日
      time = Date.parse(month + '-' + date + '-' + year),//身份证日期时间戳date
      now_time = Date.parse(new Date()),//当前时间戳
      dates = (new Date(year, month, 0)).getDate();//身份证当月天数
    if (time > now_time || date > dates) {
      return false
    }
    //校验码判断
    var c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);   //系数
    var b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');  //校验码对照表
    var id_array = id.split("");
    var sum = 0;
    for (var k = 0; k < 17; k++) {
      sum += parseInt(id_array[k]) * parseInt(c[k]);
    }
    if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
      return false
    }
    return true;
  },

  workIdVerify: function(e) {
    // todo 验证员工号具体内容
    return true
  },

  // 香港省份证验证
  // isHKCard: function(e) {
  //   // 港澳居民来往内地通行证
  //   // 规则： H/M + 10位或6位数字
  //   // 样本： H1234567890
  //   var card = this.data.certificate_number
  //   var reg = /^([A-Z]\d{6,10}(\(\w{1}\))?)$/;
  //   if (!reg.test(card)) {
  //     return false;
  //   } 
  //   return true 
  // },

  // 台湾身份证验证
  // isTWCard: function(e) {
  //   // 台湾居民来往大陆通行证
  //   // 规则： 新版8位或18位数字， 旧版10位数字 + 英文字母
  //   // 样本： 12345678 或 1234567890B
  //   var card = this.data.certificate_number
  //   var reg = /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/;
  //   if (!reg.test(card)){
  //     return false;
  //   } 
  //   return true 
  // },

  
  // 军官证正则表达式
  // isOfficerCard: function(e) {
  //   // 军官证
  //   // 规则： 军/兵/士/文/职/广/（其他中文） + "字第" + 4到8位字母或数字 + "号"
  //   // 样本： 军字第2001988号, 士字第P011816X号
  //   var card = this.data.certificate_number
  //   var reg = /^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/;
  //   if (!reg.test(card)) {
  //     return false;
  //   } 
  //   return true
  // },

  // 护照验证
  // isPassPortCard: function (e) {
  //   // 护照
  //   // 规则： 14/15开头 + 7位数字, G + 8位数字, P + 7位数字, S/D + 7或8位数字,等
  //   // 样本： 141234567, G12345678, P1234567
  //   var card = this.data.certificate_number
  //   var reg = /^([a-zA-z]|[0-9]){5,17}$/;
  //   if (!reg.test(card)) {
  //     return false;
  //   } 
  //   return true
  // },


  isCardValid: function(e) {
    var warn = ""
    var that = this
    var index = that.data.certificate_type_index
    console.log("card verify function: id index " + index)

    switch(index){
      case 0:
      if (!that.workIdVerify()) {
        warn = "员工号格式错误!"
      }
      break;
      
      case 1:

      if (!that.idCardValid()) {
        console.log("hello 大陆")
        warn = "大陆身份证格式错误!"
      }
      break;

      // case 2:
      // if (!that.isTWCard()) {
      //   warn = "台湾身份证格式错误!"
      // }
      // break;

      // case 3:
      // if (!that.isOfficerCard()){
      //   warn = "军官证格式错误!"
      // }
      // break;

      // case 4:
      // if (!that.isPassPortCard()) {
      //   warn = "护照格式错误!"
      // }
      // break;
    }

    return warn;
  },


  getCardType: function(e) {

    for (var i = 0; i < this.data.certificate_type.length; i++) {
      // console.log(this.data.placeholder_card_number)
      // console.log(this.data.certificate_type[i])
      if (this.data.placeholder_card_type == this.data.certificate_type[i]){
        return i
      }
    }

    return -1
  },



  /**
   *  身份类型选择
   */

  bindCertificatePickerChange: function(e) {
    this.setData({
      certificate_type_index: parseInt(e.detail.value),
      value_card_type: this.data.certificate_type[e.detail.value],
      placeholder_card_number: this.data.certificate_type[e.detail.value]
    })

    console.log(this.data.value_card_type)
  },

  //一级单位名称
  // companyName0PickerChange: function (e) {
  //   this.setData({
  //     company_name_0_index: parseInt(e.detail.value),
  //     value_company_name_0: this.data.company_name_items[e.detail.value]
  //   })
  //   if (e.detail.value == 1){
  //     this.setData({
  //       isFisrtNoFlag: true,
  //       choice_color_1: "color: #999999"
  //     })
  //   } else if (e.detail.value == 0) {
  //     this.setData({
  //       isFisrtNoFlag: false,
  //       choice_color_1: "color: #1759EF"
  //     })
  //   }
  //   console.log(this.data.value_company_name_0)
  // },
  /**
   * 单位部门的选择
   */

  bindMultiPickerChange: function(e) {
    
    console.log(this.data.multiIndex)
    if (this.data.multiArray[1][this.data.multiIndex[1]] == undefined){
      this.data.multiArray[1][this.data.multiIndex[1]] = ""
    }
    this.setData({
      multiIndex: e.detail.value,
      value_company_name: this.data.multiArray[0][this.data.multiIndex[0]] + " " + this.data.multiArray[1][this.data.multiIndex[1]]
    })
  },

  /**
   * 单位部门列触发调用
   */

  bindMultiPickerColumnChange: function(e) {
    // multiIndex: e.detail.value
    // console.log(this.data.multiIndex)
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    data.multiArray[0] = this.data.companies
    data.multiIndex[e.detail.column] = e.detail.value;

    switch(e.detail.column) {
      case 0:
        data.multiArray[1] = this.data.departments[data.multiIndex[0]]

        // switch(i){
        //   for (var i = 0; i < this.data.departments.length;) {

        //     case i:
        //       data.multiArray[1] = this.data.departments[i]
        //       break
        //   }
        // }
        data.multiIndex[1] = 0
        break

    }

    this.setData(data)
    
  },

  /**
   * 单位城市地区的选择
   */

  bindCompanyRegionChange: function(res) {
    console.log(res)
    this.setData({
      company_region: res.detail.value, 
      value_company_district: res.detail.value[0] + " " + res.detail.value[1] + " " + res.detail.value[2]
    })

    console.log(this.data.value_company_district)
  },

  /**
   * 家庭城市地区的选择
   */

  bindHomeRegionChange: function (res) {
    console.log(res)
    this.setData({
      home_region: res.detail.value,
      value_home_district: res.detail.value[0] + " " + res.detail.value[1] + " " + res.detail.value[2]
    })
  },

  /**
   * 获取当前时间
   */

  getCurrentDateTime: function(e) {
    var date = new Date();
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    var h = (date.getHours()) < 10 ? '0' + date.getHours() : date.getHours()
    var m = (date.getMinutes()) < 10 ? '0' + date.getMinutes() : + date.getMinutes()
    var s = (date.getSeconds()) < 10 ? '0' + date.getSeconds() : date.getSeconds()

    return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s
  },

    /**
   * 生成bid地址
   */

  getBidAddress: function(e) {

    if (this.data.bid_address != undefined && this.data.bid_address != "") {
      console.log("current bid address: ", this.data.bid_address)
      return
    }

    console.log("generate bid address")
    wx.cloud.callFunction({
      name: "generateAddress",
      data: {},
      success: res => {
        console.log("generate bid address: ", res)
        console.log( `bid_address: ${res.result.address}, privateKey: ${res.result.privateKey}`)
        this.setData({
          bid_address: res.result.address,
          private_key: res.result.privateKey,
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  /**
   *  从数据库中获取各单位及相应部门名称
   */

  getCompanyDepartments: function(e) {

    /**
     * 通过本地小程序调用最多获取20条数据
     */
    // db.collection("company_info").get({
    //   success: res => {
    //     console.log(res.data)
    //     var first = []
    //     var second = []
      
    //     for (var i = 0; i < res.data.length; i++) {
    //       var item = res.data[i]
    //       first.push(item.name)
    //       second.push(item.departments)
    //     }

    //     this.setData({
    //       companies: first,
    //       departments: second,
    //     })
    //   },

    //   fail: res => {
    //     console.log(res)
    //   }
    // })

    /**
     * 通过云函数调用可以获取全部45条的数据
     */

    wx.cloud.callFunction({
      name: "getCompany",
      success: res => {
        console.log(res)
        var first = []
        var second = []

        for (var i = 0; i < res.result.length; i++) {
          var item = res.result[i]
          first.push(item.name)
          second.push(item.departments)
        }

        this.setData({
          companies: first,
          departments: second,
        })
      },

      fail: err => {
        console.log(err)
      }
    })
  },

  /**
   *  首次登录先获取用户信息是否存在
   */

  queryUserInfo: function(e) {
    console.log("openid: ", app.globalData.openid)
    db.collection('user_info').where({
      _openid: app.globalData.openid
      // _id: "e30d61715e4fb437020bb81b754a6f6d"
    }).get({
        success: res => {
          if (res.data.length == 0) {
            this.setData({
              secretcheckbox: "secret-checkbox-show",
            })
            this.getBidAddress()
          }

          var hide = utils.toHide(res.data[0].phone)
          var idHide = ""

          console.log("card type: ", )
          
          if (res.data[0].certificate_type == "身份证号" || res.data[0].certificate_type == "大陆身份证"){
            idHide = this.toHide(res.data[0].certificate_number)
          }else {
            idHide = res.data[0].certificate_number
          }

          this.setData({
            value_card_type: "",
            user_info_data: res.data[0],
            record_id: res.data[0]._id,
            placeholder_name: res.data[0].name,
            placeholder_phone: hide,
            placeholder_phone_show: res.data[0].phone,
            placeholder_card_number_show: res.data[0].certificate_number,
            placeholder_card_type: res.data[0].certificate_type,
            placeholder_card_number: idHide,
            bid_address: res.data[0].bid_address,
            private_key: res.data[0].private_key,
            placeholder_company_name: res.data[0].company_department,
            placeholder_company_district: res.data[0].company_district,
            placeholder_company_detail: res.data[0].company_detail,
            placeholder_home_district: res.data[0].home_district,
            placeholder_home_detail: res.data[0].home_detail,
            placeholder_company_name_0: res.data[0].company_name,
            disabled: true,
            forever_disabled: true,
            choice_color: "color: #999999",
            choice_color_1: "color: #999999",
            forever_choice_color: "color: #999999",
            personal_info_change: "personal-change-show",
            secretcheckbox: "secret-checkbox-hide",
            buttons_display: "display: none",
            phone_display: "display: none"
          })
          
          if (res.data.length > 0 || this.data.bid_address == undefined  || this.data.bid_address == "") {
            this.getBidAddress()
          }

          wx.showToast({
            icon: 'success',
            title: '信息已录入!'
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.log(err)
        }
      })
  },

  
  /**
   * 个人修改信息按钮触发调用
   */
  personalInfoChange: function(res) {
    this.setData({
      disabled: false,
      choice_color: "color: #1759EF",
      choice_color_1: "color: #1759EF",
      isFisrtNoFlag:false,
      // value_name: this.data.placeholder_name,
      // value_phone: this.data.placeholder_phone,
      // value_card_type: this.data.placeholder_card_type,
      // value_card_number: this.data.placeholder_card_number,
      placeholder_phone: this.data.placeholder_phone_show,
      placeholder_card_number: this.data.placeholder_card_number_show,
      value_company_name: this.data.placeholder_company_name,
      value_company_district: this.data.placeholder_company_district,
      value_company_detail: this.data.placeholder_company_detail,
      value_home_district: this.data.placeholder_home_district,
      value_home_detail: this.data.placeholder_home_detail,

      certificate_type_index: this.getCardType(),
      buttons_display: "display: flex",
      isFisrtNoFlag:false,
      secretcheckbox: "secret-checkbox-show",
      if_checked: false

    })
    if (this.data.placeholder_company_name_0 == '无') {
      this.setData({
        isFisrtNoFlag: true,
        choice_color_1: "color: #999999",
      })
    } else {
      this.setData({
        isFisrtNoFlag: false,
        choice_color_1: "color: #1759EF",
      })
    }

    console.log(this.data.certificate_type_index)
  },


  /**
   * 基本信息报表提交
   */

  submitUserInfo: function(e) {

    wx.showLoading({
      title: '信息提交中',
    })

    this.setData({
      certificate_number: e.detail.value.certificate_number
    })

    var warn = ""
    var that = this
    var flag = false
    var cardValid = that.isCardValid()

    console.log("card varify ret: " + cardValid)

    if (e.detail.value.name == "" && this.data.personal_info_change == "personal-change-hide") {
      warn = "请填写您的姓名!"
    } else if (e.detail.value.phone == "" && this.data.personal_info_change == "personal-change-hide"){
      warn = "请填写您的手机号!"
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value.phone)) && this.data.personal_info_change == "personal-change-hide"){
      warn = "您的手机号码格式不正确!"
    } else if (e.detail.value.certificate_type == "" && this.data.personal_info_change == "personal-change-hide"){
      warn = "请选择您的证件类型!"
    } else if (e.detail.value.certificate_number == "" && this.data.personal_info_change == "personal-change-hide"){
      warn = "请输入您的证件号码!"
    } else if (cardValid != "" && this.data.personal_info_change == "personal-change-hide"){
      warn = cardValid
      
    } else if (e.detail.value.company_name == ""){
      warn = "请选择您的单位及部门!"
    } else if (e.detail.value.company_location == "") {
      warn = "请选择您的单位所在地区!"
    } else if (e.detail.value.company_detail == "") {
      warn = "请输入您的单位详细地址!"
    } /* else if (e.detail.value.home_location == "") {
      warn = "请选择您的家庭所在地区!"
    }  else if (e.detail.value.home_detail == "") {
      warn = "请输入您的家庭详细地址"
    }  */
    else if (!this.data.if_checked) {
      warn = "请选择同意用户服务条款及隐私协议"
    }
    else {
      flag = true 


      if (this.data.personal_info_change == "personal-change-hide") {
          console.log("add user info to database")
          db.collection("user_info").add({
            data: {
            created_at: that.getCurrentDateTime(),
            updated_at: that.getCurrentDateTime(),
            name: e.detail.value.name,
            phone: e.detail.value.phone,
            certificate_type: e.detail.value.certificate_type,
            certificate_number: e.detail.value.certificate_number,
            bid_address: e.detail.value.bid_address,
            private_key: that.data.private_key,
            company_department: e.detail.value.company_name,
            company_district: e.detail.value.company_location,
            company_detail: e.detail.value.company_detail,
            home_district: e.detail.value.home_location,
            home_detail: e.detail.value.home_detail,
            usertype:'0',
            company_name: e.detail.value.company_name_0,
          },
            success: res=> {
        
              wx.navigateTo({
                url: '../../pages/msg/msg_success',
              })
              wx.hideLoading()
            },

            fail: err => {

              console.log(err)
              wx.navigateTo({
                url: '../../pages/msg/msg_fail',
              })
              wx.hideLoading()
            }      
         })
      }

      else if (this.data.personal_info_change == "personal-change-show") {
        console.log("update user info to database")
        db.collection('user_info').doc(this.data.record_id).update({
          data: {
            updated_at: that.getCurrentDateTime(),
            // name: e.detail.value.name,
            // phone: e.detail.value.phone,
            // certificate_type: e.detail.value.certificate_type,
            // certificate_number: e.detail.value.certificate_number,
            bid_address: e.detail.value.bid_address,
            private_key: that.data.private_key,
            company_department: e.detail.value.company_name,
            company_district: e.detail.value.company_location,
            company_detail: e.detail.value.company_detail,
            home_district: e.detail.value.home_location,
            home_detail: e.detail.value.home_detail,
            company_name: e.detail.value.company_name_0
          },

          success: res => {
            console.log(res)

            wx.navigateTo({
              url: '../../pages/modifySuccess/modifySuccess',
            })
            wx.hideLoading()
          },

          fail: err => {
            console.error('[数据库] [更新记录] 失败：', err)
            wx.navigateTo({
              url: '../../pages/msg/msg_fail',
            })
            wx.hideLoading()
          }
        })

      }
    }

    if (!flag) {
      wx.showModal({
        title: '提示',
        content: warn
      })
      wx.hideLoading()
      return

    }
  },


  /** 
   * 获取sessionCode和openid 
   */

  getSessionCode: function (e) {
    let that = this;
    wx.login({
      success(res) {
        if (res.code) {
          console.log(res)
          //发起网络请求
          app.globalData.sessionCode = res.code
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  /**
   * 获取手机号码
   */

  getPhoneNumber: function (e) {

    var that = this;
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        content: '不能获取手机号码',
        showCancel: false
      })
      return;
    }
    wx.showLoading({
      title: '获取手机号中...',
    })

    wx.cloud.callFunction({
      name: 'getToken',  // 对应云函数名
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionCode: app.globalData.sessionCode    // 这个通过wx.login获取，去了解一下就知道。这不多描述
      },
      success: res => {
        wx.hideLoading()
        // 成功拿到手机号，跳转首页
        console.log(res.result.data);
        app.globalData.phoneNumber = res.result.data.phoneNumber
        this.setData({
          value_phone: res.result.data.phoneNumber
        })
      },
      fail: err => {
        console.error(err);
        wx.showToast({
          title: '获取手机号失败',
          icon: 'none'
        })
      }
    })

  },
  
  toHide:function (array) {
    var mphone = array.substring(0, 4) + '************' + array.substring(16);
    return mphone;
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // wx.cloud.callFunction({
    //   name: "twoLevelDatas",
    //   data: {
    //     date: '2020-02-28',
    //     company_department: "工业互联网与物联网研究所 系统开发部"
    //   },

    //   success: res => {
    //     console.log("res result: ", res.result)
    //   },

    //   fail: err => {
    //     console.log("error: ", err)
    //   }
    // })
  
    this.queryUserInfo()
    this.getCompanyDepartments()
    this.getSessionCode()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }


  createGroup: function (e) {
    console.log("跳转创建组织页面")
    const db = wx.cloud.database()
    db.collection('user_info').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        console.log(res)
        if (res.data.length > 0) {
          wx.navigateTo({
            url: '../createGroup/createGroup'
          })
          // db.collection('applications_info').where({
          //   _openid: app.globalData.openid,
          //   status: 'waiting'
          // }).get({
          //   success: res => {
          //     console.log('application:',res)
          //     if (res.data.length > 0) {
          //       wx.showToast({
          //         icon: 'none',
          //         title: '您有待审核的创建群组申请'
          //       })           
          //     } else {
          //       wx.navigateTo({
          //         url: '../createGroup/createGroup'
          //       })
          //     }
          //   },
          //   fail: err => {
          //     wx.showToast({
          //       icon: 'none',
          //       title: '请稍后'
          //     })
          //     console.log(err)
          //   }
          // })
        } else {
          wx.showToast({
            icon: 'none',
            title: '请先录入用户信息'
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '请稍后'
        })
        console.log(err)
      }
    })
  },


})