// 获取当前帐号信息
const accountInfo = wx.getAccountInfoSync();

const env = accountInfo.miniProgram.envVersion;
console.log("提示：当前环境-" + env);

const baseApi = {
  // 开发版
  develop: "https://test.bidspace.cn",
  // 体验版
  trial: "https://test.bidspace.cn",
  // 正式版
  release: "https://admin.bidspace.cn"
};
// debugger;
// 小程序appId
export const appId = "wx9f50de1f1b6b94c6";

// request请求baseURL
export const baseURL = baseApi[env] + "/bid-soybean";

// 获取首页footer信息 -- 开发、体验、正式没有区别
export const baseURLNotice =
  baseApi.release + "/bid-desk/front/notice/detail?id=29";

// 上传文件ipfs服务器 -- 开发、体验、正式没有区别
export const uploadUrl =
  baseApi.release + "/bid-blockchain/front/ipfs/upload-photo";

// 统计导出导出文件的下载链接 -- 开发、体验、正式没有区别
export const baseURLDownload = baseApi.release + "/bid-soybean";