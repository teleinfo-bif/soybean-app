// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({ env: "soybean-uat" })

// 云函数入口函数
exports.main = async (event, context) => {

  let list1 = await db.collection('user_healthy').where({
    "date": event.date
  }).get()

  let list2 = await db.collection('user_info').get()

  var healthy = list1.data
  var info = list2.data

  for (var i = 0; i < healthy.length; i++) {
    for (var j = 0; j < info.length; j++) {
      if (healthy[i]._openid == info[j]._openid){
        healthy[i]['company_department'] = info[j].company_department 
      }
    }
  }

  return healthy
  
}