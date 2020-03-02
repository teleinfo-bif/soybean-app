// 云函数入口文件
const cloud = require('wx-server-sdk')
const Bif = require("bif-main")

cloud.init()

function getAddresses() {
  const bif = new Bif();
  let a = bif.core.accounts.create(); 

  return {
    address: a.address,
    privateKey: a.privateKey
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  let data = getAddresses()
  return data
}