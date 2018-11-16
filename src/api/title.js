import request from '@/utils/request'

export function getTitle({ titleGroup_id, class_id }) {
  return request({
    url: '/title/format',
    method: 'get',
    params: {
      titleGroup_id: titleGroup_id,
      classInfo_id: class_id
    }
  })
}

export function getTitleGroup({ class_id }) {
  return request({
    url: '/titlegroup/format',
    method: 'get',
    params: { classInfo_id: class_id }
  })
}
