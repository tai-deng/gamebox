import util from '../../../utils/util.js'
import cache from '../../../utils/cache.js'
// pages/mine/safety/safety.js
Page({
  data: {

  },
  onLoad: function (options) {
    this.init();
  },
  init(){
    let data = {};
    data.IdCard = cache.get('IdCard');
    data.mobileno = cache.get('mobileno');
    this.setData({data});
  },
  onBind(e){
    let tag = e.currentTarget.dataset.tag;
    let data = this.data.data;
    if(!data.IdCard){
      util.showModal('温馨提示','请先绑定身份证号即可修改',true,(()=>{
        wx.navigateTo({
          url: '../bindIDCard/bindIDCard'
        })
      }),(()=>{}),'返回','确定','#ff5800','#ff5800')
    }else{
      switch(tag){
        case '1':
        break;
        case '2':
          wx.navigateTo({
            url: '../changePhone/changePhone'
          })
        break;
        case '3':
        break;
        case '4':
        break;
        case '5':
          util.showModal('提示','暂未开通微博绑定',false,(()=>{
          }),(()=>{}),'返回','确定','#ff5800','#ff5800')
        break;
        case '6':
          wx.navigateTo({
            url: '../changePassword/changePassword'
          })
        break;
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