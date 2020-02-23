// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database({ env: "soybean-uat" })
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  
  let datas = []

  let userInfo = await db.collection('user_info').where({
  }).count();

  let userHealthy = await db.collection('user_healthy').where({
    "date": event.date,
  }).count();

  let stateGood = await db.collection('user_healthy').where(_.and([{
    "date": event.date
    },{
      "bodyStatusFlag": "0"
    }]
    )).count();

  let stateOther = await db.collection('user_healthy').where(_.and([{
    "date": event.date
    },{
      "bodyStatusFlag": "1"
    }]
  )).count();

  let stateServer = await db.collection('user_healthy').where(_.and([{
    "date": event.date
    },{
      "bodyStatusFlag": "2"
    }]
    )).count();

  let beijing = await db.collection('user_healthy').where(_.and([{
    "date": event.date,
    },{
      "place": db.RegExp({
        regexp: '.*' + '北京'
      })
    }])).count()

  let hubei = await db.collection('user_healthy').where(_.and([{
    "date": event.date,
  }, {
    "place": db.RegExp({
      regexp: '.*' + '湖北'
    })
  }])).count()

  let wuhan = await db.collection('user_healthy').where(_.and([{
    "date": event.date,
  }, {
    "place": db.RegExp({
      regexp: '.*' + '武汉'
    })
  }])).count()

  let queZhen = await db.collection('user_healthy').where(_.and([{
    "date": event.date
  }, {
    "isQueZhenFlag": "0"
  }]
  )).count();

  let hospital = await db.collection('user_healthy').where(_.and([{
    "date": event.date
  }, {
    "goHospitalFlag": "0"
  }]
  )).count();

  let beijingUnComfirmed = await db.collection('user_healthy').where(_.and([{
    "date": event.date
  },{
      "place": db.RegExp({
        regexp: '.*' + '北京'
      })

  }, {
    "isQueZhenFlag": "1"
  }])).get()


  datas.push(userInfo.total)
  datas.push(userHealthy.total)

  datas.push(stateGood.total)
  datas.push(stateOther.total)
  datas.push(stateServer.total)

  var hubeiOther = hubei.total - wuhan.total
  var other = userHealthy.total - beijing.total - hubei.total

  datas.push(wuhan.total)
  datas.push(hubeiOther)
  datas.push(other)
  datas.push(beijing.total)

  var stateBad = queZhen.total + hospital.total
  datas.push(queZhen.total)
  datas.push(stateBad)

  datas.push(beijingUnComfirmed.data)





  // let healthyInfo = await db.collection('user_healthy').where({
  //   "date": event.date,
  // }).get()

  // let userInfo = await db.collection('user_info').get({
  // });
  
  
  // datas.push(healthyInfo.data)
  // datas.push(userInfo.data)

  return datas;
}