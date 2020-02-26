// pages/Statistics/index.js
import * as echarts from '../../components/ec-canvas/echarts';

const app = getApp();

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var scale = 1;
  var echartData = [{
    value: 3515,
    name: '健康'
  }, {
    value: 134,
    name: '其他症状'
  }, {
    value: 224,
      name: '咳嗽、发烧'
  }]
  var rich = {
    yellow: {
      color: "#3891FF",
      fontSize: 30 * scale,
      padding: [5, 4],
      align: 'center'
    },
    total: {
      color: "#ffc72b",
      fontSize: 40 * scale,
      align: 'center'
    },
    white: {
      color: "#fff",
      align: 'center',
      fontSize: 14 * scale,
      padding: [21, 0]
    }
  }
  var option = {
    title: {
      text: '统计图',
      left: 'center',
      top: 'center',
      padding: [24, 0],
      textStyle: {
        color: '#000',
        fontSize: '30rpx',
        align: 'center'
      }
    },

    series: [{
      name: '总考生数量',
      width: '352px',
      left: 0,
      right: 0,
      type: 'pie',
      radius: ['45%', '50%'],
      hoverAnimation: false,
      color: ['#3891FF', '#53BCA2', '#DCB64F'],
      label: {
        normal: {
          show: false,
        }
      },
      data: echartData,
    }]
  }

  chart.setOption(option);
  return chart;
}

function initChart2(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  var scale = 1;
  var echartData = [{
    value: 3515,
    name: '健康'
  }, {
    value: 134,
    name: '其他症状'
  }, {
    value: 224,
    name: '咳嗽、发烧'
  }]
  var rich = {
    yellow: {
      color: "#3891FF",
      fontSize: 30 * scale,
      padding: [5, 4],
      align: 'center'
    },
    total: {
      color: "#ffc72b",
      fontSize: 40 * scale,
      align: 'center'
    },
    white: {
      color: "#fff",
      align: 'center',
      fontSize: 14 * scale,
      padding: [21, 0]
    }
  }
  var option = {
    title: {
      text: '统计图',
      left: 'center',
      top: 'center',
      padding: [24, 0],
      textStyle: {
        color: '#000',
        fontSize: '30rpx',
        align: 'center'
      }
    },

    series: [{
      name: '总考生数量',
      width: '352px',
      left: 0,
      right: 0,
      type: 'pie',
      radius: ['45%', '50%'],
      hoverAnimation: false,
      color: ['#FC9026', '#53BCA2', '#EC704F'],
      label: {
        normal: {
          show: false,
        }
      },
      data: echartData,
    }]
  }

  chart.setOption(option);
  return chart;
}
Page({
  onShareAppMessage: function(res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function() {},
      fail: function() {}
    }
  },


  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    },
    ec2:{
      onInit: initChart2
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})