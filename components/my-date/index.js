function getyyyyMMdd(date) {
  var d = date || new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth() + 1;
  var curr_year = d.getFullYear();
  String(curr_month).length < 2 ? (curr_month = "0" + curr_month) : curr_month;
  String(curr_date).length < 2 ? (curr_date = "0" + curr_date) : curr_date;
  var yyyyMMdd = curr_year + "-" + curr_month + "-" + curr_date;
  return yyyyMMdd;
}
Component({
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      if (this.data.props == null || this.data.props.end == undefined) {
        this.setData({
          now: getyyyyMMdd(new Date())
        });
        // this.now = new Date().getFullYear()
      }
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    }
  },
  options: {
    multipleSlots: true,
    addGlobalClass: true // 使组件内部样式可以被全局样式覆盖 (2.2.3 以上)
  },
  properties: {
    /**
     * 微信自带选择日期文档 https://developers.weixin.qq.com/miniprogram/dev/component/picker.html
     * @params {String} props.start - 示例：hh:mm
     * @params {String} props.end - 示例：hh:mm
     * @params {String} props.xxx - 与 my-input props 相同
     */
    props: {
      type: Object,
      value: {}
    },
    /**
     * hh:mm
     */
    value: {
      type: String,
      value: "",
      now: "",
      observer(val = []) {
        this.setLabel(val);
      }
    }
  },
  data: {
    label: ""
  },
  methods: {
    onChange(e) {
      const { value } = e.detail;
      this.setLabel(value);
      this.triggerEvent("change", e.detail);
    },
    setLabel(val = "") {
      this.setData({
        label: val
      });
    }
  }
});
