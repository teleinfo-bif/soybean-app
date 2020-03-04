// pages/createGroup/createGroup.js
const app = getApp()
const db = wx.cloud.database({
  env: "xinertong-uat"
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupAvatarShow: '',
    groupAvatar: '',
    applicant: '',
    phone: '',
    placeholder_group_name: '请输入机构名称',
    placeholder_group_introduce: '请输入机构介绍信息，10-200字',
    placeholder_group_strucure: '请在此处粘贴您的架构文件链接',
    placeholder_group_apply_name: '请输入您的名字',
    placeholder_group_apply_phone: '请输入您的联系方式',
    company_count: "",//已加入几个组织
    record_id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryUserInfo()
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
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        const tempFilePath = res.tempFilePaths[0]
        var key = tempFilePath.substr(tempFilePath.lastIndexOf('/') + 1)
        // console.log('tempFilePaths:', tempFilePath)
        wx.cloud.uploadFile({
          cloudPath: 'groupAvatar/'+ key, // 上传至云端的路径
          filePath: tempFilePath, // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            // console.log(res.fileID)
            that.setData({
              groupAvatar: res.fileID,
              groupAvatarShow: tempFilePath
            })
          },
          fail: console.error
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
    } else if (e.detail.value.group_applicant == "") {
      warn = "请填写您的姓名!"
    } else if (e.detail.value.group_phone == "") {
      warn = "请填写您的手机号!"
    } else {
      flag = true

    console.log("add group info to database")
    db.collection("applications_info").add({
        data: {
          created_at: that.getCurrentDateTime(),
          name: e.detail.value.group_name,
          introduce: e.detail.value.group_introduce,
          strucure: "",
          applicant: e.detail.value.group_applicant,
          phone: e.detail.value.group_phone,
          avatar: this.data.groupAvatar,
          status: "waiting",//wating等待审核finish创建完成reject拒绝
        },
        success: res => {
          console.log('1',res)
          db.collection("company_info").add({
            data: {
              company_name: e.detail.value.group_name,
              departments: [],
              name: ""
            },
            success: res => {
              console.log('2',res)
              var count = 0
              var company_department = ""
              var usertype = ""
              if(this.data.company_count==undefined){
                  count = 2
                  company_department = "company_department" + "1"
                  usertype = "usertype" + "1"
              }else {
                company_department = `company_department${this.data.company_count}`
                usertype = `usertype${this.data.company_count}`
                count = this.data.company_count + 1               
              }
              db.collection("user_info").doc(this.data.record_id).update({
                  data: {
                    company_count: count,
                    [company_department] : e.detail.value.group_name,
                    [usertype]: "1"
                  },
                  success: res => {
                    console.log('3',res)

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

  queryUserInfo: function(e) {
    console.log("openid: ", app.globalData.openid)
    db.collection('user_info').where({
      _openid: app.globalData.openid
      // _openid: "oqME_5ae8IUfGQKBrp-O6Ou6nHdg"
    }).get({
        success: res => {
          console.log(res.data)
          this.setData({
            applicant: res.data[0].name,
            phone: res.data[0].phone,
            company_count: res.data[0].company_count,
            record_id: res.data[0]._id
          })
          // console.log('w',this.data.company_count==undefined)
        },
        fail: err => {
          console.log(err)
        }
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
    var h = (date.getHours()) < 10 ? '0' + date.getHours : date.getHours()
    var m = (date.getMinutes()) < 10 ? '0' + date.getMinutes() : + date.getMinutes()
    var s = (date.getSeconds()) < 10 ? '0' + date.getSeconds() : date.getSeconds()

    return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s
  },

  downloadStructure: function() {
    console.log('下载模板')
    wx.cloud.getTempFileURL({
      fileList: [{
        fileID: 'cloud://xinertong-uat.736f-xinertong-uat-1301333180/单位机构架构模板.xls',
        maxAge: 60 * 60, // one hour
      }]
    }).then(res => {
      // get temp file URL
      console.log(res.fileList)
      let tempFileURL = res.fileList[0].tempFileURL
      wx.setClipboardData({
        data: tempFileURL,
        success: function (res) {
          wx.showToast({
            icon: 'none',
            title: "导出文件下载链接已保存到您的剪贴板"
          });
        }
      })
    }).catch(error => {
      // handle error
    })
  },

})