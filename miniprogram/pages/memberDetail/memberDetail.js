// pages/detail/detail.js

const db = wx.cloud.database({
  env: "xinertong-uat"
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

function getDayString(day) {
  var today = new Date();
  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
  today.setTime(targetday_milliseconds);
  var tYear = today.getFullYear();
  var tMonth = today.getMonth();
  var tDate = today.getDate();
  tMonth = doHandleMonth(tMonth + 1);
  tDate = doHandleMonth(tDate);

  return tYear + "-" + tMonth + "-" + tDate;
}

function doHandleMonth(month) {
  var m = month;
  if (month.toString().length == 1) {
    m = "0" + month;
  }
  return m;
}

function getRecentDates(day) {
  let dateStrings = new Array()
  for (let i = day; i > 0; i--) {
    dateStrings.push(getDayString(-day))
  }

  return dateStrings
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
  date: getCurrentDay(),
  clockin: "--",
  status: -1
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
    date: getCurrentDay()
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
    // if (options.date != undefined && options.date != "") {
    //   this.setData({
    //     date: options.date
    //   })
    // }

    const _ = db.command
    let currentDate = this.data.date
    let userInfoMap = new Map()
    let clockedInMap = new Map()
    let ids = new Array()
    let that = this
    let totalNodes = that.data.treeData.nodes

    db.collection('user_info').where({
      _openid: _.neq("")
    }).count({
      success: function (res) {
        console.log("总用户数目" + res.total)
        that.data.totalCount = res.total;
      }
    })

    db.collection('user_info').where({
      _openid: _.neq("")
    }).limit(10).get({
      success: res => {
        console.log(res)
        for (let i = 0; i < res.data.length; i++) {
          userInfoMap.set(res.data[i]._openid, res.data[i])
        }

        for (let item of userInfoMap.keys()) {
          ids.push(item)
        }

        db.collection('user_healthy').where({
          date: currentDate,
          _openid: _.in(ids)
        }).get({
          success: res => {
            console.log(res)
            for (let i = 0; i < res.data.length; i++) {
              clockedInMap.set(res.data[i]._openid, res.data[i])
            }

            console.log("userInfoMap:" + userInfoMap.size)
            let nodes = new Array()
            for (let i = 0; i < ids.length; i++) {
              let user_id = ids[i]
              let status = -1
              let clockin = "未打卡"
              let name = "--"

              if (userInfoMap.get(user_id).name != "") {
                name = userInfoMap.get(user_id).name
              }

              if (clockedInMap.has(user_id)) {
                clockin = "已打卡"

                let body = clockedInMap.get(user_id)
                if (body.bodyStatusFlag == 0) {
                  status = 0
                } else {
                  status = 1

                  let dayCount = 6
                  let recentDays = getRecentDates(dayCount)
                  recentDays.push(getCurrentDay())

                  db.collection('user_healthy').where({
                    _openid: user_id,
                    // date: _.in(recentDates),
                    bodyStatusFlag: _.neq("0")
                  }).count({
                    success: res => {
                      if (dayCount + 1 == res.total) {
                        status = 2
                      }
                    }
                  })
                }
              }

              totalNodes.push({
                id: user_id,
                text: name,
                date: currentDate,
                clockin: clockin,
                status: status
              })

              this.setData({
                treeData: {
                  text: 'teleinfo研发部门',
                  id: 0,
                  date: currentDate,
                  nodes: totalNodes
                },
              })
            }
          }
        })

        wx.hideLoading();
        wx.hideNavigationBarLoading(); //隐藏加载
        wx.stopPullDownRefresh();
        console.log(res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })

        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log(err)
      }
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.onReachBottom()
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
    let currentDate = this.data.date

    // if (app.globalData.slectedDate == undefined || app.globalData.slectedDate == "") {
    //   currentDate = app.globalData.slectedDate
    // }

    let userInfoMap = new Map()
    let clockedInMap = new Map()
    let ids = new Array()

    if (this.data.treeData.nodes.length < this.data.totalCount) {
      console.log("分页查询，当前skip的值为：" + this.data.treeData.nodes.length);
      try {
        const _ = db.command
        db.collection('user_info').where({
          _openid: _.neq("")
        }).skip(this.data.treeData.nodes.length)
          .limit(10).get({
            success: res => {
              for (let i = 0; i < res.data.length; i++) {
                userInfoMap.set(res.data[i]._openid, res.data[i])
              }

              for (let item of userInfoMap.keys()) {
                ids.push(item)
              }

              db.collection('user_healthy').where({
                date: currentDate,
                _openid: _.in(ids)
              }).get({
                success: res => {
                  console.log("user_healthy: ", res)
                  for (let i = 0; i < res.data.length; i++) {
                    clockedInMap.set(res.data[i]._openid, res.data[i])
                  }

                  console.log("clockedInMap: " + clockedInMap.size)
                  let nodes = new Array()
                  for (let i = 0; i < ids.length; i++) {
                    let user_id = ids[i]
                    let status = -1
                    let clockin = "未打卡"
                    let name = "--"
                    if (clockedInMap.has(user_id)) {
                      clockin = "已打卡"

                      let body = clockedInMap.get(user_id)
                      if (body.bodyStatusFlag == 0) {
                        status = 0
                      } else {
                        status = 1

                        let dayCount = 6
                        let recentDays = getRecentDates(dayCount)
                        recentDays.push(getCurrentDay())

                        db.collection('user_healthy').where({
                          _openid: user_id,
                          // date: _.in(recentDates),
                          bodyStatusFlag: _.neq("0")
                        }).count({
                          success: res => {
                            if (dayCount + 1 == res.total) {
                              status = 2
                            }
                          }
                        })
                      }
                    }

                    if (userInfoMap.get(user_id).name != "") {
                      name = userInfoMap.get(user_id).name
                    }

                    nodes.push({
                      id: user_id,
                      text: name,
                      date: currentDate,
                      clockin: clockin,
                      status: status
                    })
                  }

                  let totalNodes = this.data.treeData.nodes
                  totalNodes = totalNodes.concat(nodes)

                  this.setData({
                    treeData: {
                      text: 'teleinfo研发部门',
                      id: 0,
                      date: currentDate,
                      nodes: totalNodes
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

              console.log(res)
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '查询记录失败'
              })

              console.log(err)
            }
          })
      } catch (e) {
        console.error(e);
      }
    } else {
      wx.showToast({
        title: '没有更多数据了',
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})