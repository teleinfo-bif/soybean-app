// 查询当前用户是否为管理员
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({ env: "soybean-uat" })

async function getMuserByOpenid(openid) {
  console.log("调用云函数getMuserByOpenid:" + openid);
  let count = await db.collection('user_info').where({
    _openid: openid,
    superuser:'1'
  }).count();
  console.log("调用云函数getMuserByOpenid结果count为：" + count);
  return count;
}

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("调用云函数");
  const wxContext = cloud.getWXContext()
  console.log(wxContext);
  console.log(event);
  return getMuserByOpenid(wxContext.openid)
}
