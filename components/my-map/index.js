import { getLocationPluginMapUrl, reverseAddressFromLocation } from "../../utils/qqmap-wx-jssdk/map";

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
    bindGetLoation() {
      const _this = this
      wx.showModal({
        //弹窗提示
        title: "位置授权",
        content:
          "请授权获取您的地理位置，否则健康打卡无法提交哦",
        success: function(tip) {
          if (tip.confirm) {
            wx.openSetting({
              //点击确定则调其用户设置
              success: function(data) {
                if (data.authSetting["scope.userLocation"] === true) {
                  //如果设置成功
                  wx.showToast({
                    //弹窗提示
                    title: "授权成功",
                    icon: "success",
                    duration: 1000
                  });
                  _this.getLocation()
                }
              }
            });
          } else {
            //点击取消按钮，则刷新当前页面
            wx.redirectTo({
              //销毁当前页面，并跳转到当前页面
              url: "index" //此处按照自己的需求更改
            });
          }
        }
      });
    },
    // 直接获取位置信息
    getLocation() {
      const _this = this
      wx.getLocation({
        success(res) {
          reverseAddressFromLocation(res).then(location => {
            _this.triggerEvent("change", location.result.address);
          });
         
        }
      });
    },
    // 选择位置信息
    chooseLocation() {
      wx.getLocation({
        success(res) {
          wx.navigateTo({ url: getLocationPluginMapUrl(res) });
        }
      });
    },
    // picker点击事件
    onChange(e) {
      const _this = this
      wx.getSetting({
        success:(res)=>{
          if (!res.authSetting['scope.userLocation']) {
            console.warn("-----不满足scope.userLocation权限-----");
            //申请授权
            wx.authorize({
              scope: 'scope.userLocation',
              success() {
                console.log('-----wx.authorize授权成功-----')
                _this.getLocation()
              },
              fail(e) {
                console.warn('-----wx.authorize授权失败（第一次拒绝定位）-----')
                _this.bindGetLoation()
              }
            })
          } else {
            _this.chooseLocation()
          }
        }
      })
  
    
      // const { value } = e.detail
      // this.setLabel(value)
      // this.triggerEvent("change", "test");
    },
    setLabel(val = "") {
      this.setData({
        label: val
      });
    }
  }
});
