
## 微信小程序云开发

1. 使用button授权登录 获取用户信息
2. 调用login云函数获取用户openid并写入本地缓存进行持久化存储
3. 扫描图书isbn号，调用getBookInfo云函数
4. getBookInfo内编写爬虫从豆瓣网站获取图书信息
5. 微信小程序云开发可以直接在前端操作数据库
```
      db.collection('bookInfos').orderBy('create_time', 'desc').get().then(res => {
    	this.setData({
    		books: res.data
    	})
  	})
 ```
 6. 滚动加载和下拉刷新
 
