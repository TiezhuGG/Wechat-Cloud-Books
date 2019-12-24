// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const doubanbook = require('doubanbook')
const cheerio = require('cheerio')

cloud.init()

// 第一个爬虫函数，根据isbn获取图书的详情页链接
async function crawlBookUrl(isbn) {
  const url = 'https://search.douban.com/book/subject_search?search_text=' + isbn
  let searchInfo = await axios.get(url)
  // console.log(searchInfo.data)
  // 获取window.__DATA__ = 后面的数据，需要使用doubanbook这个包解密 
  let reg = /window\.__DATA__ = "(.*)"/
  if (reg.test(searchInfo.data)) {
    // console.log(RegExp.$1)
    let searchData = doubanbook(RegExp.$1)[0]
    // console.log(searchData)
    return searchData
  }
}

async function getBookDetailInfo(isbn) {
  let bookInfo = await crawlBookUrl(isbn)
  let detailPage = await axios.get(bookInfo.url)
  // 第二个爬虫，获取图书详情页信息
  // cheerio 在node里，使用jquery的语法解析文档
  const $ = cheerio.load(detailPage.data)
  const info = $('#info').text().split('\n').map(v => v.trim()).filter(v => v)
  info.forEach(v => {
    let temp = v.split(':')
    if (temp[0] == '出版社') {
      publisher = temp[1]
    }
    if (temp[0] == '定价') {
      price = temp[1]
    }
  })
  let tags = []
  a = $('#db-tags-section a.tag').each((i, v) => {
    tags.push({
      title: $(v).text()
    })
  })
  const ret = {
    create_time: new Date().getTime(),
    tags,
    author: info[1],
    publisher,
    price,
    title: bookInfo.title,
    rate: bookInfo.rating.value,
    image: bookInfo.cover_url,
    url: bookInfo.url,
    summary: $("#link-report .intro").text().trim(),
  }
  console.log(ret)
  return ret
}

// 本地调试的入口
// console.log(getBookDetailInfo('9787115352460'))

// 所谓的云函数 就是一个node的项目(函数)
// 云函数入口函数
exports.main = async(event, context) => {
  // 云函数的逻辑
  const {
    isbn
  } = event
  return getBookDetailInfo(isbn)
  // if (isbn) {
  //   return getBookDetailInfo(isbn)
  // } else {
  //   return {
  //     code: -1,
  //     msg: '请扫描正确的图书'
  //   }
  // }
}