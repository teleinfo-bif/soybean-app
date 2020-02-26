Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true // 使组件内部样式可以被全局样式覆盖 (2.2.3 以上)
  },
  properties: {
    /**
     * @params {String} props.xxx - 与 my-input props 相同
     */
    props: {
      type: Object,
      value: {}
    },
    /**
     * ['北京市', '北京市', '东城区']
     */
    value: {
      type: Array,
      value: [],
      observer(val = []) {
        this.setLabel(val);
      }
    }
  },
  data: {
    label: ""
  },
  methods: {
    test() {
      console.log(this.data);
    },
    onChange(e) {
      const { value } = e.detail;
      this.setLabel(value);
      this.triggerEvent("change", e.detail);
    },
    setLabel(val = []) {
      this.setData({
        label: val.join("-")
      });
    }
  }
});
