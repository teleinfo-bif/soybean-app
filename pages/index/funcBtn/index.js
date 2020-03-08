// pages/index/FuncBtn/FuncBtn.js
//获取应用实例
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
const app = getApp();
import { getTodayClock } from "../../../api/api";

Component({
  lifetimes: {
    attached() {
      if (!app.globalData.appInit) {
        app.init(() => {
          // this.getTodayClockData();
        });
      } else {
        // this.getTodayClockData();
      }
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {
    btnData: {
      type: Object,
      default: () => {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    clocked: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async toNextPage(e) {
      // 确定APP初始化结束之后，能正常获取注册信息之后再调用
      if (!app.globalData.appInit) {
        app.init(this.toNextPage);
        return;
      }
      const { data, path } = e.currentTarget.dataset;
      // 如果用户未注册
      if (!app.globalData.userRegisted) {
        wx.showModal({
          title: "温馨提示",
          content: "请您继续完善身份信息",
          showCancel: false,
          confirmText: "去完善",
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: "/pages/personal/index"
              });
            }
          }
        });
      } else if (data.permission && !this.data.clocked) {
        // 存在未打卡false和未请求两种情况不单独验证
        const clocked = await this.getTodayClockData();
        if (clocked) {
          wx.navigateTo({
            url: e.currentTarget.dataset.path
          });
        } else {
          wx.showModal({
            title: "温馨提示",
            content: "健康打卡后方可使用健康码",
            showCancel: false,
            confirmText: "去健康打卡",
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: "/pages/clock/index"
                });
              }
            }
          });
        }
      } else {
        wx.navigateTo({
          url: path
        });
      }
    },
    // 获取今日打卡信息
    async getTodayClockData() {
      return getTodayClock({
        time: getyyyyMMdd()
      })
        .then(resData => {
          const locked = resData.total > 0;
          this.setData({
            locked
          });
          return locked;
        })
        .catch(e => {
          return false;
        });
    }
  }
});
