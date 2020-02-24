// import F2 from '../../components/f2-canvas/lib/f2';

var wxCharts = require('../../utils/wxcharts.js');
// var app = getApp();
var ringChart = null;
var ringChart2 = null;
var ringChart3 = null;

const db = wx.cloud.database({
  env: "soybean-uat"
})



// let chart = null;

// function getReturnBeijingNumbers(datas){

//   var sum = 0
//   for (var i = 0; i < datas.length; i++) {
//     if (datas[i].isGoBackFlag == "0" ){
//       sum = sum + 1
//     }
//   }

//   return sum
// }

// function getHealthyStatusNumber(datas, status) {
//   var sum = 0
//   for (var i = 0; i < datas.length; i++) {
//     if (datas[i].bodyStatusFlag == status){
//       sum = sum + 1
//     }
//   }

//   return sum
// }

// function initChart(canvas, width, height) {
//   const { Util, G } = F2;
//   const { Group } = G;

//   const data = [
//     { type: '和你', data: 3, a: '1' },
//     { type: '其它症状', data: 8, a: '1' },
//     { type: '咳嗽、发烧', data: 6, a : '1' }
//   ];

//   let sum = 0;
//   data.map(obj => {
//     sum += obj.data;
//   });
//   chart = new F2.Chart({
//     el: canvas,
//     width,
//     height
//   });
//   chart.source(data);
//   chart.legend({
//     position: 'right',
//     offsetX: -1500
//   });
//   chart.coord('polar', {
//     transposed: true,
//     innerRadius: 0.75,
//     radius: 2
//   });
//   chart.axis(false);
//   chart.tooltip(false);
//   chart.interval()
//     .position('a*data')
//     .color('type', ['#53bca2','#fc9026', '#ec704f'])
//     .adjust('stack');

//   chart.render();
//   return chart;
// }




