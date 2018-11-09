import { Message } from 'element-ui'
/**
 * @description 统一自动处理 response 错误，在 axios 的 response 的前置拦截器中调用
 * @author Astroleander
 *
 * @param response
 * @returns resolve 返回完整的 response, 错误时 reject 返回 { error, code, msg, response }
 *
 */
const responseHandler = (response) => {
  console.log('[response from Remote]')
  console.log(response)
  return new Promise((resolve, reject) => {
    // TODO: refactor error code
    if (response.code === '1016' || response.code === '1017') {
      const error = new Error('Customary Error on response!\ncode:' + response.code + '\nmessage:' + response.message)
      const code = response.code
      const msg = response.message
      Message({
        message: msg,
        type: 'error',
        duration: 5 * 1000
      })
      reject({ error, code, msg, response })
    }
    resolve(response)
  })
}

export default responseHandler