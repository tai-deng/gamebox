import util from '../../../utils/util.js'
import cache from '../../../utils/cache.js'
import network from '../../../utils/ajax.js'
// pages/index/recharge/recharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    click:true,
  },
  getData(){
    network.get(
      'phoneRecharge/queryPhoneAmount',
      {})
    .then((res)=>{
      if(res.meta.success){
        this.setData({recharge:res.data});
      }
    })
  },
  // 选择
  onChoose(e){
    let index = e.currentTarget.dataset.index;
    let recharge = this.data.recharge;
    if(this.data.phone){
      recharge.forEach((el) => {
          el.w = false;
      });
      let id = recharge[index].id;
      recharge[index].w = true;
      this.setData({recharge,id})
      console.log(`12`)
      this.onPay({amount:recharge[index].payAmount,userId:recharge[index].id})
    }else{
      util.toast('手机号码不能为空')
    }
  },
  // 归属
  onEntry(e){
    let phone = Number(e.detail.value);
    let regex = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    let that = this;
    if(regex.test(phone)){
      wx.request({
        url: 'https://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel='+phone,
        data: {},
        header: {
          'content-type': 'application/json' // 默认值
        },
        dataType: "jsonp",
        success (res) {
          let city = res;
          for (const key in city) {
            console.log(city[key])
          }
          console.log(city)
          that.setData({phone})
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },

  onPay(data){
    let that = this;
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