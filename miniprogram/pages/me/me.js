// miniprogram/pages/me/me.js

const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync('myUserInfo') || {},
  },
  // 获取用户信息函数
  getMyUserInfo(e) {
    // console.log(e)
    let myUserInfo = e.detail.userInfo
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        // console.log(res)
        myUserInfo.openid = res.result.openid
        this.setData({
          userInfo: myUserInfo
        })
        // 写入本地缓存
        wx.setStorageSync('myUserInfo', myUserInfo)
      }
    })
  },
  // 扫描图书二维码获取isbn号
  scanCode() {
    wx.scanCode({
      success: res => {
        // 图书的isbn号（res.result），可以去豆瓣获取详情
        console.log(res)
        this.addBook(res.result)
      }
    })
  },
  addBook(isbn) {
    // 调用云函数获取图书信息
    wx.cloud.callFunction({
      name: 'getBookInfo',
      data: {
        isbn
      },
      success: ({
        result
      }) => {
        console.log(result)
        // 添加图书的isbn号和用户信息到result对象中
        result.isbn = isbn
        result.userInfo = this.data.userInfo
        db.collection('bookInfos').add({
          data: result
        }).then(res => {
          if(res._id) {
            wx.showModal({
              title: "添加成功",
              content: `《${result.title}》添加成功`
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})