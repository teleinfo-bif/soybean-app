Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true // 使组件内部样式可以被全局样式覆盖 (2.2.3 以上)
  },
  properties: {
    props: {
      type: Object,
      value: []
    },
    options: {
      type: Array,
      value: []
    },
    value: {
      type: String,
      value: ""
    },
    itemKey: {
      type: String,
      value: "value"
    },
    itemLabelKey: {
      type: String,
      value: "label"
    }
  },
  data: {
    checked: true
  },
  methods: {
    onChange(e) {
      this.setData({
        checked: e.detail
      });
      this.triggerEvent("change", e.detail);
    }
  }
});
