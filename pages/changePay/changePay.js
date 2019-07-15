import util from '../../utils/util.js'
import cache from '../../utils/cache.js'
import network from '../../utils/ajax.js'
import pay from '../../utils/pay.js'

// pages/changePay/changePay.js
Page({
  data: {
    click:true,
  },

  onLoad: function (options) {
    this.getData();
  },
  // 获取套餐信息 Broadband/queryUsermsg
  getData(){
    network.post(
      'Broadband/queryUsermsg',
      {
        id:cache.get('id'),
        siteFcode:cache.get('siteFcode'),
        UserNum:cache.get('UserNum')})
    .then((res)=>{
      if(res.meta.success){
        this.setData({broadband:res.data})
      }
    })
  },
  // 支付 
  onDredge(e){
    let that = this;
    let data = this.data.broadband;
    let click = that.data.click;
    if(click){
      that.setData({click:false});
      network.post(
        'Broadband/queryOrderId',
        {})
      .then((res)=>{
        console.log(res)
        let orderId = res;
        if(orderId!==''){
          network.post(
            'Broadband/toPay',
            {
              id:cache.get('id'),
              amount:data.amount,
              userId:data.userId,
              siteCode:cache.get('siteFcode'),
              orderId:orderId,
              foreignId: '',
              foreignType:''
            })
          .then((res)=>{
            if(res != ''){
              wx.showLoading({
                title: '支付中',
              })
              var timeStamp = res.timestamp.toString();
              wx.requestPayment({
                'timeStamp':timeStamp,
                'nonceStr':res.noncestr,
                'package':res.package,
                'signType':res.sign,
                'paySign':res.prepayid,
                'success':function(res){
                  console.log('pay-->',res)
                  wx.showToast({
                    title: '购买成功',
                    icon: 'success',
                    duration: 2000,
                    success(){
                      wx.switchTab({
                        url:'/pages/index/index'
                      })
                    }
                  });
                },
                'complete':function(e){
                  wx.hideLoading();
                  that.setData({click:true})
                }
              })
            }
          },(res)=>{
            that.setData({click:true})
          })
        }
      },(res)=>{
        that.setData({click:true})
      })
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