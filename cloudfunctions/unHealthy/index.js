// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({ env: "soybean-uat" })
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let list = await db.collection('user_healthy').where(_.or([{
    "bodyStatusFlag": "1"
  }, {
    "bodyStatusFlag": "2"
  },{
    'isQueZhenFlag': '0'
  }]).and({
    "date": event.date
  })).get()

  let list2 = await db.collection('user_info').get()

  var healthyDatas = list.data
  var infoDatas = list2.data

  for (var i = 0; i < healthyDatas.length; i++) {
    for (var j = 0; j < infoDatas.length; j++) {
      if (healthyDatas[i]._openid == infoDatas[j]._openid) {
        healthyDatas[i]['company_department'] = infoDatas[j].company_department
      }
    }
  }

  return healthyDatas
  
}