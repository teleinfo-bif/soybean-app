// pages/statistics/statisticsTab/index.js
import { getGroupCensusList } from "../../../api/api";
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
Page({
  /**
   * 页面的初始数据
   */
  data: {
    clockInTime: getyyyyMMdd(new Date()),
    type: "",
    flag:true,//标记是否刷新
    groupId: "",
    currentTab: {},
    currentTabList: [], //当前现实的tab的数据情况
    currentTabData: [], //当前现实的tab的数据列表
    allData: [], // 所有分页数据的集合
    activeIndex: 0, //当前选中的索引
    activeType: 0,
    tabsOption: {
      healthy: [
        {
          name: "发烧、咳嗽",
          type: 2
        },
        {
          name: "其他",
          type: 0
        },
        {
          name: "健康",
          type: 1
        }
      ],
      hospitalization: [
        {
          name: "确诊",
          type: 1
        },
        {
          name: "隔离期",
          type: 2
        },
        {
          name: "出隔离期",
          type: 3
        },
        {
          name: "其他",
          type: 4
        }
      ],
      job: [
        {
          name: "已在岗",
          type: 1
        },
        {
          name: "远程办公",
          type: 2
        },
        {
          name: "未复工",
          type: 3
        },
      ],
      region: [
        {
          name: "武汉",
          type: 1
        },
        {
          name: "湖北其他",
          type: 2
        },
        {
          name: "北京",
          type: 3
        },
        {
          name: "其他",
          type: 4
        }
      ]
    }
  },
  lower(e) {
    // console.log(e);
    console.log("到底了");
    if(this.data.flag){
      this.getData();
    }
  },
  onClick(e) {
    const activeIndex = e.detail.index;
    wx.pageScrollTo({
      scrollTop: 0
    });
    this.setData(
      {
        activeIndex,
        currentTabData: this.data.allData[activeIndex]
      },
      this.getData
    );
  },
  onscroll(e, b) {
    // console.log(e);
    // console.log(b);
  },

  getData() {
    const {
      groupId,
      clockInTime,
      type,
      type: url,
      currentTab,
      activeIndex,
      allData
    } = this.data;
    let { current, pages } = allData[activeIndex];
    this.setData({
      flag:false
    })
    if (current == 0 || current < pages) {
      let params = {};
      if(type=='job'){
        params['jobstatus'] = currentTab[activeIndex].type;
      }else{
        params[type] = currentTab[activeIndex].type;
      }
      getGroupCensusList({
        url,
        groupId,
        current: ++current,
        clockInTime,
        ...params
      }).then(data => {

          allData[activeIndex] = {
            ...data,
            records: allData[activeIndex].records.concat(data.records)
          };
          this.setData({ allData });
          this.setData({
            flag:true
          })
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("提醒：页面接受的参数：", options);
    const { groupId, type, clockInTime } = options;
    const currentTab = this.data.tabsOption[type];
    const allData = [];
    currentTab.forEach((item, index) => {
      allData.push({
        total: 0,
        size: 0,
        current: 0,
        orders: [],
        searchCount: true,
        pages: 0,
        records: []
      });
    });
    this.setData(
      {
        type,
        groupId,
        clockInTime,
        currentTab,
        allData,
        currentTabData: allData[0],
        activeType: currentTab[0].type
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
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
