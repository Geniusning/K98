import axios from 'axios'
import Cache from './cache'

// axios的自定义实例
let instance = axios.create({
  baseURL: ''
})

let cache = new Cache(axios) // 将当前 axios 对象传入 Cache 中
cache.use({
  expire: 30000,
  storage: true,
  instance, // 如果有自定义axios实例 比如上面的instance 需要将其传入instance 没有则不传
  requestConfigFn: config => {
    // 请求拦截自定义操作
    let identity = sessionStorage.getItem('identity')
    if (identity) {
      config.headers = {
        'identity': identity,
      }
    }
    // 需要将config对象通过 Promise 返回 cache 中 也可以使用new Promise的写法
    return Promise.resolve(config)
  },
  responseConfigFn: res => {
    // 响应拦截的自定义操作
    if (!res.data.code) {
      // 需要将 res 通过 Promise 返回
      return Promise.resolve(res)
    }
  }
})

export default instance