// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({ env: "xinertong-uat" })
const _ = db.command
const $ = db.command.aggregate

async function getInfoCount() {
  let count = await db.collection('user_info').where({
  
  }).count();
  return count.total;
}

// 3级部门的人员
async function getMembers(department) {
  let membersData = await db.collection('user_info').where({
      company_department: db.RegExp({
          regexp: department + "$",
          options: 'i',
      }),
      _openid: _.neq("")
  }).get()
  // console.log("members ", membersData)
  let result = {count: membersData.data.length, data: membersData.data}
  return result
}


async function getDepartments(department,level) {
  var departments = ''
  if(level=='1') {
    departments = await db.collection('company_info').where({
      company_name: db.RegExp({
          regexp: department,
          options: 'i',
      }),
      _openid: _.neq("")
    }).get()
    var k = []
    departments.data.forEach(function(val, idx, arr) {     
          if(val.name!="院属公司及协会"){
             k.push(val.name)
          }else{
            val.departments.forEach(obj=>k.push(obj))
          }
      }, 0);
    return k
  } else if(level=='2') {
    departments = await db.collection('company_info').where({
      name: db.RegExp({
          regexp: department,
          options: 'i',
      }),
      _openid: _.neq("")
    }).get()
    let k = departments.data[0].departments
    return k
  } else {
    return []
  }
}

//2级 返回
async function getLevel2(department) {
  let result = []
  let departments = await getDepartments(department,"2") 
    for(let i=0; i<departments.length; i++){
      let j = await getMembers(departments[i])
      result.push({count:j.count,departments:departments[i]})
    }
  return result
}

//1级 返回
async function getLevel1(department) {
  let result = []
  let departments = await getDepartments(department,"1")   
  return departments
}
// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  // var result = []
  // const company_department = event.company_department
  // const level = '2'
  // if(level == "3") {
  //   result = await getMembers(company_department)
  // } else if(level == "2") {
  //   result  = await getLevel2(company_department)
  // } else if(level == "1") {
  //   result  = await getLevel1(company_department)
  // }
  // let n = await getMembers(event.company_department);
  let result = await getDepartments(event.company_department,event.level)
  //此函数最后只获取公司数

  return {
    result,
    // openid: wxContext.OPENID,
    // appid: wxContext.APPID,
    // unionid: wxContext.UNIONID,
  }
}