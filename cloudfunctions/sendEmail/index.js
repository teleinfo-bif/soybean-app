// 云函数入口文件
const cloud = require('wx-server-sdk')
const nodemailer = require('nodemailer')

// 创建一个SMTP客户端配置
var config = {
  host: 'smtp.qq.com',
  port: 465, //网易邮箱端口 25
  auth: {
    user: '774392980@qq.com', //邮箱账号
    pass: 'icdyakipgpihbdda' //邮箱的授权码
  }
};

// 创建一个SMTP客户端对象
let transporter = nodemailer.createTransport(config);

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("event: ", event);
  return await transporter.sendMail({
      from: event.fromAddress,
      subject: event.subject,
      to: event.toAddress,
      text: event.content,
    }
  );
}