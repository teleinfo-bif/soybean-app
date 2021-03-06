// 云函数入口文件
const cloud = require('wx-server-sdk')
const nodeExcel = require('excel-export')
const path = require('path');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log("wxContext is ", wxContext)

  var tableHead = ["发票编号", "发票代码", "开票时间", "金额"];
  var tableMap = {
    styleXmlFile: path.join(__dirname, "styles.xml"),
    name: Date.now() + "-export",
    cols: [],
    rows: [],
  }
  //添加表头
  for (var i = 0; i < tableHead.length; i++) {
    tableMap.cols[tableMap.cols.length] = {
      caption: tableHead[i],
      type: 'string'
    }
  }
  //伪数据
  const Output = [
    { 发票编号: 0, 发票代码: '001', 开票时间: '2019-5-1', 金额: 100 },
    { 发票编号: 1, 发票代码: '002', 开票时间: '2019-5-1', 金额: 200 }
  ]
  //添加每一行数据
  for (var i = 0; i < Output.length; i++) {
    tableMap.rows[tableMap.rows.length] = [
      Output[i].发票编号,
      Output[i].发票代码,
      Output[i].开票时间,
      Output[i].金额
    ]
  }
  //保存excelResult到相应位置
  var excelResult = nodeExcel.execute(tableMap);
  var filePath = "download";
  var fileName = wxContext.OPENID + "-" + Date.now() / 1000 + '.xlsx';
  console.log(excelResult);
  //上传文件到云端
  // let file = await cloud.uploadFile({
  //   cloudPath: path.join(filePath, fileName),
  //   fileContent: Buffer.from(excelResult.toSTring(), 'binary')
  // });

  return await cloud.uploadFile({
    cloudPath: `download/sheet${wxContext.OPENID}.xlsx`,  // excel文件名称及路径，即云存储中的路径
    fileContent: Buffer.from(excelResult, 'binary'),
  })

  console.log("file:", file);

  return file
}

// // //fileID: "cloud://sobean-uat.736f-sobean-uat-1301333180/outputExcels/oqME_5SxOS8uyKMun5rV4VkkM7Ao-1582519420.623.xlsx"