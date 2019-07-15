import util from '../../utils/util.js'
import cache from '../../utils/cache.js'
import network from '../../utils/ajax.js'

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    data:{
      menu:{
        tip:'HI',
        name:cache.get('username'),
      }
    },
    broadbandP:false,
    click:true,
    popup:false,      // 资料弹窗
    join:false,
    profit:false,     // 院系班级选项
    schoolSum:[],     // 学校
    departments:[],   // 院系
    classsess:[],     // 班级
  },
  onLoad: function (option) {},
  onShow:function(){
    if(!this.data.isDredge){
      this.getData();
    }
  },
  // 宽带支付
  onKdpay(){
    let status = this.clickJudge();
    if(status){
      wx.navigateTo({
        url:"/pages/index/payment/payment"
      })
    }
  },
  // 获取数据
  getData(){
    // 查询是否填写完资料
    let isBind;
    network.post(
      'isPerfect',
      {id:cache.get('id')})
    .then((res)=>{
      if(res.meta.success){
        // 保存个人资料到缓存
        isBind = true;
        let siteFcode = res.data.site.fcode;
        let UserNum = res.data.workNumber;
        cache.set('siteFcode',siteFcode);
        cache.set('UserNum',UserNum);
        cache.set('siteType',res.data.site.remark);
        this.getBroadbandInfo(siteFcode,UserNum);
        this.setData({site:res.data.site,UserNum})
      }else{
        // 弹窗完善个人资料
        isBind = false;
        this.setData({popup:true})
        // 学校
        network.post(
        'getSchool').then((res)=>{
          if(res.meta.success){
            this._schoolData(res.data)
          }
        })
      }
      app.globalData.isBind = isBind;
      this.setData({isBind})
    })
  },
  // 更换套餐
  onChangetc(e){
    let status = this.clickJudge();
    let broadbandData = this.data.broadbandData;
    if(status){
      wx.navigateTo({
        url:`url="/pages/index/combo/combo?data=${broadbandData}`
      })
    }

  },
  // 查询宽带用户个人信息
  getBroadbandInfo(siteFcode,UserNum){
    let isDredge=false;
    network.post(
      'Broadband/queryUsermsg',
      {id:cache.get('id'),siteFcode,UserNum})
    .then((res)=>{
      if(res.meta.success){
        isDredge = true;
        if(res.data.periodLimitTime){
          res.data.periodLimitTime = util.formatres.data.periodLimitTime(new Date(res.data.periodLimitTime));
        }else{
          res.data.periodLimitTime = '暂未生效';
        }
        let broadbandData = JSON.stringify(res.data);
        this.setData({broadband:res.data,broadbandData})
      }else{
        isDredge = false;
        util.showModal("提示",'您还未开通宽带业务，请先开户',true,()=>{
          wx.navigateTo({
            url:'/pages/chooseTaocan/chooseTaocan'
          })
        },()=>{},'取消','去开户','#ff5800','#ff5800')
      }
      this.setData({isDredge})
    })
  },
  clickJudge(){
    let isBind = this.data.isBind;
    let isDredge =  this.data.isDredge;
    if(!isBind){
      this.setData({popup:true})
      return false;
    }else{
      if(!isDredge){
        util.showModal("提示",'您还未开通宽带业务，请先开户',true,()=>{
          wx.navigateTo({
            url:'/pages/chooseTaocan/chooseTaocan'
          })
        },()=>{},'取消','去开户','#ff5800','#ff5800');
        return false;
      }else{
        return true;
      }
    }
  },
  // 学校选项数据处理
  _schoolData(data){
    let school = [];
    if(data.lists){
      data.lists.forEach((item,index)=>{
        school.push(item.opText)
      })
      this.setData({school,schoolSum:data.lists})
    }
  },
  // 院系选项数据处理
  _departmentsData(data){
    let depart = [];
    if(data.lists){
      data.lists.forEach((item,index)=>{
        depart.push(item.opText)
      })
      this.setData({depart,departments:data.lists})
    }
  },
  // 班级选项数据处理
  _classsessData(data){
    let cls = [];
    if(data.lists){
      data.lists.forEach((item,index)=>{
        cls.push(item.opText)
      })
      this.setData({cls,classsess:data.lists})
    }
  },
  // 选择学校/院系/班级
  onOptions(e){
    let op = e.currentTarget.dataset.tag;
    let index = Number(e.detail.value);
    let broadbandP;
    let deptName;
    let className;
    if(op == 1){
      let school_v = this.data.schoolSum[index].opText;
      let opValue = this.data.schoolSum[index].opValue;
      this.setData({school_v,opValue})
      // 宽带账号区别提示
      if(opValue == 'fb9d10335b551d5a76d36df2bc961951' || opValue == '58e8599b9d19d34e386c899fbc4508bc'){
        broadbandP = true;
      }else{
        broadbandP = false;
      }
      this.setData({broadbandP})
      // 只有这两个学校有院系
      if(opValue == 'fb9d10335b551d5a76d36df2bc961951' || opValue == '823ef78c7ed94e905156905798cbd175'){
        this.setData({profit:true})
        // 院系
        network.post(
          'getDepartments',{code:opValue}).then((res)=>{
            if(res.meta.success){
              if(res.meta.success){
                this._departmentsData(res.data)
              }
            }
        })
      }else{
        this.setData({profit:false})
      }
    }
    if(op == 2){
      let depart_v = this.data.departments[index].opText;
      deptName = this.data.departments[index].opValue;
      this.setData({depart_v,deptName})
      // 班级 
      network.post(
        'getClasssess',{dept_code:deptName}).then((res)=>{
          if(res.meta.success){
            if(res.meta.success){
              this._classsessData(res.data)
            }
          }
        })
    }

    if(op == 3){
      let cls_v = this.data.classsess[index].opText;
      className = this.data.classsess[index].opValue;
      this.setData({cls_v,className})
    }
  },
  // 宽带账号验证
  onbroadband(e){
    let broadbandP = this.data.broadbandP;
    let workNumber = e.detail.value;
    if(broadbandP){
      if(workNumber.length < 16 || workNumber.length > 20){
        workNumber = '';
        util.toast('身份证号码错误')
      }
    }else{}
    this.setData({workNumber});
  },
  // 提交
  onSubmit(e){
    let v = e.detail.value;
    let tag = e.detail.target.dataset.tag;
    let status = this.clickJudge();
    if(status){
      if(tag == 1){
        if(v.userid){
          this.setData({join:true})
        }else{
          util.toast('请输入宽带账号！')
        }
      }
      // 完善个人资料提交
      if(tag == 2){
        let siteCode = this.data.opValue;
        let workNumber = this.data.workNumber;
        let realname = v.name;
        let deptName = this.data.deptName;
        let className = this.data.className;
        if(v.broadband !='' && siteCode !='' && realname != ''){
          network.post(
            'perfectInformation',
            {
              id:cache.get('id'),
              siteCode,
              realname,
              deptName,
              className,
              workNumber
            }
          ).then((res)=>{
            if(res.meta.success){
              this.getData();
              this.setData({popup:false});
              cache.set('realname',realname);
            }
          });
        }else{
          if(!realname){
            util.toast('请输入姓名！')
          }
          if(!v.broadband){
            util.toast('请输入宽带账号！')
          }
          if(!siteCode){
            util.toast('请选择学校！')
          }
        }
      }
    }
  },
  // 确认支付
  onAffirm(e){
    let amount = this.data.broadband.amount;
    let userId = this.data.broadband.userId;
    this.onPay({amount,userId})
  },
  // 取消填写资料
  onCancel(){
    this.setData({popup:false})
  },
  onPopD(){
    this.setData({join:false})
  },
  // 开发中
  onLaundry(e){
    util.showModal('提示','此服务正在开发，敬请期待',false)
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
  // 故障报修
  service(){
    let status = cache.get('juese')
    let url = null;
    if(status == '维修人员角色'){
      url = '/pages/index/repairRecordWorker/repairRecordWorker'
    }else{
      url = '/pages/index/repairRecord/repairRecord'
    }
    wx.navigateTo({url})
  },
  // 热水
  openAPP() {
    let that = this;
    wx.navigateToMiniProgram({
      appId: 'wx2ded7c2a06ef15ea',
      success(res) {
        // that.setData({ open: false })
      }
    })
  },
})
