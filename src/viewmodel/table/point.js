import { point as pointApi } from '@/api/point'

export const requestPoint = ({ class_id }) => {
  return new Promise((resolve, reject) => {
    pointApi({ class_id: class_id }
      .then(response => {
        const dataset = response && response.subjects
        resolve(dataset)
      })
      .catch(err => {
        console.log('some err:' + err)
        // TODO: including a global api exception catcher
      })
    )
  })
}