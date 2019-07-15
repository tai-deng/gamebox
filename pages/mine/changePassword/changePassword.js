import util from '../../../utils/util.js'
import cache from '../../../utils/cache.js'
import network from '../../../utils/ajax.js'
// pages/mine/changePassword/changePassword.js
Page({
  data: {
    data:[true,true]
  },
  onLoad: function (options) {

  },
  onLook(e){
    let data = this.data.data;
    let index = Number(e.currentTarget.dataset.index);
    data[index] = !data[index];
    this.setData({data})
  },
  onSubmit(e){
    let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
    console.log(e)
    let oldPassword = e.detail.value.oldPassword;
    let newPassword = e.detail.value.newPassword;
    if(reg.test(oldPassword) && reg.test(newPassword)){
    network.post(
      'sysUser/modifypwd',
      {id:cache.get('id'),oldPassWord:oldPassword,passWord:newPassword}).then((res)=>{
        if(res.meta.success){
          util.showModal('提示','密码修改成功！',false,(()=>{
            wx.switchTab({
              url: '/pages/index/index',
            });
          }),(()=>{}),'返回','确定','#ff5800','#ff5800')
        }else{
          util.toast(res.meta.message)
        }
      })
    }else{
      if(newPassword == ''){
        util.toast('新密码不能为空')
      }
      if(!reg.test(newPassword)){
        util.toast('新密码输入错误')
      }
      if(oldPassword == ''){
        util.toast('原密码不能为空')
      }
      if(!reg.test(oldPassword)){
        util.toast('原密码输入错误')
      }
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