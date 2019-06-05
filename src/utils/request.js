/*  用于前后端进行交互  可直接使用 */

import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
// 统一错误处理
import exceptHandler from '@/utils/except'

// 创建 axios 实例
//  `baseURL` 将自动加在 `url` 前面
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url 请求前往的url
  timeout: 15000 // 请求超时时间
})

// request 拦截器
service.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers.token = token
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
