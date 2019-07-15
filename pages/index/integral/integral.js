import util from '../../../utils/util.js'
import cache from '../../../utils/cache.js'
import network from '../../../utils/ajax.js'

// pages/index/integral/integral.js
Page({
  data: {
    pageSize:10,
    pageNo:1,
    data:[],
    isMore:true,
  },
  onLoad: function (options) {
    this.getData(this.data.pageNo);
  },
  getData(pageNo){
    let pageSize = this.data.pageSize;
    let data =  this.data.data;
    let isMore = this.data.isMore;
    if(isMore){
      network.post(
        'Broadband/getFundList',
        {
          id:cache.get('id'),
          pageNo,
          pageSize,
          siteFcode:cache.get('siteFcode')
        })
      .then((res)=>{
        if(res.meta.success){
          if(res.data.length !== pageSize){
            isMore = false;
          }else{
            isMore = true;
          }
          if(res.data.length == 0){
            util.toast('暂无缴费记录')
          }
          data = data.concat(res.data);
          this.setData({isMore,data})
          wx.stopPullDownRefresh();
        }else{
          if(res.meta.message){
            util.toast(res.meta.message)
          }
        }
      })
    }else{
      wx.stopPullDownRefresh();
      util.toast('已没有更多的记录')
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
    let pageNo = this.data.pageNo;
    if(this.data.isMore){
      pageNo = pageNo + 1;
      this.getData(pageNo);
    }else{
      wx.stopPullDownRefresh();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})