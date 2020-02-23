// import F2 from '../../components/f2-canvas/lib/f2';

var wxCharts = require('../../utils/wxcharts.js');
// var app = getApp();
var ringChart = null;
var ringChart2 = null;

const db = wx.cloud.database({
  env: "soybean-uat"
})



// let chart = null;

function getReturnBeijingNumbers(datas){

  var sum = 0
  for (var i = 0; i < datas.length; i++) {
    if (datas[i].isGoBackFlag == "0" ){
      sum = sum + 1
    }
  }

  return sum
}

function getHealthyStatusNumber(datas, status) {
  var sum = 0
  for (var i = 0; i < datas.length; i++) {
    if (datas[i].bodyStatusFlag == status){
      sum = sum + 1
    }
  }

  return sum
}

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
        unfilledInText: "未填写人数"
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

    totalNumber: 0,
    filleInNumber: 0,
    unFilledNumber: 0,

    returnBeijingNumber: 0,
    outBeijingNumber: 0,

    healthyTotalNumber: 0,
    stateGoodNumber: 0,
    stateServerNumber: 0,
    stateOthersNumber: 0,

    stateGoodPercent: 0,
    stateOtherPercent: 0,
    stateServerPercent: 0,

    returnBeijingPercent: 0,
    outBeijingPercent: 0,

    showDate: "",


  },

  bindDateChange: function(e) {
    console.log(e)
    // this.setData({
    //   showDate: e.detail.value
    // })

    // console.log("showDate: ", this.data.showDate)

    var selectedDate = new Date(e.detail.value)
    var current = new Date()
    var startDate = new Date('2020-02-20')
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
    var windowWidth = 200;

    ringChart = new wxCharts({
      animation: true,
      canvasId: 'ringCanvas',
      type: 'ring',
      extra: {
        ringWidth: 15,
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
        color: "#22bb77"
      }, {
        name: '其他症状',
        data: this.data.stateOthersNumber,
        stroke: false,
        color: "#ffaa00"
      }, {
        name: '咳嗽、发烧',
        data: this.data.stateServerNumber,
        stroke: false,
        color: "#ec7055",
      },
      ],
      disablePieStroke: false,
      width: windowWidth,
      height: 140,
      dataLabel: false,
      legend: false,
      background: '#f5f5f5',
      padding: 0
    });


    ringChart.addEventListener('renderComplete', () => {
      console.log('renderComplete');
    });

    // setTimeout(() => {
    //   ringChart.stopAnimation();
    // }, 8000);

    ringChart2 = new wxCharts({
      animation: true,
      canvasId: 'ringCanvas2',
      type: 'ring',
      extra: {
        ringWidth: 15,
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
        name: '返京人数',
        data: this.data.returnBeijingNumber,
        stroke: false,
        color: "#22bb77"
      }, {
        name: '未返京人数',
        data: this.data.outBeijingNumber,
        stroke: false,
        color: "#ffaa00",
      }, {
        name: '身体异常',
        data: this.data.stateServerNumber,
        stroke: false,
        color: "#ec7055"
      }
      ],
      disablePieStroke: false,
      width: windowWidth,
      height: 140,
      dataLabel: false,
      legend: false,
      background: '#f5f5f5',
      padding: 0
    });


    ringChart2.addEventListener('renderComplete', () => {
      console.log('renderComplete');
    });
    setTimeout(() => {
      ringChart.stopAnimation();
      ringChart2.stopAnimation();
    
    }, 2000);
  },

  touchHandler: function (e) {
    console.log(ringChart.getCurrentDataIndex(e));
    
  },

  // updateData1: function () {

  //   ringChart.updateData({
  //       series: [{
  //         name: '健康人数',
  //         data: this.data.stateGoodNumber,
  //         stroke: false,
  //         color: "#22bb77"
  //       }, {
  //         name: '其他症状',
  //         data: this.data.stateOthersNumber,
  //         stroke: false,
  //           color: "#ffaa00"
  //       }, {
  //         name: '咳嗽、发烧',
  //         data: this.data.stateServerNumber,
  //         stroke: false,
  //           color: "#ec7055"
  //       }],
  //   });

   
  // },

  // goRing: function(e) {
  //     wx.redirectTo({
  //       url: '../../pages/ring/ring',
  //     })
  // },

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

getDatas: function(e) {

  console.log("get datas")
   
  wx.cloud.callFunction({
    name: "staticDatas",
    data: {
      "date": this.data.showDate
    },

    success: res => {
      console.log(res.result)
      var healthyDatas = res.result[0]
      var infoDatas = res.result[1]

      var totalNumber2 = infoDatas.length
      var filledNumber = healthyDatas.length
      var returnBeijingNumber2 = getReturnBeijingNumbers(healthyDatas)
      var outBeijingNumber2 = totalNumber2 - returnBeijingNumber2
      var unFilledNumber2 = totalNumber2 - filledNumber

      var healthyGoodNumber = getHealthyStatusNumber(healthyDatas, "0")
      var healthySeveryNumber = getHealthyStatusNumber(healthyDatas, "2")
      var healthyOthers = getHealthyStatusNumber(healthyDatas, "1")
      var healthyTotalNumber2 = healthyGoodNumber + healthyOthers + healthySeveryNumber

      var goodPercent = healthyGoodNumber / healthyTotalNumber2 * 100
      var otherPercent = healthyOthers / healthyTotalNumber2 * 100
      var serverPercent = healthySeveryNumber / healthyTotalNumber2 * 100

      var returnPercent = returnBeijingNumber2 / totalNumber2 * 100
      var outPercent = outBeijingNumber2 / totalNumber2 * 100
      
      this.setData({
        totalNumber: totalNumber2,
        filledInNumber: filledNumber,
        unFilledNumber: unFilledNumber2,

        returnBeijingNumber: returnBeijingNumber2,
        outBeijingNumber: outBeijingNumber2,

        healthyTotalNumber: healthyTotalNumber2,
        stateGoodNumber: healthyGoodNumber,
        stateServerNumber: healthySeveryNumber,
        stateOthersNumber: healthyOthers,

        stateGoodPercent: goodPercent.toFixed(2),
        stateServerPercent: serverPercent.toFixed(2),
        stateOtherPercent: otherPercent.toFixed(2),

        returnBeijingPercent: returnPercent.toFixed(2),
        outBeijingPercent: outPercent.toFixed(2),
      })

      console.log("state good:", this.stateGoodNumber)
      console.log("state others: ", this.data.stateOthersNumber)
      console.log("state server: ", this.data.stateServerNumber)

      console.log("return: ", this.data.returnBeijingNumber)
      console.log("out beijing: ", this.data.outBeijingNumber)

      // this.updateData()
      this.initChats()
        
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