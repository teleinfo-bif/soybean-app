// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({ env: "soybean-uat" })
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  let list = await db.collection('user_healthy').where({
    "date": event.date
  }).get({});

  let list2 = await db.collection('user_info').where({
    "company_department": db.RegExp({
      regexp: event.company_department,
    })
    
  }).get()

  var result = []
  var datas = []
  var data1 = list.data
  var data2 = list2.data

  for (var i = 0; i < data1.length; i++) {
    for (var j = 0; j < data2.length; j++) {
      if (data1[i]._openid == data2[j]._openid) {
        datas.push(data1[i])
      }
    }
  }

  result.push(data2)
  result.push(datas)


  return result;

  
}