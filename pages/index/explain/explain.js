// pages/index/explain/explain.js
import cache from '../../../utils/cache.js'
Page({
  data: {

  },
  onLoad: function (options) {
    this.getData()
  },
  getData(){
    let adress= cache.get('siteFcode');
    let flag = null;
    if(adress == '823ef78c7ed94e905156905798cbd175'){
        //长沙师范
        flag = 'shifan'
    }else if(adress == 'fb9d10335b551d5a76d36df2bc961951'){
        //湘中幼师
        flag = 'youshi'
    }else if(adress == '855198a37cac80fb60e76174cb254f2a'){
        //航空
        flag = 'hangkong'
    }else if(adress == '58e8599b9d19d34e386c899fbc4508bc'){
        //大众传媒
        flag = 'dazhongchuanmei'
    }else if(adress == '7d106cd0235bd777138e75e07e1ab593'){
        //生物机电
        flag = 'shengwujidian'
    }else{
        //其它学校
        flag = 'qita'
    }
    this.setData({flag})
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