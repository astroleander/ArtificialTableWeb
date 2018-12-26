import axios from 'axios'
// import { MessageBox } from 'element-ui'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
import exceptHandler from '@/utils/except'

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request 拦截器
service.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers.token = getToken()
  }
  console.log('[request to Remote]:')
  console.log(config)
  return config
}, error => {
  console.error(error)
  Promise.reject(error)
})

// response 拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    /**
     * 如异常将会返回异常处理流程，@see @/utils/except.js'
     */
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
