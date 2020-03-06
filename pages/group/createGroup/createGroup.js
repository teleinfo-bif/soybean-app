// pages/createGroup/createGroup.js
const app = getApp()
import { createGroup } from "../../../api/api";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true,
    groupAvatarShow: '',
    groupNotAvatarShow: '../../../static/images/group_name.png',
    groupDownloadIcon: '../../../static/images/group_download.png',
    groupLogo: '001', //logo地址
    excelFile: '',//execel地址
    applicant: '',
    phone: '',
    uploadFileName: '',//上传的文件名
    // uploadFilePath: '',//上传的文件路径，备用
    placeholder_group_name: '请输入机构名称',
    placeholder_group_address: '请选择您的机构地址',
    placeholder_group_introduce: '请输入机构介绍信息，10-200字',
    placeholder_group_strucure: '请在此处粘贴您的架构文件链接',
    placeholder_group_apply_name: '请输入您的名字',
    placeholder_group_apply_phone: '请输入您的联系方式',
    placeholder_group_file: '请选择您要上传的文件',
    region: [],
    group_address_picker: '',
    // customItem: '全部',
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
        wx.uploadFile({
          url: 'https://admin.bidspace.cn/bid-blockchain/front/ipfs/upload-photo', //仅为示例，非真实的接口地址
          filePath: tempFilePath,
          name: 'file',
          formData: {
            'bid': bid
          },
          success(res) {
            const data = res.data
            console.log("uploadImage", JSON.parse(data).data.photo)
            that.setData({
              groupLogo: JSON.parse(data).data.photo,
              groupAvatarShow: tempFilePath
            })
          },
          fail: console.error
        })
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
        // that.setData({
        //   uploadFileName: name,
        //   uploadFilePath: path
        // })
        wx.uploadFile({
          url: 'https://admin.bidspace.cn/bid-blockchain/front/ipfs/upload-photo', //仅为示例，非真实的接口地址
          filePath: path,
          name: 'file',
          formData: {
            'bid': bid
          },
          success(res) {
            const data = res.data
            console.log("uploadImage", res, JSON.parse(data), JSON.parse(data).data.photo)
            that.setData({
              uploadFileName: name,
              excelFile: JSON.parse(data).data.photo,
            })
            //do something
          }
        })
      }
    })
  },

  submitUserInfo: function (e) {
    console.log("机构提交: ", e.detail.value)
    wx.showLoading({
      title: '信息提交中',
    })

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
    } else if (e.detail.value.group_file == "") {
      warn = "请导入机构架构!"
    } else if (e.detail.value.group_applicant == "") {
      warn = "请填写您的姓名!"
    } else if (e.detail.value.group_phone == "") {
      warn = "请填写您的手机号!"
    } else {
      flag = true

      console.log("add group info to database")
      console.log(e.detail.value.group_address,
        e.detail.value.group_applicant,
        this.data.excelFile, this.data.groupLogo, e.detail.value.group_name,
        e.detail.value.group_phone, e.detail.value.group_introduce, this.data.globalData.userId)
      createGroup({
        addressName: e.detail.value.group_address,
        contact: e.detail.value.group_applicant,
        excelFile: this.data.excelFile,
        logo: this.data.groupLogo,
        name: e.detail.value.group_name,
        phone: e.detail.value.group_phone,
        remarks: e.detail.value.group_introduce,
        userId: this.data.globalData.userId,
      }).then(data => {
           console.log('1', data)
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: "提交成功，请保持手机畅通，如有问题，我们会与您联系 创建成功后您可以点击机构名称，在机构详情页分享邀请好友加入!",
            success(res) {
              if (res.confirm) {
                wx.reLaunch({
                  url: '../../index/index',
                })
              }
            }
          })
          wx.hideLoading()
        
      }).catch(e => {
        console.log(e)
        wx.showModal({
          title: '提示',
          content: "创建失败"
        })
        wx.hideLoading()
      })
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
  //需要修改成现有的
  queryUserInfo: function (e) {
    this.setData({
      applicant: this.data.userFilledInfo.name,
      phone: this.data.userFilledInfo.phone
    })
  },

  /**
   * 获取当前时间
   */

  getCurrentDateTime: function (e) {
    var date = new Date();
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    var h = (date.getHours()) < 10 ? '0' + date.getHours : date.getHours()
    var m = (date.getMinutes()) < 10 ? '0' + date.getMinutes() : + date.getMinutes()
    var s = (date.getSeconds()) < 10 ? '0' + date.getSeconds() : date.getSeconds()

    return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s
  },

  downloadStructure: function () {
    console.log('下载模板')
    let tempFileURL = "https://admin.bidspace.cn/bid-soybean/download/group.xlsx"
    wx.setClipboardData({
      data: tempFileURL,
      success: function (res) {
        wx.showToast({
          icon: 'none',
          title: "导出文件下载链接已保存到您的剪贴板"
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
  }

})