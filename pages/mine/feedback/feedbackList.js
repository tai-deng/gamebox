// pages/mine/feedback/feedbackList.js
import network from '../../../utils/ajax.js'
import cache from '../../../utils/cache.js'
import util from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad: function (options) {
    this.getData();
  },
  getData(){
    let id = cache.get('id');
    network.post('messageList',{id})
    .then(res=>{
      if(res.meta.success){
        let list = res.data.messageList;
        list.forEach((e,i) => {
          list[i].messageDate = util.formatTime(new Date(list[i].messageDate));
          if(list[i].replyDate){
            list[i].replyDate = util.formatTime(new Date(list[i].replyDate));
          }
        });
        this.setData({list})
      }
    })
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