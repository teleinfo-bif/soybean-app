// ipfs server地址
const url = "https://admin.bidspace.cn/bid-blockchain/front/ipfs/upload-photo";
export const baseURLDownload = "https://admin.bidspace.cn/bid-soybean";

export const UploadFile = async ({ filePath, name, formData, ...others }) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url, //仅为示例，非真实的接口地址
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
