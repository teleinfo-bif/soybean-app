const cloud = require('wx-server-sdk')
//环境变量 ID
cloud.init()

const db = cloud.database({ env: "soybean-uat" })
// 云函数入口函数
//传递的参数可通过event.xxx得到
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log("设置管理员权限，当前openid为：" + wxContext.OPENID);
    try {
      return await db.collection('user_info').doc(event.applyid).update({
        data: {
          usertype: event.usertype
        }
      })
    } catch (e) {
      console.error(e)
    }  
}