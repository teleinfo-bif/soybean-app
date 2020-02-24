const cloud = require('wx-server-sdk');
const xlsx = require('node-xlsx');

cloud.init()

const db = cloud.database({ env: "soybean-uat" })
const _ = db.command
const $ = db.command.aggregate

// async function getCompanyInfo() {
//     let list = await db.collection('company_info').where({
//     }).get();

//     return list.data
// }

// async function getUserHealthy() {
//     let list = await db.collection('user_healthy').where({
//     }).get();

//     console.log("user_healthy", user_healthy)
//     return list.data
// }

// async function getUserInfo() {
//     let list = await db.collection('user_info').where({
//     }).get();

//     return list.data
// }

exports.main = async (event, context) => {
    try {
        let dateTime = "2020-02-23"

        // let user_healthy = await db.collection('user_healthy').where({
        // }).get();

        // let userHealthy = user_healthy.data
        // console.log("user_healthy", userHealthy)

        // let user_info = await db.collection('user_info').where({
        // }).get();

        // let userInfo = user_info.data

        let dataCVS = `打开信息表-${Number(new Date())}.xlsx`

        let alldata = [];
        let row1 = ['单位名称', '当日新增来京人员总数', '来京人员累计总数(含当日新增) (A)', '从湖北省或途径湖北来京员工人数', '', '', '', '', '从湖北省以外地区来京员工人数', '', '', '', '', '联系人', '电话', '', '', '', '', '', '', '', '', '', '']
        let row2 = ['', '', '', '人数合计(B)', '其中未返京人数(C)', '其中已返京人数(D)', '已返京人员中自行隔离(14天)人数', '过隔离期人数', '人数合计(E)', '其中未返京人数(F)', '其中已返京人数(G)', '已返京人员中自行隔离(14天)人数', '过隔离期人数', '', '', '', '', '', '', '', '', '', '', '', '']

        //当日新增来京人员总数: 离开过北京，在北京，到达北京时间 isLeaveBjFlag  suregobackdate==today
        let todayRetureBjC = await db.collection('user_healthy').aggregate()
        .match(
            $.and([
                { isLeaveBjFlag: "0" },
                { suregobackdate: { $eq: dateTime } }
            ])
        )
        .group({
            _id: "$_openid",
            data: $.min('$suregobackdate')
        }).end()

        console.log("todayRetureBjC ", todayRetureBjC)
        let todayRetureBjCount = todayRetureBjC.list.length

        //累计来京人员总数
        let retureBjC = await db.collection('user_healthy').aggregate()
        .match(
            $.and([
                { isLeaveBjFlag: "0" },
                { suregobackdate: { $lte: dateTime } }
            ])
        ).
        group({
            _id: "$_openid",
            data: $.min('$suregobackdate')
        }).end()

        console.log("retureBjC ", retureBjC)
        let retureBjCount = retureBjC.list.length


        //累计从湖北返京人数
        let retureFromHBC = await db.collection('user_healthy').aggregate()
        .match(
            $.and([
                { goHBFlag: "0" },
                { suregobackdate: { $lte: dateTime } }
            ])
        )
        .group({
            _id: "$_openid",
            data: $.min('$suregobackdate')
        }).end()

        console.log("retureFromHBC ", retureFromHBC)
        let retureFromHBCount = retureFromHBC.list.length

        //未从湖北返京人数
        let unRetureFromHBC = await db.collection('user_healthy').aggregate()
        .match(
            $.and([
                { goHBFlag: "0" },
                { gobackdate: { $gt: dateTime } }
            ])
        )
        .group({
            _id: "$_openid",
            data: $.min('$gobackdate')
        }).end()

        console.log("unRetureFromHBC ", unRetureFromHBC)
        let unRetureFromHBCount = unRetureFromHBC.list.length

        //合计途径湖北的人数
        let fromHBC = await db.collection('user_healthy').aggregate()
        .match(
            $.and([
                { goHBFlag: "0" }
            ])
        )
        .group({
            _id: "$_openid",
            data: $.min('$gobackdate')
        }).end()

        console.log("totalFromHBC ", fromHBC)
        let fromHBCount = fromHBC.list.length

        //途径湖北的人数，正在隔离
        let fromHBAndSegregatingCount = "--"

        //途径湖北的人数，且完成隔离
        let fromHBAndSegregatedCount = "--"


        //累计从非湖北地区返京人数
        let retureFromNotHBC = await db.collection('user_healthy').aggregate()
        .match(
            $.and([
                { goHBFlag: "1" },
                { isLeaveBjFlag: "0" },
                { suregobackdate: { $lte: dateTime } }
            ])
        )
        .group({
            _id: "$_openid",
            data: $.min('$suregobackdate')
        }).end()

        console.log("retureFromHBC ", retureFromHBC)
        let retureFromNotHBCount = retureFromNotHBC.list.length

        //未从非湖北地区返京人数
        let unRetureFromNotHBC = await db.collection('user_healthy').aggregate()
        .match(
            $.and([
                { goHBFlag: "1" },
                { isLeaveBjFlag: "0" },
                { gobackdate: { $gt: dateTime } }
            ])
        )
        .group({
            _id: "$_openid",
            data: $.min('$gobackdate')
        }).end()

        console.log("unRetureFromNotHBC ", unRetureFromNotHBC)
        let unRetureFromHBNotCount = unRetureFromNotHBC.list.length

        //合计途径非湖北地区的人数
        let fromNotHBC = await db.collection('user_healthy').aggregate()
        .match(
            $.and([
                { goHBFlag: "1" },
                { isLeaveBjFlag: "0" }
            ])
        )
        .group({
            _id: "$_openid",
            data: $.min('$gobackdate')
        }).end()

        console.log("totalFromHBC ", fromHBC)
        let fromNotHBCount = fromNotHBC.list.length

        //途径非湖北地区的人数，正在隔离
        let fromNotHBAndSegregatingCount = "--"

        //途径非湖北地区的人数，且完成隔离
        let fromNotHBAndSegregatedCount = "--"

        let contrat = "伞颉"
        let phone = "15101014863"


        let row3 = [
            "北京泰尔英福网络科技有限责任公司",
            todayRetureBjCount, 
            retureBjCount, 
            fromHBCount,
            retureFromHBCount, 
            unRetureFromHBCount, 
            fromHBAndSegregatingCount, 
            fromHBAndSegregatedCount, 
            fromNotHBCount, 
            retureFromNotHBCount, 
            unRetureFromHBNotCount, 
            fromNotHBAndSegregatingCount, 
            fromNotHBAndSegregatedCount, 
            contrat, 
            phone, 
            '', '', '', '', '', '', '', '', '', '']

        let row4 = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
        let row5 = ['提交人', '提交时间', '部门', '是否填写', '离京时间/计划离京时间', '联系电话', '在京居住地址', '未返京原因（身体不适/当地未放行等）', '计划返京时间', '是否从其他城市返回', '返程的交通工具中是否出现确诊的新型肺炎患者', '返程统计.返程出发地', '返程统计.返程日期', '返程统计.交通方式', '返程统计.航班/车次/车牌号', '开始观察日期', '当前时间,当前地点/城市', '体温（°C）', '是否有发烧、咳嗽等症状', '目前健康状况', '是否有就诊住院', '是否有接触过疑似病患、接待过来自湖北的亲戚朋友、或者经过武汉', '腹泻', '肌肉酸疼', '其他不适症状', '可在这里补充希望获得的帮助']

        alldata.push(row1);
        alldata.push(row2);
        alldata.push(row3);
        alldata.push(row4);
        alldata.push(row5);



        // let dataList = [{
        //     name: "houfa",
        //     weixin: "2233"
        // },
        // {
        //     name: "houfa2",
        //     weixin: "223223"
        // }]

        // dataList.forEach(item => {
        //     let arr = [];
        //     console.log("数据", item)
        //     arr.push(item.name);
        //     arr.push(item.weixin);
        //     alldata.push(arr)
        // })

        const ranges = [
            { s: { c: 0, r: 0 }, e: { c: 0, r: 1 } },  // A1:A1
            { s: { c: 1, r: 0 }, e: { c: 1, r: 1 } },
            { s: { c: 2, r: 0 }, e: { c: 2, r: 1 } },

            { s: { c: 3, r: 0 }, e: { c: 7, r: 0 } },
            { s: { c: 8, r: 0 }, e: { c: 12, r: 0 } },
            { s: { c: 13, r: 0 }, e: { c: 13, r: 1 } },
            { s: { c: 14, r: 0 }, e: { c: 14, r: 1 } }
        ];
        const options = { '!merges': ranges };

        //3，把数据保存到excel里
        var buffer = await xlsx.build([{
            name: "Sheet0",
            data: alldata
        }], options);
        //4，把excel文件保存到云存储里
        return await cloud.uploadFile({
            cloudPath: dataCVS,
            fileContent: buffer, //excel二进制文件
        })

    } catch (e) {
        console.error(e)
        return e
    }
}


