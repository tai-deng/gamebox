import util from '../../../utils/util.js'
import cache from '../../../utils/cache.js'
import network from '../../../utils/ajax.js'
// pages/mine/bindIDCard/bindIDCard.js
Page({
  data: {

  },
  onLoad: function (options) {

  },
  // 提交
  onSubmit(e){
    let cardId = e.detail.value.cardId;
    let tag = e.detail.target.dataset.tag;
    if(tag == 1 && cardId != ''){
      if(/^[1-9][0-9]{5}(19[0-9]{2}|200[0-9]|2010)(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])[0-9]{3}[0-9xX]$/i.test(cardId)){
        network.get(
          'sysUser/bindingCertificateNo',
          {id:cache.get('id'),certificateNo:cardId}).then((res)=>{
            if(res.meta.success){
              cache.set('IdCard',cardId);
              wx.navigateBack({
                delta: 1
              });
            }
          })
      }else{
        util.toast('身份证号码有误！')
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