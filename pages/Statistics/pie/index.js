import * as echarts from "../../../components/ec-canvas/echarts";

const titles = ["健康情况", "地区分布", "就诊情况"];
const colors = ["#3891FF", "#53BCA2", "#FCAD57", "#EC704F"];
function setOption(chart, data, index = 0) {
  const option = {
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
      text: "统计图",
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
// pages/statistics/pie/index.js
Component({
  lifetimes: {
    attached() {
      this.ecComponent = this.selectComponent("#mychart-dom-pie");
      // this.initEcharts();
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
        if (this.data.data.length > 0) {
          this.initEcharts();
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
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initEcharts() {
      this.ecComponent.init((canvas, width, height) => {
        // 获取组件的 canvas、width、height 后的回调函数
        // 在这里初始化图表
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        setOption(chart, this.data.data);

        // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
        this.chart = chart;

        // 注意这里一定要返回 chart 实例，否则会影响事件处理等
        return chart;
      });
    }
  }
});
