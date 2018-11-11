import { getPoint as pointApi } from '@/api/point'

export const requestPoint = (class_id) => {
  return new Promise((resolve, reject) => {
    pointApi(class_id).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(err => {
      reject(err)
    })
  })
}
