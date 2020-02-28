// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({ env: "soybean-uat" })

async function getHealthyCount(date) {
  let count = await db.collection('user_healthy').where({
    "date": date
  }).count();
  return count.total;
}

async function getHealthyData(date, step) {
  let list = await db.collection('user_healthy').skip(step).where({
    "date": date
  }).limit(10).get();
  return list.data;
}


// 云函数入口函数
exports.main = async (event, context) => {

  let count = await getHealthyCount(event.date)
  let datas = []

  for (var i = 0; i < count; i += 10) {
    console.log("i = ", i)
    datas = datas.concat(await getHealthyData(event.date, datas.length))
  }

  console.log("datas: ", datas)

  return datas

}