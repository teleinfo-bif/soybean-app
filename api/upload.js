import { uploadUrl } from "../config/index";

export const UploadFile = async ({ filePath, name, formData, ...others }) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: uploadUrl, //仅为示例，非真实的接口地址
      filePath,
      name,
      formData,
      ...others,
      success(res) {
        resolve(res.data);
      },
      fail(error) {
        reject(error);
      }
    });
  });
};
