// 云函数入口文件
const cloud = require('wx-server-sdk')
const nodeExcel = require('excel-export')
const fs = require('fs')
const path = require('path')

cloud.init({
  env: "soybean-uat"   // 你的环境
})

const db = cloud.database()
const MAX_LIMIT = 80
// 生成分数项并且下载对应的excel
exports.main = async (event, context) => {

  let collectionId = 'user_healthy'                 // 模拟的集合名
  let openId = 'wx981c51592be1d70c'             // 模拟openid
  //let confParams = ['编号', '登录ID', '打卡时间', '身体状态', '打卡日期', '是否有接触过疑似病患、接待过来自湖北的亲戚朋友、或者经过武汉', '是否去医院就诊', '14天内是否离京', '离京日期', '名字', '手机号', '打卡地址', '打卡备注信息', '返京时间', '温度', '返京交通工具'] // 模拟表头

  let confParams = ['姓名', '离京时间', '目前所在地', '返京时间', '未返京原因', '计划返京时间', '交通方式（自驾、火车、飞机）班次','打卡备注信息'] // 模拟表头


  let jsonData = []
  
  let time=event
  //db.collection(collectionId).count
  const countResult = await db.collection(collectionId).where({
    date: '2020-02-22'
    }).count()
  const total = countResult.total
  const ci = Math.ceil(total / MAX_LIMIT);
  
  // 获取数据
  for (let i = 0; i < ci; i++) {
    await db.collection(collectionId).where({
          date: '2020-02-22'
    }).orderBy('addtime', 'desc').skip(i).limit(MAX_LIMIT).get().then(res => {
      if(i!=0){
       jsonData=jsonData.concat(res.data)
      }else{
        jsonData=res.data
      }
    })
  }

  // 转换成excel流数据
  let conf = {
    stylesXmlFile: path.resolve(__dirname, 'styles.xml'),
    name: 'sheet',
    cols: confParams.map(param => {
      return { caption: param, type: 'string' }
    }),
    rows: jsonToArray(jsonData)
  }
  let result = nodeExcel.execute(conf) // result为excel二进制数据流

  // 上传到云存储
  let excelfile = await cloud.uploadFile({
    cloudPath: `download/sheet${openId}.xlsx`,  // excel文件名称及路径，即云存储中的路径
    fileContent: Buffer.from(result.toString(), 'binary'),
  })

  console.log("excelfile ", excelfile)

  return excelfile

  
  
  // json对象转换成数组填充
  function jsonToArray(arrData) {
    let arr = new Array()
    arrData.forEach(item => {
      let itemArray = new Array()
      for (let key in item) {
      //  if (key === 'userinfo') {
       //    continue 
       // }
      //  if (item[key] == null || item[key] == '' || item[key] == undefined){
      //    itemArray.push('-')
       // }else{
       //   itemArray.push(item[key])
      //  }


        if (key === 'name' || key === 'leavedate' || key === 'place' || key === 'suregobackdate' || key === 'noGoBackFlag' || key === 'gobackdate' || key === 'trainnumber' || key === 'remark') {
          console.log("item[key]的值为：" + item[key])
          
          if (key === 'name'){
            itemArray[0] = item[key]
          }
          if (key === 'leavedate') {
            itemArray[1] = item[key]
          }
          if (key === 'place') {
            itemArray[2] = item[key]
          }
          if (key === 'suregobackdate') {
            itemArray[3] = item[key]
          }
          if (key === 'noGoBackFlag') {
            if (item[key] == '1'){
              itemArray[4] = '当地未放行'
            }else{
              itemArray[4] = '身体不适'
            }
          }
          if (key === 'gobackdate') {
            itemArray[5] = item[key]
          }
          if (key === 'trainnumber') {
            itemArray[6] = item[key]
          }
          if (key === 'remark') {
            itemArray[7] = item[key]
          }
        }
      }
      arr.push(itemArray)
    })
    return arr
  }

}


