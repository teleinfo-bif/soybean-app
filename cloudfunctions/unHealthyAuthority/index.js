// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({ env: "xinertong-uat" })
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let list = await db.collection('user_healthy').where(_.or([{
    "bodyStatusFlag": "1"
  }, {
    "bodyStatusFlag": "2"
  }, {
    'isQueZhenFlag': '0'
  }]).and([{
    "date": event.date
  }, {
      "company_department": db.RegExp({
        regexp: event.company_department,
      })
  }])).get()
 

  return list.data;
}