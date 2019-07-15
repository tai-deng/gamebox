import util from '../../../utils/util.js'
import cache from '../../../utils/cache.js'
import network from '../../../utils/ajax.js'
// pages/index/payment/payment.js
Page({
  data: {

  },
  onLoad: function (options) {
    this.getData();
  },
  getData(){
    let siteFcode;
    network.post(
      'Broadband/queryUserWorkNumAndSiteCode',
      {id:cache.get('id')})
    .then((res)=>{
      if(res.meta.success){
        siteFcode = res.data.siteFcode;
        this.setData({cnt_id:res.data.num,siteFcode})
      }else{
        if(res.meta.message){
          util.toast(res.meta.message);
        }
      }
    })

    // 学校
    network.post(
      'Broadband/querySites').then((res)=>{
        if(res.meta.success){
          let school = [];
          if(res.data){
            let school_v = '';
            res.data.forEach((item,index)=>{
              school.push(item.opText)
              if(item.opValue == siteFcode){
                school_v = item.opText;
                this.setData({school_v})
              }
            })
            this.setData({school,schoolSum:res.data})
          }
        }
      })
  },
  // 获取焦点
  onFocus(e){
    this.setData({focus:true})
  },
  // 失去焦点
  onBlur(e){
    this.setData({focus:false})
  },
  // 清除类容
  onClear(){
    this.setData({cnt_id:''})
  },
  // 获取学校
  onOptions(e){
    let index = Number(e.detail.value);
    let school_v = this.data.schoolSum[index].opText;
    let siteFcode = this.data.schoolSum[index].opValue;
    this.setData({school_v,siteFcode})
  },
  // 获取输入
  onInput(e){
    let cnt_id = e.detail.value;
    this.setData({cnt_id})
  },
  // 下一步
  onDredge(){
    let siteFcode = this.data.siteFcode;
    let UserNum = this.data.cnt_id;
    if(UserNum != ''){
      network.post(
        'Broadband/queryUserIsExist',{
        siteFcode,
        UserNum
      }).then((res)=>{
        if(res.meta.success){
          wx.navigateTo({
            url: `/pages/index/payment/order/order?UserNum=${UserNum}&siteFcode=${siteFcode}`
          })
        }
      })
    }else{
      util.toast('缴费对象不能为空')
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