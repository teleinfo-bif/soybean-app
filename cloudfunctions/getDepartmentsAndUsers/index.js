// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({ env: "soybean-uat" })

async function getInfoCount() {
  let count = await db.collection('user_info').where({
  
  }).count();
  return count.total;
}

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()

  let n = await getInfoCount();
  console.log(n)

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}