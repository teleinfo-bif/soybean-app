//app.js
import { findUserByPhoneAct } from "./api/api";
import { saveOrUpdateUserInfo } from "./api/api.js";
import { appInit, getUserInfo } from "./api/request";
import { env } from "./config/index";

// import { getUnionId } from "./utils/unionId/demo";
App({
  initRequest: false,
  callbackList: [],
  migrateCallbackList: [],
  // 需要依赖openid，用户录入信息的页面，判断如果页面没有完成初始化，调用此函数
  async init(callback) {
    this.callbackList.push(callback);
    return;
  },

  // 更新用户信息
  async refreshUserInfo(init = false) {
    return new Promise(async (resolve, reject) => {
      if (init) {
        const initData = await appInit();

        this.globalData = {
          ...this.globalData,
          ...initData
        };
        await this.setGloableUserInfo(initData.userFilledInfo);
        resolve(this.globalData.userFilledInfo);
      } else {
        let userFilledInfo = await getUserInfo();
        console.log("app.js refreshUserInfo()更新用户信息成功", userFilledInfo);
        this.setGloableUserInfo(userFilledInfo);
        console.log("app init 完成初始化");
        resolve(userFilledInfo);
      }
    });
  },

  // 设置app global 用户录入信息
  async setGloableUserInfo(userFilledInfo, migrateCallBack = false) {
    debugger;
    return new Promise(resolve => {
      this.globalData.userFilledInfo = userFilledInfo;
      this.globalData.userRegisted = userFilledInfo.userRegisted;

      this.globalData.userId = userFilledInfo.id;
      this.globalData.appInit = true;
      // 请求完成之后，执行回调队列中的任务
      // 老用户录入后需要重新执行一次队列中的函数
      let callbackList = migrateCallBack
        ? this.migrateCallbackList
        : this.callbackList;
      callbackList.forEach(callback => {
        // console.log(callback);
        try {
          callback(this.globalData);
        } catch (error) {
          console.error(
            `错误提醒：app.js callbackList ${callback} error`,
            error
          );
        }
      });
      this.migrateCallbackList = this.callbackList;
      this.callbackList = [];
      console.warn(`用户${userFilledInfo.userRegisted ? "已" : "未"}注册`);
      resolve();
    });
  },

  // 根据电话号更新用户信息
  async updateUserInfoByPhone(phone, loginFromPhone = false) {
    return new Promise(async (resolve, reject) => {
      const phoneUserInfo = await findUserByPhoneAct({
        phone,
        loading: true
      });
      const phoneRegisted = Object.keys(phoneUserInfo).length > 0;
      console.log(
        "提醒：手机号phone-",
        phone,
        "注册状态是:",
        phoneRegisted,
        "更新用户openId"
      );
      // TODO: 如果用户信息存在，且未注册，提交更新
      if (phoneRegisted) {
        debugger;
        try {
          phoneUserInfo.loading = true;
          await saveOrUpdateUserInfo(phoneUserInfo);
          const initData = await appInit();
          // // 设置值
          this.globalData = {
            ...this.globalData,
            ...initData
          };
          await this.setGloableUserInfo(
            initData.userFilledInfo,
            loginFromPhone
          );
          resolve(initData);
        } catch (error) {
          reject(error);
        }
      } else if (loginFromPhone) {
        reject(new Error(phone + "用户未注册"));
        wx.showToast({
          title: phone + "用户未注册",
          icon: "none",
          duration: 3000,
          mask: true,
          success: result => {},
          fail: () => {},
          complete: () => {}
        });
      }
    });
  },

  onLaunch: async function(options) {
    // 环境判断
    this.globalData.release = env == "release";
    // const options = wx.getLaunchOptionsSync();
    console.log(options);
    debugger;
    // console.log();
    // 获取传入的phone)
    const { phone } =
      options.scene === 1037
        ? options.referrerInfo && options.referrerInfo.extraData
        : "";
    debugger;

    // APP初始化
    let initData = await appInit();
    // 设置值
    this.globalData = {
      ...this.globalData,
      ...initData
    };

    // 从其他小程序携带phone参数跳转过来，而且没有注册
    if (phone && !initData.userFilledInfo.userRegisted) {
      try {
        debugger;
        initData = await this.updateUserInfoByPhone(phone);
        debugger;
      } catch (error) {
        console.error(error);
      }
    } else {
      // XXX: 执行初始化结束的回调，需要等待老用户更新完个人信息之后
      await this.setGloableUserInfo(initData.userFilledInfo);
    }
    // this.onLaunch();
    // wx.reLaunch({
    //   url: "/pages/index/index",
    //   success: result => {},
    //   fail: () => {},
    //   complete: () => {}
    // });

    // 获取用户信息
    wx.getSetting({
      success: res => {
        // 判断用户是否已授权获取用户信息
        if (res.authSetting["scope.userInfo"]) {
          console.log("提醒：已授权用户信息");
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo;
            }
          });
        } else {
          console.log("提醒：未授权用户信息");
        }
      }
    });
  },
  globalData: {
    release: null, //是否是生产环境
    auth: true, // 是否开启权限验证
    appInit: false,
    statusBarHeight: 20, // 标题栏高度-适配首页
    userInfo: null, // 从微信获取的用户信息
    userFilledInfo: {}, // 用户填写的个人信息
    userId: null, // 用户id
    fedToken: null // token、session、openID信息
  }
});
