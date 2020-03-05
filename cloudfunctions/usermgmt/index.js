
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
//查询"附近拼单"
exports.main = async (event, context) => {
  console.log("调用云函数usermgmt");
  const wxContext = cloud.getWXContext()
  console.log(wxContext);
  try {
    //order
    return await db.collection('user_info').where({
      //下面这3行，为筛选条件
      _openid: openid,
      usertype: '1'
    }).count();
  } catch (e) {
    console.error(e);
  }
}