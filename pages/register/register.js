import util from '../../utils/util.js'
import cache from '../../utils/cache.js'
import network from '../../utils/ajax.js'

// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{
      show:'获取验证码',
    },
    time:120,
    done:false,
    isClick:true,
  },
  /**
   * 获取验证码
   * @param {*} e 
   */
  onVcode(e){
    let tap = this.data.tap;
    let phone = this.data.phone;
    if(!tap){
      network.post(
        'sendVerificationCode',
        {phoneNum:phone,
          type:'2',
          id:'',
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
   * 提交
   * @param {*} e 
   */
  onSubmit(e){
    let phoneReg=/^[1][3,4,5,7,8][0-9]{9}$/;
    let passwordReg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/;
    let v = e.detail.value;
    let phone = v.phone;
    let password = v.password;
    let vcode = v.vcode;
    let isClick = this.data.isClick;
    if(phone && password && vcode && isClick){
      if(phoneReg.test(phone) && passwordReg.test(password) && vcode.toString().length == 6){
        this.setData({isClick:false})
        network.post(
          'register',
          {phoneNum:phone,
            password:password,
            type:'2',
            verificationCode:vcode})
        .then((res)=>{
          if(res.meta.success){
            wx.navigateBack({
              delta: 1
            });
            util.toast('注册成功！');
            cache.set('phone',phone);
            cache.set('password',password);
          }else{
              if(res.meta.message){
                network.prompt(res.meta.message);
              }
          }
          this.setData({isClick:true})
        });
      }else{
        if(vcode.toString().length != 6){
          util.showModal('提示','请输入正确的验证码！！',false,function(){})
        }
        if(!passwordReg.test(password)){
          util.showModal('提示','密码需要字母和数字组合，至少6位组成，区分大小写！',false,function(){})
        }
        if(!phoneReg.test(phone)){
          util.showModal('提示','请输入正确的手机号码！',false,function(){})
        }
    }
    }else{
      if(!vcode){
        util.toast('请输入手机验证码！')
      }
      if(!password){
        util.toast('请设置密码！')
      }
      if(!phone){
        util.toast('请输入手机号码！')
      }
    }
  },
  onTestPhone(e){
    let phone = e.detail.value;
    network.post(
      'verificationPhoneNum',
      {phoneNum:phone})
    .then((res)=>{
      if(!res.meta.success){
        network.prompt(res.meta.message)
        this.setData({phone:''})
    }else{
      this.setData({phone})
    }});
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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