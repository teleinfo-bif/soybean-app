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
    groupLogo: '', //logo地址
    excelFile: '',//execel地址
    applicant: '',
    phone: '',
    uploadFileName: '',//上传的文件名
    uploadFilePath: '',//上传的文件路径，备用
    placeholder_group_name: '请输入机构名称',
    placeholder_group_address: '请输入机构地址',
    placeholder_group_introduce: '请输入机构介绍信息，10-200字',
    placeholder_group_strucure: '请在此处粘贴您的架构文件链接',
    placeholder_group_apply_name: '请输入您的名字',
    placeholder_group_apply_phone: '请输入您的联系方式',
    placeholder_group_file: '请选择您要上传的文件',
    company_count: "",//已加入几个组织
    record_id: ""
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
        console.log('globalData',globalData);
        this.setData({
          globalData: globalData,
          userFilledInfo: globalData.userFilledInfo
        });
        this.queryUserInfo()
      });
    } else {
      console.log('globalData',globalData);
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
  
  chooseImage: function() {
    const that = this;
    const bid = this.data.userFilledInfo.bidAddress
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
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
          success (res){
            const data = res.data
            console.log("uploadImage", JSON.parse(data).photo)
            that.setData({
              groupLogo: JSON.parse(data).photo,
              groupAvatarShow: tempFilePath
            })
          },
          fail: console.error
        })
      }
    })
  },

  chooseFile: function() {
    const that = this;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success (res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFile = res.tempFiles[0]
        let name = tempFile.name
        let path = tempFile.path
        that.setData({
          uploadFileName: name,
          uploadFilePath: path
        })
        wx.uploadFile({
          url: 'https://admin.bidspace.cn/bid-blockchain/front/ipfs/upload-photo', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'bid': ''
          },
          success (res){
            const data = res.data
            console.log("uploadImage", JSON.parse(data).photo)
            that.setData({
              excelFile: JSON.parse(data).photo,
            })
            //do something
          }
        })
      }
    })
    // wx.chooseImage({
    //   count: 1,
    //   sizeType: ['original', 'compressed'],
    //   sourceType: ['album', 'camera'],
    //   success (res) {
    //     const tempFilePath = res.tempFilePaths[0]
    //     var key = tempFilePath.substr(tempFilePath.lastIndexOf('/') + 1)
    //     // console.log('tempFilePaths:', tempFilePath)
    //     wx.cloud.uploadFile({
    //       cloudPath: 'groupAvatar/'+ key, // 上传至云端的路径
    //       filePath: tempFilePath, // 小程序临时文件路径
    //       success: res => {
    //         // 返回文件 ID
    //         // console.log(res.fileID)
    //         that.setData({
    //           groupAvatar: res.fileID,
    //           groupAvatarShow: tempFilePath
    //         })
    //       },
    //       fail: console.error
    //     })
    //   }
    // })
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
      warn = "请填写您的机构地址!"
    } else if (e.detail.value.group_applicant == "") {
      warn = "请填写您的姓名!"
    } else if (e.detail.value.group_phone == "") {
      warn = "请填写您的手机号!"
    } else {
      flag = true

    console.log("add group info to database")
    createGroup()
    createGroup({
      addressName: e.detail.value.group_address,
      contact: e.detail.value.group_applicant,
      excelFile: "",
      logo: this.data.groupLogo,
      name: e.detail.value.group_name,
      phone: e.detail.value.group_phone,
      remarks: e.detail.value.group_introduce,
      userId: this.data.globalData.userId,
    }).then(data => {
      // 判断是不是第一次请求,current已经加一，处理iOS滑到底部可以频繁请求多次出发的问题
      if (memberData.total != undefined && current == data.current) {
        let memerList = memberData.records.concat(data.records);
        this.setData({
          memberData: {
            ...data,
            records: memerList
          }
        });
      } else {
        this.setData({
          memberData: data
        });
      }
    });
    return

    db.collection("applications_info").add({
        data: {
          userId: this.data.globalData.userId,
          name: e.detail.value.group_name,
          remarks: e.detail.value.group_introduce,
          excelFile: "",
          contact: e.detail.value.group_applicant,
          phone: e.detail.value.group_phone,
          logo: this.data.groupLogo,
          // address: e.detail.value.group_address,
          // status: "waiting",//wating等待审核finish创建完成reject拒绝
        },
        success: res => {
          console.log('1',res)
            wx.showModal({
              showCancel: false,
              title: '提示',
              content: "提交成功，请保持手机畅通，如有问题，我们会与您联系 创建成功后您可以点击机构名称，在机构详情页分享邀请好友加入!",
              success(res){
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../index/index',
                  })
                }
              }
            })
            wx.hideLoading()
        },
        fail: err => {
          console.log(err)
          wx.showModal({
            title: '提示',
            content: "创建失败"
          })
          wx.hideLoading()
        }
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
  queryUserInfo: function(e) {
    this.setData({
      applicant: this.data.userFilledInfo.name,
      phone: this.data.userFilledInfo.phone
    })

    
    // db.collection('user_info').where({
    //   _openid: app.globalData.openid
    //   // _openid: "oqME_5ae8IUfGQKBrp-O6Ou6nHdg"
    // }).get({
    //     success: res => {
    //       console.log(res.data)
    //       this.setData({
    //         applicant: res.data[0].name,
    //         phone: res.data[0].phone,
    //         company_count: res.data[0].company_count,
    //         record_id: res.data[0]._id
    //       })
    //     },
    //     fail: err => {
    //       console.log(err)
    //     }
    //   })
  },

  /**
   * 获取当前时间
   */

  getCurrentDateTime: function(e) {
    var date = new Date();
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    var h = (date.getHours()) < 10 ? '0' + date.getHours : date.getHours()
    var m = (date.getMinutes()) < 10 ? '0' + date.getMinutes() : + date.getMinutes()
    var s = (date.getSeconds()) < 10 ? '0' + date.getSeconds() : date.getSeconds()

    return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s
  },

  downloadStructure: function() {
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
    //等待后端接口
    // wx.cloud.getTempFileURL({
    //   fileList: [{
    //     fileID: 'cloud://soybean-uat.736f-soybean-uat-1301333180/单位机构架构模板.xls',
    //     maxAge: 60 * 60, // one hour
    //   }]
    // }).then(res => {
    //   // get temp file URL
    //   console.log(res.fileList)
    //   let tempFileURL = res.fileList[0].tempFileURL
    //   wx.setClipboardData({
    //     data: tempFileURL,
    //     success: function (res) {
    //       wx.showToast({
    //         icon: 'none',
    //         title: "导出文件下载链接已保存到您的剪贴板"
    //       });
    //     }
    //   })
    // }).catch(error => {
    //   // handle error
    // })
  },

})