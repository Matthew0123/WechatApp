
Page({
  data: {
    link:""
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      link: decodeURIComponent(options.link),
    })
  }
})