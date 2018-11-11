import { getStudent as studentApi } from '@/api/student'

export const requestStudent = (class_field_id) => {
  return new Promise((resolve, reject) => {
    studentApi(class_field_id).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(err => {
      reject(err)
    })
  })
}
