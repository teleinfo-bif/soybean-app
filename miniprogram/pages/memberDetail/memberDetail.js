// pages/detail/detail.js

const db = wx.cloud.database({
  env: "soybean-uat"
})

function getCurrentDay() {
  let date = new Date();
  let seperator1 = "-";
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  let currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}

function getTotalUserIds() {
  const _ = db.command
  let ids = new Array()
  let myMap = new Map()
  db.collection('user_info').where({
    _openid: _.neq("")
  }).get({
    success: res => {
      console.log(res)
      for (let i = 0; i < res.data.length; i++) {
        myMap.set(res.data[i]._openid, res.data[i])
      }
      
      for (let item of myMap.keys()) {
        ids.push(item)
      }

      console.log("total user count :" + ids.length)
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
      console.log(err)
    }
  })

  return ids
}

function getTotalUserInfos() {
  const _ = db.command
  let userInfoMap = new Map()
  db.collection('user_info').where({
    _openid: _.neq("")
  }).get({
    success: res => {
      console.log(res)
      for (let i = 0; i < res.data.length; i++) {
        userInfoMap.set(res.data[i]._openid, res.data[i])
      }

      console.log("total user count :" + userInfoMap.size)
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
      console.log(err)
    }
  })

  return userInfoMap
}

function getClockedIn(currentDate) {
  const _ = db.command
  let clockedInMap = new Map()

  db.collection('user_healthy').where({
    date: currentDate,
  }).get({
    success: res => {
      console.log(res)
      for (let i = 0; i < res.data.length; i++) {
        clockedInMap.set(res.data[i]._openid, res.data[i])
      }
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
      console.log(err)
    }
  })

  return clockedInMap
}

let emptyNode = {
  id: 0,
  text: "--",
  clockin: "--",
  status: "--"
}

var treeData = {
  text: 'teleinfo研发部门',
  id: 0,
  date: getCurrentDay(),
  nodes: [emptyNode]
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    treeData: treeData,
  },

  //事件处理函数
  tapItem: function (e) {
    console.log('index接收到的itemid: ' + e.detail.itemid);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onReady: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: function () {
    const _ = db.command
    let currentDate = getCurrentDay()
    let userInfoMap = new Map()
    let clockedInMap = new Map()

    db.collection('user_info').where({
      _openid: _.neq("")
    }).get({
      success: res => {
        console.log(res)
        for (let i = 0; i < res.data.length; i++) {
          userInfoMap.set(res.data[i]._openid, res.data[i])
        }

        console.log("total user count :" + userInfoMap.size)

        db.collection('user_healthy').where({
          date: currentDate,
        }).get({
          success: res => {
            console.log(res)
            for (let i = 0; i < res.data.length; i++) {
              clockedInMap.set(res.data[i]._openid, res.data[i])
            }

            console.log("userInfoMap:" + userInfoMap.size)
            let nodes = new Array()
            for (let i = 0; i < clockedInMap.size; i++) {
              for (let item of userInfoMap.keys()) {
                let status = "--"
                let clockin = "未打卡"
                let name = "--"
                if (clockedInMap.has(item)) {
                  clockin = "已打卡"

                  let body = clockedInMap.get(item)
                  if (body.bodyStatusFlag == 0) {
                    status = "正常"
                  } else {
                    status = "异常"
                  }
                }

                if (userInfoMap.get(item).name != "") {
                  name = userInfoMap.get(item).name
                }

                nodes.push({
                  id: item,
                  text: name,
                  clockin: clockin,
                  status: status
                })
              }
            }
            
            if (nodes.length == 0) {
              nodes.push(emptyNode)
            }

            this.setData({
                treeData: {
                  text: 'teleinfo研发部门',
                  id: 0,
                  date: currentDate,
                  nodes: nodes
                },
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