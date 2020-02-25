const cloud = require('wx-server-sdk');
const xlsx = require('node-xlsx');

cloud.init()

const db = cloud.database({ env: "soybean-uat" })
const _ = db.command
const $ = db.command.aggregate

async function getRow3(dateTimeStr) {

    //当日新增来京人员总数: 离开过北京，在北京，到达北京时间 isLeaveBjFlag  suregobackdate==today
    let todayRetureBjC = await db.collection('user_healthy').aggregate()
        .match(
            $.and([
                { isLeaveBjFlag: "0" },
                { suregobackdate: { $eq: dateTimeStr } }
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
                { suregobackdate: { $lte: dateTimeStr } }
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
                { suregobackdate: { $lte: dateTimeStr } }
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
                { gobackdate: { $gt: dateTimeStr } }
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
    let fromHBAndSegregatingCount = ""

    //途径湖北的人数，且完成隔离
    let fromHBAndSegregatedCount = ""


    //累计从非湖北地区返京人数
    let retureFromNotHBC = await db.collection('user_healthy').aggregate()
        .match(
            $.and([
                { goHBFlag: "1" },
                { isLeaveBjFlag: "0" },
                { suregobackdate: { $lte: dateTimeStr } }
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
                { gobackdate: { $gt: dateTimeStr } }
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
    let fromNotHBAndSegregatingCount = ""

    //途径非湖北地区的人数，且完成隔离
    let fromNotHBAndSegregatedCount = ""

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
        '', '', '', '', '', '', '', '', '', ''];

    return row3
}

function buildClockedUsers(data, dateTimeStr) {
    // let dateTime = new Date(dateTimeStr)

    //total 25 data
    let row = []

    currentUserInfo = data.userinfo[0]
    //提交人
    row.push(currentUserInfo.name)

    //提交时间
    row.push(data.addtime)

    //部门
    row.push(currentUserInfo.company_department)

    //是否填写
    row.push("是")

    //离京时间/计划离京时间
    if (data.leavedate == undefined) {
        row.push("")
    } else {
        row.push(data.leavedate)
    }

    //联系电话
    row.push(currentUserInfo.phone)

    //在京居住地址
    if (currentUserInfo.home_district.substring(0, 3) == "北京市") {
        row.push(`${currentUserInfo.home_district} ${currentUserInfo.home_detail}`)
    } else {
        row.push("")
    }

    //未返京原因（身体不适/当地未放行等
    if (data.noGoBackFlag == undefined) {
        row.push("")
    } else if (data.noGoBackFlag == "1") {
        row.push("当地未放行")
    } else {
        row.push("身体不适")
    }

    //计划返京时间
    if (data.suregobackdate == undefined) {
        row.push("")
    } else {
        row.push(data.suregobackdate)
    }

    //是否从其他城市返回
    if (currentUserInfo.home_district.substring(0, 3) != "北京市") {
        if (data.gobackdate != undefined && new Date(data.gobackdate) <= new Date(dateTimeStr)) {
            row.push("是")
        } else {
            row.push("否")
        }
    } else {
        row.push("")
    }

    //返程的交通工具中是否出现确诊的新型肺炎患者
    row.push("")

    //返程统计.返程出发地
    row.push("")

    //返程统计.返程日期
    if (data.gobackdate == undefined) {
        row.push("")
    } else {
        row.push(data.gobackdate)
    }

    //返程统计.交通方式
    row.push("")

    //返程统计.航班/车次/车牌号
    if (data.trainnumber == undefined) {
        row.push("")
    } else {
        row.push(data.trainnumber)
    }

    //开始观察日期
    row.push("")

    //当前时间,当前地点/城市
    row.push(`${data.addtime} ${data.place}`)

    //体温（°C）
    row.push(data.temperature)

    //是否有发烧、咳嗽等症状
    if (data.bodyStatusFlag == undefined) {
        row.push("")
    } else if (data.bodyStatusFlag == "0") {
        row.push("否")
    } else if (data.bodyStatusFlag == "1") {
        row.push("是")
    }

    //目前健康状况
    if (data.bodyStatusFlag == undefined) {
        row.push("")
    } else if (data.bodyStatusFlag == "0") {
        row.push("否")
    } else if (data.bodyStatusFlag == "1") {
        row.push("是")
    } else {
        row.push("其他")
    }

    //是否有就诊住院
    if (data.goHospitalFlag == undefined) {
        row.push("")
    } else if (data.goHospitalFlag == "0") {
        row.push("否")
    } else if (data.goHospitalFlag == "1") {
        row.push("是")
    }

    //是否有接触过疑似病患、接待过来自湖北的亲戚朋友、或者经过武汉
    if (data.goHBFlag == undefined) {
        row.push("")
    } else if (data.goHBFlag == "0") {
        row.push("否")
    } else if (data.goHBFlag == "1") {
        row.push("是")
    }

    //腹泻
    row.push("")

    //肌肉酸疼
    row.push("")

    //其他不适症状
    row.push(data.remark)

    //可在这里补充希望获得的帮助
    row.push("")

    return row
}

function buildUnClockedUsers(data) {
    //total 25 data
    let row = []

    //提交人
    row.push(data.name)

    //提交时间
    row.push("")

    //部门
    row.push(data.company_department)

    //是否填写
    row.push("否")

    //离京时间/计划离京时间
    row.push("")

    //联系电话
    row.push(data.phone)

    //在京居住地址
    if (data.home_district.substring(0, 2) == "北京市") {
        row.push(`${data.home_district} ${data.home_detail}`)
    } else {
        row.push("")
    }

    //未返京原因（身体不适/当地未放行等)
    row.push("")

    //计划返京时间
    row.push("")

    //是否从其他城市返回
    row.push("")

    //返程的交通工具中是否出现确诊的新型肺炎患者
    row.push("")

    //返程统计.返程出发地
    row.push("")

    //返程统计.返程日期
    row.push("")

    //返程统计.交通方式
    row.push("")

    //返程统计.航班/车次/车牌号
    row.push("")

    //开始观察日期
    row.push("")

    //当前时间,当前地点/城市
    row.push("")

    //体温（°C）
    row.push("")

    //是否有发烧、咳嗽等症状
    row.push("")

    //目前健康状况
    row.push("")

    //是否有就诊住院
    row.push("")

    //是否有接触过疑似病患、接待过来自湖北的亲戚朋友、或者经过武汉
    row.push("")

    //腹泻
    row.push("")

    //肌肉酸疼
    row.push("")

    //其他不适症状
    row.push("")

    //可在这里补充希望获得的帮助
    row.push("")

    return row
}

async function getDetails(dateTimeStr) {

    let dataAggr = await db.collection('user_healthy').aggregate()
        .group({
            _id: "$_openid",
            userId: $.min('$_openid'),
            lastCockedDate: $.max('$date')
        }).end()

    console.log("dataAggr ", dataAggr.list)

    let clockedIds = []
    let unClockedIds = []
    dataAggr.list.forEach(item => {
        if (item.lastCockedDate == dateTimeStr) {
            clockedIds.push(item.userId)
        } else {
            unClockedIds.push(item.userId)
        }
    });

    console.log("clockedIds ", clockedIds)
    console.log("unClockedIds ", unClockedIds)

    let rowDatas = []
    let clockedUsers = await db.collection('user_healthy').where({
        date: dateTimeStr,
        _openid: _.in(clockedIds)
    }).get()

    console.log("clockedUsers ", clockedUsers)

    clockedUsers.data.forEach(item => {
        let row = buildClockedUsers(item, dateTimeStr)
        rowDatas.push(row)
    });

    let unClockedUsers = await db.collection('user_info').where({
        _openid: _.in(unClockedIds)
    }).get()

    console.log("unClockedUsers ", unClockedUsers)

    unClockedUsers.data.forEach(item => {
        let row = buildUnClockedUsers(item)
        rowDatas.push(row)
    })

    return rowDatas
}

exports.main = async (event, context) => {
    try {
        let dateTimeStr = event.date
        let openId = cloud.getWXContext().OPENID

        if (event.user_id != undefined) {
            openId = event.user_id
        }        

        // let dateTimeStr = "2020-02-25"
        // let openId = "oqME_5SxOS8uyKMun5rV4VkkM7Ao"

        let user = await db.collection('user_info').where({
            _openid: openId
        }).get()

        let dataCVS = `统计信息表-${user.data[0].name}-${Number(new Date())}.xlsx`

        let alldata = [];
        let row1 = ['单位名称', '当日新增来京人员总数', '来京人员累计总数(含当日新增) (A)', '从湖北省或途径湖北来京员工人数', '', '', '', '', '从湖北省以外地区来京员工人数', '', '', '', '', '联系人', '电话', '', '', '', '', '', '', '', '', '', '']
        let row2 = ['', '', '', '人数合计(B)', '其中未返京人数(C)', '其中已返京人数(D)', '已返京人员中自行隔离(14天)人数', '过隔离期人数', '人数合计(E)', '其中未返京人数(F)', '其中已返京人数(G)', '已返京人员中自行隔离(14天)人数', '过隔离期人数', '', '', '', '', '', '', '', '', '', '', '', '']
        let row3 = await getRow3(dateTimeStr)
        let row4 = [] //['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
        let row5 = ['提交人', '提交时间', '部门', '是否填写', '离京时间/计划离京时间', '联系电话', '在京居住地址', '未返京原因（身体不适/当地未放行等）', '计划返京时间', '是否从其他城市返回', '返程的交通工具中是否出现确诊的新型肺炎患者', '返程统计.返程出发地', '返程统计.返程日期', '返程统计.交通方式', '返程统计.航班/车次/车牌号', '开始观察日期', '当前时间,当前地点/城市', '体温（°C）', '是否有发烧、咳嗽等症状', '目前健康状况', '是否有就诊住院', '是否有接触过疑似病患、接待过来自湖北的亲戚朋友、或者经过武汉', '腹泻', '肌肉酸疼', '其他不适症状', '可在这里补充希望获得的帮助']

        alldata.push(row1);
        alldata.push(row2);
        alldata.push(row3);
        alldata.push(row4);
        alldata.push(row5);


        let details = await getDetails(dateTimeStr);

        details.forEach(item => {
            alldata.push(item)
        })

        const ranges = [
            { s: { c: 0, r: 0 }, e: { c: 0, r: 1 } },
            { s: { c: 1, r: 0 }, e: { c: 1, r: 1 } },
            { s: { c: 2, r: 0 }, e: { c: 2, r: 1 } },

            { s: { c: 3, r: 0 }, e: { c: 7, r: 0 } },
            { s: { c: 8, r: 0 }, e: { c: 12, r: 0 } },
            { s: { c: 13, r: 0 }, e: { c: 13, r: 1 } },
            { s: { c: 14, r: 0 }, e: { c: 14, r: 1 } }
        ];
        const options = { '!merges': ranges };

        var buffer = await xlsx.build([{
            name: "Sheet0",
            data: alldata
        }], options);

        return await cloud.uploadFile({
            cloudPath: dataCVS,
            fileContent: buffer, //excel二进制文件
        })

    } catch (e) {
        console.error(e)
        return e
    }
}




/*
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

    let row1 = ['单位名称', '当日新增来京人员总数', '来京人员累计总数(含当日新增) (A)', '从湖北省或途径湖北来京员工人数', '', '', '', '', '从湖北省以外地区来京员工人数', '', '', '', '', '联系人', '电话']
    let row2 = ['', '', '', '人数合计(B)', '其中未返京人数(C)', '其中已返京人数(D)', '已返京人员中自行隔离(14天)人数', '过隔离期人数', '人数合计(E)', '其中未返京人数(F)', '其中已返京人数(G)', '已返京人员中自行隔离(14天)人数', '过隔离期人数', '', '']
    let row3 = ['北京泰尔英福网络科技有限责任公司', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
    let row4 = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']

    //26
    let row5 = ['提交人', '提交时间', '部门', '是否填写', '离京时间/计划离京时间', '联系电话', '在京居住地址', '未返京原因（身体不适/当地未放行等）', '计划返京时间', '是否从其他城市返回', '返程的交通工具中是否出现确诊的新型肺炎患者', '返程统计.返程出发地', '返程统计.返程日期', '返程统计.交通方式', '返程统计.航班/车次/车牌号', '开始观察日期', '当前时间,当前地点/城市', '体温（°C）', '是否有发烧、咳嗽等症状', '目前健康状况', '是否有就诊住院', '是否有接触过疑似病患、接待过来自湖北的亲戚朋友、或者经过武汉', '腹泻', '肌肉酸疼', '其他不适症状', '可在这里补充希望获得的帮助']


    let confParams = ['姓名', '离京时间', '目前所在地', '返京时间', '未返京原因', '计划返京时间', '交通方式（自驾、火车、飞机）班次', '打卡备注信息'] // 模拟表头

    let jsonData = []

    let time = event
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
            if (i != 0) {
                jsonData = jsonData.concat(res.data)
            } else {
                jsonData = res.data
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

                    if (key === 'name') {
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
                        if (item[key] == '1') {
                            itemArray[4] = '当地未放行'
                        } else {
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
*/

