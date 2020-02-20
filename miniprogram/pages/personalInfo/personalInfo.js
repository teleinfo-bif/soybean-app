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

    certificate_type: ["身份证", "护照"],
    certificate_type_choose: "",
    
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
    } else if (e.detail.value.company_name == ""){
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (!wx.cloud) {
    //   console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    // } else {
    //   wx.cloud.init({
    //     traceUser: true,
    //     env: 'soybean-uat'
    //   })
    // }
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