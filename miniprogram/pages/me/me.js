// miniprogram/pages/me/me.js

const db = wx.cloud.database()

Page({
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
        // console.log(res)
        this.addBook(res.result)
      }
    })
  },
  addBook(isbn) {
    // 调用云函数getBookInfo获取图书信息
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
})