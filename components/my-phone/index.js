import { getOpenId, getUserPhone } from "../../api/api.js";
const app = getApp();
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
      value: "",
      observer(val = []) {
        this.setLabel(val);
      }
    }
  },
  data: {
    label: ""
  },
  methods: {
    getPhoneNumberFromServer(data = {}) {
      this.triggerEvent("change", 10010010011);
      getUserPhone(data)
        .then(res => {
          console.log(res);
          this.triggerEvent("change", res.phoneNumber);
        })
        .catch(e => {
          console.error("获取手机号码失败");
          wx.showToast({
            title: "获取手机号码失败，使用测试手机号填写-13888888888",
            icon: "none"
          });
          this.triggerEvent("change", 13888888888);
        })
        .finally(() => {
          console.error("complete");
        });
    },
    getPhoneNumber(e) {
      const { sessionKey } = app.globalData;
      let requestData = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionKey: sessionKey
      };
      if (app.globalData.sessionKey) {
        requestData.sessionKey;
        this.getPhoneNumberFromServer(requestData);
      } else {
        getOpenId().then(({ sessionKey }) => {
          requestData.sessionKey = sessionKey;
          this.getPhoneNumberFromServer(requestData);
        });
      }
      if (e.detail.errMsg == "getPhoneNumber:ok") {
      }
    },

    onChange(e) {
      const { value } = e.detail;
      this.triggerEvent("change", value);
    },
    setLabel(val = "") {
      this.setData({
        label: val
      });
    }
  }
});
