import store from '@/store'

const loginPromise = (form) => {
  return new Promise((resolve, reject) => {
    store.dispatch('Login', form).then(() => resolve())
  })
}

export {
  loginPromise as login
}

