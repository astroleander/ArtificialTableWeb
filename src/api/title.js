import request from '@/utils/request'

export function getTitle(class_id) {
  return request({
    url: '/title/format',
    method: 'get',
    params: { classInfo_id: class_id }
  })
}
