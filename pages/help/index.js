// pages/help/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    helptap: "../../static/images/helptap.png",
    helptapright: "../../static/images/helptapright.png",
    commonList: [
      {
        title: "有象登录",
        content:
          "1 打开微信“扫一扫”扫描小程序码\n2 点击“用户注册”登录有象，获取授权\n3 登录成功，首页展示获取的头像"
      },
      {
        title: "用户注册",
        content:
          "1 点击“用户注册”，进入身份信息录入页面\n2 填写信息，手机号码自动获取（需授权允许）\n3 勾选《用户条款及隐私协议》，点【提交】"
      },
      {
        title: "修改用户信息",
        content:
          "1 首页点击“用户姓名”进入身份信息详情页面\n2 点击右上角【修改】，修改信息\n3 点击【提交】，修改成功"
      },
      {
        title: "健康打卡",
        content:
          "1 首页点击“健康打卡”进入健康打卡页\n2 【获取】打卡地点，授权允许，地址获取成功，可继续填写详细地址\n3 按真实情况健康打卡后点【提交】，打卡成功"
      },

      {
        title: "查看打卡记录",
        content:
          "1 从首页再次进入健康打卡页\n2 查看打卡详情，点击【打卡记录】，查看记录详情"
      },
      {
        title: "生成健康码",
        content:
          "绿码：身体无异常，可直接进入办公区\n 黄码：身体健康，但14天隔离未结束，或14天隔离期结束，但身体异常\n红码：确诊或身体异常或接触过确诊患者"
      },
      {
        title: "信息查看",
        content:
          "1 用户首页，点击【查看详情】按钮\n2 进入打卡详情页，可查看所属机构下的人员打卡状态"
      }
    ],
    managerList: [
      {
        title: "查看统计数据",
        content:
          "1 管理员进入有象首页，点击“统计按钮”图标\n2 进入数据统计页面查看统计数据，5种维度实时数据展示、图形展示\n3 查看不同日期的统计数据"
      },
      {
        title: "查看详细数据",
        content: "1 查看各维度的详情数据 \n 2 点击各维度的饼图，进入详情页"
      },
      {
        title: "导出报告",
        content:
          "1 管理员进入有象首页，点“统计按钮”图标\n2 点【导出报告】生成导出链接\n3 到浏览器中粘贴下载"
      },
      {
        title: "查看部门信息",
        content:
          "1 管理员进入有象首页点“查看详情”图标\n2 进入下级部门页，选择下级部门，点“查看详情”图标\n3 进入下下级部门，若为末级部门则部门详情查看完成"
      },
      {
        title: "查看人员详情",
        content:
          "1 管理员进入末级部门，进入该部门打卡详情页\n2 查看人员的健康详情及打卡记录\n3 查看该人员的打卡记录"
      },
      {
        title: "权限管理",
        content:
          "1 点击有象首页“机构头像”图标，进入机构详情页\n2 点击【权限管理】，可以选择待权限管理的部门，管理该部门下的管理权限或者统计权限\n3 点击【+】填写电话号码可以添加管理员\n4 点击【删除】可以删掉该部门添加的管理员"
      }
    ],
    permissionList: [
      {
        title: "创建机构",
        content:
          "1 点击首页头像或者您的名字进入身份信息页\n2 点击底部【注册新机构】可以选择两种方式注册\n3 方式1-填写机构基本信息并提交，后续在【机构架构管理】中完善机构架构\n4 方式2-填写机构基本信息并下载机构架构模板；完成机构架构表格填写并发送到微信；从微信中选择机构架构表格并提交，完成机构创建"
      },
      {
        title: "机构架构管理",
        content:
          "1 点击有象首页“机构头像”图标，进入机构详情页\n2 然后点击【机构架构管理】\n3 点击【+】可以添加此级机构的子机构，输入子机构名称，点击【添加】和【确认】，添加成功\n4 点击【-】可以删掉此级机构及其下级子机构"
      },
      {
        title: "创建者转让",
        content:
          "1 点击有象首页 “机构头像”图标，进入机构详情页\n2 点击【创建者转让】，填写“受让者姓名”和“受让者手机号”\n3 点击【转让】，可将创建者身份转让"
      }
    ]
  },

  onTap: function(e) {
    let index = e.currentTarget.dataset.index;
    //go
    let { commonList } = this.data;
    let data = commonList[index];
    data.flag = !data.flag; //toggle
    this.setData({
      commonList: commonList
    });
    // console.log(commonList)
  },
  onTap2: function(e) {
    let index = e.currentTarget.dataset.index;
    //go
    let { managerList } = this.data;
    let data = managerList[index];
    data.flag = !data.flag; //toggle
    this.setData({
      managerList: managerList
    });
  },
  onTap3: function(e) {
    let index = e.currentTarget.dataset.index;
    //go
    let { permissionList } = this.data;
    let data = permissionList[index];
    data.flag = !data.flag; //toggle
    this.setData({
      permissionList: permissionList
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

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
  onUnload: function() {}
});
