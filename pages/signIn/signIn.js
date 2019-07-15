
import util from '../../utils/util.js'
import cache from '../../utils/cache.js'
import network from '../../utils/ajax.js'
import {encrypt,decrypt,key} from '../../utils/safe.js'
const app = getApp();
// pages/signIn/signIn.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
  },
  // loction
  bindLoction() {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = 26.873462020074626;
        const longitude = 112.57541195337294;
        wx.openLocation({
          name:'111sdfsf',
          address:'地址：费大幅度发斯蒂芬',
          latitude,
          longitude,
          scale: 28,
          success(res){
          }
        })
        console.log(latitude)
      }
    })
  },
  /**
   * 登录
   * @param {*} e 
   */
  onSubmit(e){
    let phoneReg=/^[1][3,4,5,7,8][0-9]{9}$/;
    let passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
    let phone = e.detail.value.phone;
    let password = e.detail.value.password;
    if(phone && password){
      if(phoneReg.test(phone) && passwordReg.test(password)){
        network.post('dologin',{
          userName: encrypt(phone,key),
          passWord: encrypt(password,key)
        }).then(
        (res)=>{
          if(res.meta.success){
          cache.set('phone',phone);
          cache.set('password',password);
          let juese = 'user'
          if(res.data.roles){
            juese = decrypt(res.data.roles[0],key);
          }
          cache.set("juese",juese);
          cache.set('token',decrypt(res.data.xtoken,key));
          cache.set('mobileno',decrypt(res.data.mobileno,key));
          cache.set('fcode',decrypt(res.data.fcode,key));
          cache.set('id',decrypt(res.data.id,key));
          cache.set('username',decrypt(res.data.username,key));

          // cache.set('realname',decrypt(res.data.realname,key));
          // cache.set('userType',decrypt(res.data.userType,key));
          // cache.set('clientid',clientid); // 个推
          setTimeout(()=>{
            wx.switchTab({
              url: '/pages/index/index',
              success: function() {
                cache.set('isLogin',1);
              }
            })
          },200)
          
        }else{
          if(res.meta.message){
            network.prompt(res.meta.message)
          }
        }})
      }else{
        if(!passwordReg.test(password)){
          util.toast('密码格式错误！')
        }
        if(!phoneReg.test(phone)){
          util.toast('手机号码错误！')
        }
      }
    }else{
      if(!password){
        util.toast('密码不能为空！')
      }
      if(!phone){
        util.toast('手机号码不能为空！')
      }
    }
  },
  init(){
    if(app.globalData.deal != 1){
      if(cache.get('isLogin') == 1){
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    }
    let phone = cache.get('phone');
    let password = cache.get('password');
    if(phone && password){
      this.setData({phone,password})
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})