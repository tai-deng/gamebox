import util from '../../../utils/util.js'
import cache from '../../../utils/cache.js'
import network from '../../../utils/ajax.js'

// pages/index/combo/combo.js
Page({
  data: {
    flag:1,
    popUp:false,
    done:true,
    join:false,
    click:true,
  },
  onLoad: function (options) {
    let order = JSON.parse(options.data)
    if(options.next){
      let newOrder = JSON.parse(options.newOrder);
      this.setData({flag:2,newOrder})
    }else{
      this.getData(order);
    }
    this.setData({order})
  },
  getData(order){
    let siteFcode= cache.get('siteFcode');
    let address = this.data.address;
    if(siteFcode == '823ef78c7ed94e905156905798cbd175'){
      //长沙师范
      address = '北校区阳光服务大厅；南校区南校门原招生就业处。';
    }else if(siteFcode == 'fb9d10335b551d5a76d36df2bc961951'){
      //湘中幼师
      address='学生宿舍楼2栋101门面。';
    }else{
      //长沙师范
      address='北校区阳光服务大厅；南校区南校门原招生就业处。';
    }
    network.post(
      'Broadband/prepayChangeSerSet',
      {
        id:cache.get('id'),
        siteFcode:cache.get('siteFcode'),
        userId:order.userId,
        oldSerId:order.packageId,
        newSerId:'',
        type:1
      })
    .then((res)=>{
      if(res.meta.success){
        this.setData({prepare:res.data,address})
      }
    })

    network.post(
      'Broadband/querySerSets',
      {siteFcode:cache.get('siteFcode'),packageName:""})
    .then((res)=>{
      if(res.meta.success){
        this.setData({data:res.data})
      }
    })
  },
  // 选择
  onSelect(e){
    let packageId = this.data.order.packageId;
    let data = this.data.data;
    let id = e.currentTarget.dataset.id;
    let ins = e.currentTarget.dataset.ins;
    let index = e.currentTarget.dataset.index;
    if(id == packageId){
      util.showModal('温馨提示','要换套餐不能与当前套餐一致',false,(()=>{
        // 提示
      }),(()=>{}),'','知道了','#ff5800','#ff5800')
    }else{
      // 选套餐
      data[ins].serSets.forEach(element => {
        element['sel'] = false;
      });
      data[ins].serSets[index]['sel'] = true;
      let newOrder = data[ins].serSets[index];
      this.setData({data,id,newOrder})
    }
  },
  // 下一步
  onSubmit(e){
    let op = e.currentTarget.dataset.tag;
    let newOrder = this.data.newOrder;
    if(op == 1){
      if(newOrder){
        this.setData({popUp:true})
      }else{
        util.toast('请选择要更换的套餐')
      }
    }
    if(op == 2){

    }
  },
  // 获取密码
  onInput(e){
    let passWord = e.detail.value;
    this.setData({passWord})
  },
  // 取消
  onCancel(){
    this.setData({popUp:false})
  },
  // 确认
  onConfirm(){
    let passWord = this.data.passWord;
    if(passWord){
      network.post(
        'Broadband/changeSerSet',
        {
          id:cache.get('id'),
          siteFcode:cache.get('siteFcode'),
          userId:this.data.order.userId,
          passWord:passWord,
          newSerId:this.data.newOrder.id,
        })
      .then((res)=>{
        this.setData({popUp:false})
        if(res.meta.success){
          // 密码正确
          res.data.activeDate = util.formatTime(new Date(res.data.activeDate))
          let doneData = res.data;
          this.setData({done:false,doneData})
        }else{
          if(res.meta.message){
            util.showModal('温馨提示',res.meta.message,false,(()=>{
              // 提示
            }),(()=>{}),'','知道了','#ff5800','#ff5800')
          }
        }
      })
    }else{
      util.toast('密码不能为空')
    }
  },
  onJoin(){
    this.setData({join:true})
  },
  onPopD(){
    this.setData({join:false})
  },
  onAffirm(){
    let amount = this.data.doneData.amount;
    let userId = this.data.doneData.userId;
    this.onPay({amount,userId})
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

  },
  // 公用支付
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
})