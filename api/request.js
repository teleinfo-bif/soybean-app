// 获取小程序全局配置（变量、函数等）
const tokenKey = "fedToken";
const userFilledInfofoKey = "userFilledInfo";
// 从storage中获取openid

const appid = "wxd69df881f0c947dc";

// 定义网络请求API地址
const baseURL = "https://admin.bidspace.cn/bid-soybean";

// 获取用户openId
async function getOpenId() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        let params = {
          appid,
          code: res.code
        };
        wx.request({
          url: baseURL + "/wx/user/login",
          data: params,
          success: data => {
            console.log("tokenKey", data.data);
            wx.setStorageSync(tokenKey, data.data.data);
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

// 获取用户openId
async function getUserInfo(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseURL + "/user/exist",
      data: params,
      success: data => {
        const userFilledInfo = data.data.data;
        userFilledInfo["userRegisted"] = Object.keys(userFilledInfo).length > 0;
        wx.setStorageSync(userFilledInfofoKey, userFilledInfo);
        resolve(userFilledInfo);
      },
      fail: res => {
        reject(res);
      }
    });
  });
}

// 检查sessionKey
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

// 封装网络请求开始
const Request = async ({ url, params, method, ...other } = {}) => {
  // 先取localstorage里面openid,userid,
  let token = getTokenStorage();
  let userInfo = getUserStorage();

  const sessionValidate = await checkSessionKey();
  // console.log("await checkSessionKey()", sessionValidate);

  if (!token || token == "" || token.openid == undefined || !sessionValidate) {
    console.log(
      "提醒：storage读取openID、sessionkey失败，正在重新获取openID、sessionkey..."
    );
    token = await getOpenId();
    console.log("返回数据：获取的用户", token);
  }

  if ((url != "/user/exist" && typeof userInfo != "object") || !userInfo.id) {
    console.log(
      "提醒：storage读取用户录入信息失败，正在重新获取用户录入信息..."
    );
    userInfo = await getUserInfo({ openid: token.openid });
    console.log("返回数据：获取的用户", userInfo);
  }
  console.log("params.userId", params, params.userId);

  // params放在后面，避免覆盖参数中的openid,判断参数中userId是否有效
  let data = Object.assign({}, params, {
    openid: token.openid ? token.openid : "",
    wechatId: token.openid ? token.openid : "",
    userId: params.userId ? params.userId : userInfo.id || ""
  });

  // 添加请求加载等待
  wx.showLoading({
    title: "加载中..."
  });
  // Promise封装处理
  return new Promise((resolve, reject) => {
    wx.request({
      // 请求地址拼接
      url: baseURL + url,
      data: data,
      // 获取请求头配置
      // header: getHeader(),
      // header: Object.assign(getHeader(), header),
      method: method,
      ...other,
      // 成功或失败处理
      complete: res => {
        // 关闭等待
        wx.hideLoading();
        // 进行状态码判断并处理
        if (res.statusCode === 204) {
          resolve(res);
        } else if (res.data.code !== 200) {
          if (url == "/wx/clockln/census/census") {
            resolve(res.data);
          } else {
            console.log(url + "-" + res.statusCode);
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
          }
        } else if (res.data.code === 200) {
          resolve(res.data.data);
        } else {
          reject(res);
        }
        // else if (res.statusCode === 401) {
        //   // 检测到状态码401，进行token刷新并重新请求等操作
        //   refreshToken()
        //     .then(() => _refetch(url, data, method))
        //     .then(resolve);
        // }
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

// 进行url字符串拼接
const getUrl = url => {
  if (url.indexOf("://") == -1) {
    url = baseURL + url;
  }
  return url;
};
//获取用户userToken
function getHeader() {
  // 判断登录token是否存在
  if (wx.getStorageSync("userToken")) {
    // 获取token并设置请求头
    var token = wx.getStorageSync("userToken");
    let auth = {
      Authorization: token.token_type + " " + token.access_token
    };
    return auth;
  }
}
// 重构请求方式
const _fetch = content => {
  return Request({
    url: content.url,
    params: content.data,
    method: content.method
  });
};
// 添加刷新之后的操作处理方法
const refreshToken = () => {
  return new Promise((resolve, reject) => {
    // 获取token
    var token = wx.getStorageSync("userToken");
    // 设置请求data
    let params = {
      refresh_token: token.refresh_token
    };
    // 进行token刷新请求
    wx.request({
      url: getUrl("/app/connect/refresh"),
      data: params,
      // 设置请求header 鉴权
      header: {
        Authorization: token.token_type + " " + token.access_token
      },
      method: "post",
      // 请求响应处理
      complete: res => {
        if (res.data.code === 200) {
          // 全局存储token
          app.globalData.usertToken = res.data.data;
          // Storage存储token
          wx.setStorage({
            key: "userToken",
            data: res.data.data,
            // 存储成功处理
            success: function() {
              resolve();
            }
          });
        }
      }
    });
  });
};
const _refetch = (url, params, method) => {
  return Request({
    url,
    params,
    method
  });
};

//除开上面的调用方式之外，你也可以使用下面的这些方法，只需要关注是否传入method
const _get = (url, params = {}) => {
  return Request({
    url,
    params
  });
};
const _post = (url, params = {}) => {
  return Request({
    url,
    params,
    method: "post"
  });
};
const _put = (url, params = {}) => {
  return Request({
    url,
    params,
    method: "put"
  });
};
const _delete = (url, params = {}) => {
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
  userFilledInfofoKey,
  tokenKey,
  checkSessionKey,
  getTokenStorage
};
