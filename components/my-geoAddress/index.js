import {
  getLocationPluginMapUrl,
  reverseAddressFromLocation
} from "../../utils/qqmap-wx-jssdk/map";

Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true // 使组件内部样式可以被全局样式覆盖 (2.2.3 以上)
  },
  lifetimes: {
    attached() {}
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
      value: {},
      observer(val = {}) {
        const { location } = this.data.props;

        if (location) {
          let baseAddress;
          const {
            province,
            city,
            district
          } = location.result.address_component;
          if (province == city) {
            baseAddress = province;
          } else {
            baseAddress = province + city;
          }
          this.setData({
            noPermission: false,
            location,
            baseAddress
          });
        } else {
          this.setData({
            noPermission: true
          });
        }

        this.setLabel(val);
      }
    },
    /**
     * YYYY-MM-DD
     */
    value: {
      type: String,
      value: "",
      observer(val = []) {
        const { location } = this.data.props;
        // debugger;
        this.setData({
          location,
          streetNumber: val
        });
        // debugger;

        this.setLabel(val);
      }
    }
  },
  data: {
    noPermission: false,
    label: "",
    location: {},
    baseAddress: "",
    streetNumber: ""
  },
  methods: {
    showMsg() {
      wx.showMsg({
        data: "test"
      });
    },
    ontest(e) {
      console.log("test", e);
      const value = e.detail;
      console.log(value.length);
      const prop = e.currentTarget.dataset.prop;
      // console.log(this);
      // debugger;
      this.triggerEvent("change", value);
    },
    // onChange(e) {
    //   console.log("test", e);
    //   this.triggerEvent("change", e.detail);
    // },
    test() {
      // console.log(JSON.parse(this.data.value));
      console.log(this.data);
      this.triggerEvent("test", "value");
    },
    bindGetLoation() {
      const _this = this;
      wx.showModal({
        //弹窗提示
        title: "位置授权",
        content: "请授权获取您的地理位置，否则健康打卡无法提交哦",
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
                  _this.getLocation();
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
      const _this = this;
      wx.showLoading({
        title: "获取中..."
      });
      wx.getLocation({
        isHighAccuracy: true,
        success(res) {
          reverseAddressFromLocation(res)
            .then(location => {
              // _this.triggerEvent("change", JSON.stringify(location));
              // const { location } = this.data.props;
              wx.hideLoading();
              let baseAddress;
              const {
                province,
                city,
                district,
                street_number
              } = location.result.address_component;
              if (province == city) {
                baseAddress = province;
              } else {
                baseAddress = province + city;
              }
              _this.triggerEvent("baseAddress", {
                baseAddress,
                city: province + "，" + city
              });
              if (location) {
                _this.setData({
                  noPermission: false,
                  location,
                  baseAddress,
                  streetNumber: district + street_number
                });
              } else {
                this.setData({
                  noPermission: true
                });
              }
            })
            .catch(error => {
              wx.hideLoading();
              wx.showToast({
                title: "获取地址失败",
                icon: "none"
              });
              console.error("腾讯地址逆解析接口 error", error);
            });
        }
      });
    },
    // 选择位置信息
    chooseLocation() {
      wx.getLocation({
        isHighAccuracy: true,
        success(res) {
          wx.navigateTo({ url: getLocationPluginMapUrl(res) });
        }
      });
    },
    // picker点击事件
    onChange(e) {
      const _this = this;
      wx.getSetting({
        success: res => {
          if (!res.authSetting["scope.userLocation"]) {
            console.warn("-----不满足scope.userLocation权限-----");
            //申请授权
            wx.authorize({
              scope: "scope.userLocation",
              success() {
                console.log("-----wx.authorize授权成功-----");
                _this.getLocation();
              },
              fail(e) {
                console.warn(
                  "-----wx.authorize授权失败（第一次拒绝定位）-----"
                );
                _this.bindGetLoation();
              }
            });
          } else {
            _this.getLocation();
          }
        }
      });
    },
    setLabel(val = "") {
      this.setData({
        label: val
      });
    }
  }
});
