// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({ env: "xinertong-uat" })
const _ = db.command

async function getInfoCount(reg,serialNumber) {
  if(serialNumber=="0"){  
  var count = await db.collection('user_info').where({
    "company_department": db.RegExp({
      regexp: reg,
    })
  }).count();
} else {
  let company_department = "company_department" + serialNumber
  console.log(company_department)
  var count = await db.collection('user_info').where({
    [company_department]: db.RegExp({
      regexp: reg,
    })
  }).count();
  console.log(count)
}
  return count.total;
}

async function getInfoData(reg, step,serialNumber) {
  if(serialNumber=="0"){
    var list = await db.collection('user_info').skip(step).where({
    "company_department": db.RegExp({
      regexp: reg,
    })
  }).limit(500).get();
  }else {
    let company_department = "company_department" + serialNumber
    var list = await db.collection('user_info').skip(step).where({
    [company_department]: db.RegExp({
        regexp: reg,
      })
    }).limit(500).get();
  }
  
  return list.data;
}

async function getInfoDatas(companyReg,serialNumber) {
  let count = await getInfoCount(companyReg,serialNumber)
  let datas = []
  for (var i = 0; i < count; i += 500) {
    console.log("info i = ", i)
    datas = datas.concat(await getInfoData(companyReg, datas.length,serialNumber))
  }

  console.log("info datas size: ", datas.length)
  console.log("info datas ", datas)
  return datas
}

// 云函数入口函数
exports.main = async (event, context) => {
  let serialNumber = event.serial_number
  let userInfoes = await getInfoDatas(event.company_department,serialNumber)
  return userInfoes

}