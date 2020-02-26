const cloud = require('wx-server-sdk');
const xlsx = require('node-xlsx');

cloud.init()

const db = cloud.database({ env: "soybean-uat" })
const _ = db.command
const $ = db.command.aggregate

function getDayString(day) {
    var today = new Date();
    var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
    today.setTime(targetday_milliseconds);
    var tYear = today.getFullYear();
    var tMonth = today.getMonth();
    var tDate = today.getDate();
    tMonth = doHandleMonth(tMonth + 1);
    tDate = doHandleMonth(tDate);

    return tYear + "-" + tMonth + "-" + tDate;
}

function doHandleMonth(month) {
    var m = month;
    if (month.toString().length == 1) {
        m = "0" + month;
    }
    return m;
}

function intersecteArray(array1, array2) {
    let result = []
    if (array1 == undefined || array1.length == 0 
        || array2 == undefined || array2.length == 0) {
            return result
        }

    array1.forEach(item1 => {
        array2.forEach(item2 => {
            if (item1 == item2) {
                result.push(item2)
            }
        })
    })

    return result
}

async function regExpIdsFilter(days, regExp) {
    let coolingDay = new Date(getDayString(-days))

    let filter = await db.collection('user_healthy').aggregate()
        .match(
            {
                place: db.RegExp({
                    regexp: regExp, //'北京*'  
                    options: 'i',
                })
            }
        )
        .group({
            _id: "$_openid",
            date: $.max('$date'),
            // place: $.max('$place')
        }).end()

    console.log("filter ", filter)

    let ids = []
    filter.list.forEach(item => {
        let tmpDay = new Date(item.date)
        if (new Date(item.date) >= coolingDay) {
            ids.push(item._id)
        }
    })

    return ids
}

function notInCitiesIds(days, cities) {
    //(?!.*北京|.*湖北)^.*$
    let regExp = "(?!"
    cities.forEach(item => {
        regExp = regExp + `.*${item}|`
    })

    regExp = regExp.substring(0, regExp.length -1)
    regExp = regExp + ")^.*$"

    return  regExpIdsFilter(days, regExp)
}

async function inCityIds(days, city) {
    return  regExpIdsFilter(days, city + '*')
}

async function getSegregate(city) {
    let clockDatas = await db.collection('user_healthy').aggregate()
        .match(
            {
                place: db.RegExp({
                    regexp: city + '*',
                    options: 'i',
                }),
                bodyStatusFlag: "0"
            }
        )
        .group({
            _id: "$_openid",
            count: $.sum(1),
            // place: $.max('$place')
        }).end()

    console.log("clockDatas ", clockDatas)

    let finished = []
    let unFinished = []
    clockDatas.list.forEach(item => {
        if (item.count >= 14) {
            finished.push(item._id)
        } else {
            unFinished.push(item._id)
        }
    })

    return {
        finished: finished,
        unFinished: unFinished
    }
}

