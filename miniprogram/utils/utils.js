
var toHide = function (array) {
  var phone = array.substring(0, 3) + '****' + array.substring(7);
  return phone;
}
module.exports.toHide = toHide;
