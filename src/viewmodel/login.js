import store from '@/store'
import { login, logout } from '@/api/login'
import { getUsersWithOutPass } from '@/api/user'

const requestLogin = ({ username, password }) => {
  return new Promise((resolve, reject) => {
    login(username, password).then(response => {
      const data = response // response里有id和token
      if (data.subjects !== undefined) {
        // 获取用户信息
        getUsersWithOutPass({ id: data.subjects.id })
          .then(response => {
            if (response.subjects !== undefined) {
              store.dispatch('Login', {
                id: data.subjects.id,
                token: data.subjects.token,
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
export default{
  requestLogin, requestLogOut
}
