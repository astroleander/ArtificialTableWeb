import request from '@/utils/request'

export function getStudent(class_id) {
  return request({
    url: '/student/display',
    method: 'get',
    params: { classInfo_id: class_id }
  })
}
