// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({ env: "xinertong-uat" })

// 云函数入口函数
exports.main = async (event, context) => {
  
  let res = await db.collection('user_healthy').where({
    "date": "2020-02-25"
  }).get({})

  

      if (res.data.length > 0) {
        console.log("filled users number: ", res.data.length)



        for (var i = 0; i < res.data.length; i++) {

          console.log("begin add data, openid: ", res.data[i]._openid, i)

          var inBeijing = res.data[i].isGoBackFlag
          var backFlag = res.data[i].noGoBackFlag
          if (backFlag == undefined || backFlag == null) {
            backFlag = '0'
          }
          var gobackDate = res.data[i].gobackdate
          if (gobackDate == undefined || gobackDate == null) {
            gobackDate = ""
          }

          var leaveFlag = res.data[i].isLeaveBjFlag
          if (leaveFlag == undefined || leaveFlag == null) {
            leaveFlag = '0'
          }

          var leaveDate = res.data[i].leavedate
          if (leaveDate == undefined || leaveDate == null) {
            leaveDate = ""
          }

          var sureDate = res.data[i].suregobackdate
          if (sureDate == undefined || sureDate == null) {
            sureDate = ""
          }

          var train = res.data[i].trainnumber
          if (train == undefined || train == null) {
            train = ""
          }


         await db.collection('user_latest').add({
            data: {
              _openid: res.data[i]._openid,
              name: res.data[i].name,
              phone: res.data[i].phone,
              place: res.data[i].place,
              is_in_beijing: parseInt(inBeijing),
              out_reason: parseInt(backFlag),
              plan_beijing: gobackDate,
              ever_leave_beijing: parseInt(res.data[i].isLeaveBjFlag),
              leave_date: leaveDate,
              return_date: sureDate,
              traffic: train
            }
          })
        }
      }

      return "success"


}