Page({
  data: {
    title:{
      image: "../../images/tongjixinxi.png",
      text: "统计信息",
      date: "2020-02-01",
    },
    dashboard:{
      health: {
        should: 42,
        shouldText: "应填写人数",
        filledIn: 26,
        filledInText: "已填写人数",
        unfilledIn: 16,
        unfilledInText: "确诊人数"
      },
      area: {
        should: 42,
        shouldText: "返京人数",
        filledIn: 26,
        filledInText: "离京未返京人数",
        unfilledIn: 16,
        unfilledInText: "身体异常人数"
      }
    },

    health:{
      total: 42,
      health: 38,
      healthPercent: 96,
      other: 3,
      otherPercent: 3,
      feverAndCough: 1,
      feverAndCoughPercent: 1
    },

    area: {
      total: 42,
      health: 38,
      healthPercent: 96,
      other: 3,
      otherPercent: 3,
      feverAndCough: 1,
      feverAndCoughPercent: 1
    },
    // opts: {
    //   onInit: initChart
    // },

    shouldFilledNumber: 0,
    hasFilledNumber: 0,
    outBeijingNumber: 0,
    healthyBadNumber: 0,

    

    // healthy datas
    totalStateNumber: 0,
    stateGoodNumber: 0,
    stateServerNumber: 0,
    stateOthersNumber: 0,

    stateGoodPercent: 0,
    stateOthersPercent: 0,
    stateServerPercent: 0,

    // area datas
    beijingNumber: 5,
    wuhanNumber: 6,
    hubeiNumber: 7,
    othersNumber: 3,
    totalAreaNumber: 0,

    beijingPercent: 0,
    wuhanPercent: 0,
    hubeiPercent: 0,
    othersPercent: 0,

    // case datas
    confirmedNumber: 3,
    isolateNumber: 5,
    outIsolateNumber: 2,
    otherCasesNumber: 9,
    totalCasesNumber: 0,

    confirmedPercent: 0,
    isolatePercent: 0,
    outIsolatePercent: 0,
    otherCasesPercent: 0,

    beijingUnConfirmed: [],

    showDate: "",

    ringWidth: 200,
    ringHeight: 150,
    ringHou: 10,
    ringBackGround: "#f5f5f5"


  },

  getIsolateNumber: function(e) {
    var days14Diffms = 1209600000
    var current = new Date(this.data.showDate)

    var sum = 0
    
    for (var i = 0; i < this.data.beijingUnConfirmed.length; i++){
      var back = this.data.beijingUnConfirmed[i].suregobackdate
      var backDate = new Date(back)
      if ((current.getTime() - backDate.getTime()) < days14Diffms) {
        sum = sum + 1
      }
    }

    return sum

  },

  bindDateChange: function(e) {
    console.log(e)
    // this.setData({
    //   showDate: e.detail.value
    // })

    // console.log("showDate: ", this.data.showDate)

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
      this.dateChanged()
    }

    console.log("select: ", selectedDate)
    console.log("current: ", current)



    // this.dateChanged()

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
        color: "#ffaa00"
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
          color: "#ffff00",
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
        color: "#ffff00",
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
  },

  touchHandler: function (e) {
    console.log(ringChart.getCurrentDataIndex(e));
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

  var goodP = (this.data.stateGoodNumber / total * 100).toFixed(2)
  var otherP = (this.data.stateOthersNumber / total * 100).toFixed(2) 
  var serverP = (this.data.stateServerNumber / total * 100).toFixed(2)

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

  var bjPercent = (this.data.beijingNumber / total * 100).toFixed(2)
  var whPercent = (this.data.wuhanNumber / total * 100).toFixed(2)
  var hbPercent = (this.data.hubeiNumber / total * 100).toFixed(2)
  var othPercent = (this.data.othersNumber / total * 100).toFixed(2)

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

  var conP = (this.data.confirmedNumber / total * 100).toFixed(2)
  var isoP = (this.data.isolateNumber / total * 100).toFixed(2)
  var outIsoP = (this.data.outIsolateNumber / total * 100).toFixed(2)
  var otherP = (this.data.otherCasesNumber / total * 100).toFixed(2)

  this.setData({
    confirmedPercent: conP,
    isolatePercent: isoP,
    outIsolatePercent: outIsoP,
    otherCasesPercent: otherP,
    totalCasesNumber: total,
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

getDatas: function(e) {

  console.log("get datas")
   
  wx.cloud.callFunction({
    name: "staticDatas",
    data: {
      "date": this.data.showDate
    },

    success: res => {
      console.log(res.result)

      var datas = res.result

      this.setData({
        shouldFilledNumber: datas[0],
        hasFilledNumber: datas[1],
        outBeijingNumber: datas[1] - datas[8],

        stateGoodNumber: datas[2],
        stateOthersNumber: datas[3],
        stateServerNumber: datas[4],

        healthyBadNumber : datas[1] - datas[2],

        wuhanNumber: datas[5],
        hubeiNumber: datas[6],
        othersNumber: datas[7],
        beijingNumber: datas[8],

        confirmedNumber: datas[9],
        beijingUnConfirmed: datas[11],
        
      })

      var isoNum = this.getIsolateNumber()
      var unIsoNum = this.data.beijingUnConfirmed.length - isoNum
      var other = this.data.hasFilledNumber - this.data.confirmedNumber - isoNum - unIsoNum

      this.setData({
        isolateNumber: isoNum,
        outIsolateNumber: unIsoNum,
        otherCasesNumber: other
      })

      // var isoNum = datas[12] - datas[13]

      // var unIsoNum = datas[8] - isoNum - datas[13]
      // var other = datas[1] - isoNum - unIsoNum - datas[13]

      // this.setData({
      //   isolateNumber: isoNum,
      //   outIsolateNumber: unIsoNum,
      //   otherCasesNumber: other
      // })

      
      this.setHealthyPercents()
      this.setAreaPercents()
      this.setCasesPercents()
      
      this.initChats()

      this.printDatas()


        
    },

    fail: err => {
      console.log(err)
    }
  });

   
  },



  dateChanged: function(e){
    this.getDatas()

    // var totalNumber = this.data.infoDatas.length;
    // var filledNumber = this.data.healtyDatas.length;

    // console.log("total: ", totalNumber)
    // console.log("fill: ", filledNumber)
    

  },

  initDatas: function(e) {

   
    this.setData({
     showDate: this.getCurrentDay()
      
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initDatas()
    this.dateChanged()

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})