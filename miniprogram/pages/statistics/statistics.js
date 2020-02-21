import F2 from '../../components/f2-canvas/lib/f2';

let chart = null;

function initChart(canvas, width, height) {
  const { Util, G } = F2;
  const { Group } = G;

  const data = [
    { type: '健康', data: 38, a: '1' },
    { type: '其它症状'  , data: 3, a: '1' },
    { type: '咳嗽、发烧', data: 1, a: '1' }
  ];

  let sum = 0;
  data.map(obj => {
    sum += obj.data;
  });
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });
  chart.source(data);
  chart.legend({
    position: 'right',
    offsetX: -1500
  });
  chart.coord('polar', {
    transposed: true,
    innerRadius: 0.75,
    radius: 2
  });
  chart.axis(false);
  chart.tooltip(false);
  chart.interval()
    .position('a*data')
    .color('type', ['#53bca2','#fc9026', '#ec704f'])
    .adjust('stack');

  chart.render();
  return chart;
}

Page({
  data: {
    title:{
      image: "../../images/tongjixinxi.png",
      text: "统计信息",
      date: "2020-02-02",
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
    opts: {
      onInit: initChart
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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