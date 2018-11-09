import axios from 'axios'
// import { MessageBox } from 'element-ui'
import { Message } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import exceptHandler from '@/utils/except'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request 拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    if (config.params === undefined) {
      config.params = {}
    }
    if (config.params.token === undefined) {
      config.params.token = getToken()
    }
  }
  return config
}, error => {
  console.error(error)
  Promise.reject(error)
})

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 如果又异常将会返回异常处理流程，
    return exceptHandler(res)
  },
  error => {
    console.error('[Request Error On]:\t' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