// // 云函数入口文件
// const cloud = require('wx-server-sdk')
// const nodeExcel = require('excel-export')
// const fs = require('fs')
// const path = require('path')

// cloud.init({
//     env: "soybean-uat"   // 你的环境
// })

// const db = cloud.database()
// const MAX_LIMIT = 80
// // 生成分数项并且下载对应的excel
// exports.main = async (event, context) => {

//     let collectionId = 'user_healthy'                 // 模拟的集合名
//     let openId = 'wx981c51592be1d70c'             // 模拟openid
//     //let confParams = ['编号', '登录ID', '打卡时间', '身体状态', '打卡日期', '是否有接触过疑似病患、接待过来自湖北的亲戚朋友、或者经过武汉', '是否去医院就诊', '14天内是否离京', '离京日期', '名字', '手机号', '打卡地址', '打卡备注信息', '返京时间', '温度', '返京交通工具'] // 模拟表头

//     let row1 = ['单位名称', '当日新增来京人员总数', '来京人员累计总数(含当日新增) (A)', '从湖北省或途径湖北来京员工人数', '', '', '', '', '从湖北省以外地区来京员工人数', '', '', '', '', '联系人', '电话']
//     let row2 = ['', '', '', '人数合计(B)', '其中未返京人数(C)', '其中已返京人数(D)', '已返京人员中自行隔离(14天)人数', '过隔离期人数', '人数合计(E)', '其中未返京人数(F)', '其中已返京人数(G)', '已返京人员中自行隔离(14天)人数', '过隔离期人数', '', '']
//     let row3 = ['北京泰尔英福网络科技有限责任公司', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
//     let row4 = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']

