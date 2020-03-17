// pages/Statistics/index.js
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
import { getGroup, getGroupStatistic, getServerTime } from "../../api/api";
import { baseURLDownload } from "../../config/index";

Page({
  // onShareAppMessage: function(res) {
  //   return {
  //     title: "ECharts 可以在微信小程序中使用啦！",
  //     path: "/pages/index/index",
  //     success: function() {},
  //     fail: function() {}
  //   };
  // },

  /**
   * 页面的初始数据
   */
  data: {
    now: "",
    data: {},
    ecHealth: {
      lazyLoad: true
    },
    ecArea: {
      lazyLoad: true
    },
    ecHospital: {
      lazyLoad: true
    },
    groupId: null,
    groupName: "",
    clockInTime: getyyyyMMdd(new Date())
  },

  getData() {
    let { groupId, clockInTime } = this.data;
    getGroupStatistic({
      groupId: groupId,
      clockInTime: clockInTime
    }).then(data => {
      // console.log(data);
      this.setData({
        data
      });
    });
  },
  //根据ID获取部门信息
  getGroupDetail(groupId) {
    getGroup({
      id: groupId
    }).then(data => {
      let newName = data.addressName.split("，")[1];
      this.setData({
        addressName: newName
      });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options);
    let { groupId, groupName } = options;
    // this.setData(
    //   {
    //     groupId,
    //     groupName
    //   },
    //   () => {
    //     this.getData();
    //     this.getGroupDetail(groupId);
    //   }
    // );
    getServerTime().then(data => {
      let now =
        typeof data == "string" ? data.split(" ")[0] : getyyyyMMdd(new Date());
      let clockInTime =
        typeof data == "string" ? data.split(" ")[0] : getyyyyMMdd(new Date());
      this.setData(
        {
          groupId,
          groupName,
          clockInTime,
          now
        },
        () => {
          this.getData();
          this.getGroupDetail(groupId);
        }
      );
    });
  },
  onChange(e) {
    // console.log(e);
    const { value } = e.detail;
    this.setData(
      {
        clockInTime: value
      },
      this.getData
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getData();
    this.getGroupDetail(this.data.groupId);

    this.setData({
      clockInTime: getyyyyMMdd(new Date())
    });
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {},

  exportExcel: function() {
    const { groupId, clockInTime } = this.data;
    console.log("导出数据", clockInTime, groupId);
  //   wx.navigateTo({
  //     url: `/pages/statistics/status/index?groupId=${groupId}&clockInTime=${clockInTime}`,
  //  }); 
    let url = `${baseURLDownload}/download/annex.xlsx?groupid=${groupId}&from=${clockInTime}`;
    wx.setClipboardData({
      data: url,
      success: function(res) {
        wx.showToast({
          icon: "none",
          title: "导出文件下载链接已复制到您的剪贴板，请到浏览器中粘贴下载",
          duration: 3000
        });
      }
    });
  },

  showExcel: function(data, res) {
    const { groupId, clockInTime } = this.data;
    let url = `${baseURLDownload}/download/annex.xlsx?groupid=${groupId}&from=${clockInTime}`;
    wx.showLoading({
      title: "加载中..."
    });
    wx.downloadFile({
      url: url,
      success: function(res) {
        // console.log('res', res)
        wx.hideLoading();
        var filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath,
          fileType: "xlsx",
          success: function(res) {
            console.log("打开文档成功");
          }
        });
      }
    });
  },

  touchHandler() {
    const { groupId, clockInTime } = this.data;
    let title = "打卡";
    let type = "list";
    let series = [{"name":"未打卡","value":0,"percent":0},{"name":"已打卡","value":0,"percent":100}]
    wx.navigateTo({
      url: `/pages/statistics/statisticsTab/index?title=${title}&groupId=${groupId}&type=${type}&clockInTime=${clockInTime}&series=${JSON.stringify(series)}`
    });
  },
});
