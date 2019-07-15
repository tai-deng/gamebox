// pages/index/repairRecord/myRepair.js
import network from '../../../utils/ajax.js'
import cache from '../../../utils/cache.js'
import util from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    upload:[],
    max_upimglen:3,
    bs64:[],
  },
  onLoad: function (options) {
    this.init();
  },
  // 获取项目、区域下拉选项数据
  init(){
    let id = cache.get('id');
    network.post('getProjectSetting',{id})
    .then((res)=>{
      if(res.meta.success){
        this.setData({repairItem:res.data.lists})
      }
    })
    network.post('getAreaSetting',{id})
    .then((res)=>{
      if(res.meta.success){
        this.setData({areaList:res.data.lists})
      }
    })
    network.post('applyRepair',{id})
    .then((res)=>{
      if(res.meta.success){
        this.setData({user:res.data.sysUser})
      }
    })
  },
  // 选项
  onOptions(e){
    let tag = e.target.dataset.tag;
    let i = Number(e.detail.value);
    let arr = '';
    if(tag == 'item'){
      arr = this.data.repairItem;
      this.setData({repair_v:arr[i].opText})
    }else if(tag == 'area'){
      arr = this.data.areaList;
      this.setData({area_v:arr[i].opText,regionList:arr[i].children})
    }else if(tag == 'region'){
      arr = this.data.regionList
      this.setData({region_v:arr[i].opText})
    }
  },
  // 上传图片转base64
  bindupload(){
    let upload = this.data.upload;
    let that = this;
    let bs64 = this.data.bs64;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        let poth = res.tempFilePaths[0];
        wx.getImageInfo({
          src: poth,
          success: function(res){
            var ctx = wx.createCanvasContext('my_canvas');
            var ratio = 3;
            var canvasWidth = res.width
            var canvasHeight = res.height;
            while (canvasWidth > 200 || canvasHeight > 200){
              canvasWidth = Math.trunc(res.width / ratio)
              canvasHeight = Math.trunc(res.height / ratio)
              ratio++;
            }
            that.setData({
              canvasWidth: canvasWidth,
              canvasHeight: canvasHeight
            })
            ctx.drawImage(poth, 0, 0, canvasWidth, canvasHeight)
            ctx.draw()

            setTimeout(function(){
              wx.canvasToTempFilePath({
                canvasId: 'my_canvas',
                success: function (res) {
                  upload = upload.concat(res.tempFilePath);
                  wx.getFileSystemManager().readFile({
                    filePath: res.tempFilePath,
                    encoding:'base64',
                    success: res => {
                      bs64.push('data:image/jpg;base64,'+res.data)
                      that.setData({bs64,upload})
                    }
                  })
                },
                fail: function (error) {
                  console.log(error)
                }
              })
            },100)

      }})
      }
    })
  },
  // 删除图片
  delimg(e){
    let upload = this.data.upload;
    let bs64 = this.data.bs64;
    let i = Number(e.target.dataset.i);
    util.showModal('删除!','确定要删除照片吗？',true,(e)=>{
      upload.splice(i,1)
      bs64.splice(i,1)
      this.setData({upload,bs64})
    })
  },
  // 图片预览
  bindpreview(e){
    let upload = this.data.upload;
    let i = Number(e.target.dataset.i);
    util.preview(upload,upload[i])
  },
  // 提交数据
  onSubmit(e){
    let id = cache.get('id');
    let area_v = this.data.area_v;
    let region_v = this.data.region_v;
    let repairProject = this.data.repair_v;
    let repairAddress = e.detail.value.dizhi;
    let description = e.detail.value.description;
    let bs64 = this.data.bs64;
    let imglen = Boolean(bs64.length > 0);
    let repairPeople = this.data.user.realname;
    let repairPeopleCode = this.data.user.fcode;
    let repairPhone = this.data.user.mobileno;
    if(repairProject&&area_v&&region_v&&repairAddress
      &&description&&imglen
      ){
      let repairArea = area_v + '-' + region_v;
      network.post('saveRepair',{
        id,repairArea,repairProject,repairAddress,description,
        img1:bs64[0],
        img2:bs64[1],
        img3:bs64[2],
        img4:bs64[3],
        img5:bs64[4],repairPeople,repairPeopleCode,repairPhone})
      .then(res=>{
        util.toast('提交成功！');
        setTimeout(()=>{
          wx.navigateBack({data:1})
        },1400)
      })
    }else{
      if(!repairProject){
        util.toast('请选择报修项目！')
      }
      if(!region_v){
        util.toast('请选择报修区域！')
      }
      if(!area_v){
        util.toast('请选择具体区域！')
      }
      if(!repairAddress){
        util.toast('请填写详细地址！')
      }
      if(!description){
        util.toast('请填写故障描述！')
      }
      if(!imglen){
        util.toast("故障照片不能为空！")
      }
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