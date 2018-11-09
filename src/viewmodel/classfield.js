import { getClassField } from '@/api/class'

export const requestClassField = (user_id) => {
  return new Promise((resolve, reject) => {
    getClassField(user_id).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error)
    })
  })
}
