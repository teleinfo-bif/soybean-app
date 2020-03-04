// import F2 from '../../components/f2-canvas/lib/f2';

const app = getApp()

var wxCharts = require('../../utils/wxcharts.js');
// var app = getApp();
var ringChart = null;
var ringChart2 = null;
var ringChart3 = null;
var ringChart4 = null;
const db = wx.cloud.database({
  env: "soybean-uat"
})
const _ = db.command

Page({
  data: {
    title:{
      image: "../../images/tongjixinxi.png",
      text: "统计信息",
      date: "2020-02-01",
    },

    titleText: "统计信息",

    shouldText: "应填写人数",
    filledInText: "已填写人数",
    confirmedText: "确诊人数",
    returnJingText: "返京人数",
    leaveJingText: "离京未返京人数",
    stateBadText: "非健康人数",
    doneText: "在岗人数",
    unDoneText: "未复工人数",
    homeText: "远程办公人数",
    shouldFilledNumber: 0,
    hasFilledNumber: 0,
    returnBeijingNumber: 0,
    outBeijingNumber: 0,
    healthyBadNumber: 0,
    doneNumber:0,
    unDoneNumber:0,
    homeNumber:0,
    
    // healthy datas
    totalStateNumber: 0,
    stateGoodNumber: 0,
    stateServerNumber: 0,
    stateOthersNumber: 0,

    stateGoodPercent: 0,
    stateOthersPercent: 0,
    stateServerPercent: 0,

    // area datas
    beijingNumber: 0,
    wuhanNumber: 0,
    hubeiNumber: 0,
    othersNumber: 0,
    totalAreaNumber: 0,

    beijingPercent: 0,
    wuhanPercent: 0,
    hubeiPercent: 0,
    othersPercent: 0,

    // case datas
    confirmedNumber: 0,
    isolateNumber: 0,
    outIsolateNumber: 0,
    otherCasesNumber: 0,
    totalCasesNumber: 0,
    
    totalworksNumber: 0,

    confirmedPercent: 0,
    isolatePercent: 0,
    outIsolatePercent: 0,
    otherCasesPercent: 0,

    doneP:0,
    unP:0,
    homeP:0,
    otherP:0,

    showDate: "",

    ringWidth: 200,
    ringHeight: 150,
    ringHou: 10,
    ringBackGround: "#f5f5f5",

    userCompanyDepartment: "",
    authorityLevel : 0,

    regCompanyInfo: "",
    companyDepartment: "",

    departmentLevel: "2",
    departmentName: ""

  },



  bindDateChange: function(e) {
    console.log(e)
    
    var selectedDate = new Date(e.detail.value)
    var current = new Date()
    var startDate = new Date('2020-02-22')
    var date2 = new Date("2020-02-21")

    console.log("cha: ", date2.getTime() - startDate.getTime())

    var ms = selectedDate.getTime() - current.getTime()
    var startDuring = selectedDate.getTime() - startDate.getTime()

    var tempDate = this.data.showDate

    if (ms > 86400000) {
      console.log("后天： ", ms)
      wx.showModal({
        title: '提示',
        content: "亲, 还没到时间!"
      })
    }else if (startDuring < 0) {
      wx.showModal({
        title: '提示',
        content: "亲, 过时了!"
      })
    }
    else {
      this.setData({
        showDate: e.detail.value
      })
      this.analysisLevel(this.data.authorityLevel)
    }
  },
  getLimitDone:function(datas) {
    var sum = 0
    for (var i = 0; i < datas.length; i++) {
      if (datas[i].workStatusFlag == "0") {
        sum += 1
      }
    }
    return sum
  },
  getLimitUn: function (datas) {
    var sum = 0
    for (var i = 0; i < datas.length; i++) {
      if (datas[i].workStatusFlag == "2") {
        sum += 1
      }
    }
    return sum
  },
  getLimitHome: function (datas) {
    var sum = 0
    for (var i = 0; i < datas.length; i++) {
      if (datas[i].workStatusFlag == "1") {
        sum += 1
      }
    }
    return sum
  },

  initChats: function(e) {
    // var windowWidth = 200;

    ringChart = new wxCharts({
      animation: true,
      canvasId: 'ringCanvas',
      type: 'ring',
      extra: {
        ringWidth: this.data.ringHou,
        pie: {
          offsetAngle: -45
        }
      },
      // title: {
      //   name: '70%',
      //   color: '#7cb5ec',
      //   fontSize: 25
      // },
      // subtitle: {
      //   name: '收益率',
      //   color: '#666666',
      //   fontSize: 15
      // },
      series: [{
        name: '健康人数',
        data: this.data.stateGoodNumber,
        stroke: false,
        color: "#4169E1"
      }, {
        name: '其他症状',
        data: this.data.stateOthersNumber,
        stroke: false,
          color: "#f2d45e"
      }, {
        name: '咳嗽、发烧',
        data: this.data.stateServerNumber,
        stroke: false,
        color: "#aa4438",
      },
      ],
      disablePieStroke: false,
      width: this.data.ringWidth,
      height: this.data.ringHeight,
      dataLabel: false,
      legend: false,
      background: this.data.ringBackGround,
      padding: 0
    });


    ringChart.addEventListener('renderComplete', () => {
      console.log('renderComplete');
    });

    setTimeout(() => {
      ringChart.stopAnimation();
    }, 500);

    ringChart2 = new wxCharts({
      animation: true,
      canvasId: 'ringCanvas2',
      type: 'ring',
      extra: {
        ringWidth: this.data.ringHou,
        pie: {
          offsetAngle: -45
        }
      },
      // title: {
      //   name: '70%',
      //   color: '#7cb5ec',
      //   fontSize: 25
      // },
      // subtitle: {
      //   name: '收益率',
      //   color: '#666666',
      //   fontSize: 15
      // },
      series: [{
        name: '武汉人数',
        data: this.data.wuhanNumber,
        stroke: false,
        color: "#aa4438",
      },
        {
          name: '湖北其他人数',
          data: this.data.hubeiNumber,
          stroke: false,
          color: "#ffaa00",
        },
        {
          name: '全国其他人数',
          data: this.data.othersNumber,
          stroke: false,
          color: "#f2d45e",
        },
        {
          name: '北京人数',
          data: this.data.beijingNumber,
          stroke: false,
          color: "#4169E1"
        }
      ],
      disablePieStroke: false,
      width: this.data.ringWidth,
      height: this.data.ringHeight,
      dataLabel: false,
      legend: false,
      background: this.data.ringBackGround,
      padding: 0
    });


    ringChart2.addEventListener('renderComplete', () => {
      console.log('renderComplete');
    });
    setTimeout(() => {
      ringChart.stopAnimation();
    }, 500);

    ringChart3 = new wxCharts({
      animation: true,
      canvasId: 'ringCanvas3',
      type: 'ring',
      extra: {
        ringWidth: this.data.ringHou,
        pie: {
          offsetAngle: -45
        }
      },
      // title: {
      //   name: '70%',
      //   color: '#7cb5ec',
      //   fontSize: 25
      // },
      // subtitle: {
      //   name: '收益率',
      //   color: '#666666',
      //   fontSize: 15
      // },
      series: [{
        name: '确诊人数',
        data: this.data.confirmedNumber,
        stroke: false,
        color: "#aa4438",
      },
      {
        name: '隔离人数',
        data: this.data.isolateNumber,
        stroke: false,
        color: "#ffaa00",
      },
      {
        name: '出隔离人数',
        data: this.data.outIsolateNumber,
        stroke: false,
        color: "#f2d45e",
      },
      {
        name: '其他人数',
        data: this.data.otherCasesNumber,
        stroke: false,
        color: "#4169E1"
      }
      ],
      disablePieStroke: false,
      width: this.data.ringWidth,
      height: this.data.ringHeight,
      dataLabel: false,
      legend: false,
      background: this.data.ringBackGround,
      padding: 0
    });


    ringChart3.addEventListener('renderComplete', () => {
      console.log('renderComplete');
    });
    setTimeout(() => {
      ringChart3.stopAnimation();
    }, 500);


    ringChart4 = new wxCharts({
      animation: true,
      canvasId: 'ringCanvas4',
      type: 'ring',
      extra: {
        ringWidth: this.data.ringHou,
        pie: {
          offsetAngle: -45
        }
      },
      // title: {
      //   name: '70%',
      //   color: '#7cb5ec',
      //   fontSize: 25
      // },
      // subtitle: {
      //   name: '收益率',
      //   color: '#666666',
      //   fontSize: 15
      // },
      series: [{
        name: '在岗',
        data: this.data.doneNumber,
        stroke: false,
        color: "#aa4438",
      },
      {
        name: '远程办公',
        data: this.data.homeNumber,
        stroke: false,
        color: "#ffaa00",
      },
      {
        name: '未复工',
        data: this.data.unDoneNumber,
        stroke: false,
        color: "#f2d45e",
      },
      ],
      disablePieStroke: false,
      width: this.data.ringWidth,
      height: this.data.ringHeight,
      dataLabel: false,
      legend: false,
      background: this.data.ringBackGround,
      padding: 0
    });


    ringChart4.addEventListener('renderComplete', () => {
      console.log('renderComplete');
    });
    setTimeout(() => {
      ringChart4.stopAnimation();
    }, 500);
  },

  touchHandler1: function (e) {
    wx.navigateTo({
      url: '../healthyDetails/healthyDetails?date=' + this.data.showDate + '&&level=' + this.data.authorityLevel + '&&companyReg=' + this.data.regCompanyInfo + '&&department=' + this.data.companyDepartment,
    })
  },

  touchHandler2: function (e) {
    wx.navigateTo({
      url: '../areaDetails/areaDetails?date=' + this.data.showDate + '&&level=' + this.data.authorityLevel + '&&companyReg=' + this.data.regCompanyInfo + '&&department=' + this.data.companyDepartment,
    })
  },

  touchHandler3: function (e) {
    wx.navigateTo({
      url: '../seperateDetails/seperateDetails?date=' + this.data.showDate + '&&level=' + this.data.authorityLevel + '&&companyReg=' + this.data.regCompanyInfo + '&&department=' + this.data.companyDepartment,
    })
  },
  touchHandler4: function (e) {
    wx.navigateTo({
      url: '../workDetails/workDetails?date=' + this.data.showDate + '&&level=' + this.data.authorityLevel + '&&companyReg=' + this.data.regCompanyInfo + '&&department=' + this.data.companyDepartment,
    })
  },

  getCurrentDay: function(e){
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();

    if(month >= 1 && month <= 9) {
      month = "0" + month;
    }

    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
},

// 统计健康百分比

setHealthyPercents: function(e) {

  var total = this.data.stateGoodNumber + this.data.stateOthersNumber + this.data.stateServerNumber
 if(total == 0){
   var goodP = 0.00
   var otherP = 0.00
   var serverP = 0.00
 }else{
   var goodP = (this.data.stateGoodNumber / total * 100).toFixed(2)
   var otherP = (this.data.stateOthersNumber / total * 100).toFixed(2)
   var serverP = (this.data.stateServerNumber / total * 100).toFixed(2)
 }
 

  this.setData({
    totalStateNumber: total,
    stateGoodPercent: goodP,
    stateOthersPercent: otherP,
    stateServerPercent: serverP,
  })
},

// 地区数据百分比

setAreaPercents: function(e) {
  var total = this.data.beijingNumber + this.data.wuhanNumber + this.data.hubeiNumber + this.data.othersNumber
  if (total == 0) {
    var bjPercent = 0.00
    var whPercent= 0.00
    var othPercent = 0.00
    var hbPercent = 0.00
  } else {
  var bjPercent = (this.data.beijingNumber / total * 100).toFixed(2)
  var whPercent = (this.data.wuhanNumber / total * 100).toFixed(2)
  var hbPercent = (this.data.hubeiNumber / total * 100).toFixed(2)
  var othPercent = (this.data.othersNumber / total * 100).toFixed(2)
  }
  this.setData({
    beijingPercent: bjPercent,
    wuhanPercent: whPercent,
    hubeiPercent: hbPercent,
    othersPercent: othPercent,
    totalAreaNumber: total,
  })
},

// 就诊情况百分比

setCasesPercents: function(e) {
  var total = this.data.confirmedNumber + this.data.isolateNumber + this.data.outIsolateNumber + this.data.otherCasesNumber
  if(total == 0){
    var conP = 0.00
    var isoP = 0.00
    var outIsoP = 0.00
    var otherP  = 0.00
  }else{
    var conP = (this.data.confirmedNumber / total * 100).toFixed(2)
    var isoP = (this.data.isolateNumber / total * 100).toFixed(2)
    var outIsoP = (this.data.outIsolateNumber / total * 100).toFixed(2)
    var otherP = (this.data.otherCasesNumber / total * 100).toFixed(2)
  }
  

  this.setData({
    confirmedPercent: conP,
    isolatePercent: isoP,
    outIsolatePercent: outIsoP,
    otherCasesPercent: otherP,
    totalCasesNumber: total,
  })
},
//复工情况百分比
  setWorkPercents: function (e) {
    var total = this.data.doneNumber + this.data.unDoneNumber + this.data.homeNumber
    if(total == 0){
      var doneP = 0.00
      var unP = 0.00
      var homeP = 0.00
    }else{
      var doneP = (this.data.doneNumber / total * 100).toFixed(2)
      var unP = (this.data.unDoneNumber / total * 100).toFixed(2)
      var homeP = (this.data.homeNumber / total * 100).toFixed(2)
    }
  
    this.setData({
      doneP,
      unP,
      homeP,
      totalworksNumber:total
    })
  },

printDatas: function(e) {
  console.log("should filled number: ", this.data.shouldFilledNumber)
  console.log("has filled number:    ", this.data.hasFilledNumber)

  console.log("state good number:    ", this.data.stateGoodNumber)
  console.log("state others number:  ", this.data.stateOthersNumber)
  console.log("state server number:  ", this.data.stateServerNumber)
  console.log("state good percent:   ", this.data.stateGoodPercent)
  console.log("state others percent: ", this.data.stateOthersPercent)
  console.log("state server percent: ", this.data.stateServerPercent)

  console.log("wuhan number:         ", this.data.wuhanNumber)
  console.log("hubei other number:   ", this.data.hubeiNumber)
  console.log("others number:        ", this.data.othersNumber)
  console.log("beijing number:       ", this.data.beijingNumber)
  console.log("wuhan number percent: ", this.data.wuhanPercent)
  console.log("hubei number percent: ", this.data.wuhanPercent)
  console.log("other number percent: ", this.data.othersPercent)
  console.log("beijing number percent:", this.data.beijingPercent)

},

// 

getReturnBeijingNumber: function(datas) {
  var sum = 0
  for (var i = 0; i < datas.length; i++) {
    if (datas[i].isGoBackFlag == '0' && datas[i].isLeaveBjFlag == '0'){
      sum += 1
    }
  }

  return sum
},

  getBeijingNumber: function (datas) {
    var sum = 0
    for (var i = 0; i < datas.length; i++) {
      if (datas[i].isGoBackFlag == '0') {
        sum += 1
      }
    }

    return sum
  },

  getWuhanNumber: function (datas) {
    var sum = 0
    for (var i = 0; i < datas.length; i++) {
      if (/.*武汉/.test(datas[i].place)) {
        sum += 1
      }
    }

    return sum
  },

  getHubeiNumber: function (datas) {
    var sum = 0
    for (var i = 0; i < datas.length; i++) {
      if (/.*湖北/.test(datas[i].place)) {
        sum += 1
      }
    }

    return sum
  },

getStateNumber: function(datas, state) {
  var sum = 0
  for (var i = 0; i < datas.length; i++) {
    if (datas[i].bodyStatusFlag == state){
      sum += 1
    }
  }

  return sum
},

getConfimedNumber: function(datas) {
  var sum = 0;
  for (var i = 0; i < datas.length; i++) {
    if (datas[i].isQueZhenFlag == "0"){
      sum += 1
    }
  }

  return sum
},

getBeijingUnconfirmed: function(datas) {
  var sum = 0
  for (var i = 0; i < datas.length; i++){
    if (datas[i].isGoBackFlag == '0' && datas[i].isQueZhenFlag == "1" && datas[i].isLeaveBjFlag == "0"){
      sum += 1
    }
  }

  return sum 
},

judgeIsolate: function(backDate) {
  var days14Diffms = 1209600000
  var current = new Date(this.data.showDate)
  if (current.getTime() - backDate.getTime() < days14Diffms)  {
    return true
  }
  return false 
},

getIsoNumber: function(datas) {
  var sum = 0;
  for (var i = 0; i < datas.length; i++) {
    if (datas[i].isLeaveBjFlag != null && datas[i].isLeaveBjFlag == "0" && datas[i].isQueZhenFlag == '1'){
      var backDate = new Date(datas[i].suregobackdate)
      if (this.judgeIsolate(backDate)) {
        sum += 1
      }
    }
    
  }

  return sum 

},

parseDatas: function(datas) {

  var should = datas[0].length
  this.setData({
    shouldFilledNumber: should
  })

  var healthyDatas = datas[1]

  if (healthyDatas.length > 0) {
    
  
  var filled = healthyDatas.length
  var confirmed = this.getConfimedNumber(healthyDatas)

  var beijing = this.getBeijingNumber(healthyDatas)
  var fanJing = this.getReturnBeijingNumber(healthyDatas)
  var outJing = filled - beijing 

  var good = this.getStateNumber(healthyDatas, '0')
  var server = this.getStateNumber(healthyDatas, '1')
  var other = this.getStateNumber(healthyDatas, '2')
  var bad = filled - good 

  var hubei = this.getHubeiNumber(healthyDatas)
  var wuhan = this.getWuhanNumber(healthyDatas)
  var hubeiOther = hubei - wuhan
  var wholeOther = filled - beijing - hubei

  var beijingUnconfirmed = this.getBeijingUnconfirmed(healthyDatas)
  var isoNum = this.getIsoNumber(healthyDatas)
  var outIsoNum = beijingUnconfirmed - isoNum
  var othercases = filled - confirmed - isoNum - outIsoNum
  
    var doneNumber = this.getLimitDone(healthyDatas);
    var unDoneNumber = this.getLimitUn(healthyDatas);
    var homeNumber = this.getLimitHome(healthyDatas);

  this.setData({
    // shouldFilledNumber: should,
    hasFilledNumber: filled,
    returnBeijingNumber: fanJing,
    outBeijingNumber: outJing,


    stateGoodNumber: good,
    stateServerNumber: server,
    stateOthersNumber: other,

    healthyBadNumber: bad,

    wuhanNumber: wuhan,
    hubeiNumber: hubeiOther,
    othersNumber: wholeOther,
    beijingNumber: beijing,


    confirmedNumber: confirmed,
    isolateNumber: isoNum,
    outIsolateNumber: outIsoNum,
    otherCasesNumber: othercases,

    doneNumber,
    unDoneNumber,
    homeNumber,
  })

  }

  this.setHealthyPercents()
  this.setAreaPercents()
  this.setCasesPercents()
  this.setWorkPercents()
  this.initChats()
  // this.printDatas()

}, 
 
// getDatasAuthority: function(company) {

//   wx.showLoading({
//     title: '加载中...',
//   })
//   wx.cloud.callFunction({
//     name: "getUserClickByAuthority",
//     data: {
//       "date": this.data.showDate,
//       company_department: company,
//     },

//     success: res => {
//       console.log(res.result)

//       var totalDatas = res.result[0]
//       var healthyDatas = res.result[1]

//       var should = totalDatas.length
//       var filled = healthyDatas.length

//       var longBeijing = this.getLongBeijingNumber(healthyDatas)

//       var good = this.getStateNumber(healthyDatas, "0")
//       var server = this.getStateNumber(healthyDatas, "1")
//       var otherNum = this.getStateNumber(healthyDatas, "2")

//       var beijing = this.getBeijingNumber(healthyDatas)
//       var wuhan = this.getWuhanNumber(healthyDatas, /.*武汉/)
//       var hubei = this.getHubeiNumber(healthyDatas, /.*湖北/)

//       var confirmed = this.getConfimedNumber(healthyDatas)
//       var beijingUnconfirmed = this.getBeijingUnconfirmed(healthyDatas)

//       var isoNum = this.getIsoNumber(healthyDatas)
//       var unIsoNum = beijingUnconfirmed - isoNum
//       var otherCases = filled - confirmed - isoNum - unIsoNum

//       console.log("========================================================")

//       console.log("beijing number: ", beijing)
//       console.log("beijing long:   ", longBeijing)
//       console.log("beijing unconfirmed: ", beijingUnconfirmed)
//       console.log("iso number: ", isoNum)
//       console.log("unIso number: ", unIsoNum)

//       console.log("confirmed: ", confirmed)

//       console.log("========================================================")


//       this.setData({
//         shouldFilledNumber: should,
//         hasFilledNumber: filled,
//         returnBeijingNumber: beijing - longBeijing,
//         outBeijingNumber: filled - beijing ,


//         stateGoodNumber: good,

//         stateServerNumber: server,
//         stateOthersNumber: otherNum,

//         healthyBadNumber: filled - good,

//         wuhanNumber: wuhan,
//         hubeiNumber: hubei - wuhan,
//         othersNumber: filled - hubei - beijing,
//         beijingNumber: beijing,

//         outBeijingNumber: filled - beijing,

//         confirmedNumber: confirmed,
//         isolateNumber: isoNum,
//         outIsolateNumber: unIsoNum,
//         otherCasesNumber: otherCases


//       })

//       // var isoNum = this.getIsolateNumber()
//       // var unIsoNum = this.data.beijingUnConfirmed.length - isoNum
//       // var other = this.data.hasFilledNumber - this.data.confirmedNumber - isoNum - unIsoNum

//       // this.setData({
//       //   isolateNumber: isoNum,
//       //   outIsolateNumber: unIsoNum,
//       //   otherCasesNumber: other
//       // })

//       console.log("confimed: ", this.data.confirmedNumber)
//       console.log("iso num: ", this.data.isolateNumber)
//       console.log("un iso num: ", this.data.outIsolateNumber)
//       console.log("other: ", this.data.otherCasesNumber)

//       this.setHealthyPercents()
//       this.setAreaPercents()
//       this.setCasesPercents()

//       this.initChats()
//       this.printDatas()

//       wx.hideLoading()
//     },

//     fail: err => {
//       console.log(err)
//       wx.hideLoading()
//     }

//   });

// },

// getDatas: function(e) {

//   console.log("get datas")
//   wx.showLoading({
//     title: '加载中...',
//   })
   
//   wx.cloud.callFunction({
//     name: "staticDatas",
//     data: {
//       "date": this.data.showDate
//     },

//     success: res => {
//       console.log(res.result)

//       var datas = res.result

//       var should = datas[0]
//       var filled = datas[1]
//       var returnBeijing = datas[12]
//       var totalBeijing = datas[8]
//       var outBeijing = filled - totalBeijing 


//       this.setData({
//         shouldFilledNumber: datas[0],
//         hasFilledNumber: datas[1],
//         returnBeijingNumber: returnBeijing,
//         outBeijingNumber: outBeijing,

//         stateGoodNumber: datas[2],
       
//         stateServerNumber: datas[3],
//         stateOthersNumber: datas[4],

//         healthyBadNumber : datas[1] - datas[2],

//         wuhanNumber: datas[5],
//         hubeiNumber: datas[6],
//         othersNumber: datas[7],
//         beijingNumber: datas[8],

//         confirmedNumber: datas[9],
//         beijingUnConfirmed: datas[11],
        
//       })

//       var isoNum = this.getIsolateNumber()
//       var unIsoNum = this.data.beijingUnConfirmed.length - isoNum
//       var other = this.data.hasFilledNumber - this.data.confirmedNumber - isoNum - unIsoNum

//       this.setData({
//         isolateNumber: isoNum,
//         outIsolateNumber: unIsoNum,
//         otherCasesNumber: other
//       })

//       this.setHealthyPercents()
//       this.setAreaPercents()
//       this.setCasesPercents()
      
//       this.initChats()
//       this.printDatas()

//       wx.hideLoading()
//     },

//     fail: err => {
//       wx.hideLoading()
//       console.log(err)
//     }
    
//     });

   
//   },


  analysisLevel: function(level) {

    wx.showLoading({
      title: '加载中',
    })
    console.log("authority level: ", level)

    switch(level) {
      case 1:
        wx.cloud.callFunction({
          name: "oneLevelDatas",
          data: {
            date: this.data.showDate
          },

          success: res => {
            console.log("res result: ", res.result)
            this.parseDatas(res.result)
            wx.hideLoading()
          },

          fail: err => {
            console.log("error: ", err)
            wx.hideLoading()
          }
        })
      break;

      case 2:
        wx.cloud.callFunction({
          name: "twoLevelDatas",
          data: {
            date: this.data.showDate,
            company_department: this.data.regCompanyInfo
          },

          success: res => {
            console.log("res result: ", res.result)
            this.parseDatas(res.result)
            wx.hideLoading()
          },

          fail: err => {
            console.log("error: ", err)
            wx.hideLoading()
          }
        })
      break;

      case 3:
        wx.cloud.callFunction({
          name: "threeLevelDatas",
          data: {
            date: this.data.showDate,
            company_department: this.data.companyDepartment
          },

          success: res => {
            console.log("res result: ", res.result)
            this.parseDatas(res.result)
            wx.hideLoading()
          },

          fail: err => {
            console.log("error: ", err)
            wx.hideLoading()
          }
        })
      break;
    }
  },


  initDatas: function(currentDate) {

    const db = wx.cloud.database()
    db.collection('user_info').where({
      _openid: app.globalData.openid
    }).get({
      success: res => {
        console.log("user info: ", res)

        var superUser = res.data[0].superuser;
        var userType = res.data[0].usertype
        var company = res.data[0].company_department
      
        var level = 0

        var infoes = company.split(' ')
        var regInfo = ""
        var title = this.data.department

        if (superUser != null && superUser == "1") {
          level = 1
          title = "中国信息通信研究院"
        }else if(userType == '1'){
          level = 2
          if (infoes[0] == '院属公司及协会') {
            regInfo = '.*' + infoes[1]
            title = infoes[1]
          } else {
            regInfo = infoes[0] + ".*"
            title = infoes[0]
          }

        }else if (userType == '2'){
          level = 3
          if (infoes[1] == ""){
            title = infoes[0]
          }else {
            title = infoes[1]
          }
        } 

        this.setData({
          showDate: currentDate,
          companyDepartment: company,
          regCompanyInfo: regInfo,
          authorityLevel: level,
          titleText: title
        })

        this.analysisLevel(level)
        
    } ,
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.log(err)
      }
    })
  },

  exportExcel: function () {
    let that = this
    // console.log("get date is ", date)
    wx.showLoading({
      title: '数据加载中',
    })
    let currentDate = that.data.showDate
    if (currentDate == undefined) {
      currentDate = that.getCurrentDay()
    }

    wx.cloud.callFunction({
      name: "export",
      data: {
        date: that.data.showDate,
        user_id: app.globalData.openid,
        level: that.data.departmentLevel,
        specificDepartment: that.data.departmentName,
      },
      success: res => {
        console.log("export", res)
        wx.hideLoading()

        wx.cloud.getTempFileURL({
          fileList: [res.result.fileID],
          success: res => {
            console.log("res.fileList ", res.fileList)

            wx.setClipboardData({
              data: res.fileList[0].tempFileURL,
              success: function (res) {
                wx.showToast({
                  icon: 'none',
                  title: currentDate + "导出文件下载链接已保存到您的剪贴板"
                });
              }
            })

            // this.sendEmail({
            //   fromAddress: "774392980@qq.com",
            //   toAddress: "774392980@qq.com",
            //   subject: "打卡记录",
            //   content: res.fileList[0].tempFileURL,
            // })

            // this.sendEmail({
            //   fromAddress: "774392980@qq.com",
            //   toAddress: "zzjj64@163.com",
            //   subject: "打卡记录",
            //   content: res.fileList[0].tempFileURL,
            // })
          }
        })
      },
      fail: err => {
        console.log(err)
        wx.hideLoading()
      }
    })
  },

  sendEmail: function (email) {
    console.log("email ", email)
    wx.cloud.callFunction({
      name: "sendEmail",
      data: {
        fromAddress: email.fromAddress,
        toAddress: email.toAddress,
        subject: email.subject,
        content: email.content,
      },
      success: res => {
        console.log("sendEmail", res)
        wx.showToast({
          icon: 'none',
          title: `已发送到${email.toAddress}邮箱`
        });
      },
      fail: err => {
        console.log(err)
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let name = decodeURIComponent(options.name)
    let date = decodeURIComponent(options.date)
    let level = decodeURIComponent(options.level)
    let title = decodeURIComponent(options.title)

    this.setData({
      departmentLevel: level,
      departmentName: name
    })

    console.log('name: ', name)
    console.log('title: ', options.title)
    console.log('date: ', date)
    console.log('level: ', level)

    if(level != undefined && level == 2) {
      this.setData(
        {
          showDate: date,
          regCompanyInfo: name + '.*',
          authorityLevel: 2,
          titleText: name
        }
      )
      
      this.analysisLevel(2)
    }else if (level != undefined && level == 3){
      this.setData({
        showDate: date,
        companyDepartment: name,
        titleText:title,
        authorityLevel: 3,
      })
      this.analysisLevel(3)
    }
    
    else {
      this.initDatas(this.getCurrentDay())
    }
   
    this.setData({
    ["title.text"]: options.title,
    department: options.title
    })
    console.log(this.data.title)
  
    // var d1 = new Date('2020-02-01')
    // var d2 = new Date('2020-02-15')

    // var ms = d2.getTime() - d1.getTime()
    // console.log("ms: ", ms)
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  // countMount:async function countMount(openid) {
  //   let doneCount = await db.collection('user_healthy').where(
  //     _.and([{
  //       "date": this.data.showDate
  //     }, {
  //       "workStatusFlag": "0",
  //     }, {
  //       "company_department": db.RegExp({
  //         regexp: this.data.companyDepartment,
  //       })
  //     }]
  //   )).count()
  //   // let unDoneCount = await db.collection('user_healthy').where({
  //   //   workStatusFlag: "2",
  //   //   _openid: openid
  //   // }).count()
  //   // let homeCount = await db.collection('user_healthy').where({
  //   //   workStatusFlag: "1",
  //   //   _openid: openid
  //   // }).count()
  //   // let count = {
  //   //   doneCount,
  //   //   unDoneCount,
  //   //   homeCount
  //   // }
  //   return doneCount.total
  // },

  initDatas2: function(name, currentDate) {
    // const db = wx.cloud.database()
    this.setData({
      showDate: currentDate,
      companyDepartment: name,
      regCompanyInfo: name,
      authorityLevel: 2
    })
   
    this.analysisLevel(2)
    // db.collection('user_info').where({
    //   _openid: app.globalData.openid
    // }).get({
    //   success: res => {
    //     console.log(res)
    //     console.log("user info: ", res)

    //     var superUser = res.data[0].superuser;
    //     var userType = res.data[0].usertype
    //     var company = res.data[0].company_department
      
    //     var level = 0

    //     var infoes = company.split(' ')
    //     var regInfo = ""
    //     var title = ""

    //     if (superUser != null && superUser == "1") {
    //       level = 1
    //       title = "中国信息通信研究院"
    //     }else if(userType == '1'){
    //       level = 2
    //       if (infoes[0] == '院属公司及协会') {
    //         regInfo = '.*' + infoes[1]
    //         title = infoes[1]
    //       } else {
    //         regInfo = infoes[0] + ".*"
    //         title = infoes[0]
    //       }

    //     }else if (userType == '2'){
    //       level = 3
    //       title = company
    //     } 

    //     this.setData({
    //       showDate: currentDate,
    //       companyDepartment: company,
    //       regCompanyInfo: regInfo,
    //       authorityLevel: level
    //     })

    //     this.analysisLevel(level)
        
    // } ,
    //   fail: err => {
    //     wx.showToast({
    //       icon: 'none',
    //       title: '查询记录失败'
    //     })
    //     console.log(err)
    //   }
    // })
  },
})