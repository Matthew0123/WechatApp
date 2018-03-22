
Page({
  data: {
    list: [{ id: 1, imageurl: "../../style/images/1.jpg", title: "标题一", snippet: "由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。" }, { id: 2, imageurl: "../../style/images/1.jpg", title: "标题二", snippet: "由各种物质组成的巨型球状天体，叫做星球。星球有一定的形状，有自己的运行轨道。" }],
    url:"http://192.168.1.246:8099/V1/Rongyun/Chatroom/create",
    activeIndex: 0,
    tabs: [],
    sliderOffset: 0,
    sliderLeft: 0
  },
  onLoad: function (options) {
    var that = this;
    var optiontabs = JSON.parse(options.tabs);
    let searchlength = optiontabs.length;
    var temp = optiontabs[this.data.activeIndex];
    wx.request({
      url: that.data.url,
      data: {
        word: temp.title,
      },
      header: {//请求头
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        console.log(res.data);
        if (res.data.ok)
        {
          var tarray= res.data.value;
          temp.list=tarray;
          that.setData({
            tabs: optiontabs
          })
        }
      }
    }); 
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
    var that = this;
    var optiontabs = this.data.tabs;
    let searchlength = optiontabs.length;
    var temp = optiontabs[e.currentTarget.id];
    wx.request({
      url: that.data.url,
      data: {
        word: temp.title,
      },
      header: {//请求头
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        console.log(res.data);
        if (res.data.ok) {
          //var tarray = res.data.value;
          var tarray=that.data.list;
          temp.list = tarray;
          console.log(optiontabs);
          that.setData({
            tabs: optiontabs,
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
          })
        }
      }
    }); 
    
  }
});