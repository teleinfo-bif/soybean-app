// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({ env: "xinertong-uat" })

async function getInfoCount(reg) {
  let count = await db.collection('user_info').where({
    "company_department": db.RegExp({
      regexp: reg,
    })
  }).count();
  return count.total;
}

async function getInfoData() {
  let list = await db.collection('company_info').orderBy('weight', 'asc').get()
  return list.data;
}


// 云函数入口函数
exports.main = async (event, context) => {

  let datas = await getInfoData()
  console.log("datas: ", datas)
  console.log("datas length: ", datas.length)

  var temp = []
  var names = []
  var ret = []

  if (datas.length == 0) {
    ret.push(names)
    ret.push(temp)
  } else {

    // var departments = datas[0].departments
    var reg = ""
    for (var i = 0; i < datas.length; i++) {

      var name = datas[i].name
      if (name == '院属公司及协会') {
        var departments = datas[i].departments
        for (var j = 0; j < departments.length; j++) {
          var departmentName = departments[j]
          reg = ".*" + departmentName + "$"
          var count = await getInfoCount(reg)
          names.push(departmentName)
          temp.push(count)
        }
        
      }else {
        reg = "^" +  name + ".*"
        var count = await getInfoCount(reg)
        names.push(name)
        temp.push(count)
      }
      
      
    }
    // var temp = []
    // for (var i = 0; i < datas.length; i++) {
    //   temp = temp.push(getInfoCount(datas[i]))
    // }

    ret.push(names, temp)


  }

  return ret

}