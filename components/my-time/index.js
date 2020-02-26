Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true // 使组件内部样式可以被全局样式覆盖 (2.2.3 以上)
  },
  properties: {
    /**
     * 微信自带选择日期文档 https://developers.weixin.qq.com/miniprogram/dev/component/picker.html
     * @params {String} props.start - 示例：YYYY-MM-DD
     * @params {String} props.end - 示例：YYYY-MM-DD
     * @params {'year' | 'month' | 'day'} props.fields - 默认为 'day'
     * @params {String} props.xxx - 与 my-input props 相同
     */
    props: {
      type: Object,
      value: {}
    },
    /**
     * YYYY-MM-DD
     */
    value: {
      type: String,
      value: '',
      observer(val = []) {
        this.setLabel(val)
      }
    }
  },
  data: {
    label: ''
  },
  methods: {
    onChange(e) {
      const { value } = e.detail
      this.setLabel(value)
      this.triggerEvent('change', e.detail)
    },
    setLabel(val = '') {
      this.setData({
        label: val
      })
    }
  }
});
