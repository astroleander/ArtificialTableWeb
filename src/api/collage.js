import request from '@/utils/request'

export function getCollage(ids) {
  return request({
    url: '/collage',
    method: 'get',
    params: { id: ids }
  })
}
