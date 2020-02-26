Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true // 使组件内部样式可以被全局样式覆盖 (2.2.3 以上)
  },
  properties: {
    props: {
      type: Object,
      value: {}
    },
    value: {
      type: String,
      value: ""
    }
  },
  methods: {
    onChange(e) {
      console.log("input - e.deatil", e.detail);
      this.triggerEvent("change", e.detail);
    }
  }
});
