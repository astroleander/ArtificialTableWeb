import store from '@/store'
import { login } from '@/api/login'
// TODO: change data -> viewmodel
// const login = (form) => {
//   return new Promise((resolve, reject) => {
//     store.dispatch('Login', form)
//       .then(() => resolve())
//       .catch(err => {
//         reject(err)
//       })
//   })
// }

const requestlogin = (form) => {
  const username = form.username.trim()
  const password = form.password
  return new Promise((resolve, reject) => {
    login(username, password).then(response => {
      const data = response
      if (data.subjects !== undefined) {
        store.commit('SET_TOKEN', data.subjects.token)
        store.commit('SET_ID', data.subjects.id)
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
export default{
  requestlogin
}
