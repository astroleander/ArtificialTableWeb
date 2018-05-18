import request from '@/utils/request'

export function getPoint(params) {
  return request({
    url: '/point',
    method: 'get',
    params: { lesson: params }
  })
}
