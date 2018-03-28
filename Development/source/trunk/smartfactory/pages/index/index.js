//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    searchContent: '',
    keywords: [{ keyword: "玉石" }, { keyword: "样式" }, { keyword: "价格" }],
    modalHidden: true,
    modalHidden2: true
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    var that =this;
    wx.request({
      url: app.globalData.domainName +'setting/getInfo',
      data: {
        weixin: app.globalData.openId
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if(res.data.isOk)
        {
          that.setData({
            keywords:res.data.value
          })
        }
        else
        {
          wx.showModal({
            content: '快讯查询失败，请重新加载！',
            showCancel: false
          });
        }
      }
    });
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  addKeyword: function (e) {
    console.log(this.data.keywords)
    if (this.data.searchContent == "") {
      wx.showModal({
        content: '搜索内容为空，请确认！',
        showCancel: false
      });
      return;
    }
    var searchKeywords = this.data.keywords;
    var length = searchKeywords.length;
    for (let i = 0; i < length; i++) {
      if (searchKeywords[i].keyword == this.data.searchContent) {
        wx.showModal({
          content: '搜索内容已预订，请确认！',
          showCancel: false
        });
        return;
      }
    }
    var newObj = { keyword: this.data.searchContent };
    searchKeywords.push(newObj);
    this.setData({
      keywords: searchKeywords
    });
  },
  minusKeyword: function (e) {
    console.log(e.currentTarget.dataset)
    var dataset = e.currentTarget.dataset;
    var searchKeywords = this.data.keywords;
    searchKeywords.splice(dataset.text, 1);
    this.setData({
      keywords: searchKeywords
    });
  },
  searchInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      searchContent: e.detail.value
    })

  },
  formSubmit: function (e) {
    var formData = e.detail.value;
    let map = util.objToStrMap(formData);
    var tabs = [];
    for (var [key, value] of map)
    {
      if(util.startWith(key,"search"))
      {
        let obj = { title:value,list:[]};
        tabs.push(obj);
      }
    }
    var tabsStr= JSON.stringify(tabs);
    console.log(tabsStr);
    wx.showModal({
      title: '提示',
      content: '已输入完成，确定提交么？',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          wx.request({
            url: app.globalData.domainName + 'setting/update',
            data: {
              weixin: app.globalData.openId
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              if (res.data.isOk) {
                wx.navigateTo({
                  url: '../contentlist/contentlist?tabs=' + tabsStr
                })
              }
              else {
                wx.showModal({
                  content: '查询失败，请重新尝试！',
                  showCancel: false
                });
              }
            }
          });
          return;
        } else {
          return;
        }
      }
    });
  }
})
