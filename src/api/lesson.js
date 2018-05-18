import request from '@/utils/request'

/**
 * get lesson taught by teacher with right-token
 */
export function getLesson() {
  return request({
    url: '/lesson',
    method: 'get'
  })
}