async function getRow3() {
    let coolingDays = 28

    //当日新增来京人员总数: 离开过北京，在北京，到达北京时间 isLeaveBjFlag  suregobackdate==today
    let yesterdayNotInBjIds = await notInCitiesIds(1, ["北京"]) //前一天不在北京的人
    let nowInBjIds = await inCityIds(0 ,"北京") //今天在北京的人
    let todayRetureBjCount = intersecteArray(yesterdayNotInBjIds, nowInBjIds).length

    //累计来京人员总数
    let recentNotInBjIds = await notInCitiesIds(coolingDays, ["北京"]) //前28天不在北京的人
    let yesterdayInBjIds = await inCityIds(1 ,"北京") //前一天在北京的人
    let retureBjCount = intersecteArray(recentNotInBjIds, yesterdayInBjIds).length //前一天在北京

    //累计从湖北返京人数
    let recentInHbIds = await inCityIds(coolingDays, "湖北") //前28天在湖北的人
    let retureFromHBCount = intersecteArray(recentInHbIds, yesterdayInBjIds).length

    //未从湖北返京人数
    let unRetureFromHBCount = intersecteArray(recentInHbIds, yesterdayNotInBjIds).length

    //合计途径湖北的人数
    let fromHBCount = recentInHbIds.length

    //途径湖北的人数，正在隔离
    let segregate = await getSegregate("北京")
    let fromHBAndSegregatingCount = intersecteArray(recentInHbIds, segregate.unFinished).length

    //途径湖北的人数，且完成隔离
    let fromHBAndSegregatedCount = intersecteArray(recentInHbIds, segregate.finished).length

    //累计从非湖北地区返京人数
    let recentNotInHbAndNotInBjIds = await notInCitiesIds(coolingDays , ["北京", "湖北"]) //前28天不在湖北也不在北京的人 现在在北京的人
    let retureFromNotHB = intersecteArray(recentNotInHbAndNotInBjIds, yesterdayInBjIds)
    let retureFromNotHBCount = retureFromNotHB.length

    //未从非湖北地区返京人数
    //不在湖北， 也不在北京
    let unRetureFromHBNotCount = recentNotInHbAndNotInBjIds.length - retureFromNotHBCount//  intersecteArray(recentNotInHbAndNotInBjIds, yesterdayNotInBjIds).length

    //合计途径非湖北地区的人数
    let fromNotHBCount = recentNotInHbAndNotInBjIds.length

    //途径非湖北地区的人数，正在隔离
    let fromNotHBAndSegregatingCount = intersecteArray(retureFromNotHB, segregate.unFinished).length

    //途径非湖北地区的人数，且完成隔离
    let fromNotHBAndSegregatedCount = intersecteArray(retureFromNotHB,  segregate.finished).length

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
    if (data.gobackdate == undefined) {
        row.push("")
    } else {
        row.push(data.gobackdate)
    }

    //是否从其他城市返回
    if (data.noGoBackFlag != undefined) {
        row.push("否")
    } else if (currentUserInfo.home_district.substring(0, 3) != "北京市") {
        if (data.suregobackdate != undefined && new Date(data.suregobackdate) <= new Date(dateTimeStr)) {
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
    if (data.noGoBackFlag != undefined && currentUserInfo.home_district.substring(0, 3) != "北京市") {
        row.push(currentUserInfo.home_district)
    } else {
        row.push("")
    }

    //返程统计.返程日期
    if (data.suregobackdate == undefined) {
        row.push("")
    } else {
        row.push(data.suregobackdate)
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
    if (data.gobackdate == undefined) {
        row.push("")
    } else {
        row.push(data.gobackdate)
    }

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
        row.push("是")
    } else if (data.bodyStatusFlag == "1") {
        row.push("否")
    } else {
        row.push("其他")
    }

    //是否有就诊住院
    if (data.goHospitalFlag == undefined) {
        row.push("")
    } else if (data.goHospitalFlag == "0") {
        row.push("是")
    } else if (data.goHospitalFlag == "1") {
        row.push("否")
    }

    //是否有接触过疑似病患、接待过来自湖北的亲戚朋友、或者经过武汉
    if (data.goHBFlag == undefined) {
        row.push("")
    } else if (data.goHBFlag == "0") {
        row.push("是")
    } else if (data.goHBFlag == "1") {
        row.push("否")
    }

    //腹泻
    row.push("")

    //肌肉酸疼
    row.push("")

    //其他不适症状
    row.push(data.remark) //bodystatusotherremark

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
    if (data.home_district.substring(0, 3) == "北京市") {
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

async function getDetails(dateTimeStr, userType, department) {
    let userCount = {}
    let userAggr = {}
    if (userType == 0) { //部门管理员
        userCount = await db.collection('user_info').where({
            company_department: _.eq(department)
        }).count()

        userAggr = await db.collection('user_info').aggregate()
            .match(
                $.and([
                    { company_department: department }
                ])
            )
            .group({
                _id: "$_openid",
                userId: $.min('$_openid')
            }).limit(userCount.total).end()
    } else {
        userCount = await db.collection('user_info').where({
            _openid: _.neq("")
        }).count()

        userAggr = await db.collection('user_info').aggregate()
            .group({
                _id: "$_openid",
                userId: $.min('$_openid')
            }).limit(userCount.total).end()
    }

    console.log("userAggr ", userAggr.list)

    let clockedIds = []
    let unClockedIds = []

    for (let index = 0; index < userAggr.list.length; index++) {
        let item = userAggr.list[index]
        let healthyAggr = await db.collection('user_healthy').aggregate()
            .match(
                $.and([
                    { _openid: item.userId }
                ])
            )
            .group({
                _id: "$_openid",
                lastCockedDate: $.max('$date')
            }).end()

        if (healthyAggr.list.length > 0 && healthyAggr.list[0].lastCockedDate == dateTimeStr) {
            clockedIds.push(item.userId)
        } else {
            unClockedIds.push(item.userId)
        }
    }

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

        let userInfo = user.data[0]
        let dataCVS = `统计信息表-${userInfo.name}-${Number(new Date())}.xlsx`

        let userType = -1
        if (userInfo.usertype != undefined && userInfo.usertype == "1") {
            userType = 0 //部门管理员，能看到自己所在部门的信息

            if (userInfo.company_department == undefined || userInfo.company_department == "") {
                userType = -1  //没有部门的人
            }
        }

        if (userInfo.superuser != undefined && userInfo.superuser == "1") {
            userType = 1 //超级管理员，能看到所有人的信息
        }

        if (userType == -1) { //没权限，返回空表
            return await cloud.uploadFile({
                cloudPath: dataCVS,
                fileContent: await xlsx.build([{
                    name: "Sheet0",
                    data: []
                }]),
            })
        }

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

        let details = await getDetails(dateTimeStr, userType, userInfo.company_department);

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

