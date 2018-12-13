import { getTitle as titleApi } from '@/api/title'
import { getTitleGroups as titleGroupApi } from '@/api/title'

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

// TODO: redefine titleGroup api, specially redefine the lesson table
export const requestTitleGroup = ({ lesson_id }) => {
  return new Promise((resolve, reject) => {
    titleGroupApi({ lesson_id }).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(err => {
      reject(err)
    })
  })
}
