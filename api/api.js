import Request from "./request.js";
const tokenKey = "fedToken";

const appid = "wx9f50de1f1b6b94c6";
// const appid = "wx5b2106519f2fb6c6";

// 获取用户openId
/**
export const getOpenId = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        let params = {
          appid,
          code: res.code,
          header: {
            Authorization: "Basic c2FiZXI6c2FiZXJfc2VjcmV0"
          }
        };
        Request._get("/wx/user/login", params)
          .then(data => {
            wx.setStorageSync("tokenKey", data);
            // wx.setStorageSync("tokenKey", data.openid);
            // wx.setStorageSync("section_key", data.section_key);
            resolve(data);
          })
          .catch(e => {
            reject(e);
          });
      }
    });
  });
}; 
 */

// 获取用户获取的个人信息
export const getUserPhone = async params => {
  // const sessionState = await Request.checkSessionKey();
  // console.log("发送获取手机之前验证session：", sessionState);

  // if (!sessionState) {
  //   console.log("重新获取sessionkey");
  //   await Request.getOpenId();
  //   params.sessionKey = data.sessionKey;
  // }
  params = Object.assign({}, params, { appid });
  return Request._get("/wx/user/phone", params);
};

// 获取用户上传的个人信息
export const saveUserInfo = async params => {
  return Request._post("/user/save", params);
};

// 获取用户上传的个人信息
export const updateUserInfo = async params => {
  return Request._post("/user/update", params);
};

// 获取用户上传的个人信息
export const saveOrUpdateUserInfo = async params => {
  return Request._post("/user/saveOrUpdate", params);
};

// 删除用户上传的个人信息
export const delUserInfo = async params => {
  return Request._postParams("/user/remove", params);
};

// 用户打卡信息
export const saveClock = async params => {
  return Request._post("/wx/interaction/clock", params);
};

// 获取用户打卡信息
export const getUserClockList = async params => {
  return Request._get("/wx/interaction/list", params);
};

// 获取用户今日打卡信息
export const getTodayClock = async params => {
  return Request._get("/wx/interaction/show/today", params);
};

// 获取用户部门信息
export const getUserGroupTree = async params => {
  return Request._get("/wx/group/tree/user", params);
};

// 获取部门统计信息
export const getGroupStatistic = async params => {
  return Request._get("/wx/clockln/census/census", params);
};

// 获取部门详细信息
export const getGroupBlockList = async params => {
  return Request._get("/wx/clockln/census/list", params);
};

// 获取部门打卡分类信息
export const getGroupCensusList = async params => {
  return Request._get(`/wx/clockln/census/${params.url}`, params);
};

// 获取部门打卡分类信息
export const getGroupCurrentUserList = async params => {
  return Request._get(`/wx/group/user/current`, params);
};

// 用户加入部门
export const joinGroup = async params => {
  return Request._post(`/wx/usergroup/save`, params);
};

//根据id查看部门信息
export const getGroup = async params => {
  return Request._get(`/wx/group/detail`, params);
};

// 获取用户树形部门
export const getUserTreeGroup = async params => {
  return Request._get("/wx/group/tree", params);
};

// 用户创建部门
export const createGroup = async params => {
  return Request._post(`/wx/group/excelImport`, params);
};

// 加群前用户当前群
export const getUserCurrentGroup = async params => {
  return Request._get(`/wx/usergroup/user/currentGroup`, params);
};

// 退群
export const quitGroup = async params => {
  return Request._post(`/wx/usergroup/quit`, params);
};

// 根据唯一码查看群信息
export const fromGroupCodetoId = async params => {
  return Request._get(`/wx/group/groupCode`, params);
};
// 获取用户当天的健康码
export const getUserHealthyQR = async params => {
  return Request._get("/healthQrcode/createHealthQrcode", params);
};
//根据机构ID，查看管理员用户信息
export const getGroupManager = async params => {
  return Request._get("/wx/group/manager", params);
};
//查询此组织下拥有此手机号的用户信息
export const getGroupAddManager = async params => {
  return Request._get("/wx/group/user/phone", params);
};
// 新增群数据库管理员
export const addDataManager = async params => {
  return Request._postParams(`/wx/group/dataManager`, params);
};
// 新增群管理员
export const addManager = async params => {
  return Request._postParams(`/wx/group/manager`, params);
};

// 微信小程序推送单个用户订阅消息
export const sendSingleUserMsg = async params => {
  return Request._get(`/wx/subscribe/send`, params);
};

// 微信小程序推送群组订阅消息
export const sendGroupUserMsg = async params => {
  return Request._get(`/wx/subscribe/send/group`, params);
};

// 删除群数据库管理员
export const deleteDataManager = async params => {
  return Request._deleteParams(`/wx/group/dataManager`, params);
};
// 删除群管理员
export const deleteManager = async params => {
  return Request._deleteParams(`/wx/group/manager`, params);
};

// 获取服务器时间
export const getServerTime = async params => {
  return Request._get(`/wx/system/time`, params);
};
//退出机构
export const existCompany = async params => {
  return Request._get(`/wx/usergroup/exist`, params);
};


//订阅消息
export const userSubscribe = async params => {
  return Request._postParams(`/user/subscribe`, params);
};

//取消订阅消息
export const userUnSubscribe = async params => {
  return Request._postParams(`/user/unsubscribe`, params);
};
//群组是否存在
export const isGroupExist = async params => {
  return Request._get(`/wx/group/exist`, params);
};

//移除机构
export const delFirstCompanyAct = async params => {
  return Request._postParams(`/wx/group/close`, params);
};
//根据手机号找用户
export const findUserByPhoneAct = async params => {
  return Request._get(`/wx/user/findUserByPhone`, params);
};
//群转让
export const transferCompanyAct = async params => {
  return Request._postParams(`/wx/group/transfer`, params);
};

