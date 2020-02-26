import Request from "./request.js";

// 获取用户openId
export const getOpenId = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        let params = {
          appid: "wx5236affef117da53",
          code: res.code
        };
        Request._get("/wx/user/login", params)
          .then(data => {
            wx.setStorageSync("openid", data.openid);
            wx.setStorageSync("section_key", data.section_key);
            resolve(data);
          })
          .catch(e => {
            reject(e);
          });
      }
    });
  });
};

// 获取用户获取的个人信息
export const getUserPhone = params => {
  console.log(params);
  return Request._post("/wx/user/phone", params);
};

// 获取用户获取的个人信息
export const getUserFilledInfo = params => {
  return Request._get("/user/exist", params);
};

// 获取用户上传的个人信息
export const saveUserInfo = params => {
  return Request._post("/user/save", params);
};

// 获取用户上传的个人信息
export const updateUserInfo = params => {
  return Request._post("/user/update", params);
};

// 删除用户上传的个人信息
export const delUserInfo = params => {
  return Request._postParams("/user/remove", params);
};

// 用户打卡信息
export const saveClock = params => {
  return Request._postParams("/wx/interaction/clock", params);
};

// 获取用户打卡信息
export const getUserClockList = params => {
  return Request._get("/wx/interaction/list", params);
};

// 获取用户今日打卡信息
export const getTodayClock = params => {
  return Request._get("/wx/interaction/show/today", params);
};

// 获取用户群组信息
export const getUserGroupList = params => {
  return Request._get("/wx/group/list", params);
};

// 获取群组统计信息
export const getGroupStatistic = params => {
  return Request._get("/wx/clockln/census/census", params);
};

// 获取群组详细信息
export const getGroupBlockList = params => {
  return Request._get("/wx/clockln/census/list", params);
};
