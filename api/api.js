import Request from "./request.js";
const tokenKey = "fedToken";

const appid = "wxd69df881f0c947dc";
// const appid = "wx5b2106519f2fb6c6";

// 获取用户openId
export const getOpenId = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        let params = {
          appid,
          code: res.code
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

// 获取用户获取的个人信息
export const getUserPhone = async params => {
  const sessionState = await Request.checkSessionKey();
  console.log("发送获取手机之前验证session：", sessionState);

  if (!sessionState) {
    console.log("重新获取sessionkey");
    await Request.getTokenStorage();
    params.sessionKey = data.sessionKey;
  }
  params = Object.assign({}, params, { appid });
  return Request._get("/wx/user/phone", params);
};

// 获取用户获取的个人信息
export const getUserFilledInfo = async params => {
  return Request._get("/user/exist", params).then(data => {
    const userFilledInfo = data;
    userFilledInfo["userRegisted"] = Object.keys(userFilledInfo).length > 0;
    wx.setStorageSync(Request.userFilledInfofoKey, userFilledInfo);
    return data;
  });
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

// 获取用户群组信息
export const getUserGroupTree = async params => {
  return Request._get("/wx/group/tree/user", params);
};

// 获取群组统计信息
export const getGroupStatistic = async params => {
  return Request._get("/wx/clockln/census/census", params);
};

// 获取群组详细信息
export const getGroupBlockList = async params => {
  return Request._get("/wx/clockln/census/list", params);
};