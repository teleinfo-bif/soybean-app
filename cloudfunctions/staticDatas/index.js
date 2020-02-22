// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({ env: "soybean-uat" })

// 云函数入口函数
exports.main = async (event, context) => {
  
  let datas = []

  let healthyInfo = await db.collection('user_healthy').where({
    "date": event.date,
  }).get()

  let userInfo = await db.collection('user_info').get({
  });
  
  
  datas.push(healthyInfo.data)
  datas.push(userInfo.data)

  return datas;
}