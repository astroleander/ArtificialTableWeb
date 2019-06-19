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
  console.log('[response from Remote]:')
  console.log(response)
  return new Promise((resolve, reject) => {
    // DONE: refactor error code
    if (RegExp('4037').test(response.code)) {
      console.log('Insert nothing, may all resource have exists')
      // Message({
      //   message: '资源已存在！',
      //   type: 'warning',
      //   duration: 5 * 1000
      // })
    } else if (RegExp('4038').test(response.code)) {
      console.log('Invailed insert request')
    } else if (RegExp('4036').test(response.code)) {
      console.log('Query nothing, no exists')
    } else if (RegExp('4021').test(response.code)) {
      Message({
        message: '用户或密码名错误，请校验',
        type: 'error',
        duration: 5 * 1000
      })
    } else if (RegExp('^4').test(response.code)) {
      const error = new Error('Customary Error on response!\ncode:' + response.code + '\nmessage:' + response.message)
      const code = response.code
      const msg = response.message
      Message({
        message: msg,
        type: 'error',
        duration: 5 * 1000
      })
      reject({ error, code, msg, response })
    } else if (RegExp('^5').test(response.code)) {
      const error = new Error('Server Error\ncode:' + response.code + '\nmessage:' + response.message)
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
