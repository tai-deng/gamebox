import util from '../../utils/util.js'
import cache from '../../utils/cache.js'
import network from '../../utils/ajax.js'
const app = getApp();
// pages/mine/mine.js
Page({
  data: {
    done:false,
    avatarUrl:'../img/touxiang.png',
  },
  getData(){
    network.get(
      'sysUser/123456',
      {id:cache.get('id')}).then((res)=>{
        if(res.meta.success){
          // console.log(res)
          if(res.data.workNumber){
            this.setData({data:res.data,done:true})
          }
        }
      })
  },
  // 获取用户信息
  onUserinfo(e){
    let userInfo = e.detail.userInfo;
    if(userInfo){
      this.setData({login:false,userInfo})
    }
  },
  // 修改手机号
  onChangeTel(){
    let data = this.data.data;
    let isCard = cache.get('IdCard');
    if(isCard){
      wx.navigateTo({
        url: './changePhone/changePhone'
      })
    }else{
      util.showModal('温馨提示','请先绑定身份证号即可修改',true,(()=>{
        wx.navigateTo({
          url: './bindIDCard/bindIDCard'
        })
      }),(()=>{}),'返回','确定','#ff5800','#ff5800')
    }
  },
  // 登录 注册处理
  onDeal(){
    app.globalData.deal = 1;
  },
  // 安全退出
  onQit(e){
    cache.clear((e)=>{
      wx.reLaunch({
        url:'/pages/signIn/signIn'
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let login;
    let isBind = app.globalData.isBind;
    if(isBind){
      login = false;
      this.getData();
    }else{
      login = true;
    }
    this.setData({login})
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