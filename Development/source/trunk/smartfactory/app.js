const APP_ID = 'wx5d35120aeca69f75';//输入小程序appid  
const APP_SECRET = '775042d74503c4c8bbdc2024320b953b';//输入小程序app_secret 
//app.js
App({
  onLaunch: function () {
    var that=this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
        wx.request({
          //获取openid接口
          url: this.globalData.domainName +'weixin/getLoginMsg',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            code: res.code
          },
          method: 'GET',
          success: function (res) {
            console.log(res.data);
            if(res.data.ok)
            {
              that.globalData.openId = res.data.value.openid;
              console.log(that.globalData.openId);
            }
            else
            {
              console.log("微信openid获取失败！");
            }            
          }
        })
      }
    })
    // 获取用户信息
    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    wx.getUserInfo({
      success: res => {
        console.log(res.userInfo);
        // 可以将 res 发送给后台解码出 unionId
        this.globalData.userInfo = res.userInfo

        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })

  },
  globalData: {
    userInfo: null,
    domainName: "https://www.shangyuekeji.com/v1/api/",
    openId:''
  }
})