import request from '@/utils/request'

export function getClassField(teacher_id) {
  return request({
    url: '/table/class_field/format',
    method: 'get',
    params: { teacher_id }
  })
}

export function getClassInfo(teacher_id) {
  return request({
    url: '/table/class_info/format',
    method: 'get',
    params: { teacher_id }
  })
}
