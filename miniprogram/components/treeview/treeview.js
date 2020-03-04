
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


Component({
  properties: {
    model: Object,
  },

  data: {
    open: false,
    isBranch: false,
  },

  methods: {
    toggle: function (e) {
      if (this.data.isBranch) {
        this.setData({
          open: !this.data.open,
        })
      }
    },

    tapItem: function (e) {
      var itemid = e.currentTarget.dataset.itemid;
      console.log('组件里点击的id: ' + itemid);
      this.triggerEvent('tapitem', { itemid: itemid }, { bubbles: true, composed: true });
    },

    bindDateChange: function (e) {
      let currentDate = e.detail.value
      console.log(currentDate);
      
      const db = wx.cloud.database({
        env: "xinertong-uat"
      })

      const _ = db.command
      let userInfoMap = new Map()
      let clockedInMap = new Map()
      let ids = new Array()
      let that = this
      let totalNodes = that.data.model.nodes

      db.collection('user_info').where({
        _openid: _.neq("")
      }).count({
        success: function (res) {
          console.log("总用户数目" + res.total)
          that.data.totalCount = res.total;

          if (that.data.totalCount != undefined && that.data.totalCount > 0) {
            this.setData({
              model: {
                text: 'teleinfo研发部门',
                id: 0,
                date: currentDate,
                nodes: []
              },
            })
          }
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
                  model: {
                    text: 'teleinfo研发部门',
                    id: 0,
                    date: currentDate,
                    nodes: totalNodes
                  },
                })
              }
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

    bindDateChange1: function (e) {
      let currentDate = e.detail.value
      console.log(currentDate);

      const db = wx.cloud.database({
        env: "xinertong-uat"
      })

      const _ = db.command
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

              let nodes = new Array()
              for (let i = 0; i < clockedInMap.size; i++) {
                for (let item of userInfoMap.keys()) {
                  let status = -1
                  let clockin = "未打卡"
                  let name = "--"
                  if (clockedInMap.has(item)) {
                    clockin = "已打卡"

                    let body = clockedInMap.get(item)
                    if (body.bodyStatusFlag != 0) {
                      status = 0
                    } else {
                      status = 1

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


                          }
                        }
                      })

                    }
                  }

                  if (userInfoMap.get(item).name != "") {
                    name = userInfoMap.get(item).name
                  }

                  nodes.push({
                    id: item,
                    text: name,
                    date: currentDate,
                    clockin: clockin,
                    status: status
                  })
                }
              }
              
              // if (nodes.length == 0) {
              //   nodes.push({
              //     id: 0,
              //     text: "--",
              //     clockin: "--",
              //     status: -1
              //   })
              // }

              this.setData({
                model: {
                  text: 'teleinfo研发部门',
                  id: 0,
                  date: currentDate,
                  nodes: nodes
                },
              })
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
    }
  },

  ready: function (e) {
    this.setData({
      isBranch: Boolean(this.data.model.nodes && this.data.model.nodes.length),
    });
    console.log(this.data);
  },
})