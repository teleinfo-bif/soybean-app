import urlParameterAppend from "url-parameter-append";
import { appId, baseURL, baseURLNotice } from "../config/index";

// 存在localstorage中的变量
const tokenKey = "fedToken";
const userFilledInfofoKey = "userFilledInfo";

// login返回的token信息，用户录入的信息
let fedToken = {};
let userFilledInfo = {};

// 封装网络请求开始
const Request = async ({
  url,
  params = {},
  data = {},
  method,
  header,
  ...others
} = {}) => {
  // const sessionValidate = await checkSessionKey();
  if (!fedToken || fedToken == "" || fedToken.openid == undefined) {
    console.log(
      "提醒：openID、sessionkey失败，正在重新获取openID、sessionkey..."
    );
    fedToken = await getOpenId();
    console.log("返回数据：获取的用户", fedToken);
  }
  // console.log("userFilledInfo", userFilledInfo);
  // if (
  //   (url != "/user/exist" || url == "/wx/user/token") &&
  //   (userFilledInfo == null || typeof userFilledInfo != "object") // ||
  //   // !userFilledInfo.id)
  // ) {
  //   console.log(
  //     "提醒：storage读取用户录入信息失败，正在重新获取用户录入信息..."
  //   );
  //   userFilledInfo = await getUserInfo({ openid: fedToken.openid });
  //   console.log("返回数据：获取的用户", userFilledInfo);
  // }

  // params放在后面，避免覆盖参数中的openid,判断参数中userId是否有效
  let reqData = Object.assign({}, data, {
    openid: fedToken.openid ? fedToken.openid : "",
    wechatId: fedToken.openid ? fedToken.openid : "",
    userId: data.userId ? data.userId : userFilledInfo.id || ""
  });
  if (Object.keys(params).length > 0) {
    params = {
      ...params,
      userId: params.userId ? params.userId : userFilledInfo.id || ""
    };
    url = urlParameterAppend(url, params);
  }
  wx.showNavigationBarLoading();
  // 添加请求加载等待
  if (data.loading) {
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
  }

  // Promise封装处理
  return new Promise((resolve, reject) => {
    wx.request({
      // 请求地址拼接
      url: baseURL + url,
      data: reqData,
      method: method,
      header: {
        ...getAuth(fedToken),
        ...header
      },
      ...others,
      // 成功或失败处理
      complete: async res => {
        // 关闭等待
        try {
          wx.hideLoading();
        } catch (error) {
          console.error("wx.hideLoading error");
        }
        wx.hideNavigationBarLoading();

        // 进行状态码判断并处理
        if (res.statusCode === 204) {
          resolve(res);
        } else if (res.statusCode === 401) {
          // 检测到状态码401，进行token刷新并重新请求等操作
          const token = await getServerToken();
          fedToken = Object.assign(fedToken, token);
          _refetch({
            url,
            data,
            method,
            params,
            ...others
          })
            .then(resolve)
            .catch(reject);
        } else if (res.statusCode == 200) {
          const { code } = res.data;
          if (url == "/wx/clockln/census/census") {
            resolve(res.data);
          } else if (url == "/wx/user/token" && code === 400) {
            // 请求token400错误直接reject返回
            // debugger;
            reject(res.data);
          } else if (code === 200) {
            resolve(res.data.data);
          } else if (code === 401) {
            // 检测到状态码401，进行token刷新并重新请求等操作
            console.log("提醒：token过期，正在重新获取token");
            const token = await getServerToken();
            console.log("提醒：重新获取token", token);
            fedToken = Object.assign(fedToken, token);
            _refetch({
              url,
              data,
              method,
              params,
              ...others
            })
              .then(resolve)
              .catch(reject);
          } else {
            // console.log(url + "-" + res.statusCode);
            console.error(
              "request请求错误，URL:",
              url,
              "\nrequest data:",
              data,
              "\nresponse data:",
              res.data
            );
            // 获取后台返回报错信息
            let title = res.data.msg || "请求错误";
            // 调用全局toast方法
            showToast(title);
            reject(res.data.data);
          }
        } else {
          reject(res);
        }
      }
    });
  });
};
// 添加请求toast提示
const showToast = title => {
  wx.showToast({
    title: title,
    icon: "none",
    duration: 3000,
    mask: true
  });
};

// 重构请求方式
const _fetch = content => {
  return Request({
    url: content.url,
    data: content.data,
    method: content.method
  });
};
// 添加刷新之后的操作处理方法
const refreshToken = () => {
  return new Promise((resolve, reject) => {
    // 获取token
    getOpenId()
      .then(() => {
        resolve();
      })
      .catch(e => {
        console.error("错误：服务端401,token过期，重新获取token失败");
        reject();
      });
  });
};
const _refetch = ({ url, data, method, params, ...others }) => {
  return Request({
    url,
    data,
    method,
    params,
    others
  });
};

