// import QQMapWX from "../../util/qqmap-wx-jssdk/qqmap-wx-jssdk.min.js";

const QQMapWX = require("./qqmap-wx-jssdk.min.js");

//腾讯位置服务申请的key
const key = "2YLBZ-FJS64-RINUP-XWG5O-JC5U3-ALBXJ";

const wxMapSdk = new QQMapWX({
  // key: "27VBZ-4QOLP-ZTDD7-V35OS-WY67E-WEBO4"
  key: "2YLBZ-FJS64-RINUP-XWG5O-JC5U3-ALBXJ"
});

// 根据经纬度逆解析位置信息
export function reverseAddressFromLocation(location) {
  return new Promise((resolve, reject) => {
    wxMapSdk.reverseGeocoder({
      location,
      success: function(res) {
        resolve(res);
        // console.log(res.result)
      },
      fail: function(error) {
        reject(error);
      },
      complete: function(res) {
        console.log(res);
      }
    });
  });
}

//调用插件的app的名称
const referer = "caict_health";
// 定位类型
const category = "生活服务,娱乐休闲";

// const location = JSON.stringify({
//   latitude: 39.89631551,
//   longitude: 116.323459711
// });

// 传入location坐标，获得跳转插件选点的url
export function getLocationPluginMapUrl(location) {
  const { latitude, longitude } = location;
  const test = {
    latitude: location.latitude,
    longitude: location.longitude
  };
  return (
    "plugin://chooseLocation/index?key=" +
    key +
    "&referer=" +
    referer +
    "&location=" +
    JSON.stringify(test) +
    "&category=" +
    category
  );
}
