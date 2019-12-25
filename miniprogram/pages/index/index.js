const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    books: [],
    // 第几页
    page: 0
  },
  // 监听上拉触底事件
  onReachBottom() {
    // console.log("bottom")
    // 触底加载下一页
    this.setData({
      page: this.data.page + 1
    }, () => {
      this.getList()
    })
  },
  // 监听下拉刷新事件
  onPullDownRefresh(){
    // console.log('下拉刷新，重新渲染')
    this.getList(true)
  },
  getList(init) {
    wx.showLoading()
    // init代表是否初始化 初始化不考虑分页直接渲染
    if (init) {
      this.setData({
        page: 0
      })
    }
    // 一页3本图书
    const PAGE = 3
    const offset = this.data.page * PAGE

    let ret = db.collection('bookInfos').orderBy('create_time', 'desc')
    if (this.data.page > 0) {
      ret = ret.skip(offset)
    }
    ret = ret.limit(PAGE).get().then(res => {
      if (init) {
        this.setData({
          books: res.data
        })
      } else {
        this.setData({
          books: [...this.data.books, ...res.data]
        })
      }
      wx.hideLoading()
    })
  },
  onLoad: function(options) {
    this.getList(true)
  },

})