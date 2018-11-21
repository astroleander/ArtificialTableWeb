import request from '@/utils/request'

export function getPoint(class_id) {
  return request({
    url: '/point/format',
    method: 'get',
    params: { classInfo_id: class_id }
  })
}

export function putPoint(pointItem) {
  return request({
    url: '/point/format',
    method: 'put',
    body: {
      subjects: [pointItem]
    }
  })
}

export function putPoints(pointArray) {
  return request({
    url: '/point/format',
    method: 'put',
    body: {
      subjects: pointArray
    }
  })
}

export function postPoint(pointItem) {
  return request({
    url: '/point/format',
    method: 'post',
    // params: { id: pointItem.id },
    // data: { id: pointItem.id },
    body: {
      subjects: [pointItem]
    }
  })
}

export function postPoints(pointMultipleItems) {
  return request({
    url: '/point/format',
    method: 'post',
    body: {
      subjects: pointMultipleItems
    }
  })
}
