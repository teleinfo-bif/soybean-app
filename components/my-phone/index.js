import { getUserPhone } from "../../api/api.js";
import { checkSessionKey } from "../../api/request.js";
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
      // this.triggerEvent("change", 10010010011);
      getUserPhone(data)
        .then(res => {
          // console.log(res);
          this.triggerEvent("change", res.phoneNumber);
        })
        .catch(e => {
          console.error("错误：获取手机号码失败", e);
          wx.showToast({
            title: "获取手机号码失败",
            icon: "none"
          });
          // this.triggerEvent("change", 13888888888);
        })
        .finally(() => {
          // console.error("complete");
        });
    },
    async getPhoneNumber(e) {
      let { fedToken } = app.globalData;
      const sessionState = await checkSessionKey();
      console.log("点击获取手机号按钮，session状态是", sessionState);
      if (!sessionState) {
        console.log("sessionKey无效重新获取sessionKey");
        fedToken = awaitgetOpenId();
        app.globalData.fedToken = fedToken;
      }
      // 此处没有判断token的有效状态
      let requestData = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionKey: fedToken.sessionKey
      };
      this.getPhoneNumberFromServer(requestData);
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
