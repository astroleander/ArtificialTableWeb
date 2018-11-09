import store from '@/store'
// TODO: change data -> viewmodel
export const login = (form) => {
  return new Promise((resolve, reject) => {
    store.dispatch('Login', form)
      .then(() => resolve())
      .catch(err => {
        reject(err)
      })
  })
}

