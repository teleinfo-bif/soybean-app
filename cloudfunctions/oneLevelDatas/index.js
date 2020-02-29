// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({ env: "soybean-uat" })

async function getInfoCount() {
  let count = await db.collection('user_info').where({
  
  }).count();
  return count.total;
}

async function getInfoData(step) {
  let list = await db.collection('user_info').skip(step).where({
  }).limit(500).get();
  return list.data;
}

async function getInfoDatas() {
  let count = await getInfoCount()
  let datas = []
  for (var i = 0; i < count; i += 500) {
    datas = datas.concat(await getInfoData(datas.length))
  }

  console.log("info datas ", datas)
  return datas
}

async function getHealthyCount(date) {
  let count = await db.collection('user_healthy').where({
    "date": date
  }).count();
  return count.total;
}

async function getHealthyData(date, step) {
  let list = await db.collection('user_healthy').skip(step).where({
    "date": date
  }).limit(500).get();
  return list.data;
}

async function getHealthyDatas(date) {
  let count = await getHealthyCount(date)
  let datas = []
  for (var i = 0; i < count; i += 500) {
    datas = datas.concat(await getHealthyData(date, datas.length))
  }

  console.log("healthy datas: ", datas)
  return datas
}

async function parseDatas(infoDatas, healthyDatas) {
  var ret = []
  ret.push(infoDatas)
  var datas = []
  for (var i = 0; i < infoDatas.length; i++) {
    for (var j = 0; j < healthyDatas.length; j++) {
      if (healthyDatas[j]._openid == infoDatas[i]._openid) {
        healthyDatas[j]['company_department'] = infoDatas[i].company_department
        datas.push(healthyDatas[j])
      }
    }
  }

  console.log("parse info and healthy datas, ", datas)
  ret.push(datas)

  return ret
}

// 云函数入口函数
exports.main = async (event, context) => {

  let infoDatas = await getInfoDatas()
  let healthyDatas = await getHealthyDatas(event.date)

  let datas = await parseDatas(infoDatas, healthyDatas)

  return datas

}