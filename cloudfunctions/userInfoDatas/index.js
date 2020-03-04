// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({ env: "xinertong-uat" })
const _ = db.command

async function getInfoCount(reg) {
  let count = await db.collection('user_info').where({
    "company_department": db.RegExp({
      regexp: reg,
    })
  }).count();
  return count.total;
}

async function getInfoData(reg, step) {
  let list = await db.collection('user_info').skip(step).where({
    "company_department": db.RegExp({
      regexp: reg,
    })
  }).limit(500).get();
  return list.data;
}

async function getInfoDatas(companyReg) {
  let count = await getInfoCount(companyReg)
  let datas = []
  for (var i = 0; i < count; i += 500) {
    console.log("info i = ", i)
    datas = datas.concat(await getInfoData(companyReg, datas.length))
  }

  console.log("info datas size: ", datas.length)
  console.log("info datas ", datas)
  return datas
}

// 云函数入口函数
exports.main = async (event, context) => {
  let userInfoes = await getInfoDatas(event.company_department)
  return userInfoes

}