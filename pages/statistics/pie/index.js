var wxCharts = require("../../../utils/wxcharts/wxcharts.min.js");

const titles = ["健康情况", "地区分布", "就诊情况","复工情况"];
const colors = ["#aa4438", "#ffaa00", "#f2d45e", "#4169E1"];
function setOption(chart, data, index = 0) {
  const option = {
    backgroundColor: "#fff",
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      containLabel: true
    },
    title: {
      text: "",
      left: "center",
      top: "center",
      padding: [24, 0],
      textStyle: {
        color: "#000",
        fontSize: "130px",
        align: "center",
        rich: {}
      }
    },
    series: [
      {
        name: titles[index],
        left: 0,
        right: 0,
        type: "pie",
        radius: ["43%", "50%"],
        hoverAnimation: false,
        avoidLabelOverlap: false,
        color: colors,
        label: {
          normal: {
            show: false,
            rich: {}
          }
        },
        data: data
      }
    ]
  };
  chart.setOption(option);
}
let ecComponent = null;
// pages/statistics/pie/index.js
Component({
  lifetimes: {
    attached() {
      ecComponent = this.selectComponent("#ringCanvas");
      // this.initChats();
      // this.initEcharts();
    },
    ready() {
      // this.initChats();
    }
    // onLoad() {
    //   console.log(this);
    //   // 在组件实例进入页面节点树时执行
    //   // this.init();
    //   // this.init();
    // },
    // detached: function() {
    //   // 在组件实例被从页面节点树移除时执行
    // }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    eleid: {
      type: String,
      default: "ringCanvas"
    },
    type: {
      type: String,
      default: ""
    },
    groupId: {
      type: [Number, String],
      default: 0
    },
    clockInTime: {
      type: [Number, String],
      default: 0
    },
    first: {
      type: Boolean,
      default: false
    },
    clockIn: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ""
    },
    data: {
      type: Array,
      default: () => {},
      observer() {
        // const order = [];
        if (this.data.data.length > 0) {
          // this.initEcharts();
          this.initChats();
        }
      }
    }
  },
  // observer

  /**
   * 组件的初始数据
   */
  data: {
    ec: {
      lazyLoad: true
    },
    ringChart: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 初始化

    // pie图点击跳转
    touchHandler() {
      const { groupId, type, clockInTime } = this.data;
      wx.navigateTo({
        url: `/pages/statistics/statisticsTab/index?groupId=${groupId}&type=${type}&clockInTime=${clockInTime}`
      });
    },
    initChats(e) {
      // var windowWidth = 200;
      const series = [];

      const colors = ["#aa4438", "#f2d45e", "#ffaa00", "#4169E1"];
      const emptyData = this.data.data.filter(item => {
        return item.value != 0;
      });
      console.log(emptyData);
      this.data.data.forEach((item, index) => {
        series.push({
          name: item.name,
          data: emptyData.length > 0 ? item.value : 1,
          // data: 0,
          stroke: false,
          color:
            this.data.data.length == 3 && index == 2
              ? colors[++index]
              : colors[index]
        });
      });
      const { eleid } = this.data;
      this.data.ringChart = new wxCharts({
        componentInstance: this,
        animation: true,
        canvasId: eleid,
        type: "ring",
        extra: {
          ringWidth: 10,
          pie: {
            offsetAngle: -45
          }
        },
        series: series,
        disablePieStroke: false,
        width: 170,
        height: 170,
        dataLabel: false,
        legend: false,
        background: "#fff",
        padding: 0
      });
      // debugger;
      // setTimeout(() => {
      //   this.data.ringChart.stopAnimation();
      // }, 500);
    }
  }
});
