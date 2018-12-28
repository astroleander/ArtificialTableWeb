import store from '@/store'
import { login, logout } from '@/api/login'
import { getUserInfoWithOutPwd } from '@/api/user'

const requestLogin = ({ username, password }) => {
  return new Promise((resolve, reject) => {
    login(username, password).then(response => {
      const data = response && response.subjects
      if (data !== undefined) {
        // 获取用户信息
        /**
         * 此处尚未获取 token, 我们需要手动将 token 作为第二个参数传给 viewmodel 接口
         */
        getUserInfoWithOutPwd({ id: data.id }, data.token)
          .then(response => {
            if (response.subjects !== undefined) {
              store.dispatch('Login', {
                id: data.id,
                token: data.token,
                user: response.subjects[0]
              })
            }
          }).catch(error => {
            reject(error)
          })
      } else {
        const message = '\ncode:' + data.code + '\nmessage:' + data.message
        throw new Error(message)
      }
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
}
const requestLogOut = () => {
  return new Promise((resolve, reject) => {
    logout().then(() => {
      store.dispatch('LogOut')
      resolve()
    }).catch(error => {
      reject(error)
    })
  })
}

export default {
  requestLogin, requestLogOut
}
