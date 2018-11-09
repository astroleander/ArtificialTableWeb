import store from '@/store'
// TODO: change data -> viewmodel
const loginPromise = (form) => {
  return new Promise((resolve, reject) => {
    store.dispatch('Login', form).then(() => resolve())
  })
}

export {
  loginPromise as login
}

