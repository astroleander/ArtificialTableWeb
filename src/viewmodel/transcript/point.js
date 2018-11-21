import { getPoint, postPoint, putPoint } from '@/api/point'
import { postPoints, putPoints } from '@/api/point'

export const requestPoint = (class_id) => {
  return new Promise((resolve, reject) => {
    getPoint(class_id).then(response => {
      const dataset = response && response.subjects
      resolve(dataset)
    }).catch(err => {
      reject(err)
    })
  })
}

export const addPoint = ({ pointItem }) => {
  return new Promise((resolve, reject) => {
    postPoint(pointItem).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const addPointList = ({ pointArray }) => {
  return new Promise((resolve, reject) => {
    postPoints(pointArray).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const modifyPointList = ({ pointArray }) => {
  return new Promise((resolve, reject) => {
    putPoints(pointArray).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}

export const modifyPoint = ({ pointItem }) => {
  return new Promise((resolve, reject) => {
    putPoint(pointItem).then(response => {
      resolve(response)
    }).catch(err => {
      reject(err)
    })
  })
}
