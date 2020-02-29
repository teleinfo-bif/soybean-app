Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true // 使组件内部样式可以被全局样式覆盖 (2.2.3 以上)
  },
  properties: {
    fields: {
      type: Array,
      value: []
    },
    formData: {
      type: Object,
      value: {},
      observer(formData) {
        let test = this.setFormData(formData);
        this.setData({
          _formData: {
            ...test
          }
        });
      }
    }
  },
  data: {
    _formData: {}
  },
  methods: {
    out() {
      console.log("this.data", this.data);
      console.log("this.formData", this.data.formData);
      console.log("this._formData", this.data._formData);
    },
    findFieldItemWithProp(prop) {
      const fields = this.data.fields || [];
      return fields.find(item => item.prop === prop);
    },
    onInputChange(e) {
      const value = e.detail;
      const prop = e.currentTarget.dataset.prop;
      this.triggerChange(prop, value);
    },
    onPickerChange(e) {
      const index = e.detail.value;
      const prop = e.currentTarget.dataset.prop;
      const fieldSetting = this.findFieldItemWithProp(prop);
      if (!fieldSetting || !fieldSetting.props) return;
      const { options = [] } = fieldSetting.props;
      const option = options[index];
      // debugger;
      this.triggerChange(prop, option);
    },
    onRadioChange(e) {
      const value = e.detail;
      const prop = e.currentTarget.dataset.prop;
      this.triggerChange(prop, value);
    },
    onAreaChange(e) {
      const value = e.detail.value;
      const prop = e.currentTarget.dataset.prop;
      this.triggerChange(prop, value);
    },
    onDateChange(e) {
      const value = e.detail.value;
      const prop = e.currentTarget.dataset.prop;
      this.triggerChange(prop, value);
    },
    onTimeChange(e) {
      const value = e.detail.value;
      const prop = e.currentTarget.dataset.prop;
      this.triggerChange(prop, value);
    },
    triggerChange(prop, value, other = null) {
      // console.log("====picker idtype =======");
      this.setData({
        _formData: {
          ...this.data._formData,
          [prop]: value
        }
      });
      const formData = this.formatFormData();
      this.triggerEvent("change", {
        prop,
        value,
        formData,
        _formData: this.data._formData,
        ...other
      });
    },
    onClick(e) {
      const { prop, type } = e.currentTarget.dataset;
      this.triggerEvent("click", { prop, type });
    },
    /** 触发 change 事件前先格式化数据 */
    formatFormData() {
      let formData = {};
      let _formData = this.data._formData;
      // console.log("formData", formData);
      for (let prop in _formData) {
        // console.log("prop", prop);
        const field = this.findFieldItemWithProp(prop);
        // console.log("field", field);
        if (!field) break;
        const type = field.type;
        switch (type) {
          case "select":
            const { itemKey = "" } = field.props || {};
            formData[prop] = (_formData[prop] || {})[itemKey];
            break;
          default:
            formData[prop] = _formData[prop];
            break;
        }
      }
      return formData;
    },
    /** 父组件传入 formData 之后设置 _formData */
    setFormData(formData) {
      let _formData = {};
      for (let prop in formData) {
        const field = this.findFieldItemWithProp(prop);
        if (!field) continue;
        const type = field.type;
        switch (type) {
          case "select":
            // debugger;
            const value = formData[prop] || {};
            const { itemKey = "", options, itemLabelKey = "" } =
              field.props || {};
            // 写入的字段是string，选择的是object
            _formData[prop] = options.find(
              item =>
                item[itemKey] === (typeof value == "object" ? value.id : value)
            );
            break;
          default:
            _formData[prop] = formData[prop];
            break;
        }
      }
      return _formData;
    },
    getFormItemLabel(prop) {
      return this.data.fields.filter(item => {
        return item.prop == prop;
      });
    },
    validate() {
      const { fields, _formData } = this.data;
      Object.keys(fields).forEach(prop => {});
      for (let i = 0; i < Object.keys(fields).length; i++) {
        let prop = fields[i].prop;
        let itemData = _formData[prop];
        const item = fields[i];
        // 判断 隐藏、不需要验证的字段跳过验证
        if (item.require != false && item.hide != true) {
          let emptyItem = this.getFormItemLabel(prop)[0];
          if (item.props.validate && !item.props.validate(itemData)) {
            let errorMsg = item.props.errorMsg || emptyItem.title + "验证错误";
            wx.showToast({
              title: errorMsg,
              icon: "none"
            });
            return false;
          } else if (
            itemData == null ||
            itemData == undefined ||
            itemData.length == 0
          ) {
            wx.showToast({
              title: emptyItem.title + "项不能为空",
              icon: "none"
            });
            return false;
          }
        }
      }
      return true;
    }
  }
});
