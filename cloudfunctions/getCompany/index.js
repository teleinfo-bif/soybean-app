// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({ env: "soybean-uat" })
// const db = cloud.database()   // 这个会报错

async function getCompanyCountIndex() {
  let count = await db.collection('company_info').where({
  }).count();
  return count;
}

async function getCompanyListIndex(skip) {
  let list = await db.collection('company_info').where({
  });
  return list.data;
}

exports.main = async (event, context) => {
  // let count = await db.collection('company_info').where({
  // }).count();
  // console.log("查询机构数量为：" + count.total)
  // count = count.total;
  // let list = []
  // for (let i = 0; i < count; i += 100) {
  //   list = list.concat(
  //     await db.collection('company_info').where({
  //     }).data
  //   );
  // }

  // return count;


  let list = await db.collection('company_info').orderBy('weight', 'asc').get();

  for (let index = 0; index < list.data.length; index ++) {
    let wantedDepartments = []
    let departments = list.data[index].departments

    if (departments.length > 0) {
      wantedDepartments.push("领导")
    }
  
    for (let indexj = 0; indexj < departments.length; indexj ++) {
      if (departments[indexj] != "领导") {
        wantedDepartments.push(departments[indexj])
      }
    }

    list.data[index].departments = wantedDepartments

  }

  return list.data;
}
