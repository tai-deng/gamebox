

import util from '../../utils/util.js'
import cache from '../../utils/cache.js'
import network from '../../utils/ajax.js'

// pages/chooseTaocan/chooseTaocan.js
Page({
  data: {
    popUp:false,
  },
  onLoad: function (options) {
    this.getData();
  },
  // 获取
  getData(e){
    var siteFcode = cache.get('siteFcode');
    network.post(
      'Broadband/querySerSets',
      {siteFcode,packageName:""})
    .then((res)=>{
      if(res.meta.success){
        this.setData({data:res.data})
      }
    })
  },
  // 选择
  onSelect(e){
    let data = this.data.data;
    let id = e.currentTarget.dataset.id;
    let ins = e.currentTarget.dataset.ins;
    let index = e.currentTarget.dataset.index;
    data[ins].serSets.forEach(element => {
      element['sel'] = false;
    });
    data[ins].serSets[index]['sel'] = true;
    this.setData({data,id})
  },
  // 获取密码
  onInput(e){
    let passWord = e.detail.value;
    if(passWord.length < 3 || passWord.length > 16){
      passWord = ''
      util.toast('长度在3-16位之间')
    }
    this.setData({passWord})
  },
  // 开通
  onDredge(e){
    if(this.data.id){
      util.showModal("温馨提示",'请确认是否开通此套餐？',true,()=>{
        this.setData({popUp:true})
      },()=>{},'再想想','开通','#ff5800','#ff5800')
    }else{
      util.toast('请选择套餐')
    }
  },
  // 取消
  onCancel(){
    this.setData({popUp:false})
  },
  // 确认开户
  onConfirm(){
    let passWord = this.data.passWord;
    if(passWord != ''){
      network.post(
        'Broadband/addUser',
        {
          id:cache.get('id'),
          siteFcode:cache.get('siteFcode'),
          userId:cache.get('UserNum'),
          passWord:passWord,
          userName:cache.get('realname'),
          serSetId:this.data.id,
        })
      .then((res)=>{
        if(res.meta.success){
          wx.navigateTo({
            url:'/pages/changePay/changePay'
          })
        }
      })
    }else{
      util.toast('请输入密码')
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