import request from '@/utils/request'
// 根据titleGroup_id,class_id查询小项
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

// 根据classinfo_id查询对应小项数据
export function getTitles(class_id) {
  return request({
    url: '/title/format',
    method: 'get',
    params: {
      classInfo_id: class_id
    }
  })
}
// 修改多条titileGroup_id相同的小项数据
export function putTitles(titles) {
  return request({
    url: '/title/format',
    method: 'put',
    data: {
      subjects: titles
    }
  })
}
// 添加一条小项记录
export function postTitle(title) {
  return request({
    url: '/title/format',
    method: 'post',
    data: {
      subjects: title
    }
  })
}

// 根据lesson_id查询大项数据
export function getTitleGroups(lesson_id) {
  return request({
    url: '/titlegroup/format',
    method: 'get',
    params: { lesson_id: lesson_id }
  })
}

// 添加一条大项记录
export function postTitleGroup(titleGroup) {
  return request({
    url: '/titlegroup/format',
    method: 'post',
    data: {
      subjects: titleGroup
    }
  })
}
// 修改多条lesson_id相同的大项记录
export function putTitleGroups(titleGroups) {
  return request({
    url: '/titlegroup/format',
    method: 'put',
    data: {
      subjects: titleGroups
    }
  })
}
