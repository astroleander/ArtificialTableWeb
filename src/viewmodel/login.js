import store from '@/store'
import { login, logout } from '@/api/login'
import { getUserInfoWithOutPwd } from '@/api/user'

// 请求登录函数
const requestLogin = ({ username, password }) => {
  return new Promise((resolve, reject) => {
    // 与后端交互成功匹配
    login(username, password).then(response => {
      console.log('成功与后台数据匹配')
      console.log(response)
      const data = response && response.subjects
      if (data !== undefined) {
        // 获取用户信息
        /**
         * 此处尚未获取 token, 我们需要手动将 token 作为第二个参数传给 viewmodel 接口
         * 将用户id与token传给getUserInfoWithOutPwd 请求调回用户信息
         */
        getUserInfoWithOutPwd({ id: data.id }, data.token)
          .then(response => {
            if (response.subjects !== undefined) {
              // 提交数据到store中进行登录存储数据信息
              console.log('成功获取用户信息存储到store中')
              console.log(response)
              // 数据加载到store中
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
