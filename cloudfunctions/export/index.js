const cloud = require('wx-server-sdk');
const xlsx = require('node-xlsx');

cloud.init()

const db = cloud.database({ env: "soybean-uat" })
const _ = db.command
const $ = db.command.aggregate

async function getLimit(department) {
    let userCount = await db.collection('user_info').where({
        company_department: db.RegExp({
            regexp: department,
            options: 'i',
        }),
        _openid: _.neq("")
    }).count()

    console.log("userCount ", userCount)

    return userCount.total
}

async function getMembers(department) {
    let membersData = await db.collection('user_info').where({
        company_department: db.RegExp({
            regexp: department,
            options: 'i',
        }),
        _openid: _.neq("")
    }).get()

    console.log("members ", membersData)

    let ids = []
    for (let index = 0; index < membersData.data.length; index++) {
        ids.push(membersData.data[index]._openid)
    }

    return ids
}

function getDayString(date, day) {
    let today = date
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

function buildRegexp(input, userType) {
    let departments = input.split(" ")

    let regexpStr = "*"
    let group = ""
    // let regexpStr= input.replace(new RegExp(' ', "g"), "\\s{1}") //^((湖\s{1}北\s{1}的)){1}
    if (userType == -1) { //一级管理员
        regexpStr = ".*"
        group = "中国信息通信研究院"
    } else if (userType == 1) { //二级管理员
        regexpStr = `^((${departments[0]})){1}`
        group = departments[0]
    } else if (userType == 2) { //三级管理员
        let tmp = input.replace(new RegExp(' ', "g"), "\\s")
        regexpStr = `^((${tmp}))$`
        group = input
    }
    
    if (departments[1] == "院属公司及协会") {
        //.*(院属公司及协会)
        regexpStr = `.*(${departments[1]})`
    }

    return {
        regexpStr: regexpStr,
        gorup: group
    }
}

async function regExpIdsFilter(date, days, regExp) {
    let coolingDay = new Date(getDayString(date, -days))
    let limit = await getLimit(".")

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
            date: $.max('$date')
            // name: $.max('$name')
        }).limit(limit).end()

    console.log("filter ", filter)

    let ids = []
    filter.list.forEach(item => {
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

    regExp = regExp.substring(0, regExp.length - 1)
    regExp = regExp + ")^.*$"

    return regExpIdsFilter(new Date(), days, regExp)
}

function notInCitiesIdsWithDay(date, days, cities) {
    //(?!.*北京|.*湖北)^.*$
    let regExp = "(?!"
    cities.forEach(item => {
        regExp = regExp + `.*${item}|`
    })

    regExp = regExp.substring(0, regExp.length - 1)
    regExp = regExp + ")^.*$"

    return regExpIdsFilter(date, days, regExp)
}

async function inCityIds(days, city) {
    return regExpIdsFilter(new Date(), days, city)
}

async function inCityIdsWithDay(date, days, city) {
    return regExpIdsFilter(date, days, city)
}

async function getSegregate(city) {
    let clockDatas = await db.collection('user_healthy').aggregate()
        .match(
            {
                place: db.RegExp({
                    regexp: city,
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

async function getSegregateV(openId, dateTimeStr) {
    let clockDatas = await db.collection('user_healthy').where({
        _openid: openId,
        // isQueZhenFlag: "1", 
        place: db.RegExp({
            regexp: '北京',
            options: 'i',
        }),
        date: dateTimeStr
    }).get()

    console.log("clockDatas ", clockDatas)

    let tmpDate = getDayString(new Date(dateTimeStr), -14)

    if (clockDatas.data == undefined || clockDatas.data.length == 0 || 
        clockDatas.data[0].suregobackdate == undefined || clockDatas.data[0].suregobackdate == "") {
        return "0" //其它
    } else if (new Date(clockDatas.data[0].suregobackdate) > new Date(tmpDate)) {
        return "1" //隔离中
    } else {
        return "0"  //完成隔离
    }
}

async function returnBjs(dateTimeStr) {
    let limit = await getLimit(".")

    let filter = await db.collection('user_healthy').aggregate()
        .match(
            {
                isGoBackFlag: "0",
                isLeaveBjFlag: "0",
                date: dateTimeStr
            }
        )
        .group({
            _id: "$_openid",
            date: $.max('$date'),
            name: $.max('$name'),
        }).limit(limit).end()

    console.log("filter ", filter)

    return filter.list
}

function getDifference(arry1, arry2) {
    if (arry1 == undefined && arry2 == undefined) {
        return []
    } else if (arry1 == undefined) {
        return arry2
    } else if (arry2 == undefined) {
        return arry1
    }

    let result = arry1.concat(arry2).filter(function (v) {
        return arry1.indexOf(v) === -1 || arry2.indexOf(v) === -1
    })

    if (result == undefined || result == []) {
        return []
    }

    return result;
}

async function latestNotBjPlace(openId, dateTimeStr) {
    let filter = await db.collection('user_healthy').where({
        _openid: openId,
        place: db.RegExp({
            regexp: "(?!.*北京)^.*$",
            options: 'i',
        })
    })
        .orderBy("date", "desc")
        .get()

    console.log("filter ", filter)
    let dateTime = new Date(dateTimeStr)

    for (let index = 0; index < filter.data.length; index++) {
        if (new Date(filter.data[index].date) <= dateTime && filter.data[index].place != "北京") {  //place为""时
            return filter.data[index].place
        }
    }

    return ""
}

async function clockedDatas(dateTimeStr) {
    let limit = await getLimit(".")
    let filter = await db.collection('user_healthy').aggregate()
        .match(
            {
                date: dateTimeStr
            }
        )
        .group({
            _id: "$_openid",
            date: $.max('$date')
        }).limit(limit).end()

    console.log("filter ", filter)

    let ids = []
    filter.list.forEach(item => {
        ids.push(item._id)
    })

    return ids
}

async function getUserHealthy(openid, date) {
    let filter = await db.collection('user_healthy').where({
        _openid: openid,
        date: date
    }).get();

    console.log("filter ", filter)

    return filter.data[0]
}


async function getRow3(userInfo, dateTimeStr, group, department) {
    let coolingDays = 28
    let dateTime = new Date(dateTimeStr)
    // let group = "北京泰尔英福网络科技有限责任公司"
    let todayRetureBjCount = 0
    let retureBjCount = 0
    let retureFromHBCount = 0
    let unRetureFromHBCount = 0
    let fromHBCount = 0
    let fromHBAndSegregatingCount = 0
    let fromHBAndSegregatedCount = 0
    let fromNotHBCount = 0
    let retureFromNotHBCount = 0
    let unRetureFromHBNotCount = 0
    let fromNotHBAndSegregatingCount = 0
    let fromNotHBAndSegregatedCount = 0

    let clockeds = await clockedDatas(dateTimeStr)
    let returnedBj = await returnBjs(dateTimeStr)
    let memberIds = await getMembers(department)
    clockeds = intersecteArray(clockeds, memberIds)

    let recentInHbIds = await inCityIdsWithDay(new Date(dateTimeStr), coolingDays, "湖北")
    // let nowInHbIds = await inCityIds(0, "北京")

    //已返回北京
    let returnedBjIds = []
    for (let index = 0; index < returnedBj.length; index++) {
        let item = returnedBj[index]
        if (intersecteArray(clockeds, [item._id]).length == 0) {
            continue
        }

        let healthy = await getUserHealthy(item._id, item.date)

        //当日新增来京人员总数
        if (healthy.suregobackdate == dateTimeStr) {
            todayRetureBjCount = todayRetureBjCount + 1
        }

        //途径湖北
        if (intersecteArray(recentInHbIds, [item._id]).length > 0) {
            //累计从湖北返京人数
            if (new Date(healthy.suregobackdate) <= dateTime) {
                retureFromHBCount = retureFromHBCount + 1

                let isSegregating = await getSegregateV(item._id, dateTimeStr)
                if (isSegregating == "0") {
                     //途径湖北的人数，完成隔离
                     fromHBAndSegregatedCount = fromHBAndSegregatedCount + 1
                } else {
                    //途径湖北的人数，正在隔离
                    fromHBAndSegregatingCount = fromHBAndSegregatingCount + 1  
                }
            }

            //合计途径湖北的人数
            fromHBCount = fromHBCount + 1
        } else { //途径非湖北地区

            //累计从非湖北返京人数
            if (new Date(healthy.suregobackdate) <= dateTime) {
                retureFromNotHBCount = retureFromNotHBCount + 1

                let isSegregating = await getSegregateV(item._id, dateTimeStr)
                if (isSegregating == "0") {
                     //途径非湖北地区的人数，完成隔离
                     fromNotHBAndSegregatedCount = fromNotHBAndSegregatedCount + 1
                } else {
                    //途径非湖北地区的人数，正在隔离
                    fromNotHBAndSegregatingCount = fromNotHBAndSegregatingCount + 1  
                }
            }

            //途径非湖北地区的人数
            fromNotHBCount = fromNotHBCount + 1
        }

        returnedBjIds.push(item._id)
    }

    //累计来京人员总数
    retureBjCount = returnedBjIds.length

    //未返回北京
    let unReturnedBj = getDifference(clockeds, returnedBjIds)
    for (let index = 0; index < unReturnedBj.length; index++) {
        let item = unReturnedBj[index]

        //途径湖北
        if (intersecteArray(recentInHbIds, [item]).length > 0) {
            //未从湖北返京人数
            unRetureFromHBCount = unRetureFromHBCount + 1

            //合计途径湖北的人数
            fromHBCount = fromHBCount + 1
        } else { //途径非湖北地区
            unRetureFromHBNotCount = unRetureFromHBNotCount + 1

            //途径非湖北地区的人数
            fromNotHBCount = fromNotHBCount + 1
        }
    }

    let contrat = userInfo.name
    let phone = userInfo.phone

    let row3 = [
        group,
        todayRetureBjCount,
        retureBjCount,
        fromHBCount,
        unRetureFromHBCount,
        retureFromHBCount,
        fromHBAndSegregatingCount,
        fromHBAndSegregatedCount,
        fromNotHBCount,
        unRetureFromHBNotCount,
        retureFromNotHBCount,
        fromNotHBAndSegregatingCount,
        fromNotHBAndSegregatedCount,
        contrat,
        phone,
        '', '', '', '', '', '', '', '', '', ''];

    return row3
}

async function getRow31(userInfo) {
    let coolingDays = 28

    //当日新增来京人员总数: 离开过北京，在北京，到达北京时间 isLeaveBjFlag  suregobackdate==today
    let yesterdayNotInBjIds = await notInCitiesIds(1, ["北京"]) //前一天不在北京的人
    let nowInBjIds = await inCityIds(0, "北京") //今天在北京的人
    let todayRetureBjCount = intersecteArray(yesterdayNotInBjIds, nowInBjIds).length

    //累计来京人员总数
    let recentNotInBjIds = await notInCitiesIds(coolingDays, ["北京"]) //前28天不在北京的人
    let yesterdayInBjIds = await inCityIds(28, "北京") //前一天在北京的人
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
    let recentNotInHbAndNotInBjIds = await notInCitiesIds(coolingDays, ["北京", "湖北"]) //前28天不在湖北也不在北京的人 现在在北京的人
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
    let fromNotHBAndSegregatedCount = intersecteArray(retureFromNotHB, segregate.finished).length

    let contrat = userInfo.name
    let phone = userInfo.phone

    let row3 = [
        "北京泰尔英福网络科技有限责任公司",
        todayRetureBjCount,
        retureBjCount,
        fromHBCount,
        unRetureFromHBCount,
        retureFromHBCount,
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

async function buildClockedUsers(data, userInfo, dateTimeStr, recentNotInBjIds) {

    //total 25 data
    let row = []

    //提交人
    row.push(userInfo.name)

    //提交时间
    row.push(data.addtime)

    //部门
    row.push(userInfo.company_department)

    //是否填写
    row.push("是")

    //离京时间/计划离京时间
    if (data.leavedate == undefined) {
        row.push("")
    } else {
        row.push(data.leavedate)
    }

    //联系电话
    row.push(userInfo.phone)

    //在京居住地址
    if (userInfo.home_district.substring(0, 2) == "北京") {
        row.push(`${userInfo.home_district} ${userInfo.home_detail}`)
    } else {
        row.push("")
    }

    //未返京人员
    if (data.isGoBackFlag != undefined && data.isGoBackFlag == "1") {
        //未返京原因身体不适/当地未放行等
        if (data.noGoBackFlag == "1") {
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
    } else {
        row.push("")
        row.push("")
    }

    //是否从其他城市返回
    let isRetured = false
    let recentIds = intersecteArray(recentNotInBjIds, [data._openid])
    if (data.place.substring(0, 2) == "北京" && 
            (data.isGoBackFlag == "0" && data.isLeaveBjFlag == "0" || recentIds.length == 1)) {
        isRetured = true
    }
    
    if (isRetured) {
        row.push("是") //离开过北京
    } else if (data.place.substring(0, 2) == "北京") {
        row.push("") //一直在北京
    } else {
        row.push("否")  //未返回北京
    }

    // if (data.place.substring(0, 2) != "北京") {
    //     row.push("否")
    // } else if (data.place.substring(0, 2) == "北京") {
    //     if (intersecteArray(recentNotInBjIds, [data._openid]).length > 0) {
    //         row.push("是")
    //         isRetured = true
    //     } else {
    //         row.push("")
    //     }
    // }

    //返程的交通工具中是否出现确诊的新型肺炎患者
    row.push("")

    //返程统计.返程出发地
    if (isRetured) {
        if (data.place.substring(0, 2) == "北京") {
            let place = await latestNotBjPlace(data._openid, dateTimeStr)
            row.push(place)
        }
    } else {
        row.push("")
    }

    //返程统计.返程日期
    if (isRetured && data.suregobackdate != undefined) {
        row.push(data.suregobackdate)
    } else {
        row.push("")
    }

    //返程统计.交通方式 
    if (isRetured && data.trafficToolStatusFlag != undefined) {
        if (data.trafficToolStatusFlag == "0") {
            row.push("飞机")
        } else if (data.trafficToolStatusFlag == "1") {
            row.push("火车")
        } else if (data.trafficToolStatusFlag == "2") {
            row.push("汽车")
        } else if (data.trafficToolStatusFlag == "3") {
            row.push("轮船")
        } else if (data.trafficToolStatusFlag == "4") {
            row.push("其它")
        } else {
            row.push("")
        }
    } else {
        row.push("")
    }

    //返程统计.航班/车次/车牌号
    if (isRetured && data.trainnumber != undefined) {
        row.push(data.trainnumber)
    } else {
        row.push("")
    }

    //开始观察日期
    if (isRetured && data.suregobackdate != undefined) {
        row.push(data.suregobackdate)
    } else {
        row.push("")
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
    } else {
        row.push("是")
    }

    //目前健康状况
    if (data.bodyStatusFlag == undefined) {
        row.push("")
    } else if (data.bodyStatusFlag == "0") {
        row.push("是")
    } else {
        row.push("否")
    }

    //是否有就诊住院
    if (data.goHospitalFlag == undefined) {
        row.push("")
    } else if (data.goHospitalFlag == "0") {
        row.push("是")
    } else {
        row.push("否")
    }

    //是否有接触过疑似病患、接待过来自湖北的亲戚朋友、或者经过武汉
    if (data.goHBFlag == undefined) {
        row.push("")
    } else if (data.goHBFlag == "0") {
        row.push("是")
    } else {
        row.push("否")
    }

    //其他不适症状
    if (data.bodystatusotherremark != undefined) {
        row.push(data.bodystatusotherremark)
    } else {
        row.push("")
    }


    //可在这里补充希望获得的帮助
    if (data.remark != undefined) {
        row.push(data.remark)
    } else {
        row.push("")
    }

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
    if (data.home_district.substring(0, 2) == "北京") {
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

    //其他不适症状
    row.push("")

    //可在这里补充希望获得的帮助
    row.push("")

    return row
}

async function getDetails(dateTimeStr, department) {
    let userAggr = {}
    let limit = await getLimit(department)

    userAggr = await db.collection('user_info').aggregate()
        .match({
            company_department: db.RegExp({
                regexp: department,
                options: 'i',
            }),
            _openid: _.neq("")
        })
        .group({
            _id: "$_openid",
            userId: $.min('$_openid')
        }).limit(limit).end()

    console.log("userAggr ", userAggr.list)

    let members = []
    for (let index = 0; index < userAggr.list.length; index++) {
        members.push(userAggr.list[index]._id)
    }

    let rowDatas = []
    let clockedUsers = await db.collection('user_healthy').where({
        date: dateTimeStr,
        _openid: _.in(members)
    }).get()

    let clockedIds = []
    for (let index = 0; index < clockedUsers.data.length; index++) {
        clockedIds.push(clockedUsers.data[index]._openid)
    }

    let unClockedIds = getDifference(members, clockedIds)

    console.log("clockedUsers ", clockedUsers)
    console.log("clockedIds ", clockedIds)
    console.log("unClockedIds ", unClockedIds)

    let clockedUsersInfo = await db.collection('user_info').where({
        _openid: _.in(clockedIds)
    }).get()

    let recentNotInBjIds = await notInCitiesIdsWithDay(new Date(dateTimeStr), 28, ["北京"])
    for (let i = 0; i < clockedUsers.data.length; i++) {
        for (let j = 0; j < clockedUsersInfo.data.length; j++) {
            if (clockedUsers.data[i]._openid == clockedUsersInfo.data[j]._openid) {
                let row = await buildClockedUsers(clockedUsers.data[i], clockedUsersInfo.data[j], dateTimeStr, recentNotInBjIds)
                rowDatas.push(row)
                break;
            }
        }
    }

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

        let department = "*"
        let group = ""
        if (userInfo.usertype != undefined && userInfo.usertype == "1") { //^((湖\s{1}北\s{1}的)){1}
            if (userInfo.company_department == undefined || userInfo.company_department == "") {
                department = "*"  //没有部门的人
                group = userInfo.company_department
            } else {
                let regexp = buildRegexp(userInfo.company_department, "1")
                department = regexp.regexpStr //二级部门管理员，能看到自己所在部门的信息
                group = regexp.gorup
            }
        } else if (userInfo.usertype != undefined && userInfo.usertype == "2") {
            department = userInfo.company_department //部门管理员，能看到自己所在部门的信息
            if (userInfo.company_department == undefined || userInfo.company_department == "") {
                department = "*"  
                group = userInfo.company_department
            } else {
                let regexp = buildRegexp(userInfo.company_department, "2") //三级管理员
                department = regexp.regexpStr
                group = regexp.gorup
            }
        } 
        
        if (userInfo.superuser != undefined && userInfo.superuser == "1") {
            let regexp = buildRegexp(userInfo.company_department, "-1") //超级管理员，能看到所有人的信息
                department = regexp.regexpStr
                group = regexp.gorup
        }

        if (department == "*") { //没权限，返回空表
            return await cloud.uploadFile({
                cloudPath: dataCVS,
                fileContent: await xlsx.build([{
                    name: "Sheet0",
                    data: []
                }]),
            })
        }

        let alldata = [];
        let row1 = ['单位名称', '当日新增来京人员总数', '来京人员累计总数(含当日新增) (A)', '从湖北省或途径湖北来京员工人数', '', '', '', '', '从湖北省以外地区来京员工人数', '', '', '', '', '联系人', '电话']
        let row2 = ['', '', '', '人数合计(B)', '其中未返京人数(C)', '其中已返京人数(D)', '已返京人员中自行隔离(14天)人数', '过隔离期人数', '人数合计(E)', '其中未返京人数(F)', '其中已返京人数(G)', '已返京人员中自行隔离(14天)人数', '过隔离期人数']
        let row3 = await getRow3(userInfo, dateTimeStr, group, department)
        let row4 = [] //['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
        let row5 = ['提交人', '提交时间', '部门', '是否填写', '离京时间/计划离京时间', '联系电话', '在京居住地址', '未返京原因（身体不适/当地未放行等）', '计划返京时间', '是否从其他城市返回', '返程的交通工具中是否出现确诊的新型肺炎患者', '返程统计.返程出发地', '返程统计.返程日期', '返程统计.交通方式', '返程统计.航班/车次/车牌号', '开始观察日期', '当前时间,当前地点/城市', '体温（°C）', '是否有发烧、咳嗽等症状', '目前健康状况', '是否有就诊住院', '是否有接触过疑似病患、接待过来自湖北的亲戚朋友、或者经过武汉', '其他不适症状', '可在这里补充希望获得的帮助']

        alldata.push(row1);
        alldata.push(row2);
        alldata.push(row3);
        alldata.push(row4);
        alldata.push(row5);

        let details = await getDetails(dateTimeStr, department);

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
            fileContent: buffer,
        })

    } catch (e) {
        console.error(e)
        return e
    }
}
