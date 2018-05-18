import request from '@/utils/request'

export function getStudent(params) {
  return request({
    url: '/user',
    method: 'get',
    params: { params }
  })
}
