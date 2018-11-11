import { getTitle as titleApi } from '@/api/title'

export const requestTitle = (class_field_id) => {
  return new Promise((resolve, reject) => {
    titleApi(class_field_id).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(err => {
      reject(err)
    })
  })
}
