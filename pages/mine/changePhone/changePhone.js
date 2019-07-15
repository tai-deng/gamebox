import util from '../../../utils/util.js'
import cache from '../../../utils/cache.js'
import network from '../../../utils/ajax.js'
// pages/mine/changePhone/changePhone.js
Page({
  data: {
    disabled:false,
    tap:false,
    time:120,
    show:'获取验证码'
  },
  onLoad: function (options) {
    this.init()
  },
  init(){
    let phone = cache.get('mobileno');
    phone = phone.substr(0,3)+"****"+phone.substr(7);
    this.setData({phone})
  },
  /**
   * 获取验证码
   * @param {*} e 
   */
  onVcode(e){
    let tap = this.data.tap;
    let phone = cache.get('mobileno');
    if(!tap){
      network.post(
        'sendVerificationCode',
        {phoneNum:phone,
          type:'0',
          id:cache.get('id'),
          activeTime:'120'})
      .then((res)=>{
        if(res.meta.success){
        let show = this.data.show;
        let trim = setInterval(()=>{
          let time = this.data.time;
          if(time == 0){
            tap = false;
            show = '获取验证码';
            clearInterval(trim);
          }else{
            tap = true;
            show = '重新发送('+time+')'
          }
          time --;
          this.setData({show,time,tap})
        },1000)
      }else{
        util.toast(res.meta.message)
      }});
    }
  },
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