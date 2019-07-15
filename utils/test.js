// /** * 封装 */
// // 引入CryptoJS 
// var Crypto = require('../lib/tripledes.js').Crypto;
// var app = getApp();
// function RdWXBizDataCrypt(appId, sessionKey) {
//     this.appId = appId;
//     this.sessionKey = sessionKey;
// }
// RdWXBizDataCrypt.prototype.decryptData = function (encryptedData, iv) { 
//     // base64 decode :使用 CryptoJS 中 Crypto.util.base64ToBytes()进行 base64解码
//     var encryptedData = Crypto.util.base64ToBytes(encryptedData);
//     var key = Crypto.util.base64ToBytes(this.sessionKey); 
//     var iv = Crypto.util.base64ToBytes(iv); 
//     // 对称解密使用的算法为 AES-128-CBC,数据采用PKCS#7填充 
//     var mode = new Crypto.mode.CBC(Crypto.pad.pkcs7); 
//     try { 
//         // 解密 
//         var bytes = Crypto.AES.decrypt(encryptedData, key, { asBpytes:true, iv: iv, mode: mode }); 
//         var decryptResult = JSON.parse(bytes); 
//     } catch (err) { 
//         console.log(err) 
//     } if (decryptResult.watermark.appid !== this.appId) { 
//         console.log(err) 
//     } 
//     return decryptResult
// }
// module.exports = RdWXBizDataCrypt;

// // app.js 调用
// var WXBizDataCrypt = require('utils/RdWXBizDataCrypt.js');
// var AppId = 'wx**************';
// var AppSecret = '8f***************************';
// App({ 
//     onLaunch: function () { }, 
//     getUserInfo:function(cb){ 
//         var that = this; 
//         if(this.globalData.userInfo){ 
//             typeof cb == "function" && cb(this.globalData.userInfo)
//         }else{ 
//              //调用登录接口,获取 code 
//              wx.login({ success: function (res) { 
//                  //发起网络请求 
//                  wx.request({ 
//                     url: 'https://api.weixin.qq.com/sns/jscode2session', 
//                     data:{ 
//                          appid:AppId, 
//                          secret:AppSecret, 
//                          js_code:res.code, 
//                          grant_type:'authorization_code' 
//                     }, 
//                     header: { "Content-Type": "application/x-www-form-urlencoded" }, 
//                     method: 'GET', 
//                     success: function(res){ 
//                         var pc = new WXBizDataCrypt(AppId, res.data.session_key); 
//                         wx.getUserInfo({ 
//                             success: function (res) { 
//                                 var data = pc.decryptData(res.encryptedData , res.iv);
//                                 console.log('解密后 data: ', data) 
//                             } 
//                         }) 
//                     }, 
//                     fail: function(res) {}, 
//                     complete: function(res) {} 
//                 }); 
//             } 
//         }) 
//     } 
// }});