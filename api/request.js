// 存在localstorage中的变量
const tokenKey = "fedToken";
const userFilledInfofoKey = "userFilledInfo";
const appid = "wx9f50de1f1b6b94c6";

// 定义网络请求API地址
const baseURL = "https://test.bidspace.cn/bid-soybean";
const baseURLNotice =
  "https://test.bidspace.cn//bid-desk/front/notice/detail?id=29";
let fedToken = null;
let userFilledInfo = null;
function getAuth(token = { token_type: "", access_token: "" }) {
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
  console.log("提醒：请求token,userFilledInfo");
  fedToken = await getOpenId();
  console.log("init返回：token值是:", fedToken);
  try {
    userFilledInfo = await getUserInfo({
      openid: fedToken.openid
    });
  } catch (e) {
    console.error("userInfo失败", e);
  }
  console.log("init返回：userInfo值是:", userFilledInfo);
  return {
    fedToken: fedToken,
    userFilledInfo: userFilledInfo
  };
}

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
          header: {
            Authorization: "Basic c2FiZXI6c2FiZXJfc2VjcmV0"
          },
          success: data => {
            console.log("提醒：login获取的tokenKey", data.data);
            if (data.data.data == null) {
              console.error(
                "错误提醒：login 失败。",
                "params",
                params,
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
// 获取用户openId
async function getUserInfo(
  params = {
    openid: fedToken.openid
  }
) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseURL + "/user/exist",
      data: params,
      success: data => {
        userFilledInfo = data.data.data;
        userFilledInfo["userRegisted"] = Object.keys(userFilledInfo).length > 0;

        // wx.setStorageSync(userFilledInfofoKey, userFilledInfo);
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
const Request = async ({ url, params, method, header, ...other } = {}) => {
  // 先取localstorage里面openid,userid,
  // let token = getTokenStorage();
  // let userInfo = getUserStorage();
  const sessionValidate = await checkSessionKey();
  if (
    !fedToken ||
    fedToken == "" ||
    fedToken.openid == undefined ||
    !sessionValidate
  ) {
    console.log(
      "提醒：storage读取openID、sessionkey失败，正在重新获取openID、sessionkey..."
    );
    fedToken = await getOpenId();
    console.log("返回数据：获取的用户", fedToken);
  }
  // console.log("userFilledInfo", userFilledInfo);
  if (
    url != "/user/exist" &&
    (userFilledInfo == null ||
      typeof userFilledInfo != "object" ||
      !userFilledInfo.id)
  ) {
    console.log(
      "提醒：storage读取用户录入信息失败，正在重新获取用户录入信息..."
    );
    userFilledInfo = await getUserInfo({ openid: fedToken.openid });
    console.log("返回数据：获取的用户", userFilledInfo);
  }
  // console.log("params.userId", params, params.userId);

  // params放在后面，避免覆盖参数中的openid,判断参数中userId是否有效
  let data = Object.assign({}, params, {
    openid: fedToken.openid ? fedToken.openid : "",
    wechatId: fedToken.openid ? fedToken.openid : "",
    userId: params.userId ? params.userId : userFilledInfo.id || ""
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
      header: {
        ...getAuth(fedToken),
        ...header
      },
      ...other,
      // 成功或失败处理
      complete: res => {
        // 关闭等待
        wx.hideLoading();
        // 进行状态码判断并处理
        if (res.statusCode === 204) {
          resolve(res);
        } else if (res.statusCode === 401) {
          // 检测到状态码401，进行token刷新并重新请求等操作
          refreshToken()
            .then(() => _refetch(url, data, method))
            .then(resolve);
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
// function getHeader() {
//   // 判断登录token是否存在
//   if (wx.getStorageSync("userToken")) {
//     // 获取token并设置请求头
//     var token = wx.getStorageSync("userToken");
//     let auth = {
//       Authorization: token.token_type + " " + token.access_token
//     };
//     return auth;
//   }
// }
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
const _refetch = (url, params, method) => {
  return Request({
    url,
    params,
    method
  });
};

//除开上面的调用方式之外，你也可以使用下面的这些方法，只需要关注是否传入method
const _get = (url, params = {}) => {
  params.size = 20;
  return Request({
    url,
    params
  });
};
const _post = (url, params = {}) => {
  params.size = 20;
  return Request({
    url,
    params,
    method: "post"
  });
};
const _put = (url, params = {}) => {
  params.size = 20;
  return Request({
    url,
    params,
    method: "put"
  });
};
const _delete = (url, params = {}) => {
  params.size = 20;
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
  getTokenStorage,
  appInit,
  getOpenId,
  getUserInfo,
  getNotice
};
