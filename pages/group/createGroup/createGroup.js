// pages/createGroup/createGroup.js
const app = getApp()
import { createGroup, fromGroupCodetoId } from "../../../api/api";
import { UploadFile } from "../../../api/upload";
import { baseURLDownload } from "../../../config/index";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true,
    groupAvatarShow: '',
    groupNotAvatarShow: '../../../static/images/group_logo.png',
    groupNameIcon: '../../../static/images/group_name.png',
    groupAddressIcon: '../../../static/images/group_address.png',
    groupAddressDetailIcon: '../../../static/images/group_address_detail.png',
    groupIntroIcon: '../../../static/images/group_intro.png',
    groupStruIcon: '../../../static/images/group_stru.png',
    groupPersonIcon: '../../../static/images/group_person.png',
    groupPhoneIcon: '../../../static/images/group_phone.png',
    groupDownloadIcon: '../../../static/images/group_download.png',
    groupLogo: '', //logo地址
    excelFile: '',//execel地址
    applicant: '',
    phone: '',
    uploadFileName: '',//上传的文件名
    // uploadFilePath: '',//上传的文件路径，备用
    placeholder_group_name: '请输入机构名称',
    placeholder_group_address: '请选择机构所在城市及区',
    placeholder_group_address_detail: '请输入机构详细地址',
    placeholder_group_introduce: '请输入机构介绍信息，10-200字',
    placeholder_group_strucure: '请在此处粘贴您的架构文件链接',
    placeholder_group_apply_name: '请输入您的名字',
    placeholder_group_apply_phone: '请输入您的联系方式',
    placeholder_group_file: '请选择您要上传的文件',
    region: [],
    group_address_picker: '',
    // customItem: '全部',
    show: true,
    dialogPicture: '../../../static/images/create_dialog.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('');
    const { globalData } = app;
    if (!globalData.appInit) {
      // await app.init();
      app.init(globalData => {
        console.log('globalData', globalData);
        this.setData({
          globalData: globalData,
          userFilledInfo: globalData.userFilledInfo
        });
        this.queryUserInfo()
      });
    } else {
      console.log('globalData', globalData);
      this.setData({
        globalData: globalData,
        userFilledInfo: globalData.userFilledInfo
      });
      this.queryUserInfo()
    }
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

  chooseImage: function () {
    const that = this;
    const bid = this.data.userFilledInfo.bidAddress
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePath = res.tempFilePaths[0]
        var key = tempFilePath.substr(tempFilePath.lastIndexOf('/') + 1)
        // console.log('tempFilePaths:', tempFilePath)
        UploadFile({
          filePath: tempFilePath,
          name: 'file',
          formData: {
            'bid': bid
          }
        }).then(data=>{
            console.log("uploadImage", JSON.parse(data).data.photo)
            that.setData({
              groupLogo: JSON.parse(data).data.photo,
              groupAvatarShow: tempFilePath
            })
        }).catch(e=>console.log(e))
      }
    })
  },

  chooseFile: function () {
    const that = this;
    const bid = this.data.userFilledInfo.bidAddress
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        const tempFile = res.tempFiles[0]
        let name = tempFile.name
        let path = tempFile.path

        UploadFile({
          filePath: path,
          name: 'file',
          formData: {
            'bid': bid
          }
        }).then(data => {
            console.log("uploadFile", JSON.parse(data).data.photo)
            that.setData({
              uploadFileName: name,
              excelFile: JSON.parse(data).data.photo,
            })
        }).catch(e=>{console.log(e)})
      }
    })
  },

  submitUserInfo: function (e) {
    const _this = this
    console.log("机构提交: ", e.detail.value)
    
    var warn = ""
    var that = this
    var flag = false

    if (e.detail.value.group_name == "") {
      warn = "请填写您的机构名称!"
    } else if (e.detail.value.group_introduce == "") {
      warn = "请填写您的机构介绍!"
    } else if (e.detail.value.group_introduce.length < 10) {
      warn = "机构介绍的字数应为10-200!"
    } else if (e.detail.value.group_address == "") {
      warn = "请选择您的机构地址!"
    } else if (e.detail.value.group_address_detail == "") {
      warn = "请填写机构详细地址!"
    } else if (e.detail.value.group_file == "") {
      warn = "请导入机构架构!"
    } else if (e.detail.value.group_applicant == "") {
      warn = "请填写您的姓名!"
    } else if (e.detail.value.group_phone == "") {
      warn = "请填写您的手机号!"
    } else {
      flag = true
      
      // wx.showLoading({
      //   title: '信息提交中',
      //   mask: true
      // })
      console.log("add group info to database")
      console.log(e.detail.value.group_address,
        e.detail.value.group_applicant,
        this.data.excelFile, this.data.groupLogo, e.detail.value.group_name,
        e.detail.value.group_phone, e.detail.value.group_introduce, this.data.globalData.userId)
      createGroup({
        addressName: e.detail.value.group_address,
        detailAddress: e.detail.value.group_address_detail,
        contact: e.detail.value.group_applicant,
        excelFile: this.data.excelFile,
        logo: this.data.groupLogo,
        name: e.detail.value.group_name,
        phone: e.detail.value.group_phone,
        remarks: e.detail.value.group_introduce,
        userId: this.data.globalData.userId,
        loading: true
      }).then(data => {
           console.log('1', data)
           let code = data;
           wx.navigateTo({
              url: `/pages/group/groupCodeShow/index?groupCode=${code}&finished=${e.detail.value.group_file}`,
           });           
      }).catch(e => {
        console.log(e)
        if(e.errMsg && e.errMsg.substr(0,12)=="request:fail") {
          wx.showToast({
            title: "创建失败，请再次尝试",
            icon: "none"
          });
        }       
        // wx.showModal({
        //   title: '创建失败',
        //   content: "如需帮助，发送邮件到service@teleinfo.cn，我们会尽快与您联系！"
        // })
      })
    }

    if (!flag) {
      // wx.showModal({
      //   title: '提示',
      //   content: warn
      // })
      wx.showToast({
        title: warn,
        icon: 'none',
      })
      // wx.hideLoading()
      return

    }
  },

  //需要修改成现有的
  queryUserInfo: function (e) {
    this.setData({
      applicant: this.data.userFilledInfo.name,
      phone: this.data.userFilledInfo.phone
    })
  },


  downloadStructure: function () {
    // this.setData({ show: false });
    console.log('下载模板',`${baseURLDownload}/download/group.xlsx`)
    let tempFileURL = `${baseURLDownload}/download/group.xlsx`
    wx.setClipboardData({
      data: tempFileURL,
      success: function (res) {
        wx.showToast({
          icon: 'none',
          title: "导出文件下载链接已保存到您的剪贴板",
          duration: 2000,
        });
      }
    })
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let region = e.detail.value;
    this.setData({
      region: e.detail.value,
      group_address_picker: `${region[0]}，${region[1]}，${region[2]}`
    })
  },
  
  onClose() {
    this.setData({ show: false });
  }
})