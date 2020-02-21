// miniprogram/pages/personalInfo/personal.js
const db = wx.cloud.database({
  env: "soybean-uat"
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    company_region: ["", "", ""],
    home_region: ["", "", ""],
    company_district: "",
    home_district: "",

    certificate_type: ["大陆身份证", "港澳身份证","台湾身份证", "军官证", "护照"],
    certificate_type_choose: "",
    certificate_type_index: 0,
    certificate_number:"",
    
    multiArray: [["单位1", "单位2"], ["研发部", "财务部", "行政部", "市场部", "人力部"]],
    multiIndex: [0, 0],
    company_department_choose: "",
  },

  chooseCertificate: function(e){
    console.log(e)
    console.log("hello choose certificate")
  },

  bindCertificatePickerChange: function(e) {
    this.setData({
      certificate_type_index: e.detail.value,
      certificate_type_choose: this.data.certificate_type[e.detail.value]
    })

    console.log(this.data.certificate_type_choose)
  },

  bindMultiPickerChange: function(e) {
    multiIndex: e.detail.value
    console.log(this.data.multiIndex)
    this.setData({
      company_department_choose: this.data.multiArray[0][this.data.multiIndex[0]] + " " + this.data.multiArray[1][this.data.multiIndex[1]]
    })
  },

  bindMultiPickerColumnChange: function(e) {
    // multiIndex: e.detail.value
    // console.log(this.data.multiIndex)
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    data.multiIndex[e.detail.column] = e.detail.value;

    switch(e.detail.column) {
      case 0:
        switch(data.multiIndex[0]){
          case 0:
            data.multiArray[1] = ["研发部", "财务部", "行政部", "市场部"]
            break
          case 1:
            data.multiArray[1] = ["研发部", "财务部", "行政部", "市场部", "其他部门"]
            break
        }
        break
    }

    this.setData(data)
    // this.setData({
    //   company_department_choose: this.multiArray[0][this.multiIndex[0]] + " " + this.multiArray[1][this.multiIndex[1]]
    // })
  },

  
  bindCompanyRegionChange: function(res) {
    console.log(res)
    this.setData({
      company_region: res.detail.value, 
      company_district: res.detail.value[0] + " " + res.detail.value[1] + " " + res.detail.value[2]
    })

    console.log(this.data.company_district)
  },

  bindHomeRegionChange: function (res) {
    console.log(res)
    this.setData({
      home_region: res.detail.value,
      home_district: res.detail.value[0] + " " + res.detail.value[1] + " " + res.detail.value[2]
    })
  },

  submitUserInfo: function(e) {
    console.log(e)

    this.setData({
      certificate_number: e.detail.value.certificate_number
    })

    var warn = ""
    var flag = false

    if (e.detail.value.name == "") {
      warn = "请填写您的姓名!"
    } else if (e.detail.value.phone == ""){
      warn = "请填写您的手机号!"
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value.phone))){
      warn = "您的手机号码格式不正确!"
    } else if (e.detail.value.certificate_type == ""){
      warn = "请选择您的证件类型!"
    } else if (e.detail.value.certificate_number == ""){
      warn = "请输入您的证件号码!"
    // } else if (this.data.certificate_type_index == 0) {
    //   var idcard = e.detail.value.certificate_number
    //   if (!idCardValid()){
    //     warn = "大陆身份证号码格式错误!"
    //   }
    }
    else if (e.detail.value.company_name == ""){
      warn = "请选择您的单位及部门!"
    } else if (e.detail.value.company_location == "") {
      warn = "请选择您的单位所在地区!"
    } else if (e.detail.value.company_detail == "") {
      warn = "请输入您的单位详细地址!"
    } else if (e.detail.value.home_location == "") {
      warn = "请选择您的家庭所在地区!"
    } else if (e.detail.value.home_detail == "") {
      warn = "请输入您的家庭详细地址"
    } else {
      flag = true 
    db.collection("user_info").add({
      data: {
        name: e.detail.value.name,
        phone: e.detail.value.phone,
        certificate_type: e.detail.value.certificate_type,
        certificate_number: e.detail.value.certificate_number,
        company_department: e.detail.value.company_name,
        company_district: e.detail.value.company_location,
        company_detail: e.detail.value.company_detail,
        home_district: e.detail.value.home_location,
        home_detail: e.detail.value.home_detail
      },

      success: res=> {
        console.log(res)
        
        wx.navigateTo({
          url: '/pages/submitSuccess/submitSuccess',
        })
        

      },

      fail: err => {
        console.log(err)
      }      
    })

    }

    if (!flag ) {
      wx.showModal({
        title: '提示',
        content: warn
      })

    }
  },


  idCardValid: function(e){

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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
  onShareAppMessage: function () {

  }
})