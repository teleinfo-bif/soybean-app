var CryptoJS = require("crypto-js");
const key = "9vApxLk5G3PAsJrM";
const iv = "FnJL7EDzjqWjcaY9";
function decode(word) {
  let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  let decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

function encode(data) {
  //加密

  var parseKey = CryptoJS.enc.Utf8.parse(key);
  var parseIV = CryptoJS.enc.Utf8.parse(iv);
  var encrypted = CryptoJS.AES.encrypt(data, parseKey, {
    iv: parseIV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.ciphertext.toString(); //返回的是hex格式的密文,encrypted.toString()返回base64格式
}
module.exports = {
  decode,
  encode
};
