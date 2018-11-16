import { getTitle as titleApi } from '@/api/title'
import { getTitleGroup as titleGroupApi } from '@/api/title'

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

export const requestTitleGroup = ({ titleGourp_id }) => {
  return new Promise((resolve, reject) => {
    titleGroupApi({ titleGourp_id }).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(err => {
      reject(err)
    })
  })
}
