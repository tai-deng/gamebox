// pages/index/repairRecord/repairRecord.js

import network from '../../../utils/ajax.js'
import cache from '../../../utils/cache.js'
import util from '../../../utils/util.js'
Page({
  data: {
    tabItem:0,
    tabv:['全部','待处理','处理中','已完成','已关闭'],
    pageNo:1,
    pageSize:5,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  // tab 选项
  bindtab(e){
    let tabItem = e.currentTarget.dataset.index;
    let data = this.data.data;
    if(tabItem != this.data.tabItem){
      this.setData({tabItem});
      if(JSON.stringify(data[tabItem].data) == '{}'){
        this.getData();
      } else {
        this.setData({ list: data[tabItem].data })
      }
    } 
  },
  // 获取数据
  getData(flag=1){
    let tabItem = this.data.tabItem;
    let id = cache.get('id');
    let data = this.data.data;
    if(!data){
      data = new Array()
      for(var i = 0;i<this.data.tabv.length;i++){
        let obj = {pageNo:this.data.pageNo,pageSize:this.data.pageSize,data:{},isLoad:true}
        data.push(obj)
      }
    }

    if(data[tabItem].isLoad){
      let orderState = tabItem;
      orderState = orderState == 0 ? '' : orderState;
      network.post('findOrderByStatus',{
        id,
        pageNo:data[tabItem].pageNo,
        pageSize:data[tabItem].pageSize,
        orderState
      })
      .then((res)=>{
        if(res.meta.success){
          if(data[tabItem].data['result'] && flag){
            if(flag==1){
              data[tabItem].data.result = data[tabItem].data.result.concat(res.data.lists.result);
            }
          }else{
            data[tabItem].data = res.data.lists;
          }
          if(res.data.lists.result.length < data[tabItem].pageSize ){
            data[tabItem].isLoad = false;
            if(data[tabItem].data.result.length >= 1){
              util.toast('已全部加载完！')
            }
          }else{
            data[tabItem].pageNo += 1;
          }
          let reg = new RegExp(network.img_url);
          for(var i = 0;i < data[tabItem].data.result.length;i++){
            data[tabItem].data.result[i].repairDate = util.formatTime(new Date(data[tabItem].data.result[i].repairDate));
            if(data[tabItem].data.result[i].img1){
              if(!reg.test(data[tabItem].data.result[i].img1)){
                data[tabItem].data.result[i].img1 = network.img_url+data[tabItem].data.result[i].img1;
              }
            }else{
              data[tabItem].data.result[i].img1 = '../../img/img-wu.png'
            }
          }
          this.setData({data,list:data[tabItem].data})
        }
      })
    }else{
      this.setData({list:data[tabItem].data})
    }
  },
  // 撤回
  onRecall(e){
    let id = e.currentTarget.dataset.id;
    let data = this.data.data;
    let tabItem = this.data.tabItem;
    util.showModal('提示','确定要撤销报修吗？',true,()=>{
      network.post('recallOrder',{
        id:cache.get('id'),
        orderId:id
      })
      .then((res)=>{
        if(res.meta.success){
          data[tabItem].pageNo = 1;
          this.setData({data})
          this.getData(0)
        }
      })
    })
  },
  // 跳转详情
  onDetail(e){
    let orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url:`/pages/index/repairDetail/repairDetail?orderId=${orderId}`
    })
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let data = this.data.data;
    if(data){
      let tabItem = this.data.tabItem;
      data[tabItem].pageNo = 1;
      this.setData({data})
      this.getData(0)
    }else{
      this.getData()
    }
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
    // wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let data = this.data.data;
    if(data[this.data.tabItem].isLoad){
      this.getData()
    }else{
      util.toast('嘶~扯到啦！')
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})