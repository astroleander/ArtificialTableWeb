import axios from 'axios'
// import { MessageBox } from 'element-ui'
import { Message } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

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
    console.log('[response from Remote]')
    console.log(res)
    // if (res.code !== 20000) {
    //   Message({
    //     message: res.message,
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    //
    //   // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
    //       confirmButtonText: '重新登录',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('FedLogOut').then(() => {
    //         location.reload()// 为了重新实例化vue-router对象 避免bug
    //       })
    //     })
    //   }
    //   return Promise.reject('error')
    // } else {
    //    return response.data
    return Promise.resolve(res)
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
