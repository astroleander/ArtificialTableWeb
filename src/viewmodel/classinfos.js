import { getClassInfo } from '@/api/class'

const requestClassInfo = user_id => {
  return new Promise((resolve, reject) => {
    getClassInfo(user_id)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export default { requestClassInfo }
