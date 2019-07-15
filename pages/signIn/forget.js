
import util from "../../utils/util.js";
import network from '../../utils/ajax.js'
import cache from '../../utils/cache.js'
// pages/signIn/forget.js
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

  },
  /**
   * 下一步 / 确定 / 完成
   */
  onSubmit(e){
    let myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
    let v = e.detail.value;
    let flag = this.data.flag;
    let data = this.data.data;
    // 1
    if(this.data.flag == 1){
      if(v.phone){
        if(myreg.test(v.phone)){
          network.post(
            'checkByMobileNo',
            {mobileno:v.phone})
          .then(
          (res)=>{
            if(res.meta.success){
            var str = v.phone;
            data.phone = str.substr(0,3)+"****"+str.substr(7);
            data.tel = str;
            this.setData({flag:2,data})
          }});
        }else{
          util.toast('请输入正确的号码！')
        }
      }
    }
    // 2 
    if(this.data.flag == 2){
      if(v.vcode){
        if(v.vcode != ''){
          let phone = this.data.data.tel;
          let vcode = v.vcode;
          network.post(
            'erification',
            {id:cache.get('id'),mobileno:phone,verificationCode:vcode,type:'0'})
          .then((res)=>{
            if(res.meta.success){
            this.setData({flag:3})}
          });
        }else{
          util.toast('验证码输入有误！')
        }
      }
    }
    // 3
    let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
    if(this.data.flag == 3){
      if(v.password){
        network.post(
          'sysUser/setPassword',
          {id:this.data.data.tel,passWord:v.password})
        .then((res)=>{
          if(res.meta.success){
          util.showModal('温馨提示','确认设置',true,()=>{
            if(reg.test(v.password)){
              this.setData({flag:4})
            }else{
              util.showModal('提示','密码需要字母和数字组合，至少6位组成，区分大小写！',false,function(){})
            }
          },()=>{
            console.log("取消")
          })
        }});
      }else{
        util.toast('密码设置有误！')
      }
    }
  },
  /**
   * 获取验证码
   * @param {*} e 
   */
  onVcode(e){
    let tap = this.data.tap;
    let phone = this.data.data.tel;
    if(!tap){
      network.post(
        'sendVerificationCode',
        {phoneNum:phone,
          type:'0',
          id:cache.get('id'),
          activeTime:'120'})
      .then((res)=>{
        if(res.meta.success){
        let data = this.data.data;
        let trim = setInterval(()=>{
          let time = this.data.time;
          if(time == 0){
            tap = false;
            data.show = '获取验证码';
            clearInterval(trim);
          }else{
            tap = true;
            data.show = '重新发送('+time+')'
          }
          time --;
          this.setData({data,time,tap})
        },1000)
      }});
    }
  },
  /**
   * 密码是否隐藏
   * @param {*} e 
   */
  onEye(e){
    let isLook = !this.data.isLook;
    this.setData({isLook})
  },
  // init
  init(){
    this.setData({
      flag:1,
      data:{
        phone:'',
        show:'获取验证码'
      },
      tap:false,
      time:120,
      isLook:false,
    })
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
    this.init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.init();
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