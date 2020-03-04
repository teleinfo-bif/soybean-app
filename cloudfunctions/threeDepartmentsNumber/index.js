// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({ env: "xinertong-uat" })

async function getInfoCount(department) {
  let count = await db.collection('user_info').where({
    "company_department": department
  }).count();
  return count.total;
}

async function getInfoData(name) {
  let list = await db.collection('company_info').where({
    "name": name
  }).get();
  return list.data;
}


// 云函数入口函数
exports.main = async (event, context) => {
  
  let datas = await getInfoData(event.name)
  console.log("datas: ", datas)
  console.log("datas length: ", datas.length)

  var departments = datas[0].departments
  var temp = []
  var ret = []
  for (var i = 0; i < departments.length; i++) {
    var company_department = event.name + ' ' + departments[i]
    console.log("company deparment name: ", company_department)
    var count = await getInfoCount(company_department)
    console.log("count: ", count)
    temp.push(count)
  }
  // var temp = []
  // for (var i = 0; i < datas.length; i++) {
  //   temp = temp.push(getInfoCount(datas[i]))
  // }

  ret.push(datas[0].departments, temp)

  return ret
  
}