//除开上面的调用方式之外，你也可以使用下面的这些方法，只需要关注是否传入method
const _get = (url, data = {}, header = {}) => {
  data.size = 20;
  return Request({
    url,
    data,
    header
  });
};
const _post = (url, data = {}) => {
  return Request({
    url,
    data,
    method: "post"
  });
};
const _put = (url, data = {}) => {
  data.size = 20;
  return Request({
    url,
    data,
    method: "put"
  });
};
const _delete = (url, data = {}) => {
  data.size = 20;
  return Request({
    url,
    data,
    method: "delete"
  });
};
const _deleteParams = (url, params = {}) => {
  return Request({
    url,
    params,
    method: "delete"
  });
};

// post - application/x-www-form-urlencoded
const _postParams = (url, params = {}) => {
  return Request({
    url,
    params: params,
    method: "post",
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
};

/**
 *获取用户openID & token信息
 *
 * @returns
 */
async function getOpenId() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        let data = {
          appid: appId,
          code: res.code
        };
        wx.request({
          url: baseURL + "/wx/user/login",
          data: data,
          header: {
            Authorization: "Basic c2FiZXI6c2FiZXJfc2VjcmV0"
          },
          success: data => {
            console.log("提醒：login获取的tokenKey", data.data);
            if (data.data.data == null) {
              console.error(
                "错误提醒：login 失败。",
                "data",
                data,
                "response",
                data
              );
            }
            fedToken = data.data.data;
            // wx.setStorageSync(tokenKey, data.data.data);
            resolve(data.data.data);
          },
          fail: res => {
            reject(res);
          }
        });
      }
    });
  });
}

/**
 *获取用户openID & token信息
 *
 * @returns
 */
async function getServerToken() {
  return _get(
    "/wx/user/token",
    {
      openid: fedToken.openid
    },
    {
      Authorization: "Basic c2FiZXI6c2FiZXJfc2VjcmV0"
    }
  );
}
//获取首页的显示提示语
function getNotice(cb) {
  wx.request({
    url: baseURLNotice,
    method: "get",
    success: function(res) {
      return typeof cb == "function" && cb(res);
    },
    fail: function(res) {
      return typeof cb == "function" && cb(res);
    }
  });
}
/**
 *获取用户录入的信息
 *
 * @param {*} [data={
 *     openid: fedToken.openid
 *   }]
 * @returns userFilledInfo 用户录入信息
 */
async function getUserInfo(
  data = {
    openid: fedToken.openid
  }
) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseURL + "/user/exist",
      data: data,
      header: {
        ...getAuth()
      },
      success: async data => {
        if (data.data.code == 401) {
          console.log("提醒：token过期，正在重新获取token");
          const token = await getServerToken();
          fedToken = Object.assign(fedToken, token);
          console.log("提醒：重新获取token", token);
          userFilledInfo = await getUserInfo();
        } else {
          userFilledInfo = data.data.data;
        }

        userFilledInfo["userRegisted"] = Object.keys(userFilledInfo).length > 0;

        // wx.setStorageSync(userFilledInfofoKey, userFilledInfo);
        resolve(userFilledInfo);
      },
      fail: res => {
        console.error("错误提醒：获取身份信息失败。", error);
        reject(res);
      }
    });
  });
}

/**
 *检查session有效性
 *
 * @returns true/false
 */
async function checkSessionKey() {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success() {
        console.log("checkSessionKey success");
        //session_key 未过期，并且在本生命周期一直有效
        resolve(true);
      },
      fail() {
        console.log("checkSessionKey fail");
        // session_key 已经失效，需要重新执行登录流程
        // wx.login() //重新登录
        resolve(false);
      }
    });
  });
}

/**
 * 获取存的openID
 *
 * @returns
 */
function getTokenStorage() {
  return wx.getStorageSync(tokenKey);
}
function getUserStorage() {
  return wx.getStorageSync(userFilledInfofoKey);
}

/**
 *获取拼接的header数据
 *
 * @param {*} [token=fedToken]
 * @returns
 */
function getAuth(token = fedToken) {
  return {
    "Blade-Auth": token.tokenType + " " + token.accessToken
  };
}

/**
 *APP初始化请求，优先请求openID、token，之后开始请求用户信息，
 *
 * @returns {fedToken, userFilledInfo}
 */
async function appInit() {
  // 本来到这里初始化结束，但是必须要有请求的userId
  fedToken = await getOpenId();
  console.log("提醒：请求token返回值", fedToken);
  return new Promise(async resolve => {
    if (!fedToken.tokenType) {
      resolve({
        fedToken: fedToken,
        userFilledInfo: { userRegisted: false }
      });
    } else {
      try {
        userFilledInfo = await getUserInfo({
          openid: fedToken.openid
        });
      } catch (e) {
        console.error("userInfo失败", e);
      }
      console.log("提醒：请求userFilledInfo返回值", userFilledInfo);
      resolve({
        fedToken: fedToken,
        userFilledInfo: userFilledInfo
      });
    }
  });
}

module.exports = {
  baseURL,
  refreshToken,
  _fetch,
  _refetch,
  _get,
  _post,
  _put,
  _delete,
  _postParams,
  _deleteParams,
  userFilledInfofoKey,
  tokenKey,
  checkSessionKey,
  getTokenStorage,
  appInit,
  getOpenId,
  getUserInfo,
  getNotice,
  getServerToken
};
