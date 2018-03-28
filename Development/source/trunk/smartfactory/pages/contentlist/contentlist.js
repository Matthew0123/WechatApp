//获取应用实例
const app = getApp()
function queryNews(optiontabs,that)
{
  let searchlength = optiontabs.length;
  var temp = optiontabs[that.data.activeIndex];
  console.log(app.globalData.domainName + "express/queryNewsOnline");
  wx.request({
    url: app.globalData.domainName + "express/queryNewsOnline",
    data: {
      word: temp.title,
    },
    header: {//请求头
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    success: function (res) {
      console.log(res.data);
      if (res.data.isOk) {
        var tarray = res.data.value;
        temp.list = tarray;
        that.setData({
          tabs: optiontabs
        })
      }
    }
  }); 
}

Page({
  data: {
    activeIndex: 0,
    tabs: [],
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function (options) {
    var optiontabs = JSON.parse(options.tabs);
    queryNews(optiontabs,this);
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length)+10,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  bindDownLoad:function(){

  },
  tabClick: function (e) {
    var optiontabs = this.data.tabs;
    queryNews(optiontabs,this);
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    })
  },
  pageskip: function (e) {
    console.log(e.currentTarget);
    wx.navigateTo({
      url: '../webview/webview?link=' + encodeURIComponent(e.currentTarget.dataset.text)
    })
  }
});