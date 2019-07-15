// pages/mine/feedback/feedback.js
import network from '../../../utils/ajax.js'
import cache from '../../../utils/cache.js'
import util from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    click:true,
  },
  // 获取留言
  onLeave(e){
    let leave = e.detail.value.trim();
    if(leave!=this.data.leave){
      this.setData({leave})
    }
  },
  // 提交留言
  submit(e){
    let leave = this.data.leave;
    let id = cache.get('id')
    if(leave){
      network.post('leaveComments',{id,messageRemark:leave})
      .then(res=>{
        if(res.meta.success){
          util.showModal('提示','感谢您的宝贵建议',false,()=>{
            wx.navigateBack({
              data:1
            })
          })
          setTimeout(()=>{
            wx.navigateBack({
              data:1
            })
          },2000)
        }
      })
    }else{
      util.toast("请输入建议内容!")
    }
  },
  // 反馈记录
  onRecord(){
    wx.navigateTo({
      url:'/pages/mine/feedback/feedbackList'
    })
  },
  onLoad: function (options) {

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