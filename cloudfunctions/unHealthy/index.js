// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({ env: "soybean-uat" })
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let list = await db.collection('user_healthy').where(_.and[{
    "date": event.date
  }, {
    "bodyStatusFlag": "0"
  }]).get({
  });
  
  return list.data;
}