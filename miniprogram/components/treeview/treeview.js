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
        env: "soybean-uat"
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
                nodes.push({
                  id: 0,
                  text: "--",
                  clockin: "--",
                  status: "--"
                })
              }

              this.setData({
                model: {
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
    }
  },

  ready: function (e) {
    this.setData({
      isBranch: Boolean(this.data.model.nodes && this.data.model.nodes.length),
    });
    console.log(this.data);
  },
})