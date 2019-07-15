// pages/index/repairDetail/repairDetail.js
import network from '../../../utils/ajax.js'
import cache from '../../../utils/cache.js'
import util from '../../../utils/util.js'
Page({
  data: {
    data:{},
  },
  onLoad: function (options) {
    this.getData(options.orderId)
  },
  getData(orderId){
    let id = cache.get('id');
    let role = cache.get('juese');
    network.post('orderDetails',{id,orderId})
    .then(res=>{
        if(res.meta.success){
            this.setData({role,data:res.data.order,orderId})
            if(role == '维修人员角色'){
                this.worker_repair(res.data.order)
            }
            else{
                this.user_repair(res.data.order)
            }
        }
    })
  },
  // 维修人员
  worker_repair(data){
    if(data.orderState == 1 || data.processState == 1){
        data['state'] = '待接单'
        data['btnText'] = '接单处理'
    }
    if(data.orderState == 2 || data.processState == 2){
        data['state'] = '待确认'
        data['btnText'] = '确认完成订单'
        this.pickerFn();
    }
    if(data.orderState == 3 || data.processState == 3){
        data['state'] = '已完成'
        data['btnText'] = '返回上一页'
    }

    data['identity'] = '报修人'
    this.setData({data})
    this.public_repair()
  },
  // 用户
  user_repair(data){
    if(data.orderState == 1 || data.processState == 1){
        data['state'] = '待处理'
    }
    if(data.orderState == 2 || data.processState == 2){
        data['state'] = '处理中'
    }
    if(data.orderState == 3 || data.processState == 3){
        data['state'] = '已完成'
        data['leave'] = true;
        let leave = null;
        let disabled = null;
        let focus = null;
        let placeholder = '您可以给维修人员评论（限1次）';
        if(!data.repairRemark){
            data['btnText'] = '我要评论'
            disabled = false;
            focus = true;
            util.scrool(300,20)
        }else{
            disabled = true;
            focus = false;
            leave = data.repairRemark;
            data['btnText'] = '返回上一页'
        }
        this.setData({leave,disabled,focus,placeholder})
    }
    
    data['identity'] = '维修人'
    this.setData({data})
    this.public_repair();
  },
  // 公用状态
  public_repair(){
    let data = this.data.data;
    let width = 0;
    data['upload'] = [];
    data.createTime = util.formatTime(new Date(data.createTime));
    if(data.orderState == 1 || data.processState == 1){
        width = '33.333%';
    }
    if(data.orderState == 2 || data.processState == 2){
        width = '66.666%';
    }
    if(data.orderState == 3 || data.processState == 3){
        width = '100%';
    }
    if(data.orderState == 4){
        width = '0%';
        data['state'] = '已关闭'
        data['btnText'] = '返回上一页'
    }

    if(!!data.img1){
        data.upload.push(network.img_url + data.img1);
    }else{
        data['uploadState'] = true;
    }
    if(!!data.img2){
        data.upload.push(network.img_url + data.img2);
    }
    if(!!data.img3){
        data.upload.push(network.img_url + data.img3);
    }
    if(!!data.img4){
        data.upload.push(network.img_url + data.img4);
    }
    if(!!data.img5){
        data.upload.push(network.img_url + data.img5);
    }
    this.setData({data,width})
  },
  // 拨打电话
  onPlayCall(e){
      let phone = e.currentTarget.dataset.phone;
      util.call(phone)
  },
  // 图片预览
  bindpreview(e){
    let i = Number(e.currentTarget.dataset.i);
    let arr = this.data.data.upload;
    util.preview(arr,arr[i])
  },
  // 按钮事件
  onBtn(e){
      let data = this.data.data;
      let that = this;
      switch(data.btnText){
          case '接单处理':
            that.receiving()
          break;
          case '确认完成订单':
            that.affirm()
          break;
          case '返回上一页':
            that.back()
          break;
          case '我要评论':
            that.review()
          break;
      }
  },
  // 师傅接单处理
  receiving(){
    let id = cache.get('id');
    let orderId = this.data.orderId;
    network.post('receiveOrder',{id,orderId})
    .then(res=>{
        if(res.meta.success){
            util.showModal('提示！','接单成功！',false,()=>{
                this.back();
            })
        }
    })
  },
  // 师傅确认完成订单
  affirm(){
    let id = cache.get('id');
    let orderId = this.data.orderId;
    let data2 = this.data.data2;
    if(data2){
        network.post('completeOrder',{id,orderId,data2})
        .then(res=>{
            if(res.meta.success){
                util.showModal('提示！','订单确认完成！',false,()=>{
                    this.back();
                })
            }
        })
    }else{
        if(this.data.region_v == '其它'){
            util.toast('请选输入故障描述！')
        }else{
            util.toast('请选择故障类型！')
        }
    }
  },
  // 我要评论
  review(){
    let id = cache.get('id');
    let orderId = this.data.orderId;
    let repairRemark = this.data.repairRemark;
    if(repairRemark){
        network.post('evaluation',{id,orderId,repairRemark})
        .then(res=>{
            if(res.meta.success){
                util.showModal('提示！','评论成功！',false,()=>{
                    this.back();
                })
            }
        })
    }else{
        util.toast('请输入评论内容！')
    }
  },
  // 返回上一页
  back(){
    wx.navigateBack({data:1})
  },
  // 获取评论
  bindleave(e){
      let repairRemark = e.detail.value;
      let data2 = repairRemark;
      this.setData({repairRemark,data2})
  },
  // 获取系统故障类型
  pickerFn(){
    let id = cache.get('id');
    network.post('getRepairType',{id})
    .then(res=>{
        if(res.meta.success){
            this.setData({regionList:res.data.lists,select:true})
        }
    })
  },
  // 选择故障类型
  onOptions(e){
      let i = Number(e.detail.value);
      let data2 = this.data.regionList[i].opText;
      let region_v = this.data.regionList[i].opText;
      let focus= null;
      let placeholder= null;
      let disabled = null;
      if(data2 == '其它'){
        focus = true;
        placeholder = '请输入故障具体内容！';
        disabled = false;
        util.scrool(300,20)
        data2 = '';
      }
      this.setData({data2,region_v,focus,placeholder,disabled})
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