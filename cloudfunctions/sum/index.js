
const cloud = require('wx-server-sdk')
// 云函数入口函数
exports.main = async (event, context) => {
  let tmpa = event.a
  let tmpb = event.b

  return {
    sum: tmpa + tmpb + 3
  }
  
}