//     //26
//     let row5 = ['提交人', '提交时间', '部门', '是否填写', '离京时间/计划离京时间', '联系电话', '在京居住地址', '未返京原因（身体不适/当地未放行等）', '计划返京时间', '是否从其他城市返回', '返程的交通工具中是否出现确诊的新型肺炎患者', '返程统计.返程出发地', '返程统计.返程日期', '返程统计.交通方式', '返程统计.航班/车次/车牌号', '开始观察日期', '当前时间,当前地点/城市', '体温（°C）', '是否有发烧、咳嗽等症状', '目前健康状况', '是否有就诊住院', '是否有接触过疑似病患、接待过来自湖北的亲戚朋友、或者经过武汉', '腹泻', '肌肉酸疼', '其他不适症状', '可在这里补充希望获得的帮助']


//     let confParams = ['姓名', '离京时间', '目前所在地', '返京时间', '未返京原因', '计划返京时间', '交通方式（自驾、火车、飞机）班次', '打卡备注信息'] // 模拟表头

//     let jsonData = []

//     let time = event
//     //db.collection(collectionId).count
//     const countResult = await db.collection(collectionId).where({
//         date: '2020-02-22'
//     }).count()
//     const total = countResult.total
//     const ci = Math.ceil(total / MAX_LIMIT);

//     // 获取数据
//     for (let i = 0; i < ci; i++) {
//         await db.collection(collectionId).where({
//             date: '2020-02-22'
//         }).orderBy('addtime', 'desc').skip(i).limit(MAX_LIMIT).get().then(res => {
//             if (i != 0) {
//                 jsonData = jsonData.concat(res.data)
//             } else {
//                 jsonData = res.data
//             }
//         })
//     }

//     // 转换成excel流数据
//     let conf = {
//         stylesXmlFile: path.resolve(__dirname, 'styles.xml'),
//         name: 'sheet',
//         cols: confParams.map(param => {
//             return { caption: param, type: 'string' }
//         }),
//         rows: jsonToArray(jsonData)
//     }
//     let result = nodeExcel.execute(conf) // result为excel二进制数据流

//     // 上传到云存储
//     let excelfile = await cloud.uploadFile({
//         cloudPath: `download/sheet${openId}.xlsx`,  // excel文件名称及路径，即云存储中的路径
//         fileContent: Buffer.from(result.toString(), 'binary'),
//     })

//     console.log("excelfile ", excelfile)

//     return excelfile

//     // json对象转换成数组填充
//     function jsonToArray(arrData) {
//         let arr = new Array()
//         arrData.forEach(item => {
//             let itemArray = new Array()
//             for (let key in item) {
//                 //  if (key === 'userinfo') {
//                 //    continue 
//                 // }
//                 //  if (item[key] == null || item[key] == '' || item[key] == undefined){
//                 //    itemArray.push('-')
//                 // }else{
//                 //   itemArray.push(item[key])
//                 //  }


//                 if (key === 'name' || key === 'leavedate' || key === 'place' || key === 'suregobackdate' || key === 'noGoBackFlag' || key === 'gobackdate' || key === 'trainnumber' || key === 'remark') {
//                     console.log("item[key]的值为：" + item[key])

//                     if (key === 'name') {
//                         itemArray[0] = item[key]
//                     }
//                     if (key === 'leavedate') {
//                         itemArray[1] = item[key]
//                     }
//                     if (key === 'place') {
//                         itemArray[2] = item[key]
//                     }
//                     if (key === 'suregobackdate') {
//                         itemArray[3] = item[key]
//                     }
//                     if (key === 'noGoBackFlag') {
//                         if (item[key] == '1') {
//                             itemArray[4] = '当地未放行'
//                         } else {
//                             itemArray[4] = '身体不适'
//                         }
//                     }
//                     if (key === 'gobackdate') {
//                         itemArray[5] = item[key]
//                     }
//                     if (key === 'trainnumber') {
//                         itemArray[6] = item[key]
//                     }
//                     if (key === 'remark') {
//                         itemArray[7] = item[key]
//                     }
//                 }
//             }
//             arr.push(itemArray)
//         })
//         return arr
//     }

// }


