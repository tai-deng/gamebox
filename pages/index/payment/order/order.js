import util from '../../../../utils/util.js'
import cache from '../../../../utils/cache.js'
import network from '../../../../utils/ajax.js'
// pages/index/payment/order/order.js
Page({
  data: {
    num:1,
    click:true,
  },
  onLoad: function (op) {
    if(op.siteFcode && op.UserNum){
      this.getData(op.siteFcode,op.UserNum);
    }
  },
  getData(siteFcode,UserNum){
    network.post(
      'Broadband/queryUsermsg',
      {id:cache.get('id'),
      siteFcode,
      UserNum
    })
    .then((res)=>{
      if(res.meta.success){
        if(res.data.periodStartTime){
          res.data.periodStartTime = util.formatTime(new Date(res.data.periodStartTime))
        }else{
          res.data.periodStartTime = '暂未生效'
        }
        if(res.data.periodLimitTime){
          res.data.periodLimitTime = util.formatTime(new Date(res.data.periodLimitTime))
        }else{
          res.data.periodLimitTime = '暂未生效'
        }
        this.setData({userData:res.data,money:res.data.amount})

        let siteFcode = cache.get('siteFcode');
        network.post(
          'Broadband/querySerSets',
          {siteFcode,packageName:""})
        .then((res)=>{
          if(res.meta.success){
            this.setData({data:res.data})
          }
        })
      }else{
        if(res.meta.message){
          util.toast(res.meta.message);
        }
      }
    })
    
  },
  // 减
  onMinus(e){
    let other = e.currentTarget.dataset.flag;
    let num = this.data.num;
    let price = this.data.userData.amount;
    if(other == 1){
      num--;
      if(num<1){
        num=1;
        util.toast('不能少于1份');
      }
    }
    if(other == 2){
      num++
    }
    let money = price * num;
    this.setData({money,num})
  },
  // 更多
  onMore(){
    let more = !this.data.more;
    this.setData({more})
  },
  // 选择
  onSelect(e){
    let packageId = this.data.userData.packageId;
    let data = this.data.data;
    let id = e.currentTarget.dataset.id;
    let ins = e.currentTarget.dataset.ins;
    let index = e.currentTarget.dataset.index;
    if(id == packageId){
      util.showModal('提示','是否为套餐续费？',true,(()=>{
        // 续费
        this.setData({join:true});
      }),(()=>{}),'暂时不','续费','#ff5800','#ff5800')

    }else{

      util.showModal('温馨提示','确定要更换此套餐？',true,(()=>{
        // 换套餐
        let oldData = JSON.stringify(this.data.userData);
        let newOrder = JSON.stringify(data[ins].serSets[index]);
        console.log(data,newOrder)
        wx.navigateTo({
          url: `/pages/index/combo/combo?next=true&data=${oldData}&newOrder=${newOrder}`
        })
      }),(()=>{}),'再想想','确定','#ff5800','#ff5800')

      data[ins].serSets.forEach(element => {
        element['sel'] = false;
      });

      data[ins].serSets[index]['sel'] = true;
      this.setData({data,id})
    }
  },
  // 套餐续费
  onSubmit(e){
    let op = e.currentTarget.dataset.tag;
    let amount =  this.data.money;
    let userId = this.data.userData.userId;
    if(op == 1){
      this.setData({join:true})
    }
    if(op == 2){
      // 支付
      this.onPay({amount,userId});
    }
  },
  // 关闭弹窗
  onPopD(e){
    this.setData({join:false})
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
})